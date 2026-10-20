import React from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { MetricCard } from '../components/common/MetricCard.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const PortfolioOverviewScreen: React.FC = () => {
  const { projects, activeProject, setActiveProjectId, setActiveScreen, openDrawer } = useProject();

  // Aggregate portfolio metrics
  const totalBac = projects.reduce((acc, p) => acc + p.evm.bac, 0);
  const totalEv = projects.reduce((acc, p) => acc + p.evm.ev, 0);
  const totalAc = projects.reduce((acc, p) => acc + p.evm.ac, 0);
  const avgCpi = totalAc > 0 ? totalEv / totalAc : 1.0;
  const avgSpi = projects.reduce((acc, p) => acc + p.evm.spi, 0) / projects.length;

  const overdueTasks = activeProject.tasks.filter((t) => t.isOverdue || t.status === 'blocked');
  const upcomingMilestones = activeProject.milestones
    .filter((m) => m.status !== 'completed')
    .slice(0, 3);
  const urgentAdvisories = activeProject.advisories.filter((a) => a.severity === 'urgent' || !a.acknowledged);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Daily Briefing Panel */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#273244] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#F59E0B] font-mono mb-1">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              <span>MORNING ENGINEERING & SITE BRIEFING</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">DEMO WORKSPACE DATA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Executive Portfolio Briefing
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#94A3B8]">Active Focus:</span>
            <span className="text-xs font-semibold font-mono text-[#F8FAFC] bg-[#192231] border border-[#273244] px-3 py-1 rounded-md">
              {activeProject.code} · {activeProject.name}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#192231]/60 rounded-lg border border-[#273244]">
            <span className="font-semibold text-amber-400 block mb-1">Schedule Vigilance:</span>
            <p className="text-[#94A3B8] leading-relaxed">
              Tier 1 & 2 Steel Erection float has compressed to -11 days on the critical path. Vanguard Steel dual-sourcing authorization is recommended.
            </p>
          </div>
          <div className="p-3 bg-[#192231]/60 rounded-lg border border-[#273244]">
            <span className="font-semibold text-rose-400 block mb-1">Cost Overrun Mitigation:</span>
            <p className="text-[#94A3B8] leading-relaxed">
              Cumulative portfolio cost variance is negative (-$2.70M on Helix). Change order PCO-042 requires PM engineering sign-off.
            </p>
          </div>
          <div className="p-3 bg-[#192231]/60 rounded-lg border border-[#273244]">
            <span className="font-semibold text-emerald-400 block mb-1">Safety & Compliance:</span>
            <p className="text-[#94A3B8] leading-relaxed">
              214 days zero-incident across 142 on-site trades. Wind-hold protocol enacted on tower crane when gusts exceed 22 mph.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Portfolio Total BAC"
          value={formatCurrency(totalBac)}
          subValue="3 Projects"
          icon={<DollarSign className="w-4 h-4 text-[#3B82F6]" />}
        />
        <MetricCard
          label="Earned Value (EV)"
          value={formatCurrency(totalEv)}
          subValue="Consolidated"
          icon={<TrendingUp className="w-4 h-4 text-[#22C55E]" />}
        />
        <MetricCard
          label="Portfolio Avg CPI"
          value={avgCpi.toFixed(3)}
          trendText={avgCpi >= 1.0 ? 'Favorable Cost' : 'Cost Variance Alert'}
          variant={avgCpi >= 1.0 ? 'success' : 'warning'}
        />
        <MetricCard
          label="Portfolio Avg SPI"
          value={avgSpi.toFixed(3)}
          trendText={avgSpi >= 1.0 ? 'Ahead of Schedule' : 'Schedule Compression'}
          variant={avgSpi >= 1.0 ? 'success' : 'warning'}
        />
        <MetricCard
          label="Zero-Incident Days"
          value={activeProject.safetyDaysWithoutIncident}
          subValue="Active Site"
          variant="success"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* Three Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Projects Health Matrix */}
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#273244] pb-3">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3B82F6]" />
              Active Projects Portfolio
            </h2>
            <button
              onClick={() => setActiveScreen('workspace')}
              className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
            >
              Workspace <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setActiveProjectId(proj.id)}
                className={`p-3.5 rounded-lg border transition cursor-pointer ${
                  proj.id === activeProject.id
                    ? 'border-[#3B82F6] bg-[#192231]'
                    : 'border-[#273244] bg-[#080B10]/40 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-semibold text-[#F59E0B]">{proj.code}</span>
                  <StatusBadge
                    label={proj.evm.cpi >= 1.0 ? 'Optimal' : 'Variance'}
                    variant={proj.evm.cpi >= 1.0 ? 'success' : 'warning'}
                  />
                </div>
                <h3 className="text-xs font-bold text-[#F8FAFC] mb-1 truncate">{proj.name}</h3>
                <div className="flex justify-between items-center text-[11px] text-[#94A3B8]">
                  <span>BAC: {formatCurrency(proj.evm.bac)}</span>
                  <span className="font-mono">
                    CPI: {proj.evm.cpi} · SPI: {proj.evm.spi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Upcoming Milestones & Critical Path */}
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#273244] pb-3">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F59E0B]" />
              Key Milestones ({activeProject.code})
            </h2>
            <button
              onClick={() => setActiveScreen('schedule')}
              className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
            >
              Timeline <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingMilestones.map((m) => (
              <div
                key={m.id}
                onClick={() => openDrawer('milestone', m)}
                className="p-3.5 rounded-lg border border-[#273244] bg-[#080B10]/40 hover:border-slate-600 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#F8FAFC] truncate block max-w-[200px]">
                    {m.title}
                  </span>
                  {m.criticalPath ? (
                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-800/60 px-1.5 py-0.2 rounded">
                      CRITICAL
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Float</span>
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-[#94A3B8]">
                  <span>Sub: {m.subcontractor}</span>
                  <span
                    className={`font-mono font-bold ${
                      m.totalFloatDays < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    Float: {m.totalFloatDays}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Overdue Tasks & Autopilot Alerts */}
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#273244] pb-3">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
              Urgent Tasks & Alerts
            </h2>
            <button
              onClick={() => setActiveScreen('tasks')}
              className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
            >
              All Tasks <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {overdueTasks.length === 0 ? (
              <p className="text-xs text-[#94A3B8] p-4 text-center">No overdue tasks flagged.</p>
            ) : (
              overdueTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => openDrawer('task', t)}
                  className="p-3.5 rounded-lg border border-rose-900/60 bg-rose-950/10 hover:bg-rose-950/20 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-rose-300 truncate max-w-[200px]">
                      {t.title}
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.2 rounded">
                      Overdue
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#94A3B8]">
                    <span>Assignee: {t.assigneeName}</span>
                    <span className="font-mono text-rose-400">Due: {t.dueDate}</span>
                  </div>
                </div>
              ))
            )}

            {urgentAdvisories.slice(0, 1).map((adv) => (
              <div
                key={adv.id}
                onClick={() => setActiveScreen('autopilot')}
                className="p-3 rounded-lg border border-amber-900/60 bg-amber-950/20 cursor-pointer"
              >
                <span className="text-xs font-semibold text-amber-300 block mb-0.5">
                  Autopilot Advisory: {adv.title}
                </span>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2">{adv.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
