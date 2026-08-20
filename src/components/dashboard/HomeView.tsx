import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  CheckCheck,
  ListChecks,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatTime,
  getTodayDateString,
  calculateStreak,
} from '../../utils/formatters';
import { CategoryIcon, getCategoryColorClasses } from '../common/CategoryIcon';
import { PriorityBadge } from '../common/PriorityBadge';

export const HomeView: React.FC = () => {
  const {
    tasks,
    toggleTask,
    addTask,
    expenses,
    checklists,
    toggleChecklistItem,
    preferences,
    openQuickAdd,
    setActiveTab,
  } = useApp();

  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  const today = getTodayDateString();

  // Tasks for today
  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const pendingTasks = todayTasks.filter((t) => !t.completed);
  const completedTasks = todayTasks.filter((t) => t.completed);
  const totalTasks = todayTasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Expenses for today & month
  const todayExpenses = expenses.filter((e) => e.date === today);
  const todaySpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const currentMonthPrefix = today.substring(0, 7);
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonthPrefix));
  const monthlySpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetRemaining = Math.max(0, preferences.monthlyBudget - monthlySpent);
  const budgetPercentUsed = preferences.monthlyBudget > 0 ? Math.round((monthlySpent / preferences.monthlyBudget) * 100) : 0;

  const handleQuickInlineTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask({
      title: quickTaskTitle.trim(),
      dueDate: today,
      priority: 'medium',
      completed: false,
      recurrence: 'none',
    });
    setQuickTaskTitle('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* 1. Daily Overview Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Pending Tasks */}
        <div
          id="stat-card-pending-tasks"
          onClick={() => setActiveTab('tasks')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-emerald-500/40 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Tasks Left
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              {pendingTasks.length}
            </span>
            <span className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium">
              of {totalTasks} today
            </span>
          </div>
          <div className="mt-2 w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Card 2: Completed Tasks */}
        <div
          id="stat-card-completed-tasks"
          onClick={() => setActiveTab('tasks')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-teal-500/40 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Done
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              {completedTasks.length}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-teal-600 dark:text-teal-400">
              {taskCompletionRate}%
            </span>
          </div>
          <div className="mt-2 w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Today's Spending */}
        <div
          id="stat-card-today-spending"
          onClick={() => setActiveTab('expenses')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-blue-500/40 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Today Spent
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 truncate">
              {formatCurrency(todaySpent, preferences.currencySymbol, preferences.currency)}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-stone-600 dark:text-stone-300 font-medium truncate">
            {todayExpenses.length} transaction{todayExpenses.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Card 4: Monthly Spending */}
        <div
          id="stat-card-monthly-spending"
          onClick={() => setActiveTab('insights')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-amber-500/40 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              This Month
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 truncate">
              {formatCurrency(monthlySpent, preferences.currencySymbol, preferences.currency)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className={budgetPercentUsed > 85 ? 'text-rose-500 font-semibold' : 'text-stone-600 dark:text-stone-300 font-medium'}>
              {budgetPercentUsed}% used
            </span>
            <span className="text-stone-600 dark:text-stone-300 font-medium truncate ml-1">
              {formatCurrency(budgetRemaining, preferences.currencySymbol, preferences.currency)} left
            </span>
          </div>
        </div>
      </section>

      {/* 2. Today's Tasks & Checklists Section */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Today's Action Plan
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                {completedTasks.length}/{totalTasks}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
              Tap any task to mark complete.
            </p>
          </div>

          <button
            id="today-add-task-btn"
            onClick={() => openQuickAdd('task')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all active:scale-95 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Quick inline 1-tap task input */}
        <form onSubmit={handleQuickInlineTask} className="relative">
          <input
            id="home-inline-task-input"
            type="text"
            placeholder="Quick task (e.g., Drink water, Call mom)..."
            value={quickTaskTitle}
            onChange={(e) => setQuickTaskTitle(e.target.value)}
            className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="submit"
            disabled={!quickTaskTitle.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-emerald-600 disabled:opacity-40 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all"
          >
            Save
          </button>
        </form>

        {/* Active Pending Tasks List */}
        {pendingTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-2xl bg-stone-50/50 dark:bg-stone-950/30 border border-dashed border-stone-200 dark:border-stone-800">
            <Sparkles className="w-7 h-7 text-emerald-500 mx-auto mb-1.5 opacity-80" />
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Your day is clear ✨
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
              Add your first task or start a daily routine.
            </p>
            <button
              onClick={() => openQuickAdd('task')}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
            >
              + Add First Task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className="group flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200/70 dark:border-stone-800/80 hover:border-emerald-500/40 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="shrink-0 w-7 h-7 rounded-lg border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500 flex items-center justify-center text-transparent hover:text-emerald-500 active:scale-90 transition-all min-h-[32px] min-w-[32px]"
                    aria-label={`Mark ${task.title} as completed`}
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>

                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <span className="text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 block truncate">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                      {task.dueTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {formatTime(task.dueTime)}
                        </span>
                      )}
                      {task.category && (
                        <span className="px-1.5 py-0.2 rounded bg-stone-200/60 dark:bg-stone-800 text-[10px] text-stone-600 dark:text-stone-400">
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 ml-2">
                  <PriorityBadge priority={task.priority} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tasks Accordion */}
        {completedTasks.length > 0 && (
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <button
              id="toggle-completed-tasks-btn"
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center justify-between w-full py-1 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <span>Completed ({completedTasks.length})</span>
              {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCompleted && (
              <div className="mt-2 space-y-1.5">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    id={`task-completed-${task.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100/50 dark:bg-stone-950/20 text-stone-600 dark:text-stone-300 text-xs transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="shrink-0 w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center active:scale-90 transition-transform"
                        aria-label="Unmark completed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="line-through truncate text-stone-600 dark:text-stone-300 font-medium">
                        {task.title}
                      </span>
                    </div>
                    {task.completedAt && (
                      <span className="shrink-0 text-[10px] text-stone-600 dark:text-stone-300 font-medium">
                        {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Reusable Routines Quick Strip */}
      {checklists.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                Daily Routines
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('checklists')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {checklists.slice(0, 3).map((list) => {
              const doneCount = list.items.filter((i) => i.completed).length;
              const total = list.items.length;
              const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

              return (
                <div
                  key={list.id}
                  id={`home-checklist-card-${list.id}`}
                  onClick={() => setActiveTab('checklists')}
                  className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-emerald-500/40 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                      {list.name}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {percent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium line-clamp-1 mb-2">
                    {doneCount} of {total} completed
                  </p>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Today's Spending Summary List */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Today's Spending
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
              Total today: <span className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(todaySpent, preferences.currencySymbol, preferences.currency)}</span>
            </p>
          </div>

          <button
            id="today-add-expense-btn"
            onClick={() => openQuickAdd('expense')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition-all min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>

        {todayExpenses.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-2xl bg-stone-50/50 dark:bg-stone-950/30 border border-dashed border-stone-200 dark:border-stone-800">
            <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
              No expenses recorded today
            </p>
            <button
              onClick={() => openQuickAdd('expense')}
              className="mt-2.5 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold shadow-xs hover:opacity-90 active:scale-95 transition-all"
            >
              + Record Expense
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayExpenses.map((exp) => {
              const colorClasses = getCategoryColorClasses(exp.category);
              return (
                <div
                  key={exp.id}
                  id={`home-expense-${exp.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200/70 dark:border-stone-800/80"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${colorClasses.lightBg} ${colorClasses.text} flex items-center justify-center shrink-0`}
                    >
                      <CategoryIcon name={exp.category} size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 block truncate capitalize">
                        {exp.description || exp.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                        <span className="capitalize">{exp.category}</span>
                        <span>•</span>
                        <span className="uppercase text-[9px] font-bold text-stone-600 dark:text-stone-300 px-1 py-0.2 bg-stone-200/70 dark:bg-stone-800 rounded">
                          {exp.paymentMethod}
                        </span>
                        {exp.time && <span>• {formatTime(exp.time)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      {formatCurrency(exp.amount, preferences.currencySymbol, preferences.currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-1 text-center">
          <button
            onClick={() => setActiveTab('expenses')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Financial History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. Motivation & Consistency Card */}
      {(() => {
        const streak = calculateStreak(tasks);
        const hasTasks = tasks.length > 0;
        const totalCompleted = tasks.filter((t) => t.completed).length;

        return (
          <section className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Flame className={`w-5 h-5 ${streak > 0 ? 'fill-amber-500 text-amber-500 animate-pulse' : 'text-amber-500'}`} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {streak > 0 ? `${streak}-Day Streak Active 🔥` : 'Consistency Streak'}
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium truncate">
                  {hasTasks ? `${totalCompleted} of ${tasks.length} total tasks completed.` : 'Log your daily actions to build momentum.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('insights')}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs font-semibold shadow-xs border border-stone-200/80 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
            >
              Insights
            </button>
          </section>
        );
      })()}
    </div>
  );
};
