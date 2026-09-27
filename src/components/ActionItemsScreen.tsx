import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MeetingAnalysis, ActionItem } from '../types';

interface ActionItemsScreenProps {
  meeting: MeetingAnalysis;
  onUpdateMeeting: (updated: MeetingAnalysis) => void;
  onViewSource: (item: { text: string; source: string; type: 'decision' | 'suggestion' | 'question' | 'action' }) => void;
  onAddMoreNotes?: () => void;
}

export const ActionItemsScreen: React.FC<ActionItemsScreenProps> = ({
  meeting,
  onUpdateMeeting,
  onViewSource,
  onAddMoreNotes,
}) => {
  const [filter, setFilter] = useState<'all' | 'needs-clarification' | 'assigned'>('all');
  
  // Row editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editStatus, setEditStatus] = useState<'Assigned' | 'Needs clarification'>('Assigned');

  // Add new item modal/inline state
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newSource, setNewSource] = useState('');

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  const isMissingOwner = (owner: string | null | undefined) => {
    if (owner === null || owner === undefined) return true;
    const o = owner.toLowerCase().trim();
    return !o || o === 'owner missing' || o === 'missing' || o === 'null' || o === 'needs clarification';
  };

  const isMissingDeadline = (deadline: string | null | undefined) => {
    if (deadline === null || deadline === undefined) return true;
    const d = deadline.toLowerCase().trim();
    return !d || d === 'deadline missing' || d === 'missing' || d === 'null' || d === 'needs clarification';
  };

  const startEdit = (action: ActionItem) => {
    setEditingId(action.id);
    setEditTask(action.task);
    setEditOwner(isMissingOwner(action.owner) ? '' : (action.owner || ''));
    setEditDeadline(isMissingDeadline(action.deadline) ? '' : (action.deadline || ''));
    setEditStatus(action.status);
  };

  const saveEdit = (id: string) => {
    if (!editTask.trim()) {
      setEditingId(null);
      return;
    }

    const finalOwner = editOwner.trim() ? editOwner.trim() : null;
    const finalDeadline = editDeadline.trim() ? editDeadline.trim() : null;
    
    const missingDetails: string[] = [];
    if (!finalOwner) missingDetails.push('owner');
    if (!finalDeadline) missingDetails.push('deadline');

    const calculatedStatus: 'Assigned' | 'Needs clarification' = (!finalOwner || !finalDeadline)
      ? 'Needs clarification' 
      : editStatus;

    const updatedActions = meeting.actions.map((act) => {
      if (act.id === id) {
        return {
          ...act,
          task: editTask.trim(),
          owner: finalOwner,
          deadline: finalDeadline,
          status: calculatedStatus,
          missingDetails,
        };
      }
      return act;
    });

    onUpdateMeeting({ ...meeting, actions: updatedActions });
    setEditingId(null);
  };

  const removeAction = (id: string) => {
    const updated = meeting.actions.filter((a) => a.id !== id);
    onUpdateMeeting({ ...meeting, actions: updated });
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const finalOwner = newOwner.trim() ? newOwner.trim() : null;
    const finalDeadline = newDeadline.trim() ? newDeadline.trim() : null;
    const missingDetails: string[] = [];
    if (!finalOwner) missingDetails.push('owner');
    if (!finalDeadline) missingDetails.push('deadline');

    const newActionItem: ActionItem = {
      id: `act-${Date.now()}`,
      task: newTask.trim(),
      owner: finalOwner,
      deadline: finalDeadline,
      status: (!finalOwner || !finalDeadline) ? 'Needs clarification' : 'Assigned',
      source: newSource.trim() || 'Manually added during action review',
      missingDetails,
    };

    onUpdateMeeting({
      ...meeting,
      actions: [...meeting.actions, newActionItem],
    });

    setIsAdding(false);
    setNewTask('');
    setNewOwner('');
    setNewDeadline('');
    setNewSource('');
  };

  // Filter actions
  const filteredActions = meeting.actions.filter((act) => {
    const hasMissing = isMissingOwner(act.owner) || isMissingDeadline(act.deadline) || act.status === 'Needs clarification';
    if (filter === 'needs-clarification') return hasMissing;
    if (filter === 'assigned') return act.status === 'Assigned' && !isMissingOwner(act.owner);
    return true;
  });

  const missingCount = meeting.actions.filter(
    (a) => isMissingOwner(a.owner) || isMissingDeadline(a.deadline) || a.status === 'Needs clarification'
  ).length;

  const copyMarkdownSummary = () => {
    let md = `# ${meeting.title || 'Meeting Summary'} — Action Items\n\n`;
    md += `*Extracted with AgreeMate AI on ${new Date().toLocaleDateString()}*\n\n`;
    
    md += `## Confirmed Decisions\n`;
    meeting.decisions.forEach((d) => {
      md += `- ✓ ${d.text} *(Source: "${d.source}")*\n`;
    });
    md += `\n`;

    md += `## Action Items\n`;
    md += `| Task | Owner | Deadline | Status | Source |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    meeting.actions.forEach((a) => {
      md += `| ${a.task} | ${a.owner} | ${a.deadline} | ${a.status} | "${a.source}" |\n`;
    });
    md += `\n`;

    if (meeting.questions.length > 0) {
      md += `## Open Questions\n`;
      meeting.questions.forEach((q) => {
        md += `- ❓ ${q.text} *(Source: "${q.source}")*\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Action Items
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Review and complete the actions extracted from your meeting.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {onAddMoreNotes && (
            <button
              onClick={onAddMoreNotes}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-500/30 shadow-sm transition-colors flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add More Notes</span>
            </button>
          )}

          <button
            onClick={copyMarkdownSummary}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/70 shadow-sm transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-300">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary (Markdown)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Action</span>
          </button>
        </div>
      </div>

      {/* FILTER & STATS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl self-start transition-colors">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Actions ({meeting.actions.length})
          </button>
          <button
            onClick={() => setFilter('needs-clarification')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === 'needs-clarification'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-300" />
            <span>Needs Clarification ({missingCount})</span>
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'assigned'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Assigned ({meeting.actions.length - missingCount})
          </button>
        </div>

        {/* Uncertainty guarantee */}
        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>If owner or deadline is missing, AgreeMate never guesses — marked as "Needs clarification".</span>
        </div>
      </div>

      {/* ADD ACTION INLINE FORM */}
      {isAdding && (
        <form onSubmit={handleAddAction} className="p-6 rounded-2xl bg-white dark:bg-[#0B0F1E] border border-slate-200 dark:border-indigo-500/40 shadow-xl space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Add New Action Item
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-400 block mb-1">Task Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Prepare dataset"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-black/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-400 block mb-1">
                Owner <span className="text-[11px] text-slate-500">(Leave blank for "Owner missing")</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Priya"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-black/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-400 block mb-1">
                Deadline <span className="text-[11px] text-slate-500">(Leave blank for "Deadline missing")</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Friday"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-black/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-400 block mb-1">Source Sentence (Optional)</label>
              <input
                type="text"
                placeholder="Original context sentence"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-black/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono text-xs transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md"
            >
              Add Action
            </button>
          </div>
        </form>
      )}

      {/* EDITABLE TABLE */}
      <div className="rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 shadow-xl dark:shadow-2xl overflow-hidden transition-colors">
        {filteredActions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No action items found.</p>
            <p className="text-xs mt-1">Try switching filters or adding a new action item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
                  <th className="py-3.5 px-4">Task</th>
                  <th className="py-3.5 px-4 w-44">Owner</th>
                  <th className="py-3.5 px-4 w-40">Deadline</th>
                  <th className="py-3.5 px-4 w-40">Status</th>
                  <th className="py-3.5 px-4">Source Sentence</th>
                  <th className="py-3.5 px-4 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 transition-colors">
                {filteredActions.map((action) => {
                  const isEditing = editingId === action.id;
                  const ownerMissing = isMissingOwner(action.owner);
                  const deadlineMissing = isMissingDeadline(action.deadline);

                  if (isEditing) {
                    return (
                      <tr key={action.id} className="bg-indigo-50/60 dark:bg-indigo-950/20">
                        {/* Edit Task */}
                        <td className="p-3">
                          <input
                            type="text"
                            value={editTask}
                            onChange={(e) => setEditTask(e.target.value)}
                            className="w-full p-2 text-xs bg-white dark:bg-black/60 border border-indigo-500 text-slate-900 dark:text-white rounded-md focus:outline-none"
                            placeholder="Task description"
                          />
                        </td>

                        {/* Edit Owner */}
                        <td className="p-3">
                          <input
                            type="text"
                            value={editOwner}
                            onChange={(e) => setEditOwner(e.target.value)}
                            className="w-full p-2 text-xs bg-white dark:bg-black/60 border border-indigo-500 text-slate-900 dark:text-white rounded-md focus:outline-none"
                            placeholder="Owner (leave blank for 'Owner missing')"
                          />
                        </td>

                        {/* Edit Deadline */}
                        <td className="p-3">
                          <input
                            type="text"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="w-full p-2 text-xs bg-white dark:bg-black/60 border border-indigo-500 text-slate-900 dark:text-white rounded-md focus:outline-none"
                            placeholder="Deadline (leave blank for 'Deadline missing')"
                          />
                        </td>

                        {/* Edit Status */}
                        <td className="p-3">
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full p-2 text-xs bg-white dark:bg-black/60 border border-indigo-500 text-slate-900 dark:text-white rounded-md focus:outline-none"
                          >
                            <option value="Assigned">Assigned</option>
                            <option value="Needs clarification">Needs clarification</option>
                          </select>
                        </td>

                        {/* Source (read-only in row edit) */}
                        <td className="p-3 text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-xs">
                          "{action.source}"
                        </td>

                        {/* Save / Cancel buttons */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => saveEdit(action.id)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr 
                      key={action.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group"
                    >
                      {/* Task */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {action.task}
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4">
                        {ownerMissing ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-transparent px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                            <span>Owner missing</span>
                          </span>
                        ) : (
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            {action.owner}
                          </span>
                        )}
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4">
                        {deadlineMissing ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-transparent px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                            <span>Deadline missing</span>
                          </span>
                        ) : (
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            {action.deadline}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {action.status === 'Assigned' && !ownerMissing ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-transparent px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Assigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-transparent px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            Needs clarification
                          </span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                            “{action.source}”
                          </span>
                          <button
                            onClick={() =>
                              onViewSource({
                                text: action.task,
                                source: action.source,
                                type: 'action',
                              })
                            }
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-medium flex items-center gap-0.5 shrink-0"
                            title="Verify original sentence in notes"
                          >
                            <span>View source</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(action)}
                            title="Edit action"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeAction(action.id)}
                            title="Remove action"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK WORKFLOW TIPS FOR STUDENT TEAMS */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div>
          💡 <strong>Tip for student teams:</strong> Click "Copy Summary" to copy decisions and actions with source citations.
        </div>
        <div className="font-mono text-slate-500 dark:text-slate-400">
          Edits persist automatically in your active session.
        </div>
      </div>
    </div>
  );
};
