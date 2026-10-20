import React, { useState } from 'react';
import type { Milestone } from '../types/index.ts';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface MilestonesViewProps {
  milestones: Milestone[];
  onAddMilestone?: (milestone: Partial<Milestone>) => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({ milestones }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'delayed'>('all');
  const [search, setSearch] = useState('');

  const filteredMilestones = milestones.filter((m) => {
    if (filter === 'critical' && !m.criticalPath) return false;
    if (filter === 'delayed' && m.status !== 'delayed' && m.totalFloatDays >= 0) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.subcontractor.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Schedule Milestones & Critical Path Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time total float calculation and schedule slippage tracking
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search activities or subs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-amber-400"
          />

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({milestones.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'critical'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical Path
            </button>
            <button
              onClick={() => setFilter('delayed')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'delayed'
                  ? 'bg-slate-800 text-rose-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Negative Float / Delayed
            </button>
          </div>
        </div>
      </div>

      {/* Critical Path Warning Banner if any delayed */}
      {milestones.some((m) => m.criticalPath && (m.status === 'delayed' || m.totalFloatDays < 0)) && (
        <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/60 flex items-start gap-3 text-xs text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-rose-300 block mb-0.5">Critical Path Slippage Alert</span>
            One or more critical path construction activities have negative float days. Because this is on the critical path, every day of delay directly impacts the contract handover date.
            Autopilot has flagged this advisory for human superintendent intervention.
          </div>
        </div>
      )}

      {/* High-density Milestones Table */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Milestone / Work Package</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4">Subcontractor</th>
              <th className="py-3 px-4">Planned Window</th>
              <th className="py-3 px-4 text-center">Critical Path</th>
              <th className="py-3 px-4 text-right">Total Float</th>
              <th className="py-3 px-4 text-right">Progress</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredMilestones.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No milestones matching the selected criteria.
                </td>
              </tr>
            ) : (
              filteredMilestones.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-100 block">{m.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{m.id}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 capitalize">{m.category}</td>
                  <td className="py-3 px-4 text-slate-300">{m.subcontractor}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">
                    {m.plannedStartDate} &rarr; {m.plannedEndDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {m.criticalPath ? (
                      <span className="text-amber-400 font-semibold font-mono text-[11px] px-2 py-0.5 bg-amber-950/40 border border-amber-800/50 rounded">
                        CRITICAL
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Buffer</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
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
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-slate-300 tabular-nums">{m.progressPercent}%</span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            m.progressPercent === 100
                              ? 'bg-emerald-500'
                              : m.status === 'delayed'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${m.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {m.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                    {m.status === 'in_progress' && (
                      <span className="inline-flex items-center gap-1 text-cyan-400">
                        <Clock className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                    {m.status === 'delayed' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Delayed
                      </span>
                    )}
                    {m.status === 'pending' && <span className="text-slate-500">Queued</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
