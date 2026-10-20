import React, { useState } from 'react';
import type { RFIItem } from '../types/index.ts';
import { FileQuestion, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { evaluateGuardrail } from '../core/guardrails.ts';

interface RFIsViewProps {
  rfis: RFIItem[];
  onAnswerRFI: (id: string, answer: string) => void;
}

export const RFIsView: React.FC<RFIsViewProps> = ({ rfis, onAnswerRFI }) => {
  const [selectedRfi, setSelectedRfi] = useState<RFIItem | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [attemptedAutopilotMsg, setAttemptedAutopilotMsg] = useState<string | null>(null);

  const handleTestAutonomousEngineering = () => {
    const evaluation = evaluateGuardrail('APPROVE_TECHNICAL_RFI_SUBMITTAL');
    setAttemptedAutopilotMsg(
      `[GUARDRAIL TRIGGERED - ${evaluation.governingPolicy}]: Action Blocked. ${evaluation.violationReason}`
    );
  };

  const submitHumanAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfi || !answerText.trim()) return;
    onAnswerRFI(selectedRfi.id, answerText);
    setSelectedRfi(null);
    setAnswerText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Requests for Information (RFIs) & Submittals
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Engineering coordination and technical clarification log
          </p>
        </div>

        <button
          onClick={handleTestAutonomousEngineering}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 rounded-md hover:bg-cyan-900/40 transition-colors"
          title="Verify that Autopilot cannot autonomously resolve licensed engineering questions"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Test Engineering Variance Guardrail
        </button>
      </div>

      {attemptedAutopilotMsg && (
        <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-800/80 text-xs text-cyan-200 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300 block mb-1">
                Engineering Decision Guardrail Enforced
              </span>
              <p>{attemptedAutopilotMsg}</p>
            </div>
          </div>
          <button
            onClick={() => setAttemptedAutopilotMsg(null)}
            className="text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* RFI Table */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">RFI Code</th>
              <th className="py-3 px-4">Subject & Scope</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4">Assigned Engineer / Consultant</th>
              <th className="py-3 px-4 text-center">Due Date</th>
              <th className="py-3 px-4 text-center">Schedule Impact</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {rfis.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No open RFIs recorded for this project.
                </td>
              </tr>
            ) : (
              rfis.map((rfi) => (
                <tr key={rfi.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-amber-400">{rfi.code}</td>
                  <td className="py-3 px-4 max-w-sm">
                    <span className="font-medium text-slate-200 block">{rfi.subject}</span>
                    <span className="text-[11px] text-slate-400">Created: {rfi.dateCreated}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {rfi.discipline}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{rfi.assignedTo}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-400">{rfi.dueDate}</td>
                  <td className="py-3 px-4 text-center">
                    {rfi.impactsSchedule ? (
                      <span className="text-rose-400 font-semibold flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {rfi.status === 'answered' || rfi.status === 'closed' ? (
                      <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Answered
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium">Under Review</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {rfi.status !== 'answered' && rfi.status !== 'closed' ? (
                      <button
                        onClick={() => setSelectedRfi(rfi)}
                        className="px-2.5 py-1 text-[11px] font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/60 rounded transition"
                      >
                        Provide PE Answer
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Closed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Answer Modal for human PE sign-off */}
      {selectedRfi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white">PE Clarification: {selectedRfi.code}</h3>
              </div>
              <button
                onClick={() => setSelectedRfi(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs mb-4">
              <span className="text-slate-400 block mb-1">Subject:</span>
              <p className="text-slate-200 font-medium">{selectedRfi.subject}</p>
            </div>

            <form onSubmit={submitHumanAnswer} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Engineer of Record / PE Formal Response:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the technical resolution, referenced drawing sheets, and specification sections..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRfi(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition"
                >
                  Submit Formal Response (Human Sign-off)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
