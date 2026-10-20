import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  ConstructionProject,
  ScreenId,
  TaskItem,
  TaskStatus,
  SiteDiaryEntry,
  ChangeOrder,
  RiskItem,
  DocumentItem,
  TeamMember,
} from '../types/index.ts';
import { DEMO_PROJECTS } from '../data/mockProjects.ts';
import { checkSupabaseConnection } from '../services/supabase.ts';

export interface DrawerDetail {
  type: 'task' | 'document' | 'change_order' | 'risk' | 'milestone';
  data: any;
}

interface ProjectContextType {
  projects: ConstructionProject[];
  activeProjectId: string;
  activeProject: ConstructionProject;
  setActiveProjectId: (id: string) => void;
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAuditing: boolean;
  auditResult: any;
  triggerAudit: () => Promise<void>;
  isSupabaseConnected: boolean;

  // Working mutations
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addSiteDiaryEntry: (entry: Omit<SiteDiaryEntry, 'id'>) => void;
  addChangeOrder: (co: Omit<ChangeOrder, 'id'>) => void;
  approveChangeOrder: (coId: string) => void;
  rejectChangeOrder: (coId: string) => void;
  answerRFI: (rfiId: string, answer: string) => void;
  addRiskItem: (risk: Omit<RiskItem, 'id'>) => void;
  acknowledgeAdvisory: (advId: string) => void;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  updateTeamPermission: (memberId: string, permKey: string, val: boolean) => void;

  // Drawer detail panel
  drawerItem: DrawerDetail | null;
  openDrawer: (type: DrawerDetail['type'], data: any) => void;
  closeDrawer: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ConstructionProject[]>(DEMO_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(DEMO_PROJECTS[0].id);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('portfolio');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [drawerItem, setDrawerItem] = useState<DrawerDetail | null>(null);

  // Sync with URL query parameters for deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen') as ScreenId;
    const projectParam = params.get('project');

    if (screenParam) {
      setActiveScreen(screenParam);
    }
    if (projectParam && projects.some((p) => p.id === projectParam)) {
      setActiveProjectId(projectParam);
    }

    checkSupabaseConnection().then((st) => setIsSupabaseConnected(st.isLiveConnected));
  }, []);

  const changeScreen = (screen: ScreenId) => {
    setActiveScreen(screen);
    const url = new URL(window.location.href);
    url.searchParams.set('screen', screen);
    window.history.replaceState({}, '', url.toString());
  };

  const changeProject = (id: string) => {
    setActiveProjectId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('project', id);
    window.history.replaceState({}, '', url.toString());
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
      return next;
    });
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const triggerAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/autopilot/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectData: activeProject }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Actions
  const addTask = (taskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `tsk-${Date.now()}`,
    };
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, tasks: [newTask, ...p.tasks] } : p))
    );
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
            }
          : p
      )
    );
  };

  const addSiteDiaryEntry = (entryData: Omit<SiteDiaryEntry, 'id'>) => {
    const newEntry: SiteDiaryEntry = {
      ...entryData,
      id: `diary-${Date.now()}`,
    };
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, siteDiary: [newEntry, ...p.siteDiary] } : p))
    );
  };

  const addChangeOrder = (coData: Omit<ChangeOrder, 'id'>) => {
    const newCo: ChangeOrder = {
      ...coData,
      id: `co-${Date.now()}`,
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              changeOrders: [newCo, ...p.changeOrders],
              pendingChangeOrderTotal: p.pendingChangeOrderTotal + coData.proposedCost,
            }
          : p
      )
    );
  };

  const approveChangeOrder = (coId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              changeOrders: p.changeOrders.map((co) =>
                co.id === coId
                  ? { ...co, status: 'approved', approvedDate: new Date().toISOString().split('T')[0] }
                  : co
              ),
            }
          : p
      )
    );
  };

  const rejectChangeOrder = (coId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              changeOrders: p.changeOrders.map((co) => (co.id === coId ? { ...co, status: 'rejected' } : co)),
            }
          : p
      )
    );
  };

  const answerRFI = (rfiId: string, answer: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              rfis: p.rfis.map((rfi) =>
                rfi.id === rfiId ? { ...rfi, status: 'answered', answerSummary: answer } : rfi
              ),
              openRFICount: Math.max(0, p.openRFICount - 1),
            }
          : p
      )
    );
  };

  const addRiskItem = (riskData: Omit<RiskItem, 'id'>) => {
    const newRisk: RiskItem = {
      ...riskData,
      id: `rk-${Date.now()}`,
    };
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, risks: [newRisk, ...p.risks] } : p))
    );
  };

  const acknowledgeAdvisory = (advId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              advisories: p.advisories.map((a) =>
                a.id === advId ? { ...a, acknowledged: true, acknowledgedBy: 'Sarah Lin, PE' } : a
              ),
            }
          : p
      )
    );
  };

  const addDocument = (docData: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
    };
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, documents: [newDoc, ...p.documents] } : p))
    );
  };

  const updateTeamPermission = (memberId: string, permKey: string, val: boolean) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              team: p.team.map((m) =>
                m.id === memberId
                  ? {
                      ...m,
                      permissions: { ...m.permissions, [permKey]: val },
                    }
                  : m
              ),
            }
          : p
      )
    );
  };

  const openDrawer = (type: DrawerDetail['type'], data: any) => {
    setDrawerItem({ type, data });
  };

  const closeDrawer = () => {
    setDrawerItem(null);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject,
        setActiveProjectId: changeProject,
        activeScreen,
        setActiveScreen: changeScreen,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        isAuditing,
        auditResult,
        triggerAudit,
        isSupabaseConnected,
        addTask,
        updateTaskStatus,
        addSiteDiaryEntry,
        addChangeOrder,
        approveChangeOrder,
        rejectChangeOrder,
        answerRFI,
        addRiskItem,
        acknowledgeAdvisory,
        addDocument,
        updateTeamPermission,
        drawerItem,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
