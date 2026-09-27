import React, { useState } from 'react';
import { ShieldCheck, Sliders, FileDown, RotateCcw, Check, Sparkles } from 'lucide-react';
import { MeetingAnalysis } from '../types';
import { INITIAL_MEETING } from '../sampleData';

interface SettingsScreenProps {
  meeting: MeetingAnalysis;
  onResetMeeting: (meeting: MeetingAnalysis) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ meeting, onResetMeeting }) => {
  const [strictUncertainty, setStrictUncertainty] = useState(true);
  const [requireExplicitSource, setRequireExplicitSource] = useState(true);
  const [flagPassiveActions, setFlagPassiveActions] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Guardrails
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm md:text-base">
          Control how AgreeMate AI extracts decisions and handles ambiguity.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Settings saved successfully.
        </div>
      )}

      {/* CORE ANTI-HALLUCINATION RULES */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Uncertainty Preservation Engine</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guarantees that participants never leave with fabricated assumptions.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Setting 1 */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Never Guess Missing Owners
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                When an action item lacks an explicit name ("Testing should be completed Monday"), mark as "Needs clarification".
              </span>
            </div>
            <input
              type="checkbox"
              checked={strictUncertainty}
              onChange={(e) => setStrictUncertainty(e.target.checked)}
              className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Setting 2 */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Preserve Verbatim Source Sentences
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Bind every confirmed decision, suggestion, and action to its original sentence for full traceability.
              </span>
            </div>
            <input
              type="checkbox"
              checked={requireExplicitSource}
              onChange={(e) => setRequireExplicitSource(e.target.checked)}
              className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Setting 3 */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Strict Suggestion Isolation
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Prohibit speculative language ("we could", "maybe we") from ever appearing as confirmed agreements.
              </span>
            </div>
            <input
              type="checkbox"
              checked={flagPassiveActions}
              onChange={(e) => setFlagPassiveActions(e.target.checked)}
              className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-md"
          >
            Save Guardrails
          </button>
        </div>
      </div>

      {/* DATA MANAGEMENT */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Reset & Diagnostics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Restore the app to the canonical hackathon/student example dataset or clear custom edits.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onResetMeeting(INITIAL_MEETING)}
            className="px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:text-white dark:hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-500/30 rounded-xl transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Canonical Meeting Example</span>
          </button>
        </div>
      </div>
    </div>
  );
};
