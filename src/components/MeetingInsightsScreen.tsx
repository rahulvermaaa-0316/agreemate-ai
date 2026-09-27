import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  Edit3, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { MeetingAnalysis, DecisionItem, SuggestionItem, QuestionItem } from '../types';

interface MeetingInsightsScreenProps {
  meeting: MeetingAnalysis;
  onUpdateMeeting: (updated: MeetingAnalysis) => void;
  onViewSource: (item: { text: string; source: string; type: 'decision' | 'suggestion' | 'question' | 'action' }) => void;
  onGoToActions: () => void;
  onAddMoreNotes?: () => void;
}

export const MeetingInsightsScreen: React.FC<MeetingInsightsScreenProps> = ({
  meeting,
  onUpdateMeeting,
  onViewSource,
  onGoToActions,
  onAddMoreNotes,
}) => {
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Add new item state
  const [activeAddCategory, setActiveAddCategory] = useState<'decision' | 'suggestion' | 'question' | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemSource, setNewItemSource] = useState('');

  const startEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (category: 'decision' | 'suggestion' | 'question', id: string) => {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }

    if (category === 'decision') {
      const updated = meeting.decisions.map((d) => (d.id === id ? { ...d, text: editText.trim() } : d));
      onUpdateMeeting({ ...meeting, decisions: updated });
    } else if (category === 'suggestion') {
      const updated = meeting.suggestions.map((s) => (s.id === id ? { ...s, text: editText.trim() } : s));
      onUpdateMeeting({ ...meeting, suggestions: updated });
    } else {
      const updated = meeting.questions.map((q) => (q.id === id ? { ...q, text: editText.trim() } : q));
      onUpdateMeeting({ ...meeting, questions: updated });
    }

    setEditingId(null);
    setEditText('');
  };

  const deleteItem = (category: 'decision' | 'suggestion' | 'question', id: string) => {
    if (category === 'decision') {
      onUpdateMeeting({ ...meeting, decisions: meeting.decisions.filter((d) => d.id !== id) });
    } else if (category === 'suggestion') {
      onUpdateMeeting({ ...meeting, suggestions: meeting.suggestions.filter((s) => s.id !== id) });
    } else {
      onUpdateMeeting({ ...meeting, questions: meeting.questions.filter((q) => q.id !== id) });
    }
  };

  const handleAddNewItem = (category: 'decision' | 'suggestion' | 'question') => {
    if (!newItemText.trim()) return;

    const source = newItemSource.trim() || 'Added during manual meeting review';
    const newId = `${category.slice(0, 3)}-${Date.now()}`;

    if (category === 'decision') {
      onUpdateMeeting({
        ...meeting,
        decisions: [...meeting.decisions, { id: newId, text: newItemText.trim(), source }],
      });
    } else if (category === 'suggestion') {
      onUpdateMeeting({
        ...meeting,
        suggestions: [...meeting.suggestions, { id: newId, text: newItemText.trim(), source }],
      });
    } else {
      onUpdateMeeting({
        ...meeting,
        questions: [...meeting.questions, { id: newId, text: newItemText.trim(), source }],
      });
    }

    setActiveAddCategory(null);
    setNewItemText('');
    setNewItemSource('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Meeting Insights
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Here’s what we found in your notes.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
          {onAddMoreNotes && (
            <button
              onClick={onAddMoreNotes}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add More Notes</span>
            </button>
          )}

          <button
            onClick={onGoToActions}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>View Action Items ({meeting.actions.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DYNAMIC TOP SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3 shadow-sm transition-colors">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg md:text-xl font-bold font-mono text-slate-900 dark:text-white">
              {meeting.decisions.length}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              {meeting.decisions.length === 1 ? 'Confirmed Decision' : 'Confirmed Decisions'}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 flex items-center gap-3 shadow-sm transition-colors">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg md:text-xl font-bold font-mono text-slate-900 dark:text-white">
              {meeting.suggestions.length}
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
              {meeting.suggestions.length === 1 ? 'Suggestion' : 'Suggestions'}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/30 flex items-center gap-3 shadow-sm transition-colors">
          <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg md:text-xl font-bold font-mono text-slate-900 dark:text-white">
              {meeting.questions.length}
            </div>
            <div className="text-xs text-sky-700 dark:text-sky-400 font-semibold">
              {meeting.questions.length === 1 ? 'Open Question' : 'Open Questions'}
            </div>
          </div>
        </div>
      </div>

      {/* CLARITY PRINCIPLE CALLOUT */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-700 dark:text-slate-300 transition-colors">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Anti-hallucination guarantee:</strong> Suggestions and open questions are strictly isolated from confirmed decisions.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          {meeting.decisions.length} {meeting.decisions.length === 1 ? 'Decision' : 'Decisions'} · {meeting.suggestions.length} {meeting.suggestions.length === 1 ? 'Suggestion' : 'Suggestions'} · {meeting.questions.length} {meeting.questions.length === 1 ? 'Question' : 'Questions'}
        </span>
      </div>

      {/* THREE MAJOR SECTIONS */}
      <div className="space-y-8">
        {/* 1. CONFIRMED DECISIONS */}
        <div className="rounded-2xl bg-white dark:bg-[#090D1A] border border-emerald-200 dark:border-emerald-500/20 p-6 shadow-md dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-100 dark:border-emerald-500/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide uppercase">
                  1. Confirmed Decisions
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Agreed stances settled by the team
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveAddCategory('decision');
                setNewItemText('');
                setNewItemSource('');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg border border-emerald-200 dark:border-emerald-500/20 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Decision</span>
            </button>
          </div>

          {/* Add form */}
          {activeAddCategory === 'decision' && (
            <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-emerald-200 dark:border-emerald-500/30 space-y-3">
              <input
                type="text"
                placeholder="What was confirmed or agreed?"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-black/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Source sentence in raw notes (optional)"
                value={newItemSource}
                onChange={(e) => setNewItemSource(e.target.value)}
                className="w-full p-2 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveAddCategory(null)}
                  className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddNewItem('decision')}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                >
                  Save Decision
                </button>
              </div>
            </div>
          )}

          {meeting.decisions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl">
              No confirmed decisions detected in this meeting.
            </div>
          ) : (
            <div className="space-y-3">
              {meeting.decisions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 text-sm bg-white dark:bg-black/60 border border-emerald-500 text-slate-900 dark:text-white rounded-lg focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit('decision', item.id)}
                            className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-md flex items-center gap-1 font-medium"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                          <span>{item.text}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono text-[11px] truncate max-w-md text-slate-500 dark:text-slate-400">
                            Source: “{item.source}”
                          </span>
                          <button
                            onClick={() =>
                              onViewSource({
                                text: item.text,
                                source: item.source,
                                type: 'decision',
                              })
                            }
                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-0.5 shrink-0"
                          >
                            <span>View source</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {editingId !== item.id && (
                    <div className="flex items-center gap-1 self-end sm:self-start opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(item.id, item.text)}
                        title="Edit text"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteItem('decision', item.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. SUGGESTIONS */}
        <div className="rounded-2xl bg-white dark:bg-[#090D1A] border border-amber-200 dark:border-amber-500/20 p-6 shadow-md dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-amber-100 dark:border-amber-500/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide uppercase">
                  2. Suggestions
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Brainstormed or tentative ideas (NOT confirmed decisions)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveAddCategory('suggestion');
                setNewItemText('');
                setNewItemSource('');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg border border-amber-200 dark:border-amber-500/20 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Suggestion</span>
            </button>
          </div>

          {/* Add form */}
          {activeAddCategory === 'suggestion' && (
            <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-amber-200 dark:border-amber-500/30 space-y-3">
              <input
                type="text"
                placeholder="What was suggested or proposed?"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-black/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Source sentence in raw notes (optional)"
                value={newItemSource}
                onChange={(e) => setNewItemSource(e.target.value)}
                className="w-full p-2 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveAddCategory(null)}
                  className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddNewItem('suggestion')}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg"
                >
                  Save Suggestion
                </button>
              </div>
            </div>
          )}

          {meeting.suggestions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl">
              No tentative suggestions found.
            </div>
          ) : (
            <div className="space-y-3">
              {meeting.suggestions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 text-sm bg-white dark:bg-black/60 border border-amber-500 text-slate-900 dark:text-white rounded-lg focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit('suggestion', item.id)}
                            className="px-2.5 py-1 text-xs bg-amber-600 text-white rounded-md flex items-center gap-1 font-medium"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span className="text-amber-600 dark:text-amber-400 font-bold">💡</span>
                          <span>{item.text}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono text-[11px] truncate max-w-md text-slate-500 dark:text-slate-400">
                            Source: “{item.source}”
                          </span>
                          <button
                            onClick={() =>
                              onViewSource({
                                text: item.text,
                                source: item.source,
                                type: 'suggestion',
                              })
                            }
                            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-[11px] font-semibold flex items-center gap-0.5 shrink-0"
                          >
                            <span>View source</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {editingId !== item.id && (
                    <div className="flex items-center gap-1.5 self-end sm:self-start opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(item.id, item.text)}
                        title="Edit text"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteItem('suggestion', item.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. OPEN QUESTIONS */}
        <div className="rounded-2xl bg-white dark:bg-[#090D1A] border border-sky-200 dark:border-sky-500/20 p-6 shadow-md dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-sky-500/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide uppercase">
                  3. Open Questions
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Unresolved points, blockers, or ambiguities requiring answers
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveAddCategory('question');
                setNewItemText('');
                setNewItemSource('');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 rounded-lg border border-sky-200 dark:border-sky-500/20 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Add form */}
          {activeAddCategory === 'question' && (
            <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-sky-200 dark:border-sky-500/30 space-y-3">
              <input
                type="text"
                placeholder="What is the open question?"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-black/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                placeholder="Source sentence in raw notes (optional)"
                value={newItemSource}
                onChange={(e) => setNewItemSource(e.target.value)}
                className="w-full p-2 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-sky-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveAddCategory(null)}
                  className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddNewItem('question')}
                  className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg"
                >
                  Save Question
                </button>
              </div>
            </div>
          )}

          {meeting.questions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl">
              No open questions remaining.
            </div>
          ) : (
            <div className="space-y-3">
              {meeting.questions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-sky-400 dark:hover:border-sky-500/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 text-sm bg-white dark:bg-black/60 border border-sky-500 text-slate-900 dark:text-white rounded-lg focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit('question', item.id)}
                            className="px-2.5 py-1 text-xs bg-sky-600 text-white rounded-md flex items-center gap-1 font-medium"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span className="text-sky-600 dark:text-sky-400 font-bold">❓</span>
                          <span>{item.text}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono text-[11px] truncate max-w-md text-slate-500 dark:text-slate-400">
                            Source: “{item.source}”
                          </span>
                          <button
                            onClick={() =>
                              onViewSource({
                                text: item.text,
                                source: item.source,
                                type: 'question',
                              })
                            }
                            className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-[11px] font-semibold flex items-center gap-0.5 shrink-0"
                          >
                            <span>View source</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {editingId !== item.id && (
                    <div className="flex items-center gap-1 self-end sm:self-start opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(item.id, item.text)}
                        title="Edit text"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteItem('question', item.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Need to add more notes to this meeting?</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Append points without losing your current analysis or resetting your progress.</div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onAddMoreNotes && (
            <button
              onClick={onAddMoreNotes}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add More Notes</span>
            </button>
          )}
          <button
            onClick={onGoToActions}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>View Action Items ({meeting.actions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
