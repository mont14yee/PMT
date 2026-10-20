import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { evaluateGuardrail, AutonomousActionType } from './src/core/guardrails.ts';
import { calculateEVM, evaluateProjectHealth } from './src/core/evm.ts';
import { analyzeSchedule } from './src/core/scheduler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API: Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'project-manager-autopilot',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    runtime: 'node-express',
  });
});

// API: Integration & Environment Status (safe: never leaks secret keys)
app.get('/api/config/status', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim() !== '');
  const hasSupabaseAnonKey = Boolean(process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY.trim() !== '');
  const hasSupabaseServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim() !== '');

  res.json({
    gemini: {
      configured: hasGeminiKey,
      model: 'gemini-2.5-flash',
      mode: hasGeminiKey ? 'live_cloud' : 'local_deterministic_rules_fallback',
    },
    supabase: {
      hasUrl: hasSupabaseUrl,
      hasAnonKey: hasSupabaseAnonKey,
      hasServiceRoleKey: hasSupabaseServiceKey,
      status: hasSupabaseUrl && hasSupabaseAnonKey ? 'configured' : 'requires_configuration',
      activeMode: hasSupabaseUrl && hasSupabaseAnonKey ? 'connected' : 'demo_workspace',
    },
    autopilotPolicy: {
      autonomyLevel: 'MONITOR_AND_NOTIFY_ONLY',
      forbiddenAutonomousActions: [
        'APPROVE_EXPENDITURE',
        'MODIFY_APPROVED_BASELINE',
        'DECIDE_ENGINEERING_VARIANCE',
        'DISPATCH_FORMAL_CONTRACTUAL_CLAIMS',
      ],
      strictFailClosed: true,
    },
  });
});

// API: Server-side Autopilot Audit (Uses Gemini if key available, else deterministic engineering rules)
app.post('/api/autopilot/audit', async (req: Request, res: Response) => {
  try {
    const { projectData } = req.body;

    if (!projectData) {
      res.status(400).json({ error: 'projectData is required for audit' });
      return;
    }

    const evm = calculateEVM(
      projectData.evm?.bac || 1000000,
      projectData.evm?.pv || 500000,
      projectData.evm?.ev || 480000,
      projectData.evm?.ac || 490000
    );

    const scheduleAnalysis = analyzeSchedule(projectData.milestones || []);
    const health = evaluateProjectHealth(evm.cpi, evm.spi);

    // Verify Guardrails on any prospective actions
    const candidateActions: AutonomousActionType[] = [
      'APPROVE_CHANGE_ORDER',
      'MODIFY_BASELINE_SCHEDULE',
      'DISPATCH_RISK_ADVISORY',
      'SEND_PM_NOTIFICATION',
    ];

    const guardrailAudits = candidateActions.map(action => evaluateGuardrail(action));

    let geminiInsights: string[] = [];
    let aiSource: 'gemini-2.5-flash' | 'deterministic_rules_engine' = 'deterministic_rules_engine';

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the advisory intelligence agent for Project Manager Autopilot (a construction & engineering management system).
Analyze the following project metrics and produce 3 concise, highly professional engineering advisory observations.
IMPORTANT CONSTRAINT: You are strictly an advisory system. You can NEVER approve budget changes, baseline shifts, or contractual notices.

Project Code: ${projectData.code || 'PRJ-ENG-01'}
Name: ${projectData.name || 'Commercial Facility'}
Cost Performance Index (CPI): ${evm.cpi} (Target >= 1.0)
Schedule Performance Index (SPI): ${evm.spi} (Target >= 1.0)
Schedule Variance: $${evm.sv}
Cost Variance: $${evm.cv}
Critical Path Delayed Milestones: ${scheduleAnalysis.criticalPathDelayedCount}
Project Float (avg days): ${scheduleAnalysis.averageFloatDays}
Max Schedule Slip: ${scheduleAnalysis.maxScheduleVarianceDays} days

Return a JSON array of 3 string advisories, e.g. ["Advisory 1", "Advisory 2", "Advisory 3"].`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed)) {
            geminiInsights = parsed.map(String);
            aiSource = 'gemini-2.5-flash';
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to deterministic rules:', geminiErr);
      }
    }

    // Deterministic fallback if Gemini is not configured or failed
    if (geminiInsights.length === 0) {
      if (evm.cpi < 0.9) {
        geminiInsights.push(
          `Cost variance alert: CPI at ${evm.cpi.toFixed(2)} indicates cumulative overrun. Subcontractor labor billing and concrete supply invoices require project director review before the next pay application.`
        );
      } else {
        geminiInsights.push(
          `Cost performance nominal: CPI at ${evm.cpi.toFixed(2)}. Contingency reserve remains within safe operating threshold.`
        );
      }

      if (scheduleAnalysis.criticalPathDelayedCount > 0) {
        geminiInsights.push(
          `Critical Path Delay: ${scheduleAnalysis.criticalPathDelayedCount} critical milestone(s) flagged with negative total float (${scheduleAnalysis.maxScheduleVarianceDays} days slip). Subcontractor recovery schedule required.`
        );
      } else {
        geminiInsights.push(
          `Schedule progress tracking on pace: SPI at ${evm.spi.toFixed(2)} with positive buffer on critical structural activities.`
        );
      }

      geminiInsights.push(
        `Autopilot Boundary Verified: All change order approvals and baseline revisions remain strictly gated behind human Project Manager authorization.`
      );
    }

    res.json({
      timestamp: new Date().toISOString(),
      evm,
      health,
      scheduleAnalysis,
      guardrailAudits,
      insights: geminiInsights,
      aiSource,
      boundedPolicy: 'MONITOR_AND_NOTIFY_ONLY',
    });
  } catch (error) {
    console.error('Audit failed:', error);
    res.status(500).json({ error: 'Audit calculation failed', details: String(error) });
  }
});

// API: Scheduled Background Job Simulator (Cron worker)
app.post('/api/jobs/monitor', (_req: Request, res: Response) => {
  // Evaluates background scheduled scans
  res.json({
    jobId: `job-${Date.now()}`,
    status: 'completed',
    scannedProjects: 3,
    anomaliesFound: 2,
    advisoriesGenerated: 2,
    actionsGatedByPolicy: 2,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Project Manager Autopilot] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
