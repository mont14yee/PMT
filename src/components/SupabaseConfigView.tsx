import React, { useEffect, useState } from 'react';
import { Database, Shield, Key, Copy, Check, Server, Terminal, Lock } from 'lucide-react';

export const SupabaseConfigView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [configStatus, setConfigStatus] = useState<{
    gemini: { configured: boolean; model: string; mode: string };
    supabase: { hasUrl: boolean; hasAnonKey: boolean; hasServiceRoleKey: boolean; status: string; activeMode: string };
    autopilotPolicy: { autonomyLevel: string; forbiddenAutonomousActions: string[] };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config/status')
      .then((res) => res.json())
      .then((data) => setConfigStatus(data))
      .catch((err) => console.error('Error fetching config status:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const sqlSchema = `-- ==============================================================================
-- PROJECT MANAGER AUTOPILOT - SUPABASE POSTGRESQL SCHEMA (DDL)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Projects Table
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

-- 3. Milestones Table (Critical Path & Schedule)
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    planned_start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_start_date DATE,
    actual_end_date DATE,
    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    critical_path BOOLEAN DEFAULT FALSE,
    total_float_days INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    subcontractor TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Change Orders Table (Financial Governance Gated by Human PM)
CREATE TABLE IF NOT EXISTS public.change_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    reason TEXT NOT NULL,
    proposed_cost NUMERIC(14,2) NOT NULL,
    time_impact_days INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'under_engineering_review',
    originator TEXT NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Autopilot Advisories & Non-Autonomous Logs
CREATE TABLE IF NOT EXISTS public.autopilot_advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'urgent')),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    bounded_reason TEXT NOT NULL,
    confidence_score NUMERIC(4,3) NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS) Enablement
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_advisories ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Authenticated Engineering Team Read/Write, Gated Changes)
CREATE POLICY "Engineering Team Read All Projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "PM Change Order Approval Policy"
ON public.change_orders FOR UPDATE
TO authenticated
USING (auth.uid() = approved_by);
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Cloud Infrastructure & Supabase Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Backend state, environment variable inventory, and PostgreSQL data architecture
        </p>
      </div>

      {/* Integration Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supabase Status Card */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Supabase PostgreSQL & Auth</h3>
            </div>
            {configStatus?.supabase.status === 'configured' ? (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                LIVE CONNECTED
              </span>
            ) : (
              <span className="text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded">
                DEMO WORKSPACE ACTIVE
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">SUPABASE_URL</span>
              <span className="font-mono text-slate-200">
                {configStatus?.supabase.hasUrl ? 'Configured [Provided]' : 'Unset (Requires .env)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">SUPABASE_ANON_KEY</span>
              <span className="font-mono text-slate-200">
                {configStatus?.supabase.hasAnonKey ? 'Configured [Client Safe]' : 'Unset (Requires .env)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">SUPABASE_SERVICE_ROLE_KEY</span>
              <span className="font-mono text-slate-200">
                {configStatus?.supabase.hasServiceRoleKey ? 'Configured [Server-Only]' : 'Optional (Background worker)'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Private Storage Buckets</span>
              <span className="font-mono text-slate-300">private-drawings, submittal-vault</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Status Card */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Gemini AI Engine (Server-Side Proxy)</h3>
            </div>
            {configStatus?.gemini.configured ? (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                GEMINI ACTIVE
              </span>
            ) : (
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded">
                DETERMINISTIC RULES ENGINE
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Server Proxy Endpoint</span>
              <span className="font-mono text-slate-200">/api/autopilot/audit</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Target Model</span>
              <span className="font-mono text-amber-400">gemini-2.5-flash</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Browser API Key Exposure</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> 0% (Strictly Server-Side)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Autonomy Guardrail Boundary</span>
              <span className="font-mono text-slate-200">MONITOR_AND_NOTIFY_ONLY</span>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Migration Script Generator */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Supabase SQL Migration Blueprint (PostgreSQL DDL)
            </h3>
            <p className="text-xs text-slate-400">
              Run this in your Supabase SQL Editor to provision project tables, foreign keys, and RLS policies
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL' : 'Copy DDL'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg text-slate-300 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
          {sqlSchema}
        </pre>
      </div>
    </div>
  );
};
