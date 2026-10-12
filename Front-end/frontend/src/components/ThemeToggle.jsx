import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store';

/**
 * Modern, accessible Theme Toggle Button
 * Supports:
 * - variant="icon": compact circular toggle button with smooth icon rotate & scale animation
 * - variant="pill": pill-shaped switch toggle with text labels (ideal for mobile menu drawer)
 */
export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
          isDark
            ? 'bg-darkCard border-darkBorder text-darkText hover:border-primary/50'
            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-primary/40'
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${
              isDark
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-amber-500/10 text-amber-500'
            }`}
          >
            {isDark ? (
              <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
            ) : (
              <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
            )}
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold leading-tight">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span className="block text-[10px] text-slate-400 dark:text-darkMuted">
              {isDark ? 'Tap for Light theme' : 'Tap for Dark theme'}
            </span>
          </div>
        </div>

        {/* Sliding Pill Indicator */}
        <div
          className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
            isDark ? 'bg-primary' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
              isDark ? 'translate-x-5.5' : 'translate-x-0.5'
            }`}
          >
            {isDark ? (
              <Moon className="w-3 h-3 text-primary" />
            ) : (
              <Sun className="w-3 h-3 text-amber-500" />
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative p-2.5 rounded-full transition-all duration-300 group overflow-hidden border ${
        isDark
          ? 'bg-darkCard/80 text-blue-300 border-darkBorder hover:border-primary/50 hover:bg-darkCard hover:text-white shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:bg-amber-50/60 hover:text-amber-600 shadow-sm'
      } active:scale-95 ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`w-5 h-5 transition-all duration-300 absolute ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
              : 'opacity-100 rotate-0 scale-100 text-amber-500'
          }`}
        />

        {/* Moon Icon */}
        <Moon
          className={`w-5 h-5 transition-all duration-300 absolute ${
            isDark
              ? 'opacity-100 rotate-0 scale-100 text-blue-300'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        />
      </div>

      <span className="sr-only">
        {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </span>
    </button>
  );
}
