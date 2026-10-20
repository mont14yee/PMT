import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import {
  AlertTriangle,
  Shield,
  Plus,
  Filter,
  CheckCircle,
  X,
  Activity,
} from 'lucide-react';
import type { RiskItem, RiskSeverity } from '../types/index.ts';

export const RisksIssuesScreen: React.FC = () => {
  const { activeProject, addRiskItem, openDrawer } = useProject();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RiskItem['category']>('supply_chain');
  const [probability, setProbability] = useState(0.7);
  const [impactScore, setImpactScore] = useState(4);
  const [cost, setCost] = useState(150000);
  const [days, setDays] = useState(10);
  const [mitigation, setMitigation] = useState('');
  const [owner, setOwner] = useState('Project Manager');

  const filteredRisks = activeProject.risks.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    let severity: RiskSeverity = 'medium';
    const score = Number(impactScore) * Number(probability);
    if (score >= 3.2) severity = 'critical';
    else if (score >= 2.0) severity = 'high';
    else if (score < 1.0) severity = 'low';

    addRiskItem({
      projectId: activeProject.id,
      code: `RSK-${Date.now().toString().slice(-4)}`,
      description,
      category,
      probability: Number(probability),
      impactScore: Number(impactScore),
      impactCost: Number(cost),
      impactScheduleDays: Number(days),
      severity,
      mitigationPlan: mitigation,
      owner,
      status: 'active',
    });

    setDescription('');
    setMitigation('');
    setShowAddModal(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Risk & Safety Register
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            HAZOP, weather, geotechnical, and subcontractor exposure matrix
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Risk Categories</option>
            <option value="supply_chain">Supply Chain</option>
            <option value="weather">Weather & Environmental</option>
            <option value="safety">Safety & OSHA</option>
            <option value="geotechnical">Geotechnical / Subgrade</option>
            <option value="regulatory">Regulatory & Permits</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Identify Risk</span>
          </button>
        </div>
      </div>

      {/* 5x5 Probability vs Impact Risk Matrix & High Severity Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Visual Matrix */}
        <div className="lg:col-span-1 border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center justify-between">
            <span>5x5 Risk Severity Matrix</span>
            <span className="text-[10px] font-mono text-[#F59E0B]">ISO 31000 Standard</span>
          </h3>

          <div className="grid grid-cols-5 gap-1.5 p-2 bg-[#080B10] rounded-lg border border-[#273244] aspect-square">
            {/* 25 matrix cells (5 rows x 5 cols) */}
            {Array.from({ length: 25 }).map((_, idx) => {
              const row = 5 - Math.floor(idx / 5); // impact 5 to 1
              const col = (idx % 5) + 1; // prob 1 to 5
              const score = row * col;

              let cellColor = 'bg-emerald-950/40 text-emerald-500';
              if (score >= 15) cellColor = 'bg-rose-950/80 text-rose-300 font-bold';
              else if (score >= 8) cellColor = 'bg-amber-950/60 text-amber-300';

              // check if any risk matches this cell
              const matchingCount = activeProject.risks.filter(
                (r) => r.impactScore === row && Math.round(r.probability * 5) === col
              ).length;

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center rounded border border-[#273244]/40 text-[10px] font-mono transition ${cellColor}`}
                >
                  {matchingCount > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-white text-slate-950 font-bold flex items-center justify-center text-[10px]">
                      {matchingCount}
                    </span>
                  ) : (
                    <span className="opacity-40">{score}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono pt-1">
            <span>Low Risk (1-6)</span>
            <span>Medium (8-12)</span>
            <span className="text-rose-400 font-bold">Critical (15-25)</span>
          </div>
        </div>

        {/* Active Risk Summary Cards */}
        <div className="lg:col-span-2 border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#273244] pb-3">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Active Risk Mitigation Directives</h3>
            <span className="text-xs font-mono text-rose-400">
              {activeProject.risks.filter((r) => r.severity === 'critical').length} Critical Exposures
            </span>
          </div>

          <div className="space-y-3">
            {filteredRisks.map((risk) => (
              <div
                key={risk.id}
                onClick={() => openDrawer('risk', risk)}
                className={`p-3.5 rounded-lg border transition cursor-pointer ${
                  risk.severity === 'critical'
                    ? 'border-rose-900/80 bg-rose-950/20'
                    : risk.severity === 'high'
                    ? 'border-amber-900/80 bg-amber-950/20'
                    : 'border-[#273244] bg-[#192231]/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#F59E0B]">{risk.code}</span>
                    <span className="font-semibold text-xs text-[#F8FAFC]">{risk.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        risk.severity === 'critical'
                          ? 'bg-rose-950 border-rose-800 text-rose-300'
                          : risk.severity === 'high'
                          ? 'bg-amber-950 border-amber-800 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#94A3B8] mb-2">
                  <strong className="text-slate-300">Mitigation:</strong> {risk.mitigationPlan}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#94A3B8] pt-2 border-t border-[#273244]/60 font-mono">
                  <span>Owner: {risk.owner}</span>
                  <span>Impact: {formatCurrency(risk.impactCost)}</span>
                  <span>Schedule Risk: +{risk.impactScheduleDays} days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Risk Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#111722] border border-[#273244] rounded-xl p-6 text-[#F8FAFC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#273244] pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Log Project Risk Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRisk} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#94A3B8] block mb-1">Risk Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concrete supplier batch plant equipment breakdown"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  >
                    <option value="supply_chain">Supply Chain</option>
                    <option value="weather">Weather & Environmental</option>
                    <option value="safety">Safety & OSHA</option>
                    <option value="geotechnical">Geotechnical / Subgrade</option>
                    <option value="regulatory">Regulatory</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Impact Score (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={impactScore}
                    onChange={(e) => setImpactScore(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Estimated Cost Risk ($)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Schedule Delay (Days)</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#94A3B8] block mb-1">Mitigation Action Plan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail preventative measures, secondary backup sources, or insurance riders..."
                  value={mitigation}
                  onChange={(e) => setMitigation(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#273244]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition"
                >
                  Register Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
