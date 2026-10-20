import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { TopBar } from './components/layout/TopBar.tsx';
import { MasterDrawer } from './components/common/MasterDrawer.tsx';

// 12 Screens
import { PortfolioOverviewScreen } from './screens/PortfolioOverviewScreen.tsx';
import { ProjectWorkspaceScreen } from './screens/ProjectWorkspaceScreen.tsx';
import { TaskManagementScreen } from './screens/TaskManagementScreen.tsx';
import { ScheduleTimelineScreen } from './screens/ScheduleTimelineScreen.tsx';
import { SiteDiaryScreen } from './screens/SiteDiaryScreen.tsx';
import { DocumentRegisterScreen } from './screens/DocumentRegisterScreen.tsx';
import { CostControlScreen } from './screens/CostControlScreen.tsx';
import { RisksIssuesScreen } from './screens/RisksIssuesScreen.tsx';
import { ReportsScreen } from './screens/ReportsScreen.tsx';
import { NotificationsAutopilotScreen } from './screens/NotificationsAutopilotScreen.tsx';
import { TeamPermissionsScreen } from './screens/TeamPermissionsScreen.tsx';
import { SettingsScreen } from './screens/SettingsScreen.tsx';

function MainLayout() {
  const { activeScreen } = useProject();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'portfolio':
        return <PortfolioOverviewScreen />;
      case 'workspace':
        return <ProjectWorkspaceScreen />;
      case 'tasks':
        return <TaskManagementScreen />;
      case 'schedule':
        return <ScheduleTimelineScreen />;
      case 'diary':
        return <SiteDiaryScreen />;
      case 'documents':
        return <DocumentRegisterScreen />;
      case 'cost':
        return <CostControlScreen />;
      case 'risks':
        return <RisksIssuesScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'autopilot':
        return <NotificationsAutopilotScreen />;
      case 'team':
        return <TeamPermissionsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <PortfolioOverviewScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex antialiased">
      {/* Persistent Desktop Sidebar & Mobile Drawer */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <TopBar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderScreen()}
        </main>

        <footer className="border-t border-[var(--border-color)] bg-[var(--surface-main)] py-4 px-6 text-xs text-[var(--text-secondary)]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Project Manager Autopilot · Construction Operations System</span>
            <span className="font-mono text-[11px] text-slate-500">
              Strict Fail-Closed Autonomy Invariant Active
            </span>
          </div>
        </footer>
      </div>

      {/* Contextual Master Detail Drawer */}
      <MasterDrawer />
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  );
}
