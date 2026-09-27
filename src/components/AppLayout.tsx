import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  ArrowLeft, 
  Layers, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ActiveView, MeetingAnalysis } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface AppLayoutProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onReturnToLanding: () => void;
  currentMeeting: MeetingAnalysis;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeView,
  onNavigate,
  onReturnToLanding,
  currentMeeting,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: ActiveView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      view: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      view: 'analyze',
      label: 'Analyze Notes',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      view: 'insights',
      label: 'Meeting Insights',
      icon: <Sparkles className="w-4 h-4" />,
      badge: `${currentMeeting.decisions.length + currentMeeting.suggestions.length + currentMeeting.questions.length}`,
    },
    {
      view: 'actions',
      label: 'Action Items',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: `${currentMeeting.actions.length}`,
    },
    {
      view: 'settings',
      label: 'Settings',
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-800 dark:text-[#F3F4F6] flex flex-col md:flex-row antialiased transition-colors duration-200">
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#090D18] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base">AgreeMate AI</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle showLabel={false} className="py-1 px-2" />
          <button
            onClick={onReturnToLanding}
            className="p-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium"
          >
            Landing
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm pt-20 px-6 space-y-2">
          <div className="p-3 mb-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Theme Preference</span>
            <ThemeToggle />
          </div>

          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
                activeView === item.view
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-200 dark:bg-black/40 text-slate-700 dark:text-slate-300">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => {
              onReturnToLanding();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 mt-4 border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing Page</span>
          </button>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 p-5 bg-white dark:bg-[#090D18] border-r border-slate-200 dark:border-slate-800/80 shrink-0 sticky top-0 h-screen transition-colors">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight block leading-tight">
                  AgreeMate AI
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  Meeting Clarity
                </span>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                        isActive
                          ? 'bg-black/20 dark:bg-black/30 text-white dark:text-indigo-100'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Return to Landing & Info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
            <span className="font-semibold text-indigo-700 dark:text-indigo-300 block mb-0.5">Core Principle:</span>
            “Know what was agreed. Know what happens next.”
          </div>

          <button
            onClick={onReturnToLanding}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOPBAR */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-[#070A12]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
              Active Sync
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-md">
              {currentMeeting.title || 'Untitled Meeting'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE IN TOPBAR */}
            <ThemeToggle />

            <button
              onClick={() => onNavigate('analyze')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-500/30 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paste New Notes</span>
            </button>
          </div>
        </header>

        {/* VIEW CONTAINER */}
        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
