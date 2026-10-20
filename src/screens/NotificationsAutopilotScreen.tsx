import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import {
  Cpu,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge.tsx';

export const NotificationsAutopilotScreen: React.FC = () => {
  const {
    activeProject,
    isAuditing,
    triggerAudit,
    auditResult,
    acknowledgeAdvisory,
  } = useProject();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [backgroundJobMessage, setBackgroundJobMessage] = useState<string | null>(null);
  const [isSimulatingJob, setIsSimulatingJob] = useState(false);

  const runBackgroundJob = async () => {
    setIsSimulatingJob(true);
    try {
      const res = await fetch('/api/jobs/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setBackgroundJobMessage(
        `Scheduled Cron Run Completed [Job ID: ${data.jobId}]. Scanned ${data.scannedProjects} active projects. ${data.anomaliesFound} variances flagged; ${data.actionsGatedByPolicy} actions held by Autonomy Guardrails.`
      );
    } catch (err) {
      setBackgroundJobMessage(`Failed to trigger background worker: ${String(err)}`);
    } finally {
      setIsSimulatingJob(false);
    }
  };

  const filteredAdvisories = activeProject.advisories.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Hero Station */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#F59E0B] font-mono mb-1">
              <Cpu className="w-4 h-4" />
              <span>AUTONOMOUS SURVEILLANCE & EARLY RISK AGENT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Autopilot Command Center & Alerts
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
              Autopilot continuously evaluates schedule slippage, subcontractor billing rates, and float erosion. 
              By policy invariant, Autopilot is strictly <strong>Monitor & Notify Only</strong> — expenditure approvals, baseline resets, and contractual claims require human sign-off.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runBackgroundJob}
              disabled={isSimulatingJob}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#192231] hover:bg-slate-700 disabled:opacity-50 border border-[#273244] rounded-lg transition"
            >
              <Play className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Simulate Cron Job</span>
            </button>

            <button
              onClick={triggerAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-[#F59E0B] hover:bg-amber-300 disabled:opacity-50 rounded-lg transition shadow-sm whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>Run Server-Side Audit</span>
            </button>
          </div>
        </div>

        {backgroundJobMessage && (
          <div className="mt-4 p-3 bg-[#080B10] rounded-lg border border-[#273244] text-xs font-mono text-[#3B82F6] flex items-center justify-between">
            <span>{backgroundJobMessage}</span>
            <button
              onClick={() => setBackgroundJobMessage(null)}
              className="text-[#94A3B8] hover:text-white ml-2 text-sm"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* Live Server Findings from Audit */}
      {auditResult && (
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#273244] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-sm font-bold text-white">Live Server Audit Findings</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <span>Engine Source: <strong className="text-[#F59E0B] font-mono">{auditResult.aiSource}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{new Date(auditResult.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {auditResult.insights?.map((insight: string, idx: number) => (
              <div key={idx} className="p-3.5 rounded-lg bg-[#080B10] border border-[#273244] text-xs text-slate-200">
                <span className="font-mono text-[#F59E0B] font-bold block mb-1">Observation #{idx + 1}</span>
                <p className="leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <h3 className="text-xs uppercase font-semibold text-[#94A3B8] block tracking-wider mb-2">
              Autonomy Guardrail Invariants Verification:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {auditResult.guardrailAudits?.map((ga: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-start gap-2.5 ${
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
                    <div className="flex items-center gap-2 font-mono font-semibold">
                      <span>{ga.actionType}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-[#080B10]">
                        {ga.enforcedAction}
                      </span>
                    </div>
                    <span className="text-[11px] opacity-80 block mt-0.5">{ga.governingPolicy}</span>
                    {ga.violationReason && (
                      <p className="text-[11px] text-rose-300 mt-1 italic leading-tight">
                        {ga.violationReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advisories Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC]">Advisory Notification Queue</h2>
            <p className="text-xs text-[#94A3B8]">Alerts requiring human Project Director sign-off</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">All Severities</option>
              <option value="urgent">Urgent</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAdvisories.map((adv) => (
            <div
              key={adv.id}
              className={`p-4 rounded-xl border transition-all ${
                adv.severity === 'urgent'
                  ? 'border-rose-900/80 bg-rose-950/20'
                  : adv.severity === 'warning'
                  ? 'border-amber-900/80 bg-amber-950/20'
                  : 'border-[#273244] bg-[#111722]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {adv.severity === 'urgent' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                  {adv.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                  <h3 className="text-sm font-bold text-white">{adv.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono">
                  <span>{new Date(adv.timestamp).toLocaleString()}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#3B82F6]">Confidence: {Math.round(adv.confidenceScore * 100)}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-3">{adv.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-2.5 rounded bg-[#080B10] border border-[#273244]">
                  <strong className="text-slate-300 block mb-0.5">Recommended PM Next Step:</strong>
                  <span className="text-[#94A3B8]">{adv.recommendedAction}</span>
                </div>
                <div className="p-2.5 rounded bg-[#080B10] border border-[#273244]">
                  <strong className="text-slate-300 block mb-0.5">Autonomy Boundary Safeguard:</strong>
                  <span className="text-[#94A3B8]">{adv.boundedReason}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#273244]">
                <div className="text-xs">
                  {adv.acknowledged ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Acknowledged by {adv.acknowledgedBy || 'Project Manager'}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Awaiting Human Project Director Acknowledgement
                    </span>
                  )}
                </div>

                {!adv.acknowledged && (
                  <button
                    onClick={() => acknowledgeAdvisory(adv.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-[#F59E0B] hover:bg-amber-300 rounded-lg transition"
                  >
                    Acknowledge & Sign Off
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
