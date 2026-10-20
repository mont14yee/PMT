import React, { useState } from 'react';
import type { ChangeOrder } from '../types/index.ts';
import { DollarSign, ShieldAlert, Check, X, ShieldCheck } from 'lucide-react';
import { evaluateGuardrail } from '../core/guardrails.ts';

interface ChangeOrdersViewProps {
  changeOrders: ChangeOrder[];
  onApproveChangeOrder: (id: string) => void;
  onRejectChangeOrder: (id: string) => void;
}

export const ChangeOrdersView: React.FC<ChangeOrdersViewProps> = ({
  changeOrders,
  onApproveChangeOrder,
  onRejectChangeOrder,
}) => {
  const [attemptedAutopilotMsg, setAttemptedAutopilotMsg] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleTestAutonomousApproval = () => {
    const evaluation = evaluateGuardrail('APPROVE_CHANGE_ORDER');
    setAttemptedAutopilotMsg(
      `[GUARDRAIL TRIGGERED - ${evaluation.governingPolicy}]: Action Intercepted. ${evaluation.violationReason}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Autonomy Guardrail Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Cost Governance & Change Orders
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict human-in-the-loop financial approval workflow
          </p>
        </div>

        <button
          onClick={handleTestAutonomousApproval}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-md hover:bg-amber-900/40 transition-colors"
          title="Verify that Autopilot cannot autonomously authorize financial expenditure"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Test Autopilot Expenditure Guardrail
        </button>
      </div>

      {attemptedAutopilotMsg && (
        <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-800/80 text-xs text-rose-200 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300 block mb-1">
                Autonomous Action Blocked by Invariant
              </span>
              <p>{attemptedAutopilotMsg}</p>
            </div>
          </div>
          <button
            onClick={() => setAttemptedAutopilotMsg(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Governance Notice */}
      <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Policy Enforced:</strong> All changes affecting contract value or baseline schedule require manual Project Manager authorization.
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">Fail-Closed Safety Mode Active</span>
      </div>

      {/* Change Orders List */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Change Order Code</th>
              <th className="py-3 px-4">Scope Description</th>
              <th className="py-3 px-4">Originator</th>
              <th className="py-3 px-4 text-right">Proposed Cost</th>
              <th className="py-3 px-4 text-center">Time Impact</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">PM Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {changeOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No active change orders logged for this project.
                </td>
              </tr>
            ) : (
              changeOrders.map((co) => (
                <tr key={co.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-amber-400">
                    {co.code}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-medium text-slate-200 block">{co.title}</span>
                    <span className="text-[11px] text-slate-400 capitalize">Reason: {co.reason.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{co.originator}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                    {formatCurrency(co.proposedCost)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums">
                    {co.timeImpactDays > 0 ? (
                      <span className="text-rose-400">+{co.timeImpactDays} days</span>
                    ) : (
                      <span className="text-slate-400">0 days</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {co.status === 'approved' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
                        Approved (Human)
                      </span>
                    )}
                    {co.status === 'rejected' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/40 text-rose-400 border border-rose-800/50">
                        Rejected
                      </span>
                    )}
                    {(co.status === 'under_engineering_review' || co.status === 'submitted_to_owner') && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/40 text-amber-300 border border-amber-800/50">
                        Pending Sign-off
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {co.status !== 'approved' && co.status !== 'rejected' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onApproveChangeOrder(co.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800 rounded transition"
                          title="Authorize expenditure as human Project Manager"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => onRejectChangeOrder(co.id)}
                          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-rose-300 bg-rose-950/50 hover:bg-rose-900/50 border border-rose-800 rounded transition"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Sign-off recorded</span>
                    )}
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
