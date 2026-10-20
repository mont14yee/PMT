import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { Calendar, AlertCircle, CheckCircle, Clock, Filter, Eye } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge.tsx';

export const ScheduleTimelineScreen: React.FC = () => {
  const { activeProject, openDrawer } = useProject();
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredMilestones = activeProject.milestones.filter((m) => {
    if (criticalOnly && !m.criticalPath) return false;
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    return true;
  });

  const criticalDelayedCount = activeProject.milestones.filter(
    (m) => m.criticalPath && (m.status === 'delayed' || m.totalFloatDays < 0)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Schedule & Critical Path Timeline
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Gantt work breakdown structure, total float calculations, and baseline adherence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-[#F8FAFC] cursor-pointer bg-[#111722] border border-[#273244] px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={criticalOnly}
              onChange={(e) => setCriticalOnly(e.target.checked)}
              className="rounded accent-[#3B82F6]"
            />
            <span className="font-semibold text-rose-400">Critical Path Only</span>
          </label>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Packages</option>
            <option value="civil">Civil & Earthwork</option>
            <option value="structural">Structural Steel</option>
            <option value="mep">MEP / HVAC</option>
            <option value="finishes">Finishes & Envelope</option>
          </select>
        </div>
      </div>

      {/* Critical Path Warning Banner if delay exists */}
      {criticalDelayedCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 text-xs text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-rose-300 block mb-0.5">
              Critical Path Compression Warning: {criticalDelayedCount} Milestone with Negative Float
            </span>
            Tier 1 & 2 Steel Erection is operating with -11 days float. Because this milestone is on the governing critical path, the contract handover date will be breached unless an overtime recovery schedule or dual-sourcing is enacted.
          </div>
        </div>
      )}

      {/* Schedule Table / Timeline Grid */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#192231]/70 text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#273244]">
            <tr>
              <th className="py-3 px-4">Milestone Package</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4">Trade Subcontractor</th>
              <th className="py-3 px-4">Planned Duration</th>
              <th className="py-3 px-4 text-center">Critical Path</th>
              <th className="py-3 px-4 text-right">Total Float</th>
              <th className="py-3 px-4 text-right">Progress</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#273244]/80">
            {filteredMilestones.map((m) => (
              <tr
                key={m.id}
                onClick={() => openDrawer('milestone', m)}
                className="hover:bg-[#192231]/40 transition cursor-pointer"
              >
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-[#F8FAFC] block">{m.title}</span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{m.id}</span>
                </td>
                <td className="py-3.5 px-4 capitalize text-slate-300">{m.category}</td>
                <td className="py-3.5 px-4 text-slate-200 font-medium">{m.subcontractor}</td>
                <td className="py-3.5 px-4 font-mono text-[#94A3B8]">
                  {m.plannedStartDate} &rarr; {m.plannedEndDate}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {m.criticalPath ? (
                    <span className="font-mono text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
                      CRITICAL
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-500">Buffer</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  <span
                    className={
                      m.totalFloatDays < 0
                        ? 'text-rose-400'
                        : m.totalFloatDays === 0
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    {m.totalFloatDays > 0 ? `+${m.totalFloatDays}d` : `${m.totalFloatDays}d`}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-mono text-[#F8FAFC]">{m.progressPercent}%</span>
                    <div className="w-16 bg-[#080B10] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          m.progressPercent === 100
                            ? 'bg-emerald-500'
                            : m.status === 'delayed'
                            ? 'bg-rose-500'
                            : 'bg-[#3B82F6]'
                        }`}
                        style={{ width: `${m.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge
                    label={m.status.replace('_', ' ')}
                    variant={
                      m.status === 'completed'
                        ? 'success'
                        : m.status === 'delayed'
                        ? 'critical'
                        : m.status === 'in_progress'
                        ? 'info'
                        : 'neutral'
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
