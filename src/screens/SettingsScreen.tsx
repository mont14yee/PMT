import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import {
  Settings,
  Database,
  Moon,
  Sun,
  Shield,
  Key,
  Copy,
  Check,
  Server,
  Lock,
  Terminal,
  Bell,
  Sliders,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useProject();
  const [copied, setCopied] = useState(false);
  const [cpiThreshold, setCpiThreshold] = useState('0.95');
  const [floatThreshold, setFloatThreshold] = useState('0');
  const [craneWindLimit, setCraneWindLimit] = useState('22');
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  useEffect(() => {
    fetch('/api/config/status')
      .then((res) => res.json())
      .then((data) => setConfigStatus(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 2500);
  };

  const sqlSchema = `-- ==============================================================================
-- PROJECT MANAGER AUTOPILOT - SUPABASE POSTGRESQL SCHEMA (DDL)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    client TEXT NOT NULL,
    general_contractor TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'construction',
    start_date DATE NOT NULL,
    target_completion_date DATE NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    bac NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    pv NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    ev NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    ac NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    contingency_budget NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    contingency_remaining NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    safety_days_without_incident INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Engineering Team Read All Projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);
`;

  const copyDDL = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            System Settings & Cloud Infrastructure
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Appearance themes, Supabase PostgreSQL, Gemini proxy, and Autopilot surveillance thresholds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#111722] border border-[#273244] text-[#F8FAFC] hover:bg-[#192231] transition"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#F59E0B]" />
                <span>Switch to Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#3B82F6]" />
                <span>Switch to Dark Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSettingsMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-lg animate-fadeIn flex items-center justify-between">
          <span>Surveillance threshold parameters updated successfully.</span>
        </div>
      )}

      {/* Grid: Appearance & Alert Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Identity */}
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 border-b border-[#273244] pb-2.5">
            <Sliders className="w-4 h-4 text-[#3B82F6]" />
            Visual Theme & Identity
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#192231]/40 border border-[#273244]">
              <div>
                <span className="font-semibold text-white block">Visual Palette</span>
                <span className="text-[#94A3B8]">
                  Current mode: <strong className="capitalize text-white">{theme} Theme</strong>
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-[#3B82F6] text-white hover:bg-blue-600 transition"
              >
                Toggle Theme
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#080B10] border border-[#273244] text-[11px] text-[#94A3B8] space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Dark Canvas:</span>
                <span className="text-white">#080B10</span>
              </div>
              <div className="flex justify-between">
                <span>Surfaces:</span>
                <span className="text-white">#111722 / #192231</span>
              </div>
              <div className="flex justify-between">
                <span>Engineering Accent:</span>
                <span className="text-[#3B82F6]">#3B82F6 (Blue)</span>
              </div>
              <div className="flex justify-between">
                <span>Warning / Critical:</span>
                <span className="text-[#F59E0B]">#F59E0B / #DC2626</span>
              </div>
            </div>
          </div>
        </div>

        {/* Autopilot Alert Thresholds */}
        <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 border-b border-[#273244] pb-2.5">
            <Bell className="w-4 h-4 text-[#F59E0B]" />
            Autopilot Surveillance Thresholds
          </h2>

          <form onSubmit={handleSavePreferences} className="space-y-3 text-xs">
            <div>
              <label className="text-[#94A3B8] font-semibold block mb-1">
                CPI Cost Alert Threshold (Triggers advisory if CPI drops below)
              </label>
              <input
                type="text"
                value={cpiThreshold}
                onChange={(e) => setCpiThreshold(e.target.value)}
                className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] font-semibold block mb-1">
                Critical Path Float Limit (Days of negative float before PM escalation)
              </label>
              <input
                type="text"
                value={floatThreshold}
                onChange={(e) => setFloatThreshold(e.target.value)}
                className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] font-semibold block mb-1">
                Tower Crane Wind Hold Limit (mph)
              </label>
              <input
                type="text"
                value={craneWindLimit}
                onChange={(e) => setCraneWindLimit(e.target.value)}
                className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#192231] hover:bg-slate-700 text-white font-semibold rounded-lg border border-[#273244] transition"
            >
              Save Threshold Parameters
            </button>
          </form>
        </div>
      </div>

      {/* Cloud & Supabase Status */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#273244] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Supabase PostgreSQL Connection & Data DDL
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Verify environment credentials or run the PostgreSQL migration blueprint in your Supabase project
            </p>
          </div>
          <button
            onClick={copyDDL}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-[#F59E0B] hover:bg-amber-300 rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied DDL' : 'Copy SQL DDL'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#080B10] border border-[#273244] rounded-lg text-slate-300 font-mono text-xs overflow-x-auto max-h-56 leading-relaxed">
          {sqlSchema}
        </pre>
      </div>
    </div>
  );
};
