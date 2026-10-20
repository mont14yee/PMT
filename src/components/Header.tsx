import React from 'react';
import { PWAInstallButton } from './PWAInstallButton.tsx';

export type NavTab = 'overview' | 'milestones' | 'cost' | 'rfis' | 'autopilot' | 'supabase';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onRunAudit: () => void;
  isAuditing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onRunAudit,
  isAuditing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single line, display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Project Manager Autopilot
          </span>
        </div>

        {/* Zone 2: 4-5 Nav Links (Single line, unboxed, subtle hover states) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onTabChange('overview')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'overview'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Portfolio & EVM
          </button>
          <button
            onClick={() => onTabChange('milestones')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'milestones'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => onTabChange('cost')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'cost'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Cost & Changes
          </button>
          <button
            onClick={() => onTabChange('rfis')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'rfis'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            RFIs & Submittals
          </button>
          <button
            onClick={() => onTabChange('autopilot')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'autopilot'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Autopilot Station
          </button>
          <button
            onClick={() => onTabChange('supabase')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'supabase'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Cloud Config
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + PWA Install */}
        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton />
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-md transition-colors whitespace-nowrap shadow-sm"
          >
            {isAuditing ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Analyzing Logs...</span>
              </>
            ) : (
              <span>Run Autopilot Scan</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip (Horizontal scrollable with smooth touch targets) */}
      <div className="md:hidden overflow-x-auto border-t border-slate-900 bg-slate-950/95 px-4 py-2 flex items-center gap-4 text-xs font-medium scrollbar-none">
        <button
          onClick={() => onTabChange('overview')}
          className={`whitespace-nowrap py-1 transition-colors ${
            activeTab === 'overview' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Portfolio & EVM
        </button>
        <button
          onClick={() => onTabChange('milestones')}
          className={`whitespace-nowrap py-1 transition-colors ${
            activeTab === 'milestones' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => onTabChange('cost')}
          className={`whitespace-nowrap py-1 transition-colors ${
            activeTab === 'cost' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Cost & Changes
        </button>
        <button
          onClick={() => onTabChange('rfis')}
          className={`whitespace-nowrap py-1 transition-colors ${
            activeTab === 'rfis' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          RFIs
        </button>
        <button
          onClick={() => onTabChange('autopilot')}
          className={`whitespace-nowrap py-1 transition-colors ${
            activeTab === 'autopilot' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Autopilot
        </button>
        <button
          onClick={() => onTabChange('supabase')}
          className={`whitespace-nowrap py-1 transition-colors ${
            activeTab === 'supabase' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Cloud Config
        </button>
      </div>
    </header>
  );
};
