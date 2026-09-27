import React from 'react';
import { X, Quote, CheckCircle2, AlertCircle } from 'lucide-react';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sourceSentence: string;
  itemType: 'decision' | 'suggestion' | 'question' | 'action';
  itemText: string;
  rawNotes?: string;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  isOpen,
  onClose,
  title,
  sourceSentence,
  itemType,
  itemText,
  rawNotes,
}) => {
  if (!isOpen) return null;

  const getTypeLabel = () => {
    switch (itemType) {
      case 'decision':
        return { label: 'Confirmed Decision', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' };
      case 'suggestion':
        return { label: 'Suggestion', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' };
      case 'question':
        return { label: 'Open Question', color: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20' };
      case 'action':
        return { label: 'Action Item', color: 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' };
    }
  };

  const typeConfig = getTypeLabel();

  // Find line highlighting in raw notes if available
  const notesLines = rawNotes ? rawNotes.split(/\r?\n/) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden text-left transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Source Traceability</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Extracted Item</label>
            <div className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              {itemText}
            </div>
          </div>

          <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 rounded-xl relative transition-colors">
            <Quote className="w-5 h-5 text-indigo-400/40 absolute top-3 right-3" />
            <label className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 block mb-1">
              Original Source Sentence
            </label>
            <p className="text-sm font-mono text-indigo-950 dark:text-indigo-100 italic bg-white dark:bg-black/30 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-500/10 shadow-inner">
              "{sourceSentence}"
            </p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Verifiable from raw meeting notes. No details hallucinated.
            </p>
          </div>

          {rawNotes && (
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Context in Raw Notes
              </label>
              <div className="max-h-40 overflow-y-auto font-mono text-xs p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1 text-slate-600 dark:text-slate-400 transition-colors">
                {notesLines.map((line, idx) => {
                  const isMatch = line.trim() && (sourceSentence.includes(line.trim()) || line.includes(sourceSentence.trim()));
                  return (
                    <div 
                      key={idx}
                      className={`px-2 py-1 rounded transition-colors ${
                        isMatch 
                          ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 border-l-2 border-indigo-600 dark:border-indigo-500 font-semibold' 
                          : 'hover:text-slate-900 dark:hover:text-slate-300'
                      }`}
                    >
                      {line || ' '}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-transparent"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
