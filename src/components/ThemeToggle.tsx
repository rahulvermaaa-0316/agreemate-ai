import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 cursor-pointer border ${
        isDark
          ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-slate-700/60 shadow-sm shadow-black/20'
          : 'bg-white hover:bg-slate-100 text-indigo-900 border-slate-200 shadow-sm shadow-slate-200/50'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-180 duration-200" />
        )}
      </div>

      {showLabel && (
        <span className="font-medium tracking-tight">
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </span>
      )}
    </button>
  );
};
