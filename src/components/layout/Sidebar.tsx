import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  Calendar,
  BookOpen,
  FileText,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Cpu,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext.tsx';
import type { ScreenId } from '../../types/index.ts';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: 'blue' | 'red' | 'amber';
}

export const Sidebar: React.FC = () => {
  const { activeScreen, setActiveScreen, activeProject } = useProject();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingTasksCount = activeProject.tasks.filter(
    (t) => t.status === 'in_progress' || t.status === 'blocked'
  ).length;
  const criticalPathDelayed = activeProject.milestones.some(
    (m) => m.criticalPath && (m.status === 'delayed' || m.totalFloatDays < 0)
  );
  const pendingCOs = activeProject.changeOrders.filter(
    (co) => co.status === 'under_engineering_review' || co.status === 'submitted_to_owner'
  ).length;
  const criticalRisks = activeProject.risks.filter(
    (r) => r.status === 'active' && (r.severity === 'critical' || r.severity === 'high')
  ).length;

  const navItems: NavItem[] = [
    { id: 'portfolio', label: 'Portfolio Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'workspace', label: 'Project Workspace', icon: <Building2 className="w-4 h-4" /> },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'blue',
    },
    {
      id: 'schedule',
      label: 'Schedule & Timeline',
      icon: <Calendar className="w-4 h-4" />,
      badge: criticalPathDelayed ? '!' : undefined,
      badgeColor: 'red',
    },
    { id: 'diary', label: 'Site Diary', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'documents', label: 'Document Register', icon: <FileText className="w-4 h-4" /> },
    {
      id: 'cost',
      label: 'Cost Control',
      icon: <DollarSign className="w-4 h-4" />,
      badge: pendingCOs > 0 ? pendingCOs : undefined,
      badgeColor: 'amber',
    },
    {
      id: 'risks',
      label: 'Risks & Issues',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: criticalRisks > 0 ? criticalRisks : undefined,
      badgeColor: 'red',
    },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'autopilot',
      label: 'Autopilot Station',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      badge: 'Active',
      badgeColor: 'blue',
    },
    { id: 'team', label: 'Team & Permissions', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (screen: ScreenId) => {
    setActiveScreen(screen);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Toggle (Floating button on phones) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 rounded-full bg-[#3B82F6] text-white shadow-lg hover:bg-blue-600 transition flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[var(--surface-main)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-[var(--bg-main)]/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight block truncate">
                  PM Autopilot
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] font-mono block truncate">
                  Engineering Ops
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--surface-elevated)] text-[var(--engineering-blue)] font-semibold border-l-2 border-[var(--engineering-blue)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]/60'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      item.badgeColor === 'red'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : item.badgeColor === 'amber'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Autopilot Governance Note */}
        {!collapsed && (
          <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-main)]/40 text-[11px] text-[var(--text-secondary)] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Autonomy: Monitor Only</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Expenditure & baseline changes require human PM approval.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
