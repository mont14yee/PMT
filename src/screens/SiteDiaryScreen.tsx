import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import {
  BookOpen,
  Calendar,
  CloudSun,
  Users,
  HardHat,
  Camera,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Wind,
  X,
} from 'lucide-react';
import type { SiteDiaryEntry } from '../types/index.ts';

export const SiteDiaryScreen: React.FC = () => {
  const { activeProject, addSiteDiaryEntry } = useProject();
  const [selectedEntry, setSelectedEntry] = useState<SiteDiaryEntry>(
    activeProject.siteDiary[0] || {
      id: 'd-new',
      projectId: activeProject.id,
      date: new Date().toISOString().split('T')[0],
      author: 'Carlos Mendoza (Site Superintendent)',
      weather: { tempFahrenheit: 60, condition: 'Clear', windSpeedMph: 10, craneHold: false },
      totalHeadcount: 140,
      contractors: [],
      equipmentActive: [],
      safetyIncidents: 0,
      inspectionsCompleted: [],
      workCompletedNotes: 'Regular shift ongoing.',
      photos: [],
    }
  );

  const [showLogModal, setShowLogModal] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logNotes, setLogNotes] = useState('');
  const [logHeadcount, setLogHeadcount] = useState(150);
  const [tempF, setTempF] = useState(64);
  const [windMph, setWindMph] = useState(12);

  const handleCreateDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logNotes.trim()) return;

    addSiteDiaryEntry({
      projectId: activeProject.id,
      date: logDate,
      author: 'Carlos Mendoza (Site Superintendent)',
      weather: {
        tempFahrenheit: Number(tempF),
        condition: windMph > 20 ? 'Windy' : 'Clear',
        windSpeedMph: Number(windMph),
        craneHold: windMph > 22,
      },
      totalHeadcount: Number(logHeadcount),
      contractors: [
        { trade: 'Ironworkers', company: 'Vanguard Steel', workerCount: 40 },
        { trade: 'Carpenters & Glaziers', company: 'Enclos', workerCount: 30 },
        { trade: 'Pipefitters', company: 'Dynamic Systems', workerCount: 35 },
      ],
      equipmentActive: ['Liebherr 280 EC-H Tower Crane', 'JLG Boom Lift', 'Concrete Pumper'],
      safetyIncidents: 0,
      inspectionsCompleted: ['Daily Toolbox Safety Briefing', 'Fall Protection Inspection'],
      workCompletedNotes: logNotes,
      photos: [],
    });

    setLogNotes('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Daily Construction Site Diary
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Superintendent log, weather telemetry, trade headcounts, and site inspection records
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Log Daily Entry</span>
        </button>
      </div>

      {/* Diary Entry Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {activeProject.siteDiary.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              selectedEntry.id === entry.id
                ? 'bg-[#3B82F6] text-white font-bold shadow-sm'
                : 'bg-[#111722] border border-[#273244] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {entry.date} ({entry.weather.condition}, {entry.weather.tempFahrenheit}°F)
          </button>
        ))}
      </div>

      {/* Selected Daily Log View */}
      {selectedEntry && (
        <div className="space-y-6">
          {/* Top Conditions Card */}
          <div className="border border-[#273244] bg-[#111722] rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#273244] pb-4">
              <div>
                <span className="text-xs text-[#94A3B8] font-mono">
                  LOGGED BY: {selectedEntry.author}
                </span>
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  Site Report for {selectedEntry.date}
                </h2>
              </div>

              {/* Weather Telemetry Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#192231] border border-[#273244] rounded-lg text-xs font-mono text-[#F8FAFC]">
                  <CloudSun className="w-4 h-4 text-[#F59E0B]" />
                  <span>
                    {selectedEntry.weather.tempFahrenheit}°F · {selectedEntry.weather.condition}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                    selectedEntry.weather.craneHold
                      ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                      : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  }`}
                >
                  <Wind className="w-4 h-4" />
                  <span>
                    Wind {selectedEntry.weather.windSpeedMph} mph ·{' '}
                    {selectedEntry.weather.craneHold ? 'CRANE HOLD' : 'Picks Allowed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
              <div>
                <span className="text-[#94A3B8] block">Total Site Headcount</span>
                <span className="text-xl font-bold font-mono text-[#F8FAFC] tabular-nums">
                  {selectedEntry.totalHeadcount} Workers
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Safety Incidents</span>
                <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  0 Incidents
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Active Subcontractors</span>
                <span className="text-xl font-bold font-mono text-[#3B82F6] tabular-nums">
                  {selectedEntry.contractors.length} Trades
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Inspections Completed</span>
                <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                  {selectedEntry.inspectionsCompleted.length} Signed
                </span>
              </div>
            </div>
          </div>

          {/* Subcontractor Trades Breakdown & Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trades & Equipment */}
            <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 border-b border-[#273244] pb-3">
                <Users className="w-4 h-4 text-[#3B82F6]" />
                Subcontractor Headcount Breakdown
              </h3>

              <div className="space-y-2">
                {selectedEntry.contractors.map((c, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2.5 rounded bg-[#192231]/50 border border-[#273244] text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#F8FAFC] block">{c.trade}</span>
                      <span className="text-[11px] text-[#94A3B8]">{c.company}</span>
                    </div>
                    <span className="font-mono font-bold text-[#F8FAFC] bg-[#080B10] px-2.5 py-1 rounded border border-[#273244]">
                      {c.workerCount} men
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#273244]">
                <h4 className="text-xs font-semibold text-[#94A3B8] mb-2">Heavy Equipment Deployed:</h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {selectedEntry.equipmentActive.map((eq, i) => (
                    <li key={i}>{eq}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Daily Work Summary & Field Photos */}
            <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 border-b border-[#273244] pb-3">
                <BookOpen className="w-4 h-4 text-[#F59E0B]" />
                Work Completed & Delay Causes
              </h3>

              <div className="text-xs text-slate-200 leading-relaxed bg-[#192231]/40 p-4 rounded-lg border border-[#273244]">
                <strong className="text-white block mb-1">Superintendent Notes:</strong>
                {selectedEntry.workCompletedNotes}
              </div>

              {selectedEntry.delayCauses && (
                <div className="p-3 bg-amber-950/20 border border-amber-800/60 rounded-lg text-xs text-amber-200">
                  <strong className="block text-amber-300 font-semibold mb-0.5">Delay Cause Recorded:</strong>
                  {selectedEntry.delayCauses}
                </div>
              )}

              {/* Photos Gallery */}
              <div>
                <h4 className="text-xs font-semibold text-[#94A3B8] mb-2 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#3B82F6]" />
                  Verified Site Field Photos ({selectedEntry.photos.length})
                </h4>
                {selectedEntry.photos.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No field photos attached for this shift.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedEntry.photos.map((ph) => (
                      <div
                        key={ph.id}
                        className="rounded-lg overflow-hidden border border-[#273244] bg-[#192231]"
                      >
                        <img
                          src={ph.url}
                          alt={ph.caption}
                          className="w-full h-28 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-2 text-[10px] text-[#94A3B8] line-clamp-1">
                          {ph.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Diary Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#111722] border border-[#273244] rounded-xl p-6 text-[#F8FAFC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#273244] pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Log Site Diary Shift</h3>
              <button onClick={() => setShowLogModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiary} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Total Headcount</label>
                  <input
                    type="number"
                    required
                    value={logHeadcount}
                    onChange={(e) => setLogHeadcount(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Temperature (°F)</label>
                  <input
                    type="number"
                    value={tempF}
                    onChange={(e) => setTempF(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Wind Speed (mph)</label>
                  <input
                    type="number"
                    value={windMph}
                    onChange={(e) => setWindMph(Number(e.target.value))}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#94A3B8] block mb-1">
                  Daily Work Summary & Inspections Completed *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe progress, steel picks completed, concrete pours, QA/QC tests..."
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#273244]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition"
                >
                  Save Shift Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
