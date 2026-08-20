import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Repeat,
  Bell,
  Trash2,
  CheckCircle2,
  Sparkles,
  Tag,
  Filter,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Reminder, Priority, Recurrence } from '../../types';
import {
  formatDateLabel,
  formatTime,
  getTodayDateString,
} from '../../utils/formatters';
import { PriorityBadge } from '../common/PriorityBadge';

type FilterTab = 'today' | 'upcoming' | 'high_priority' | 'repeating' | 'reminders' | 'completed';

export const TasksView: React.FC = () => {
  const {
    tasks,
    toggleTask,
    deleteTask,
    reminders,
    toggleReminder,
    deleteReminder,
    snoozeReminder,
    openQuickAdd,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('today');
  const [searchQuery, setSearchQuery] = useState('');

  const today = getTodayDateString();

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((t) => {
    // Search query filter
    if (searchQuery.trim() && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeFilter === 'today') {
      return t.dueDate === today && !t.completed;
    }
    if (activeFilter === 'upcoming') {
      return t.dueDate > today && !t.completed;
    }
    if (activeFilter === 'high_priority') {
      return t.priority === 'high' && !t.completed;
    }
    if (activeFilter === 'repeating') {
      return t.recurrence !== 'none' && !t.completed;
    }
    if (activeFilter === 'completed') {
      return t.completed;
    }
    return !t.completed;
  });

  const filteredReminders = reminders.filter((r) => {
    if (searchQuery.trim() && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeFilter === 'completed') return r.completed;
    return !r.completed;
  });

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Top Header & Quick Actions */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Tasks & Reminders
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
            Organize daily to-dos, one-time reminders, and repeating habits.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="tasks-add-task-btn"
            onClick={() => openQuickAdd('task')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Task</span>
          </button>

          <button
            id="tasks-add-reminder-btn"
            onClick={() => openQuickAdd('reminder')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all active:scale-95 min-h-[36px]"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Reminder</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'today', label: `Today (${tasks.filter((t) => t.dueDate === today && !t.completed).length})` },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'high_priority', label: 'Priority' },
            { id: 'reminders', label: `Reminders (${reminders.filter((r) => !r.completed).length})` },
            { id: 'repeating', label: 'Habits' },
            { id: 'completed', label: 'Done' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setActiveFilter(tab.id as FilterTab)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap text-xs transition-all active:scale-95 ${
                activeFilter === tab.id
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search inside tasks */}
        <div className="relative">
          <input
            id="tasks-search-input"
            type="text"
            placeholder="Search tasks, reminders, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* View: Dedicated Reminders Tab */}
      {activeFilter === 'reminders' ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Active Reminders
            </h2>
            <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
              {filteredReminders.length} active
            </span>
          </div>

          {filteredReminders.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800">
              <Bell className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                No reminders here
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">
                Create daily, weekly, or one-time reminders for medicines, bills, and habits.
              </p>
              <button
                onClick={() => openQuickAdd('reminder')}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
              >
                + Create Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredReminders.map((rem) => (
                <div
                  key={rem.id}
                  id={`reminder-item-${rem.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className="shrink-0 w-6 h-6 rounded-lg border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500 flex items-center justify-center text-transparent hover:text-emerald-500 transition-colors"
                      aria-label="Complete reminder"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block truncate">
                        {rem.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-600 dark:text-stone-300 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {formatDateLabel(rem.date)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <Clock className="w-3 h-3" />
                          {formatTime(rem.time)}
                        </span>
                        {rem.recurrence !== 'none' && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold uppercase">
                            <Repeat className="w-2.5 h-2.5" />
                            {rem.recurrence}
                          </span>
                        )}
                        {rem.snoozedUntil && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                            Snoozed until {rem.snoozedUntil}
                          </span>
                        )}
                      </div>
                      {rem.notes && (
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium mt-1">
                          {rem.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => snoozeReminder(rem.id, 15)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all active:scale-95"
                      title="Snooze 15 minutes"
                    >
                      Snooze 15m
                    </button>
                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Tasks List */
        <section className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                {activeFilter === 'completed'
                  ? 'No completed tasks recorded yet'
                  : 'No tasks found in this view'}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">
                {activeFilter === 'completed'
                  ? 'Tasks completed today will appear here with timestamps.'
                  : 'You are completely caught up! Tap below to add something.'}
              </p>
              {activeFilter !== 'completed' && (
                <button
                  onClick={() => openQuickAdd('task')}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  + Add New Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border shadow-sm transition-all ${
                  task.completed
                    ? 'bg-stone-50/70 dark:bg-stone-950/30 border-stone-200/60 dark:border-stone-800/60 opacity-85'
                    : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-transparent hover:text-emerald-500'
                    }`}
                    aria-label={`Toggle task ${task.title}`}
                  >
                    {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-sm font-semibold block truncate ${
                        task.completed
                          ? 'line-through text-stone-600 dark:text-stone-300'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-600 dark:text-stone-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {formatDateLabel(task.dueDate)}
                      </span>

                      {task.dueTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {formatTime(task.dueTime)}
                        </span>
                      )}

                      {task.recurrence !== 'none' && (
                        <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-semibold uppercase">
                          <Repeat className="w-2.5 h-2.5" />
                          {task.recurrence}
                        </span>
                      )}

                      {task.category && (
                        <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-medium">
                          <Tag className="w-2.5 h-2.5" />
                          {task.category}
                        </span>
                      )}

                      {task.completedAt && (
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                          Done at {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <PriorityBadge priority={task.priority} size="sm" />
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
};
