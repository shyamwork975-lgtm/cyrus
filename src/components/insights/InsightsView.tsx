import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  getTodayDateString,
} from '../../utils/formatters';
import { CategoryIcon, getCategoryColorClasses } from '../common/CategoryIcon';

export const InsightsView: React.FC = () => {
  const { expenses, tasks, preferences, updatePreferences, setSettingsOpen } = useApp();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const today = getTodayDateString();

  // Filter expenses for selected month
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));
  const totalMonthlySpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  monthlyExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      percentage: totalMonthlySpent > 0 ? Math.round((amount / totalMonthlySpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Daily spending array for bar chart
  const daysInMonth: Record<number, number> = {};
  monthlyExpenses.forEach((e) => {
    const day = parseInt(e.date.split('-')[2], 10);
    daysInMonth[day] = (daysInMonth[day] || 0) + e.amount;
  });

  const maxDaySpend = Math.max(1, ...Object.values(daysInMonth));

  // Find peak spending day
  let peakDay = 0;
  let peakDayAmount = 0;
  Object.entries(daysInMonth).forEach(([day, amount]) => {
    if (amount > peakDayAmount) {
      peakDayAmount = amount;
      peakDay = parseInt(day, 10);
    }
  });

  // Calculate Average Daily Spend
  const daysWithSpendCount = Object.keys(daysInMonth).length || 1;
  const avgDailySpend = Math.round(totalMonthlySpent / Math.max(1, new Date().getDate()));

  // Budget calculations
  const budget = preferences.monthlyBudget || 25000;
  const remainingBudget = budget - totalMonthlySpent;
  const budgetUsedPct = Math.round((totalMonthlySpent / budget) * 100);

  // Productivity stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overallTaskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Month label
  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Financial & Life Insights
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
            Spending patterns, budget limits, and habits.
          </p>
        </div>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shrink-0 min-h-[36px]"
        />
      </div>

      {/* 1. Monthly Financial Hero Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Spent */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Total Spent ({monthLabel})
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {formatCurrency(totalMonthlySpent, preferences.currencySymbol, preferences.currency)}
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
            Across {monthlyExpenses.length} transactions
          </p>
        </div>

        {/* Budget Status */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Monthly Budget
            </span>
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Edit Budget
            </button>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {formatCurrency(budget, preferences.currencySymbol, preferences.currency)}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className={budgetUsedPct > 80 ? 'text-amber-500 font-semibold' : 'text-stone-600 dark:text-stone-300 font-medium'}>
              {budgetUsedPct}% used
            </span>
            <span className={remainingBudget < 0 ? 'text-rose-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
              {remainingBudget >= 0
                ? `${formatCurrency(remainingBudget, preferences.currencySymbol, preferences.currency)} left`
                : `${formatCurrency(Math.abs(remainingBudget), preferences.currencySymbol, preferences.currency)} over`}
            </span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                budgetUsedPct > 90
                  ? 'bg-rose-500'
                  : budgetUsedPct > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, budgetUsedPct))}%` }}
            />
          </div>
        </div>

        {/* Daily Spending Avg */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Avg Daily Spend
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {formatCurrency(avgDailySpend, preferences.currencySymbol, preferences.currency)}
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
            Projected: {formatCurrency(avgDailySpend * 30, preferences.currencySymbol, preferences.currency)}
          </p>
        </div>
      </div>

      {/* 2. Smart Actionable Insights */}
      <section className="p-5 rounded-3xl bg-stone-900 text-white dark:bg-stone-900/90 border border-stone-800 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-tight">
            Key Financial & Habit Takeaways
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {sortedCategories[0] && (
            <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CategoryIcon name={sortedCategories[0].category} size={15} />
              </div>
              <div>
                <span className="font-semibold block text-stone-200 capitalize">
                  Highest Category: {sortedCategories[0].category}
                </span>
                <p className="text-stone-400 mt-0.5">
                  Accounts for {sortedCategories[0].percentage}% of your expenses ({formatCurrency(sortedCategories[0].amount, preferences.currencySymbol, preferences.currency)}).
                </p>
              </div>
            </div>
          )}

          {peakDay > 0 && (
            <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold block text-stone-200">
                  Peak Spending Day: {monthDate.toLocaleDateString('en-US', { month: 'short' })} {peakDay}
                </span>
                <p className="text-stone-400 mt-0.5">
                  You spent {formatCurrency(peakDayAmount, preferences.currencySymbol, preferences.currency)} on this single day.
                </p>
              </div>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold block text-stone-200">
                Task Completion Rate: {overallTaskRate}%
              </span>
              <p className="text-stone-400 mt-0.5">
                {completedTasks} completed out of {totalTasks} tracked items.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-400" />
            </div>
            <div>
              <span className="font-semibold block text-stone-200">
                Weekly Habit Consistency
              </span>
              <p className="text-stone-400 mt-0.5">
                {tasks.length > 0 || sortedCategories.length > 0
                  ? 'Consistency tracked across daily checklists, scheduled tasks, and budget logging.'
                  : 'Start tracking daily habits and checklists to unlock personalized trends.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Breakdown Distribution (Donut / Bar) */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
          Spending by Category ({monthLabel})
        </h2>

        {sortedCategories.length === 0 ? (
          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium py-4 text-center">
            No expenses recorded for {monthLabel}.
          </p>
        ) : (
          <div className="space-y-3">
            {sortedCategories.map((item) => {
              const colorClasses = getCategoryColorClasses(item.category);
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg ${colorClasses.lightBg} ${colorClasses.text} flex items-center justify-center`}
                      >
                        <CategoryIcon name={item.category} size={14} />
                      </div>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 capitalize">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {formatCurrency(item.amount, preferences.currencySymbol, preferences.currency)}
                      </span>
                      <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium w-8 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${colorClasses.bg} h-full rounded-full transition-all`}
                      style={{ width: `${Math.max(4, item.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Daily Spending Bar Timeline Chart */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Daily Spending Rhythm
          </h2>
          <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
            Days 1–31
          </span>
        </div>

        <div className="h-36 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-1 border-b border-stone-200 dark:border-stone-800">
          {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
            const spend = daysInMonth[dayNum] || 0;
            const heightPercent = spend > 0 ? Math.max(12, Math.round((spend / maxDaySpend) * 100)) : 4;
            const isToday = today === `${selectedMonth}-${String(dayNum).padStart(2, '0')}`;

            return (
              <div
                key={dayNum}
                className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                {spend > 0 && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] py-1 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                    Day {dayNum}: {formatCurrency(spend, preferences.currencySymbol, preferences.currency)}
                  </div>
                )}

                <div
                  className={`w-full rounded-t-md transition-all ${
                    isToday
                      ? 'bg-emerald-500'
                      : spend > 0
                      ? 'bg-stone-800 dark:bg-stone-200 group-hover:bg-emerald-600'
                      : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span
                  className={`text-[9px] ${
                    isToday
                      ? 'font-bold text-emerald-600 dark:text-emerald-400'
                      : 'text-stone-600 dark:text-stone-300'
                  } ${dayNum % 5 === 0 || dayNum === 1 ? 'block' : 'hidden sm:block'}`}
                >
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
