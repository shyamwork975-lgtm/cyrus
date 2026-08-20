import React from 'react';
import {
  Home,
  CheckSquare,
  ListChecks,
  Receipt,
  BarChart3,
  Calendar,
  Plus,
  Moon,
  Sun,
  Laptop,
  Sparkles,
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { formatCurrency, getTodayDateString } from '../../utils/formatters';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openQuickAdd,
    tasks,
    expenses,
    preferences,
    updatePreferences,
    showToast,
  } = useApp();

  const today = getTodayDateString();
  const pendingTasksCount = tasks.filter((t) => t.dueDate === today && !t.completed).length;

  // Monthly spending
  const currentMonthPrefix = today.substring(0, 7);
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonthPrefix));
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetRatio = preferences.monthlyBudget > 0 ? (monthlyTotal / preferences.monthlyBudget) * 100 : 0;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Home Dashboard', icon: <Home className="w-5 h-5" /> },
    {
      id: 'tasks',
      label: 'Tasks & Reminders',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    { id: 'checklists', label: 'Reusable Checklists', icon: <ListChecks className="w-5 h-5" /> },
    { id: 'expenses', label: 'Expense Tracker', icon: <Receipt className="w-5 h-5" /> },
    { id: 'insights', label: 'Insights & Budget', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar History', icon: <Calendar className="w-5 h-5" /> },
  ];

  const handleCycleTheme = () => {
    const nextTheme = preferences.theme === 'light' ? 'dark' : preferences.theme === 'dark' ? 'system' : 'light';
    updatePreferences({ theme: nextTheme });
    showToast(`Switched theme to ${nextTheme}`, 'info');
  };

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 border-r border-stone-200/80 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-950/60 backdrop-blur-md p-4 lg:p-6 justify-between transition-colors overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-500/20">
            C
          </div>
          <div>
            <h1 className="font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
              Cyrus
            </h1>
            <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
              Remember • Do • Track
            </p>
          </div>
        </div>

        {/* Quick Add Button */}
        <div className="space-y-2">
          <button
            id="sidebar-quick-add-btn"
            onClick={() => openQuickAdd('smart')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm shadow-sm shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Quick Add</span>
          </button>
          
          <button
            id="sidebar-smart-magic-btn"
            onClick={() => openQuickAdd('smart')}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Natural Input</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets & Controls */}
      <div className="space-y-4 pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
        {/* Monthly budget widget */}
        <div className="p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200/60 dark:border-stone-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 dark:text-stone-400 font-medium">Monthly Budget</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {Math.round(budgetRatio)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                budgetRatio > 90
                  ? 'bg-rose-500'
                  : budgetRatio > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, budgetRatio))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <span>{formatCurrency(monthlyTotal, preferences.currencySymbol, preferences.currency)}</span>
            <span>of {formatCurrency(preferences.monthlyBudget, preferences.currencySymbol, preferences.currency)}</span>
          </div>
        </div>

        {/* Theme button */}
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-stone-500 dark:text-stone-400 capitalize">
            Theme: {preferences.theme}
          </span>
          <button
            onClick={handleCycleTheme}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title="Toggle theme mode"
          >
            {preferences.theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {preferences.theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {preferences.theme === 'system' && <Laptop className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
