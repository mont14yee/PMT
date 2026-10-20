import React from 'react';
import type { ConstructionProject } from '../types/index.ts';
import { DollarSign, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProjectOverviewProps {
  project: ConstructionProject;
  onSelectTab: (tab: 'milestones' | 'cost' | 'rfis' | 'autopilot') => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  onSelectTab,
}) => {
  const { evm } = project;

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getHealthBadge = () => {
    if (evm.cpi >= 0.95 && evm.spi >= 0.95) {
      return (
        <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Optimal Health
        </span>
      );
    }
    if (evm.cpi < 0.85 || evm.spi < 0.85) {
      return (
        <span className="text-rose-400 font-semibold flex items-center gap-1.5 text-sm">
          <AlertTriangle className="w-4 h-4" />
          Critical Variance Detected
        </span>
      );
    }
    return (
      <span className="text-amber-400 font-semibold flex items-center gap-1.5 text-sm">
        <AlertTriangle className="w-4 h-4" />
        Moderate Risk / Float Erosion
      </span>
    );
  };

  const contingencyPctUsed = Math.round(
    ((project.contingencyBudget - project.contingencyRemaining) / project.contingencyBudget) * 100
  );

  return (
    <div className="space-y-6">
      {/* Top Project Identity Banner */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-1">
              <span className="font-mono text-amber-400 font-semibold">{project.code}</span>
              <span aria-hidden="true">·</span>
              <span>{project.location}</span>
              <span aria-hidden="true">·</span>
              <span>GC: {project.generalContractor}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {project.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Baseline Health</span>
              {getHealthBadge()}
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <div>
              <span className="text-xs text-slate-400 block">Safety Performance</span>
              <span className="text-sm font-semibold font-mono text-emerald-400">
                {project.safetyDaysWithoutIncident} Days Zero-Incident
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary EVM Core Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Earned Value Management (ANSI/EIA-748 Matrix)
          </h2>
          <span className="text-xs text-slate-500">Live baseline currency: USD ($)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* BAC */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-3.5">
            <span className="text-xs text-slate-400 block mb-1">Budget at Completion (BAC)</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              {formatCurrency(evm.bac)}
            </span>
          </div>

          {/* PV */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-3.5">
            <span className="text-xs text-slate-400 block mb-1">Planned Value (PV)</span>
            <span className="text-base font-bold font-mono text-slate-200 tabular-nums">
              {formatCurrency(evm.pv)}
            </span>
          </div>

          {/* EV */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-3.5">
            <span className="text-xs text-slate-400 block mb-1">Earned Value (EV)</span>
            <span className="text-base font-bold font-mono text-slate-200 tabular-nums">
              {formatCurrency(evm.ev)}
            </span>
          </div>

          {/* AC */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-3.5">
            <span className="text-xs text-slate-400 block mb-1">Actual Cost (AC)</span>
            <span className="text-base font-bold font-mono text-slate-200 tabular-nums">
              {formatCurrency(evm.ac)}
            </span>
          </div>

          {/* CPI */}
          <div className={`border rounded-lg p-3.5 ${
            evm.cpi >= 1.0 
              ? 'border-emerald-800/60 bg-emerald-950/20' 
              : 'border-amber-800/60 bg-amber-950/20'
          }`}>
            <span className="text-xs text-slate-400 block mb-1">Cost Perf Index (CPI)</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-lg font-bold font-mono tabular-nums ${
                evm.cpi >= 1.0 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {evm.cpi.toFixed(3)}
              </span>
              <span className="text-xs text-slate-400">
                {evm.cpi >= 1.0 ? 'Favorable' : 'Overrun'}
              </span>
            </div>
          </div>

          {/* SPI */}
          <div className={`border rounded-lg p-3.5 ${
            evm.spi >= 1.0 
              ? 'border-emerald-800/60 bg-emerald-950/20' 
              : 'border-amber-800/60 bg-amber-950/20'
          }`}>
            <span className="text-xs text-slate-400 block mb-1">Sched Perf Index (SPI)</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-lg font-bold font-mono tabular-nums ${
                evm.spi >= 1.0 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {evm.spi.toFixed(3)}
              </span>
              <span className="text-xs text-slate-400">
                {evm.spi >= 1.0 ? 'Ahead' : 'Delayed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Variances & Forecasting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cost & Schedule Variance */}
        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Variances & Completion Forecast
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400">Cost Variance (CV = EV - AC)</span>
              <span className={`font-mono font-semibold tabular-nums ${
                evm.cv >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatCurrency(evm.cv)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400">Schedule Variance (SV = EV - PV)</span>
              <span className={`font-mono font-semibold tabular-nums ${
                evm.sv >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatCurrency(evm.sv)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400">Estimate at Completion (EAC)</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {formatCurrency(evm.eac)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Variance at Completion (VAC)</span>
              <span className={`font-mono font-semibold tabular-nums ${
                evm.vac >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatCurrency(evm.vac)}
              </span>
            </div>
          </div>
        </div>

        {/* Contingency Reserve & Financial Guardrails */}
        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Contingency Reserve & Governance
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Contingency Drawdown</span>
                <span className="font-mono text-slate-200 tabular-nums">{contingencyPctUsed}% Burned</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    contingencyPctUsed > 70 ? 'bg-rose-500' : contingencyPctUsed > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(contingencyPctUsed, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-xs space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Initial Reserve:</span>
                <span className="font-mono text-slate-300 tabular-nums">{formatCurrency(project.contingencyBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">{formatCurrency(project.contingencyRemaining)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Pending Changes:</span>
                <span className="font-mono text-amber-400 font-semibold tabular-nums">{formatCurrency(project.pendingChangeOrderTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Engineering Gates */}
        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Active Engineering Gates
          </h3>
          <div className="space-y-2.5">
            <button
              onClick={() => onSelectTab('milestones')}
              className="w-full text-left p-2.5 rounded bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Critical Path Delay</span>
                <span className="text-[11px] text-rose-400">1 milestone with -11d float</span>
              </div>
              <span className="text-xs text-amber-400">Review &rarr;</span>
            </button>

            <button
              onClick={() => onSelectTab('cost')}
              className="w-full text-left p-2.5 rounded bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Change Orders Under Review</span>
                <span className="text-[11px] text-slate-400">{project.changeOrders.length} pending ($1.84M)</span>
              </div>
              <span className="text-xs text-amber-400">Review &rarr;</span>
            </button>

            <button
              onClick={() => onSelectTab('rfis')}
              className="w-full text-left p-2.5 rounded bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Open Engineering RFIs</span>
                <span className="text-[11px] text-amber-400">{project.openRFICount} require discipline review</span>
              </div>
              <span className="text-xs text-amber-400">Review &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Autopilot Recent Advisories Preview */}
      <div className="border border-slate-800 bg-slate-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Autopilot Advisories</h3>
            <p className="text-xs text-slate-400">Non-autonomous notifications for human Project Manager action</p>
          </div>
          <button
            onClick={() => onSelectTab('autopilot')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300"
          >
            View Autopilot Station &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {project.advisories.map((adv) => (
            <div
              key={adv.id}
              className={`p-3.5 rounded-lg border ${
                adv.severity === 'urgent'
                  ? 'border-rose-900/60 bg-rose-950/10'
                  : adv.severity === 'warning'
                  ? 'border-amber-900/60 bg-amber-950/10'
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-semibold text-white">{adv.title}</span>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono">{new Date(adv.timestamp).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span className={adv.acknowledged ? 'text-emerald-400' : 'text-amber-400'}>
                    {adv.acknowledged ? 'Acknowledged' : 'Pending PM Review'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-2">{adv.summary}</p>
              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <strong className="text-slate-300">Recommended Next Step:</strong> {adv.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
