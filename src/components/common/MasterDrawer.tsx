import React from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import { DetailDrawer } from './DetailDrawer.tsx';
import { StatusBadge } from './StatusBadge.tsx';
import {
  Calendar,
  User,
  DollarSign,
  AlertTriangle,
  Clock,
  FileText,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const MasterDrawer: React.FC = () => {
  const { drawerItem, closeDrawer, updateTaskStatus, approveChangeOrder, rejectChangeOrder } =
    useProject();

  if (!drawerItem) return null;

  const { type, data } = drawerItem;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (type === 'task') {
    return (
      <DetailDrawer
        isOpen={true}
        onClose={closeDrawer}
        title={data.title}
        subtitle={`Task ID: ${data.id} · ${data.discipline} Discipline`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-[#94A3B8] block mb-1">Status & Priority</span>
            <div className="flex items-center gap-2">
              <StatusBadge label={data.status} variant="info" />
              <span className="font-mono uppercase font-bold text-amber-400">{data.priority}</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#080B10] rounded-lg border border-[#273244]">
            <span className="text-[#94A3B8] block mb-1">Task Scope & Standard:</span>
            <p className="text-[#F8FAFC] leading-relaxed">{data.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#94A3B8] block">Assignee</span>
              <span className="font-semibold text-white">{data.assigneeName}</span>
              <span className="text-[10px] text-[#94A3B8] block">{data.assigneeRole}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">Due Date</span>
              <span className="font-mono text-white">{data.dueDate}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#273244] flex justify-end gap-2">
            {data.status !== 'completed' && (
              <button
                onClick={() => {
                  updateTaskStatus(data.id, 'completed');
                  closeDrawer();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition"
              >
                Mark Task Completed
              </button>
            )}
          </div>
        </div>
      </DetailDrawer>
    );
  }

  if (type === 'change_order') {
    return (
      <DetailDrawer
        isOpen={true}
        onClose={closeDrawer}
        title={`${data.code} · Change Order`}
        subtitle={`Submitted: ${data.submittedDate}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-[#94A3B8] block mb-1">Proposed Cost</span>
            <span className="text-2xl font-bold font-mono text-white">{formatCurrency(data.proposedCost)}</span>
          </div>

          <div className="p-3.5 bg-[#080B10] rounded-lg border border-[#273244]">
            <span className="text-[#94A3B8] block mb-1">Scope Description:</span>
            <p className="text-[#F8FAFC] font-medium leading-relaxed">{data.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[#94A3B8] block">Schedule Impact</span>
              <span className="font-mono text-rose-400 font-bold">+{data.timeImpactDays} Days</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">Originator</span>
              <span className="text-white">{data.originator}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-800/60 rounded-lg text-amber-200">
            <span className="font-bold block mb-0.5">Autonomy Guardrail Enforced:</span>
            Autopilot cannot approve change orders. Requires human Project Director authorization.
          </div>

          {data.status !== 'approved' && data.status !== 'rejected' && (
            <div className="pt-4 border-t border-[#273244] flex justify-end gap-2">
              <button
                onClick={() => {
                  rejectChangeOrder(data.id);
                  closeDrawer();
                }}
                className="px-4 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold rounded-lg transition"
              >
                Reject Change
              </button>
              <button
                onClick={() => {
                  approveChangeOrder(data.id);
                  closeDrawer();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition"
              >
                Approve as Human PM
              </button>
            </div>
          )}
        </div>
      </DetailDrawer>
    );
  }

  if (type === 'document') {
    return (
      <DetailDrawer
        isOpen={true}
        onClose={closeDrawer}
        title={`${data.documentNumber} · ${data.title}`}
        subtitle={`Revision ${data.revision} · Released ${data.releaseDate}`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[#94A3B8] block">Category</span>
              <span className="font-semibold text-white capitalize">{data.category.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">Discipline</span>
              <span className="font-semibold text-white">{data.discipline}</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#080B10] rounded-lg border border-[#273244]">
            <span className="text-[#94A3B8] block mb-1">Authoring Engineering Firm:</span>
            <p className="text-[#F8FAFC] font-medium">{data.author}</p>
          </div>

          <div>
            <span className="text-[#94A3B8] block mb-1">Approval Status</span>
            <StatusBadge label={data.status.replace('_', ' ')} variant="success" />
          </div>

          <div className="pt-4 border-t border-[#273244] flex justify-end">
            <button
              onClick={() => {
                alert(`Simulating document download for ${data.documentNumber}`);
                closeDrawer();
              }}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              Download Controlled Document
            </button>
          </div>
        </div>
      </DetailDrawer>
    );
  }

  if (type === 'milestone') {
    return (
      <DetailDrawer
        isOpen={true}
        onClose={closeDrawer}
        title={data.title}
        subtitle={`Package ID: ${data.id} · ${data.category} Package`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[#94A3B8] block">Total Float</span>
              <span
                className={`text-lg font-mono font-bold ${
                  data.totalFloatDays < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {data.totalFloatDays} Days {data.criticalPath ? '(Critical Path)' : ''}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">Progress</span>
              <span className="text-lg font-mono font-bold text-white">{data.progressPercent}%</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#080B10] rounded-lg border border-[#273244]">
            <span className="text-[#94A3B8] block mb-1">Primary Trade Subcontractor:</span>
            <p className="text-[#F8FAFC] font-semibold">{data.subcontractor}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[#94A3B8] font-mono">
            <div>Planned Start: {data.plannedStartDate}</div>
            <div>Planned Completion: {data.plannedEndDate}</div>
          </div>
        </div>
      </DetailDrawer>
    );
  }

  if (type === 'risk') {
    return (
      <DetailDrawer
        isOpen={true}
        onClose={closeDrawer}
        title={`${data.code} · ${data.description}`}
        subtitle={`Category: ${data.category} · Owner: ${data.owner}`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[#94A3B8] block">Severity</span>
              <span className="font-mono font-bold uppercase text-rose-400">{data.severity}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">Cost Risk</span>
              <span className="font-mono font-bold text-white">{formatCurrency(data.impactCost)}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">Schedule Risk</span>
              <span className="font-mono font-bold text-amber-400">+{data.impactScheduleDays}d</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#080B10] rounded-lg border border-[#273244]">
            <span className="text-[#94A3B8] block mb-1">Mitigation Action Plan:</span>
            <p className="text-[#F8FAFC] leading-relaxed">{data.mitigationPlan}</p>
          </div>
        </div>
      </DetailDrawer>
    );
  }

  return null;
};
