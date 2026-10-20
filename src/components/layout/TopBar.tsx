import React from 'react';
import {
  Search,
  Sun,
  Moon,
  Building2,
  RefreshCw,
  User,
  Shield,
  Layers,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext.tsx';
import { PWAInstallButton } from '../PWAInstallButton.tsx';

export const TopBar: React.FC = () => {
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    isAuditing,
    triggerAudit,
    isSupabaseConnected,
    setActiveScreen,
  } = useProject();

  const activeProj = projects.find((p) => p.id === activeProjectId) || projects[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#111722]/90 backdrop-blur-md border-b border-[#273244] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Active Project Selector & Demo Mode Label */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <select
            value={activeProjectId}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="bg-[#192231] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#3B82F6] font-medium"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Demo Data Tag (Explicitly labeled) */}
        {!isSupabaseConnected ? (
          <button
            onClick={() => setActiveScreen('settings')}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#F59E0B] hover:text-amber-300 bg-amber-950/30 border border-amber-800/40 px-2 py-0.5 rounded transition"
            title="Running in Demo Workspace with realistic construction datasets. Click to configure Supabase."
          >
            <span>Demo Baseline Active</span>
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
            Live Supabase
          </span>
        )}
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, milestones, drawings, RFIs, change orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#192231] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-[#3B82F6] placeholder-[#94A3B8]/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        <PWAInstallButton />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#192231] border border-[#273244] text-[#94A3B8] hover:text-[#F8FAFC] transition"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          aria-label="Toggle visual theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Server-side Autopilot Scan Trigger */}
        <button
          onClick={triggerAudit}
          disabled={isAuditing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-[#F59E0B] hover:bg-amber-300 disabled:opacity-50 rounded-lg transition shadow-sm whitespace-nowrap"
          title="Trigger real server-side Autopilot risk & EVM audit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Autopilot Scan</span>
        </button>

        {/* User Profile Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#273244] text-xs">
          <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6] font-semibold">
            SL
          </div>
          <div className="truncate max-w-[120px]">
            <span className="font-medium text-[#F8FAFC] block truncate">Sarah Lin, PE</span>
            <span className="text-[10px] text-[#94A3B8] block truncate">Project Director</span>
          </div>
        </div>
      </div>
    </header>
  );
};
