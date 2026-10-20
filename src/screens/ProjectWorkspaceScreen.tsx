import React from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { MetricCard } from '../components/common/MetricCard.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import {
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';

export const ProjectWorkspaceScreen: React.FC = () => {
  const { activeProject, setActiveScreen, openDrawer } = useProject();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const contingencyPct = Math.round(
    ((activeProject.contingencyBudget - activeProject.contingencyRemaining) /
      activeProject.contingencyBudget) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-1 font-mono">
              <span className="text-[#F59E0B] font-bold">{activeProject.code}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{activeProject.status} Phase</span>
              <span aria-hidden="true">·</span>
              <span>GC: {activeProject.generalContractor}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {activeProject.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8] mt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                {activeProject.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#3B82F6]" />
                Client: {activeProject.client}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                {activeProject.startDate} &rarr; {activeProject.targetCompletionDate}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveScreen('tasks')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => setActiveScreen('diary')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F8FAFC] bg-[#192231] hover:bg-slate-700 border border-[#273244] rounded-lg transition"
            >
              <span>Log Site Diary</span>
            </button>
            <button
              onClick={() => setActiveScreen('cost')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F8FAFC] bg-[#192231] hover:bg-slate-700 border border-[#273244] rounded-lg transition"
            >
              <span>New Change Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Snapshot Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Budget at Completion"
          value={formatCurrency(activeProject.evm.bac)}
          subValue={`Contingency: ${formatCurrency(activeProject.contingencyRemaining)}`}
        />
        <MetricCard
          label="Cost Performance (CPI)"
          value={activeProject.evm.cpi}
          variant={activeProject.evm.cpi >= 1.0 ? 'success' : 'warning'}
          trendText={`Cost Variance: ${formatCurrency(activeProject.evm.cv)}`}
        />
        <MetricCard
          label="Schedule Index (SPI)"
          value={activeProject.evm.spi}
          variant={activeProject.evm.spi >= 1.0 ? 'success' : 'warning'}
          trendText={`Schedule Variance: ${formatCurrency(activeProject.evm.sv)}`}
        />
        <MetricCard
          label="Safety Milestone"
          value={`${activeProject.safetyDaysWithoutIncident} Days`}
          variant="success"
          trendText="Zero Lost-Time Incidents"
        />
      </div>

      {/* Two Column Detailed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scope & Operational Architecture */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center justify-between border-b border-[#273244] pb-3">
              <span>Project Work Breakdown & Engineering Scope</span>
              <span className="text-xs font-mono text-[#F59E0B]">
                {activeProject.milestones.length} Milestone Packages
              </span>
            </h2>

            <div className="space-y-3">
              {activeProject.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => openDrawer('milestone', m)}
                  className="p-3.5 rounded-lg border border-[#273244] bg-[#192231]/40 hover:border-slate-600 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#F8FAFC]">{m.title}</span>
                    <span className="text-[11px] font-mono text-[#94A3B8]">
                      {m.progressPercent}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-[#080B10] h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${
                        m.status === 'delayed'
                          ? 'bg-rose-500'
                          : m.progressPercent === 100
                          ? 'bg-emerald-500'
                          : 'bg-[#3B82F6]'
                      }`}
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#94A3B8]">
                    <span>Contractor: {m.subcontractor}</span>
                    <span
                      className={`font-mono font-semibold ${
                        m.totalFloatDays < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      Float: {m.totalFloatDays}d {m.criticalPath ? '(Critical Path)' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Drawing & Document References */}
        <div className="space-y-6">
          <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#273244] pb-3">
              <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3B82F6]" />
                Controlled Drawings
              </h2>
              <button
                onClick={() => setActiveScreen('documents')}
                className="text-xs text-[#3B82F6] hover:underline"
              >
                Register &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {activeProject.documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => openDrawer('document', doc)}
                  className="p-3 rounded-lg border border-[#273244] bg-[#192231]/40 hover:border-slate-600 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#F59E0B]">{doc.documentNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">{doc.revision}</span>
                  </div>
                  <span className="text-xs text-[#F8FAFC] font-medium block truncate">
                    {doc.title}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] mt-1 block">
                    Author: {doc.author}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contingency Burn Metric Box */}
          <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider">
              Contingency Reserve Health
            </h3>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94A3B8]">Drawdown Burn</span>
              <span className="font-mono text-[#F8FAFC]">{contingencyPct}% Allocated</span>
            </div>
            <div className="w-full bg-[#080B10] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${contingencyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${contingencyPct}%` }}
              />
            </div>
            <div className="pt-2 text-xs flex justify-between text-[#94A3B8]">
              <span>Remaining Reserve:</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatCurrency(activeProject.contingencyRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
