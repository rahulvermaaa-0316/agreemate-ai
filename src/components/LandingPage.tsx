import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  CheckSquare, 
  Sparkles, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { CANONICAL_EXAMPLE_NOTES } from '../sampleData';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onOpenApp: (samplePreset?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenApp }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-800 dark:text-[#F3F4F6] selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-200">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] overflow-hidden pointer-events-none -z-10 opacity-40">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-[10%] right-[20%] w-[450px] h-[450px] bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-[140px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#070A12]/80 border-b border-slate-200 dark:border-white/[0.06] transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block">
                AgreeMate AI
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                Meeting Clarity Engine
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('example')} 
              className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              Example
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE */}
            <ThemeToggle />

            <button
              onClick={() => onOpenApp()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all active:scale-[0.98] border border-indigo-400/20"
            >
              Open App
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-inner mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI-powered meeting clarity</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto text-balance">
            Never leave a meeting wondering,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-200">
              ‘What did we actually agree on?’
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AgreeMate AI turns messy meeting notes into confirmed decisions, open questions, and actionable tasks — without inventing missing details.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenApp()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Analyze Meeting Notes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('example')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              See Example
            </button>
          </div>

          {/* HERO VISUAL MOCKUP */}
          <div className="mt-16 md:mt-20 relative max-w-5xl mx-auto p-4 md:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-indigo-950/20 dark:shadow-indigo-950/40">
            <div className="flex flex-col lg:flex-row items-stretch gap-6 text-left">
              {/* Left: Messy Meeting Notes */}
              <div className="flex-1 bg-slate-50 dark:bg-[#090D18] rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-inner flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      Messy Meeting Notes
                    </span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400/90 font-mono bg-amber-100 dark:bg-amber-400/10 px-2 py-0.5 rounded font-semibold">
                      Unstructured
                    </span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-slate-800 dark:text-slate-300 space-y-2 leading-relaxed bg-white dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
                    <p className="text-slate-900 dark:text-slate-300">“We agreed to use React for the frontend.</p>
                    <p className="text-slate-500 dark:text-slate-400 italic">We could add dark mode later.</p>
                    <p className="text-indigo-700 dark:text-indigo-300">Priya will prepare the dataset by Friday.</p>
                    <p className="text-slate-900 dark:text-slate-300">Testing should be completed Monday.</p>
                    <p className="text-amber-700 dark:text-amber-300">Who will handle deployment?”</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>5 raw lines</span>
                  <span>Ambiguity: High</span>
                </div>
              </div>

              {/* Center: Animated Transformation Indicator */}
              <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 animate-pulse">
                  <ArrowRight className="w-5 h-5 hidden lg:block" />
                  <ArrowRight className="w-5 h-5 lg:hidden rotate-90" />
                </div>
              </div>

              {/* Right: Structured Output Cards */}
              <div className="flex-1 space-y-3">
                {/* Confirmed Decisions */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3 shadow-sm">
                  <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Confirmed Decisions
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      Use React for the frontend.
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 flex items-start gap-3 shadow-sm">
                  <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Suggestions
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      Add dark mode later.
                    </div>
                  </div>
                </div>

                {/* Open Questions */}
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/30 flex items-start gap-3 shadow-sm">
                  <div className="p-1 rounded-md bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                      Open Questions
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      Who will handle deployment?
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 shadow-sm">
                  <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        Action Items
                      </span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-100 dark:bg-amber-400/10 px-1.5 py-0.2 rounded">
                        Preserves uncertainty
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 flex flex-wrap gap-2">
                      <span className="text-slate-900 dark:text-slate-100 font-medium">Prepare dataset (Priya · Friday)</span>
                      <span className="text-amber-700 dark:text-amber-400 font-medium">Handle deployment (Needs details)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / VALUE STRIP */}
      <section className="py-8 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-white/[0.06] transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
              From rough notes <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span> to clear decisions <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span> to actionable next steps
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                100% Traceable Source Sentences
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Zero Hallucinated Owners/Dates
              </span>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Highlights Missing Details
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              How AgreeMate AI Works
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              Designed specifically for student project teams and club meetings where clarity is lost in speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all shadow-sm group">
              <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform inline-block">
                01 — Paste
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Paste meeting notes</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Dump whatever rough bullets, chat logs, or scratchpad notes your team took during your sync.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all shadow-sm group">
              <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform inline-block">
                02 — Analyze
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI identifies structure</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Gemini separates settled decisions from mere suggestions, extracts open questions, and parses tasks without guessing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all shadow-sm group">
              <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform inline-block">
                03 — Act
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review & edit action list</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Assign missing owners, adjust deadlines, verify source sentences, and export clean next steps for your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" className="py-20 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Pure Functional Focus
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Everything your team needs after a meeting.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              No bloated calendars, no noisy chatbots. Exactly two core capabilities that solve the post-meeting disconnect.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature Card 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Know What Was Agreed
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Separate confirmed decisions from tentative suggestions and unresolved questions. Suggestions never masquerade as final agreements.
                </p>

                {/* Categorized cards visual */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Decisions
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      ✓ Use React for the frontend.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                      <Lightbulb className="w-3.5 h-3.5" /> Suggestions
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      💡 Add dark mode later.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wide">
                      <HelpCircle className="w-3.5 h-3.5" /> Open Questions
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      ❓ Who will handle deployment?
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Turn Notes Into Action
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Convert agreed work into editable action items with owners, deadlines, missing details, and source sentences.
                </p>

                {/* Action Table visual */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        <th className="p-3">Task</th>
                        <th className="p-3">Owner</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 font-medium">
                      <tr>
                        <td className="p-3 text-slate-900 dark:text-slate-200 font-semibold">Build frontend</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Rahul</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Friday</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">Assigned</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-900 dark:text-slate-200 font-semibold">Prepare dataset</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Priya</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Monday</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">Assigned</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-900 dark:text-slate-200 font-semibold">Handle deployment</td>
                        <td className="p-3 text-slate-400 dark:text-slate-500">—</td>
                        <td className="p-3 text-slate-400 dark:text-slate-500">—</td>
                        <td className="p-3 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Needs clarification
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLE SECTION */}
      <section id="example" className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Side-by-Side Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              See the difference.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              Watch how rough conversational meeting lines turn into verifiable clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LEFT: Raw Meeting Notes */}
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#080B15] border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" /> Raw Meeting Notes
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Input</span>
              </div>
              <div className="font-mono text-sm text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-black/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 leading-relaxed whitespace-pre-line">
                {CANONICAL_EXAMPLE_NOTES}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notice how promises and ideas are tangled together.
                </p>
                <button
                  onClick={() => onOpenApp(CANONICAL_EXAMPLE_NOTES)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  Analyze this live <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* RIGHT: AgreeMate AI Output */}
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#090D1C] border border-indigo-200 dark:border-indigo-500/20 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> AgreeMate AI Output
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">Clarity Achieved</span>
              </div>

              {/* Confirmed Decisions */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Decisions
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">✓ Use React for the frontend.</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono italic">
                    Source: “We agreed to use React for the frontend.”
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Suggestions
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 rounded-xl">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">💡 Add dark mode later.</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono italic">
                    Source: “We could add dark mode later.”
                  </div>
                </div>
              </div>

              {/* Open Questions */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Open Questions
                </div>
                <div className="p-3 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/30 rounded-xl">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">❓ Who will handle deployment?</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono italic">
                    Source: “Who will handle deployment?”
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" /> Action Items
                </div>
                <div className="space-y-2.5">
                  {/* Item 1 */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Prepare dataset</span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Assigned</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex gap-4">
                      <span>Owner: <strong className="text-slate-900 dark:text-slate-200">Priya</strong></span>
                      <span>Deadline: <strong className="text-slate-900 dark:text-slate-200">Friday</strong></span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                      Source: “Priya will prepare the dataset by Friday.”
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Complete testing</span>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Needs clarification</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex gap-4">
                      <span>Owner: <strong className="text-amber-700 dark:text-amber-400">Owner missing</strong></span>
                      <span>Deadline: <strong className="text-slate-900 dark:text-slate-200">Monday</strong></span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                      Source: “Testing should be completed Monday.”
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Handle deployment</span>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Needs clarification</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex gap-4">
                      <span>Owner: <strong className="text-amber-700 dark:text-amber-400">Missing</strong></span>
                      <span>Deadline: <strong className="text-amber-700 dark:text-amber-400">Missing</strong></span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                      Source: “Who will handle deployment?”
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-indigo-100 via-purple-100 to-slate-100 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-slate-900/60 border border-indigo-200 dark:border-indigo-500/20 text-center relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Ready to bring clarity to your next team meeting?
              </h3>
              <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm md:text-base">
                “Know what was agreed. Know what happens next.”
              </p>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => onOpenApp()}
                  className="px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <span>Launch AgreeMate AI App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/[0.06] text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">AgreeMate AI</span>
            <span>—</span>
            <span className="italic">“Know what was agreed. Know what happens next.”</span>
          </div>
          <div>
            Built for Student Project Teams · Student Clubs · Small Groups
          </div>
        </div>
      </footer>
    </div>
  );
};
