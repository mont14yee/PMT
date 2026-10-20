/**
 * Project Manager Autopilot Core Domain Types
 * Engineering & Construction Operations Platform
 */

export type ScreenId =
  | 'portfolio'
  | 'workspace'
  | 'tasks'
  | 'schedule'
  | 'diary'
  | 'documents'
  | 'cost'
  | 'risks'
  | 'reports'
  | 'autopilot'
  | 'team'
  | 'settings';

export type ProjectStatus = 'planning' | 'procurement' | 'construction' | 'commissioning' | 'handover' | 'on_hold';

export type HealthGrade = 'optimal' | 'moderate_risk' | 'critical_variance';

export interface EVMMetrics {
  bac: number; // Budget at Completion ($)
  pv: number;  // Planned Value ($)
  ev: number;  // Earned Value ($)
  ac: number;  // Actual Cost ($)
  cv: number;  // Cost Variance ($): EV - AC
  sv: number;  // Schedule Variance ($): EV - PV
  cpi: number; // Cost Performance Index: EV / AC
  spi: number; // Schedule Performance Index: EV / PV
  eac: number; // Estimate at Completion ($): BAC / CPI
  etc: number; // Estimate to Complete ($): EAC - AC
  vac: number; // Variance at Completion ($): BAC - EAC
  tcpi: number; // To-Complete Performance Index: (BAC - EV) / (BAC - AC)
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  category: 'civil' | 'structural' | 'mep' | 'finishes' | 'permits' | 'handover';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progressPercent: number;
  criticalPath: boolean;
  totalFloatDays: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  subcontractor: string;
}

export type TaskStatus = 'backlog' | 'in_progress' | 'under_inspection' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItem {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description: string;
  discipline: 'Civil' | 'Structural' | 'Electrical' | 'Mechanical' | 'Safety' | 'Architectural';
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string;
  assigneeRole: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  isOverdue?: boolean;
}

export interface SubcontractorHeadcount {
  trade: string;
  company: string;
  workerCount: number;
}

export interface SitePhoto {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

export interface SiteDiaryEntry {
  id: string;
  projectId: string;
  date: string;
  author: string;
  weather: {
    tempFahrenheit: number;
    condition: 'Clear' | 'Rain' | 'Windy' | 'Snow' | 'Overcast';
    windSpeedMph: number;
    craneHold: boolean;
  };
  totalHeadcount: number;
  contractors: SubcontractorHeadcount[];
  equipmentActive: string[];
  safetyIncidents: number;
  inspectionsCompleted: string[];
  workCompletedNotes: string;
  delayCauses?: string;
  photos: SitePhoto[];
}

export type DocumentCategory = 'drawing' | 'specification' | 'submittal' | 'structural_calc' | 'permit' | 'contract';
export type DocumentStatus = 'approved_for_construction' | 'under_review' | 'revise_and_resubmit' | 'superseded';

export interface DocumentItem {
  id: string;
  projectId: string;
  documentNumber: string;
  title: string;
  discipline: string;
  category: DocumentCategory;
  revision: string;
  status: DocumentStatus;
  author: string;
  approver?: string;
  releaseDate: string;
  fileSizeBytes: number;
  fileType: string;
  downloadUrl?: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  code: string;
  title: string;
  reason: 'client_request' | 'site_condition' | 'design_discrepancy' | 'regulatory';
  proposedCost: number;
  timeImpactDays: number;
  status: 'draft' | 'under_engineering_review' | 'submitted_to_owner' | 'approved' | 'rejected';
  submittedDate: string;
  approvedDate?: string;
  originator: string;
  requiresBoardApproval: boolean;
}

export interface RFIItem {
  id: string;
  projectId: string;
  code: string;
  subject: string;
  discipline: 'Structural' | 'Electrical' | 'Mechanical' | 'Architectural' | 'Geotechnical';
  assignedTo: string;
  dateCreated: string;
  dueDate: string;
  status: 'open' | 'under_review' | 'answered' | 'closed';
  impactsSchedule: boolean;
  costImpactPotential: number;
  answerSummary?: string;
}

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface RiskItem {
  id: string;
  projectId: string;
  code: string;
  description: string;
  category: 'safety' | 'subcontractor' | 'weather' | 'supply_chain' | 'regulatory' | 'geotechnical';
  probability: number; // 0.0 to 1.0 (or 1 to 5)
  impactScore: number; // 1 to 5
  impactCost: number;  // estimated $
  impactScheduleDays: number;
  severity: RiskSeverity;
  mitigationPlan: string;
  owner: string;
  status: 'active' | 'mitigated' | 'retired';
}

export interface AutopilotAdvisory {
  id: string;
  projectId: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'urgent';
  title: string;
  summary: string;
  recommendedAction: string;
  boundedReason: string;
  confidenceScore: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export type UserRole = 'project_director' | 'project_manager' | 'superintendent' | 'lead_engineer' | 'subcontractor';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  phone: string;
  permissions: {
    approveExpenditure: boolean;
    modifyScheduleBaseline: boolean;
    signOffDiary: boolean;
    submitRFIs: boolean;
    manageTeam: boolean;
  };
}

export interface ReportItem {
  id: string;
  projectId: string;
  title: string;
  period: string;
  reportType: 'executive_summary' | 'earned_value' | 'critical_path_schedule' | 'safety_compliance' | 'subcontractor_headcount';
  generatedDate: string;
  cpiRecorded: number;
  spiRecorded: number;
  totalCostVariance: number;
  highlights: string[];
}

export interface ConstructionProject {
  id: string;
  code: string;
  name: string;
  location: string;
  client: string;
  generalContractor: string;
  status: ProjectStatus;
  startDate: string;
  targetCompletionDate: string;
  currency: string;
  evm: EVMMetrics;
  contingencyBudget: number;
  contingencyRemaining: number;
  safetyDaysWithoutIncident: number;
  openRFICount: number;
  pendingChangeOrderTotal: number;
  milestones: Milestone[];
  tasks: TaskItem[];
  siteDiary: SiteDiaryEntry[];
  documents: DocumentItem[];
  changeOrders: ChangeOrder[];
  rfis: RFIItem[];
  risks: RiskItem[];
  advisories: AutopilotAdvisory[];
  team: TeamMember[];
  reports: ReportItem[];
}

export interface SupabaseConfigStatus {
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasServiceRoleKey: boolean;
  isLiveConnected: boolean;
  storageBucketAvailable: boolean;
  tablesVerified: {
    projects: boolean;
    milestones: boolean;
    change_orders: boolean;
    advisories: boolean;
    audit_logs: boolean;
  };
}
