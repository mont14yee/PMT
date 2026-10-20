import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Printer,
  CheckCircle,
  X,
} from 'lucide-react';
import type { ReportItem } from '../types/index.ts';

export const ReportsScreen: React.FC = () => {
  const { activeProject } = useProject();
  const [selectedReport, setSelectedReport] = useState<ReportItem>(
    activeProject.reports[0] || {
      id: 'rep-01',
      projectId: activeProject.id,
      title: 'Executive Weekly Progress Briefing - Week 11',
      period: 'March 10 - March 17, 2026',
      reportType: 'executive_summary',
      generatedDate: '2026-03-18',
      cpiRecorded: activeProject.evm.cpi,
      spiRecorded: activeProject.evm.spi,
      totalCostVariance: activeProject.evm.cv,
      highlights: [
        'Steel erection reached 78% completion with active ultrasonic weld inspections.',
        'Contingency reserve remains within nominal operating tolerances.',
        'Zero lost-time safety incidents recorded over past quarter.',
      ],
    }
  );

  const [showPrintModal, setShowPrintModal] = useState(false);

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
            Engineering Reports & Executive Briefings
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Formal weekly stakeholder summaries, Earned Value analysis, and audit trails
          </p>
        </div>

        <button
          onClick={() => setShowPrintModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Generate Official Report</span>
        </button>
      </div>

      {/* Reports List & Active Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Reports Archive */}
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#F8FAFC] border-b border-[#273244] pb-2.5">
            Published Report Archive
          </h2>

          <div className="space-y-2.5">
            {activeProject.reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-3.5 rounded-lg border cursor-pointer transition ${
                  selectedReport.id === rep.id
                    ? 'border-[#3B82F6] bg-[#192231]'
                    : 'border-[#273244] bg-[#080B10]/40 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-[#F59E0B]">
                    {rep.generatedDate}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 capitalize">
                    {rep.reportType.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#F8FAFC] block">{rep.title}</h3>
                <span className="text-[11px] text-[#94A3B8] mt-1 block">Period: {rep.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Report Preview Document */}
        <div className="lg:col-span-2 border border-[#273244] bg-[#111722] rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
            <div>
              <span className="text-xs font-mono text-[#F59E0B]">
                CONFIDENTIAL · OWNER / CONTRACTOR BRIEFING
              </span>
              <h2 className="text-lg font-bold text-[#F8FAFC]">{selectedReport.title}</h2>
              <span className="text-xs text-[#94A3B8]">Period Covered: {selectedReport.period}</span>
            </div>

            <button
              onClick={() => alert(`Exporting ${selectedReport.title} as signed PDF document`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#192231] hover:bg-slate-700 border border-[#273244] rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Download Signed PDF</span>
            </button>
          </div>

          {/* Report Metadata & EVM Stamp */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080B10] p-4 rounded-lg border border-[#273244] text-xs">
            <div>
              <span className="text-[#94A3B8] block">Project Code</span>
              <span className="font-mono font-bold text-[#F8FAFC]">{activeProject.code}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">CPI Recorded</span>
              <span className="font-mono font-bold text-amber-400">
                {selectedReport.cpiRecorded}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">SPI Recorded</span>
              <span className="font-mono font-bold text-amber-400">
                {selectedReport.spiRecorded}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] block">Cost Variance</span>
              <span className="font-mono font-bold text-rose-400">
                {formatCurrency(selectedReport.totalCostVariance)}
              </span>
            </div>
          </div>

          {/* Key Executive Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Executive Observations & Milestones
            </h3>
            <ul className="space-y-2 text-xs text-slate-200">
              {selectedReport.highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-[#192231]/40 border border-[#273244]"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Autonomy Non-Autonomous Certification */}
          <div className="p-3.5 rounded-lg border border-[#273244] bg-[#080B10]/60 text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>
              Report generated via <strong>Project Manager Autopilot Engine</strong> under human supervisory audit.
            </span>
            <span className="font-mono text-emerald-400">ANSI/EIA-748 Verified</span>
          </div>
        </div>
      </div>

      {/* Official Printable Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#111722] border border-[#273244] rounded-xl p-6 text-[#F8FAFC] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#273244] pb-3">
              <h3 className="text-base font-bold text-white">Generate Executive Summary Document</h3>
              <button onClick={() => setShowPrintModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              This compiles project {activeProject.code} Earned Value indices, critical path variance, contractor headcounts, and open RFI statuses into an executive PDF briefing with digital signature stamps.
            </p>

            <div className="p-4 bg-[#080B10] border border-[#273244] rounded-lg text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Project:</span>
                <span className="text-white">{activeProject.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">EAC Forecast:</span>
                <span className="text-amber-400">{formatCurrency(activeProject.evm.eac)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Zero-Incident Days:</span>
                <span className="text-emerald-400">{activeProject.safetyDaysWithoutIncident} Days</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#273244]">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowPrintModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
