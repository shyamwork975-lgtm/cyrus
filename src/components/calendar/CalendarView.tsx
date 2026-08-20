import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Receipt,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDateLabel,
  formatTime,
  getTodayDateString,
} from '../../utils/formatters';
import { CategoryIcon, getCategoryColorClasses } from '../common/CategoryIcon';
import { PriorityBadge } from '../common/PriorityBadge';

export const CalendarView: React.FC = () => {
  const {
    tasks,
    expenses,
    toggleTask,
    preferences,
    selectedHistoryDate,
    setSelectedHistoryDate,
    openQuickAdd,
  } = useApp();

  const today = getTodayDateString();

  // Current calendar month view
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Days calculations
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Selected date data
  const dayTasks = tasks.filter((t) => t.dueDate === selectedHistoryDate);
  const dayPending = dayTasks.filter((t) => !t.completed);
  const dayCompleted = dayTasks.filter((t) => t.completed);

  const dayExpenses = expenses.filter((e) => e.date === selectedHistoryDate);
  const dayTotalSpent = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const selectedDateFormatted = new Date(
    parseInt(selectedHistoryDate.split('-')[0], 10),
    parseInt(selectedHistoryDate.split('-')[1], 10) - 1,
    parseInt(selectedHistoryDate.split('-')[2], 10)
  ).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Calendar & History
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
            Browse any day to review tasks, habits, and expenses.
          </p>
        </div>

        <button
          onClick={() => setSelectedHistoryDate(today)}
          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 transition-all min-h-[36px]"
        >
          Today
        </button>
      </div>

      {/* Interactive Month Calendar Card */}
      <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3 sm:space-y-4">
        {/* Month Header Nav */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
            {monthLabel}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 sm:p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-[11px] font-bold text-stone-600 dark:text-stone-300">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-0.5">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-14 rounded-xl opacity-0" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = dateStr === selectedHistoryDate;
            const isToday = dateStr === today;

            // Check if there are tasks or expenses on this day
            const hasTasks = tasks.some((t) => t.dueDate === dateStr);
            const dayExpenseSum = expenses
              .filter((e) => e.date === dateStr)
              .reduce((sum, e) => sum + e.amount, 0);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedHistoryDate(dateStr)}
                className={`h-10 sm:h-14 rounded-xl sm:rounded-2xl flex flex-col items-center justify-between p-1 sm:p-1.5 text-xs font-semibold transition-all relative active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 font-bold'
                    : isToday
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                    : 'bg-stone-50 dark:bg-stone-950/40 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-[10px] sm:text-xs">{dayNum}</span>

                <div className="flex items-center gap-0.5 sm:gap-1">
                  {hasTasks && (
                    <span
                      className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-emerald-500'
                      }`}
                    />
                  )}
                  {dayExpenseSum > 0 && (
                    <span
                      className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-200' : 'bg-amber-500'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Timeline & Details */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
        {/* Selected date title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800/80">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {selectedDateFormatted}
              </h2>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
              {formatDateLabel(selectedHistoryDate)}'s complete productivity & financial log.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              Spent: {formatCurrency(dayTotalSpent, preferences.currencySymbol, preferences.currency)}
            </span>
          </div>
        </div>

        {/* Section 1: Tasks for Selected Day */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Tasks ({dayCompleted.length}/{dayTasks.length} Completed)
            </h3>
            <button
              onClick={() => openQuickAdd('task')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              + Add for this date
            </button>
          </div>

          {dayTasks.length === 0 ? (
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium py-2">
              No tasks scheduled or recorded for this date.
            </p>
          ) : (
            <div className="space-y-2">
              {dayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${
                    task.completed
                      ? 'bg-stone-50 dark:bg-stone-950/30 border-stone-200/60 dark:border-stone-800/60'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${
                        task.completed ? 'bg-emerald-500 text-white' : 'border-2 border-stone-300'
                      }`}
                    >
                      {task.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                    </button>
                    <span
                      className={`text-xs font-medium truncate ${
                        task.completed
                          ? 'line-through text-stone-600 dark:text-stone-300'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {task.dueTime && (
                      <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                        {formatTime(task.dueTime)}
                      </span>
                    )}
                    <PriorityBadge priority={task.priority} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Expenses for Selected Day */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Expenses ({formatCurrency(dayTotalSpent, preferences.currencySymbol, preferences.currency)})
            </h3>
            <button
              onClick={() => openQuickAdd('expense')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              + Add Expense
            </button>
          </div>

          {dayExpenses.length === 0 ? (
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium py-2">
              No expenses recorded for this date.
            </p>
          ) : (
            <div className="space-y-2">
              {dayExpenses.map((exp) => {
                const colorClasses = getCategoryColorClasses(exp.category);
                return (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200/70 dark:border-stone-800/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl ${colorClasses.lightBg} ${colorClasses.text} flex items-center justify-center shrink-0`}
                      >
                        <CategoryIcon name={exp.category} size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block truncate capitalize">
                          {exp.description || exp.category}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-600 dark:text-stone-300 font-medium">
                          <span className="capitalize">{exp.category}</span>
                          <span>•</span>
                          <span className="uppercase font-bold text-stone-600 dark:text-stone-300">
                            {exp.paymentMethod}
                          </span>
                          {exp.time && <span>• {formatTime(exp.time)}</span>}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 shrink-0 ml-2">
                      {formatCurrency(exp.amount, preferences.currencySymbol, preferences.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
