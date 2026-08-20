import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  CheckSquare,
  Receipt,
  Bell,
  ListChecks,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDateLabel,
} from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    tasks,
    expenses,
    reminders,
    checklists,
    toggleTask,
    preferences,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        matchedTasks: [],
        matchedExpenses: [],
        matchedReminders: [],
        matchedChecklists: [],
      };
    }

    const matchedTasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
    );

    const matchedExpenses = expenses.filter(
      (e) =>
        (e.description && e.description.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q) ||
        e.paymentMethod.toLowerCase().includes(q)
    );

    const matchedReminders = reminders.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
    );

    const matchedChecklists = checklists.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.items.some((i) => i.title.toLowerCase().includes(q))
    );

    return {
      matchedTasks,
      matchedExpenses,
      matchedReminders,
      matchedChecklists,
    };
  }, [query, tasks, expenses, reminders, checklists]);

  const totalResults =
    searchResults.matchedTasks.length +
    searchResults.matchedExpenses.length +
    searchResults.matchedReminders.length +
    searchResults.matchedChecklists.length;

  const handleClose = () => {
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            id="global-search-modal"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
          >
            {/* Search input header */}
            <div className="p-3.5 sm:p-4 border-b border-stone-100 dark:border-stone-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-emerald-500 shrink-0" />
              <input
                id="global-search-input-field"
                type="text"
                placeholder="Search tasks, reminders, expenses, checklists..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-base sm:text-sm font-medium text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs font-semibold text-stone-400 hover:text-stone-600 px-2 py-1 rounded min-h-[36px]"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5 text-xs">
          {!query.trim() ? (
            <div className="text-center py-8 text-stone-400">
              <p className="font-semibold text-stone-600 dark:text-stone-300">
                Instant Search
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                Type "groceries", "food", "gym", or "assignment" to find anything across Cyrus.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <p className="font-semibold text-stone-600 dark:text-stone-300">
                No matching results found for "{query}"
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                Try searching by different keywords or categories.
              </p>
            </div>
          ) : (
            <>
              {/* Matched Tasks */}
              {searchResults.matchedTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                      Tasks ({searchResults.matchedTasks.length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {searchResults.matchedTasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/60 dark:border-stone-800/60"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <button
                            onClick={() => toggleTask(t.id)}
                            className={`shrink-0 w-4 h-4 rounded flex items-center justify-center ${
                              t.completed ? 'bg-emerald-500 text-white' : 'border border-stone-300'
                            }`}
                          >
                            {t.completed && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                          <span
                            className={`truncate font-medium ${
                              t.completed
                                ? 'line-through text-stone-600 dark:text-stone-300'
                                : 'text-stone-900 dark:text-stone-100'
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-600 dark:text-stone-300 shrink-0 ml-2">
                          {formatDateLabel(t.dueDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Expenses */}
              {searchResults.matchedExpenses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <span className="flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5 text-blue-500" />
                      Expenses ({searchResults.matchedExpenses.length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {searchResults.matchedExpenses.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          setActiveTab('expenses');
                          handleClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/60 dark:border-stone-800/60 cursor-pointer hover:border-emerald-500/40"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-stone-900 dark:text-stone-100 block truncate capitalize">
                            {e.description || e.category}
                          </span>
                          <span className="text-[10px] text-stone-600 dark:text-stone-300">
                            {formatDateLabel(e.date)} • {e.category}
                          </span>
                        </div>
                        <span className="font-bold text-stone-900 dark:text-stone-100 shrink-0 ml-2">
                          {formatCurrency(e.amount, preferences.currencySymbol, preferences.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Reminders */}
              {searchResults.matchedReminders.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <span className="flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 text-amber-500" />
                      Reminders ({searchResults.matchedReminders.length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {searchResults.matchedReminders.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setActiveTab('tasks');
                          handleClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/60 dark:border-stone-800/60 cursor-pointer hover:border-emerald-500/40"
                      >
                        <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {r.title}
                        </span>
                        <span className="text-[10px] text-stone-600 dark:text-stone-300 shrink-0 ml-2">
                          {r.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Checklists */}
              {searchResults.matchedChecklists.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <span className="flex items-center gap-1">
                      <ListChecks className="w-3.5 h-3.5 text-purple-500" />
                      Checklists ({searchResults.matchedChecklists.length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {searchResults.matchedChecklists.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveTab('checklists');
                          handleClose();
                        }}
                        className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/60 dark:border-stone-800/60 cursor-pointer hover:border-emerald-500/40"
                      >
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-stone-600 dark:text-stone-300">
                          {c.items.length} items
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
