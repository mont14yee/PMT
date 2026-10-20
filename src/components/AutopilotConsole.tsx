import React, { useState } from 'react';
import type { ConstructionProject, AutopilotAdvisory } from '../types/index.ts';
import { ShieldAlert, ShieldCheck, Cpu, RefreshCw, AlertTriangle, Play, CheckCircle } from 'lucide-react';

interface AutopilotConsoleProps {
  project: ConstructionProject;
  advisories: AutopilotAdvisory[];
  onAcknowledgeAdvisory: (id: string) => void;
  onTriggerAudit: () => Promise<void>;
  isAuditing: boolean;
  auditResult: {
    timestamp: string;
    aiSource: string;
    insights: string[];
    guardrailAudits: Array<{
      actionType: string;
      isPermittedAutonomously: boolean;
      governingPolicy: string;
      violationReason?: string;
      enforcedAction: string;
    }>;
  } | null;
}

export const AutopilotConsole: React.FC<AutopilotConsoleProps> = ({
  project,
  advisories,
  onAcknowledgeAdvisory,
  onTriggerAudit,
  isAuditing,
  auditResult,
}) => {
  const [backgroundJobOutput, setBackgroundJobOutput] = useState<string | null>(null);
  const [isRunningBackgroundJob, setIsRunningBackgroundJob] = useState(false);

  const triggerBackgroundJob = async () => {
    setIsRunningBackgroundJob(true);
    try {
      const res = await fetch('/api/jobs/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setBackgroundJobOutput(
        `Job completed [ID: ${data.jobId}]. Scanned ${data.scannedProjects} projects. ${data.anomaliesFound} anomalies identified; ${data.actionsGatedByPolicy} actions halted by Autonomy Guardrails.`
      );
    } catch (err) {
      setBackgroundJobOutput(`Failed to contact background job worker: ${String(err)}`);
    } finally {
      setIsRunningBackgroundJob(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Autopilot Policy & Status Banner */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
              <Cpu className="w-4 h-4" />
              <span>AUTONOMOUS SURVEILLANCE & EARLY RISK ENGINE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Autopilot Agent Command Center
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Project Manager Autopilot continuously audits schedule float, subcontractor variances, and Earned Value metrics. 
              By code invariant, it operates under a strict <strong>Monitor & Notify Only</strong> mandate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={triggerBackgroundJob}
              disabled={isRunningBackgroundJob}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-lg transition"
              title="Trigger simulated cron background surveillance pass"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate Cron Job</span>
            </button>

            <button
              onClick={onTriggerAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>Run Server-Side Audit</span>
            </button>
          </div>
        </div>

        {backgroundJobOutput && (
          <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <span>{backgroundJobOutput}</span>
            <button
              onClick={() => setBackgroundJobOutput(null)}
              className="text-slate-400 hover:text-white ml-2 text-sm"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* Audit Output & Live Server Inspection */}
      {auditResult && (
        <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Live Server Audit Findings</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Engine Source: <strong className="text-amber-300 font-mono">{auditResult.aiSource}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{new Date(auditResult.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">
              Engineering Advisories & Observations:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {auditResult.insights.map((insight, idx) => (
                <div key={idx} className="p-3 rounded bg-slate-950/80 border border-slate-800 text-xs text-slate-200">
                  <span className="font-mono text-amber-400 font-bold block mb-1">Observation #{idx + 1}</span>
                  <p className="leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Guardrail Policy Verifications */}
          <div className="pt-2">
            <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider mb-2">
              Autonomous Action Guardrail Policy Matrix:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {auditResult.guardrailAudits.map((ga, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border flex items-start gap-2.5 ${
                    ga.isPermittedAutonomously
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                  }`}
                >
                  {ga.isPermittedAutonomously ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{ga.actionType}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-slate-950/50">
                        {ga.enforcedAction}
                      </span>
                    </div>
                    <span className="text-[11px] opacity-80 block">{ga.governingPolicy}</span>
                    {ga.violationReason && (
                      <p className="text-[11px] text-rose-300 mt-1 italic">{ga.violationReason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advisory Queue Requiring Human Action */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Advisory Notification Queue</h3>
            <p className="text-xs text-slate-400">Formal human-in-the-loop acknowledgement register</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {advisories.filter((a) => !a.acknowledged).length} Pending Sign-off
          </span>
        </div>

        <div className="space-y-3">
          {advisories.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-slate-800 bg-slate-900/20 rounded-lg text-xs">
              No active advisories in queue. Project running within safe tolerances.
            </div>
          ) : (
            advisories.map((advisory) => (
              <div
                key={advisory.id}
                className={`p-4 rounded-lg border transition-all ${
                  advisory.severity === 'urgent'
                    ? 'border-rose-900/80 bg-rose-950/20'
                    : advisory.severity === 'warning'
                    ? 'border-amber-900/80 bg-amber-950/20'
                    : 'border-slate-800 bg-slate-900/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {advisory.severity === 'urgent' && (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    {advisory.severity === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <h4 className="text-sm font-bold text-white">{advisory.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono">{new Date(advisory.timestamp).toLocaleString()}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-cyan-300">
                      Confidence: {Math.round(advisory.confidenceScore * 100)}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3">{advisory.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                    <strong className="text-slate-300 block mb-0.5">Recommended PM Action:</strong>
                    <span className="text-slate-400">{advisory.recommendedAction}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                    <strong className="text-slate-300 block mb-0.5">Safety Boundary Rationale:</strong>
                    <span className="text-slate-400">{advisory.boundedReason}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="text-xs">
                    {advisory.acknowledged ? (
                      <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Signed off by {advisory.acknowledgedBy || 'Project Manager'}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium">
                        Awaiting Human Project Director Acknowledgement
                      </span>
                    )}
                  </div>

                  {!advisory.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeAdvisory(advisory.id)}
                      className="px-3 py-1 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition"
                    >
                      Acknowledge & Sign Off
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
