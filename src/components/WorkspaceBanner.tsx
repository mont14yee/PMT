import React from 'react';
import { ShieldCheck, Database, Building2 } from 'lucide-react';
import type { ConstructionProject } from '../types/index.ts';

interface WorkspaceBannerProps {
  projects: ConstructionProject[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  isSupabaseConnected: boolean;
  onOpenConfig: () => void;
}

export const WorkspaceBanner: React.FC<WorkspaceBannerProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  isSupabaseConnected,
  onOpenConfig,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Project Selector & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">Active Project:</span>
          </div>
          
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>

          {/* Mode indicator (clean unboxed text with dot) */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <span aria-hidden="true">·</span>
            {isSupabaseConnected ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                Live Supabase Connected
              </span>
            ) : (
              <button
                onClick={onOpenConfig}
                className="text-amber-300 hover:text-amber-200 underline decoration-amber-500/40 underline-offset-2 transition-colors flex items-center gap-1"
                title="Click to view Supabase connection setup"
              >
                <Database className="w-3.5 h-3.5" />
                Demo Workspace (Simulated Engineering Baseline)
              </button>
            )}
          </div>
        </div>

        {/* Guardrail Policy Badge */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Autonomy Guardrail: <strong className="text-slate-200 font-medium">Monitor & Notify Only</strong> (Human sign-off enforced on expenditure & baselines)</span>
        </div>
      </div>
    </div>
  );
};
