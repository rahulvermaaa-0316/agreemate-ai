import React from 'react';
import { 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  CheckSquare, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';
import { MeetingAnalysis } from '../types';

interface DashboardOverviewProps {
  currentMeeting: MeetingAnalysis;
  onNavigate: (view: 'analyze' | 'insights' | 'actions') => void;
  onSelectMeetingPreset: (name: 'canonical' | 'club' | 'capstone') => void;
  onAddMoreNotes?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentMeeting,
  onNavigate,
  onSelectMeetingPreset,
  onAddMoreNotes,
}) => {
  const decisionsCount = currentMeeting.decisions.length;
  const suggestionsCount = currentMeeting.suggestions.length;
  const questionsCount = currentMeeting.questions.length;
  const actionsCount = currentMeeting.actions.length;

  const missingDetailsCount = currentMeeting.actions.filter(
    (a) => a.owner === 'Owner missing' || a.owner === 'Missing' || a.deadline === 'Deadline missing' || a.deadline === 'Missing' || a.status === 'Needs clarification'
  ).length;

  const assignedCount = actionsCount - missingDetailsCount;

  // Clarity score: ratio of clear decisions and assigned actions over total elements
  const totalElements = decisionsCount + suggestionsCount + questionsCount + actionsCount;
  const resolvedElements = decisionsCount + assignedCount;
  const clarityScore = totalElements > 0 ? Math.round((resolvedElements / totalElements) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Meeting Clarity Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {currentMeeting.title || 'Project Meeting Overview'}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
            {currentMeeting.summary || 'Summary of agreed decisions and actions.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onAddMoreNotes && currentMeeting.rawNotes && (
            <button
              onClick={onAddMoreNotes}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add More Notes</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('analyze')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze New Notes</span>
          </button>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate('insights')}
          className="p-5 rounded-2xl bg-white dark:bg-[#090D18] border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Decisions
            </span>
            <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {decisionsCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Confirmed agreements</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('insights')}
          className="p-5 rounded-2xl bg-white dark:bg-[#090D18] border border-amber-200 dark:border-amber-500/20 hover:border-amber-400 dark:hover:border-amber-500/40 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Suggestions
            </span>
            <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {suggestionsCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Tentative proposals</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigate('insights')}
          className="p-5 rounded-2xl bg-white dark:bg-[#090D18] border border-sky-200 dark:border-sky-500/20 hover:border-sky-400 dark:hover:border-sky-500/40 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Open Questions
            </span>
            <div className="p-1 rounded-md bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {questionsCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Needs clarification</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigate('actions')}
          className="p-5 rounded-2xl bg-white dark:bg-[#090D18] border border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Action Items
            </span>
            <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {actionsCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className={missingDetailsCount > 0 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-emerald-600 dark:text-emerald-400'}>
              {missingDetailsCount} need clarification
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* CLARITY RADAR & HIGHLIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Meeting Clarity Status */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Current Meeting Clarity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluates how well decisions were finalized and tasks assigned.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{clarityScore}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Clarity Score</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(clarityScore, 10)}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Key Decision
              </span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mt-1">
                {currentMeeting.decisions[0]?.text || 'No decisions recorded yet.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Primary Question
              </span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mt-1">
                {currentMeeting.questions[0]?.text || 'No open questions pending.'}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Source traceability is active for all extracted items.
            </span>
            <button
              onClick={() => onNavigate('insights')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Inspect Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Quick Sample Presets */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Pre-loaded Synced Meetings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Test AgreeMate AI with real student and team meeting scenarios.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onSelectMeetingPreset('canonical')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/90 text-left transition-all"
              >
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Frontend & Deployment</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  React decision, dataset assignment, missing deployment owner.
                </div>
              </button>

              <button
                onClick={() => onSelectMeetingPreset('club')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/90 text-left transition-all"
              >
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">DevClub Hackathon Sync</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Cap at 120 students, lecture hall booking, catering timeline.
                </div>
              </button>

              <button
                onClick={() => onSelectMeetingPreset('capstone')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/90 text-left transition-all"
              >
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Capstone Architecture Review</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  PostgreSQL choice, user interviews, draft slides deadline.
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 text-center">
            <button
              onClick={() => onNavigate('actions')}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-transparent"
            >
              Open Full Action List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
