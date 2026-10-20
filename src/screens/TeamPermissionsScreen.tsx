import React from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { Users, ShieldCheck, Mail, Phone, Lock, Building } from 'lucide-react';
import type { TeamMember } from '../types/index.ts';

export const TeamPermissionsScreen: React.FC = () => {
  const { activeProject, updateTeamPermission } = useProject();

  const handleToggle = (memberId: string, permKey: string, currentVal: boolean) => {
    updateTeamPermission(memberId, permKey, !currentVal);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Team Roster & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            RACI matrix, financial signature limits, and baseline modification permissions
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>RLS Security Enforced</span>
        </div>
      </div>

      {/* Team Cards / Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeProject.team.map((member) => (
          <div
            key={member.id}
            className="border border-[#273244] bg-[#111722] rounded-xl p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#273244] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">{member.name}</h3>
                <span className="text-xs text-[#3B82F6] font-medium block">{member.roleTitle}</span>
                <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">
                  {member.organization}
                </span>
              </div>
              <div className="text-right text-[11px] text-[#94A3B8] space-y-1">
                <div className="flex items-center gap-1.5 justify-end">
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-[140px]">{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end font-mono">
                  <Phone className="w-3 h-3" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>

            {/* Permission Toggles */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                Assigned Operational Permissions:
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[#192231]/40 border border-[#273244]/60">
                  <span className="text-slate-200">Approve Financial Commitments ($)</span>
                  <input
                    type="checkbox"
                    checked={member.permissions.approveExpenditure}
                    onChange={() =>
                      handleToggle(
                        member.id,
                        'approveExpenditure',
                        member.permissions.approveExpenditure
                      )
                    }
                    className="rounded accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#192231]/40 border border-[#273244]/60">
                  <span className="text-slate-200">Modify Schedule Baselines</span>
                  <input
                    type="checkbox"
                    checked={member.permissions.modifyScheduleBaseline}
                    onChange={() =>
                      handleToggle(
                        member.id,
                        'modifyScheduleBaseline',
                        member.permissions.modifyScheduleBaseline
                      )
                    }
                    className="rounded accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#192231]/40 border border-[#273244]/60">
                  <span className="text-slate-200">Sign Off Daily Site Diary</span>
                  <input
                    type="checkbox"
                    checked={member.permissions.signOffDiary}
                    onChange={() =>
                      handleToggle(member.id, 'signOffDiary', member.permissions.signOffDiary)
                    }
                    className="rounded accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#192231]/40 border border-[#273244]/60">
                  <span className="text-slate-200">Submit Formal Technical RFIs</span>
                  <input
                    type="checkbox"
                    checked={member.permissions.submitRFIs}
                    onChange={() =>
                      handleToggle(member.id, 'submitRFIs', member.permissions.submitRFIs)
                    }
                    className="rounded accent-[#3B82F6] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
