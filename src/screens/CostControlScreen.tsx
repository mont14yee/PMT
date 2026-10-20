import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { MetricCard } from '../components/common/MetricCard.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import {
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Check,
  X,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { evaluateGuardrail } from '../core/guardrails.ts';
import type { ChangeOrder } from '../types/index.ts';

export const CostControlScreen: React.FC = () => {
  const {
    activeProject,
    addChangeOrder,
    approveChangeOrder,
    rejectChangeOrder,
    openDrawer,
  } = useProject();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [guardrailAlert, setGuardrailAlert] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState(`PCO-0${activeProject.changeOrders.length + 45}`);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(120000);
  const [days, setDays] = useState(5);
  const [reason, setReason] = useState<ChangeOrder['reason']>('site_condition');
  const [originator, setOriginator] = useState('Subcontractor Lead');

  const { evm } = activeProject;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const testExpenditureGuardrail = () => {
    const evalResult = evaluateGuardrail('APPROVE_CHANGE_ORDER');
    setGuardrailAlert(
      `[INVARIANT TRIGGERED - ${evalResult.governingPolicy}]: Autopilot cannot autonomously authorize financial expenditure or change orders. Requires human Project Manager sign-off.`
    );
  };

  const handleCreateCO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addChangeOrder({
      projectId: activeProject.id,
      code,
      title,
      reason,
      proposedCost: Number(cost),
      timeImpactDays: Number(days),
      status: 'under_engineering_review',
      submittedDate: new Date().toISOString().split('T')[0],
      originator,
      requiresBoardApproval: Number(cost) > 500000,
    });

    setTitle('');
    setShowCreateModal(false);
  };

  const contingencyPct = Math.round(
    ((activeProject.contingencyBudget - activeProject.contingencyRemaining) /
      activeProject.contingencyBudget) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Cost Control & Earned Value Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            ANSI/EIA-748 Earned Value metrics, contingency reserves, and human-in-the-loop change order governance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={testExpenditureGuardrail}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-lg hover:bg-amber-900/40 transition"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Test Expenditure Guardrail</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Change Order</span>
          </button>
        </div>
      </div>

      {/* Guardrail Invariant Banner */}
      {guardrailAlert && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800 text-xs text-rose-200 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300 block mb-0.5">
                Autonomous Action Intercepted by Autonomy Policy
              </span>
              <p>{guardrailAlert}</p>
            </div>
          </div>
          <button onClick={() => setGuardrailAlert(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EVM 6-Box Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Budget (BAC)" value={formatCurrency(evm.bac)} />
        <MetricCard label="Planned (PV)" value={formatCurrency(evm.pv)} />
        <MetricCard label="Earned Value (EV)" value={formatCurrency(evm.ev)} />
        <MetricCard label="Actual Cost (AC)" value={formatCurrency(evm.ac)} />
        <MetricCard
          label="CPI Index"
          value={evm.cpi}
          variant={evm.cpi >= 1.0 ? 'success' : 'warning'}
          trendText={`CV: ${formatCurrency(evm.cv)}`}
        />
        <MetricCard
          label="SPI Index"
          value={evm.spi}
          variant={evm.spi >= 1.0 ? 'success' : 'warning'}
          trendText={`SV: ${formatCurrency(evm.sv)}`}
        />
      </div>

      {/* Contingency Reserve & Forecasting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F8FAFC]">Contingency Reserve Allocation</h3>
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>Drawdown: {contingencyPct}%</span>
            <span>
              Remaining: <strong className="text-emerald-400 font-mono">{formatCurrency(activeProject.contingencyRemaining)}</strong>
            </span>
          </div>
          <div className="w-full bg-[#080B10] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${contingencyPct > 65 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${contingencyPct}%` }}
            />
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Initial contingency budgeted at {formatCurrency(activeProject.contingencyBudget)}. Any drawdowns require owner representative approval.
          </p>
        </div>

        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-2 text-xs">
          <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">Estimate at Completion (EAC) Forecast</h3>
          <div className="flex justify-between py-1 border-b border-[#273244]">
            <span className="text-[#94A3B8]">Estimate at Completion (EAC = BAC / CPI)</span>
            <span className="font-mono font-bold text-white tabular-nums">{formatCurrency(evm.eac)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#273244]">
            <span className="text-[#94A3B8]">Variance at Completion (VAC = BAC - EAC)</span>
            <span className={`font-mono font-bold tabular-nums ${evm.vac >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(evm.vac)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#94A3B8]">To-Complete Performance Index (TCPI)</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">{evm.tcpi}</span>
          </div>
        </div>
      </div>

      {/* Change Orders Register */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl overflow-x-auto shadow-sm">
        <div className="px-5 py-4 border-b border-[#273244] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC]">Potential Change Orders (PCO Register)</h2>
            <p className="text-xs text-[#94A3B8]">Changes affecting contract price or milestone duration</p>
          </div>
          <span className="text-xs font-mono text-[#F59E0B]">
            Pending: {formatCurrency(activeProject.pendingChangeOrderTotal)}
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#192231]/70 text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#273244]">
            <tr>
              <th className="py-3 px-4">PCO #</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Originator</th>
              <th className="py-3 px-4 text-right">Proposed Cost</th>
              <th className="py-3 px-4 text-center">Schedule Impact</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Human PM Sign-off</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#273244]/80">
            {activeProject.changeOrders.map((co) => (
              <tr
                key={co.id}
                onClick={() => openDrawer('change_order', co)}
                className="hover:bg-[#192231]/40 transition cursor-pointer"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-[#F59E0B]">{co.code}</td>
                <td className="py-3.5 px-4 max-w-sm">
                  <span className="font-semibold text-[#F8FAFC] block">{co.title}</span>
                  <span className="text-[10px] text-[#94A3B8] capitalize">Reason: {co.reason.replace('_', ' ')}</span>
                </td>
                <td className="py-3.5 px-4 text-[#F8FAFC]">{co.originator}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                  {formatCurrency(co.proposedCost)}
                </td>
                <td className="py-3.5 px-4 text-center font-mono">
                  {co.timeImpactDays > 0 ? (
                    <span className="text-rose-400">+{co.timeImpactDays}d</span>
                  ) : (
                    <span className="text-slate-500">0d</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge
                    label={co.status.replace('_', ' ')}
                    variant={
                      co.status === 'approved'
                        ? 'success'
                        : co.status === 'rejected'
                        ? 'critical'
                        : 'warning'
                    }
                  />
                </td>
                <td
                  className="py-3.5 px-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {co.status !== 'approved' && co.status !== 'rejected' ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => approveChangeOrder(co.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-800 rounded transition"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => rejectChangeOrder(co.id)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-rose-300 bg-rose-950/50 hover:bg-rose-900 border border-rose-800 rounded transition"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#94A3B8] font-mono">Sign-off Logged</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Change Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#111722] border border-[#273244] rounded-xl p-6 text-[#F8FAFC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#273244] pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Draft Potential Change Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCO} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">PCO Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Originator</label>
                  <input
                    type="text"
                    required
                    value={originator}
                    onChange={(e) => setOriginator(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#94A3B8] block mb-1">Title & Scope *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Relocation of underground fiber duct bank"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Proposed Cost ($)</label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Time Impact (Days)</label>
                  <input
                    type="number"
                    required
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  >
                    <option value="site_condition">Site Condition</option>
                    <option value="client_request">Client Request</option>
                    <option value="design_discrepancy">Design Discrepancy</option>
                    <option value="regulatory">Regulatory</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#273244]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition"
                >
                  Submit for PM Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
