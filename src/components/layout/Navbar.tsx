import React from 'react';
import { Search, Bell, Settings, Flame, Sparkles, Sun, Moon, Laptop } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getGreeting, formatDateLabel, getTodayDateString, calculateStreak } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    showToast,
    setSearchOpen,
    setSettingsOpen,
    setNotificationsOpen,
    activeNotifications,
    openQuickAdd,
    tasks,
  } = useApp();

  const today = getTodayDateString();
  const streak = calculateStreak(tasks);
  const isStreakActive = streak > 0;

  const handleCycleTheme = () => {
    const nextTheme = preferences.theme === 'light' ? 'dark' : preferences.theme === 'dark' ? 'system' : 'light';
    updatePreferences({ theme: nextTheme });
    showToast(`Switched theme to ${nextTheme}`, 'info');
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-stone-950/85 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand / Greeting */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold text-base sm:text-lg shrink-0">
            C
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 tracking-tight text-base sm:text-lg">
                Cyrus
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                Daily Companion
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
              {getGreeting()}{preferences.name ? `, ${preferences.name}` : ''} • {todayFormatted}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Daily Streak Indicator */}
          <div
            id="navbar-streak-badge"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60"
            title="Daily Activity Streak"
          >
            <Flame className={`w-3.5 h-3.5 ${isStreakActive ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">{isStreakActive ? `${streak}d streak` : 'Start streak'}</span>
            <span className="sm:hidden font-bold">{streak}</span>
          </div>

          {/* Quick AI/Magic Add button (Desktop only) */}
          <button
            id="navbar-magic-add-btn"
            onClick={() => openQuickAdd('smart')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Magic Add</span>
          </button>

          {/* Search Button */}
          <button
            id="navbar-search-btn"
            onClick={() => setSearchOpen(true)}
            className="min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
            aria-label="Search"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Notifications Button */}
          <button
            id="navbar-notifications-btn"
            onClick={() => setNotificationsOpen(true)}
            className="relative min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {activeNotifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-950" />
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            id="navbar-theme-btn"
            onClick={handleCycleTheme}
            className="min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
            aria-label={`Toggle theme (current: ${preferences.theme})`}
            title={`Current theme: ${preferences.theme}. Click to change.`}
          >
            {preferences.theme === 'light' && <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
            {preferences.theme === 'dark' && <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />}
            {preferences.theme === 'system' && <Laptop className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 dark:text-stone-400" />}
          </button>

          {/* Settings Button */}
          <button
            id="navbar-settings-btn"
            onClick={() => setSettingsOpen(true)}
            className="min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
