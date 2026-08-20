import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Checklist,
  ChecklistItem,
  Expense,
  Reminder,
  ExpenseCategory,
  UserPreferences,
  ActiveNotification,
  ThemeMode,
} from '../types';
import {
  INITIAL_PREFERENCES,
  getInitialTasks,
  getInitialChecklists,
  getInitialExpenses,
  getInitialReminders,
  getStarterTasks,
  getStarterChecklists,
  getStarterExpenses,
  getStarterReminders,
} from '../utils/initialData';
import { DEFAULT_CATEGORIES, getTodayDateString } from '../utils/formatters';

export type NavigationTab = 'home' | 'tasks' | 'checklists' | 'expenses' | 'insights' | 'calendar';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Checklists
  checklists: Checklist[];
  addChecklist: (name: string, description?: string, icon?: string, color?: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  addChecklistItem: (checklistId: string, title: string) => void;
  removeChecklistItem: (checklistId: string, itemId: string) => void;
  resetChecklist: (checklistId: string) => void;
  duplicateChecklist: (checklistId: string) => void;
  deleteChecklist: (checklistId: string) => void;
  exportChecklistToToday: (checklistId: string) => void;

  // Expenses & Categories
  expenses: Expense[];
  categories: ExpenseCategory[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCustomCategory: (name: string, icon: string, color: string) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  toggleReminder: (id: string) => void;
  snoozeReminder: (id: string, minutes?: number) => void;
  deleteReminder: (id: string) => void;

  // Preferences & Settings
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetToSampleData: () => void;
  clearAllUserData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;

  // Notifications
  activeNotifications: ActiveNotification[];
  dismissNotification: (id: string) => void;
  triggerSampleNotification: () => void;

  // Navigation & Modals
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isQuickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  quickAddInitialTab: 'smart' | 'task' | 'expense' | 'reminder';
  openQuickAdd: (tab?: 'smart' | 'task' | 'expense' | 'reminder') => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  // Selected date for calendar/history
  selectedHistoryDate: string;
  setSelectedHistoryDate: (date: string) => void;

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  fireConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PREFERENCES: 'cyrus_user_preferences_v2',
  TASKS: 'cyrus_tasks_v2',
  CHECKLISTS: 'cyrus_checklists_v2',
  EXPENSES: 'cyrus_expenses_v2',
  REMINDERS: 'cyrus_reminders_v2',
  CATEGORIES: 'cyrus_categories_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return saved ? { ...INITIAL_PREFERENCES, ...JSON.parse(saved) } : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  });

  // 2. Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : getInitialTasks();
    } catch {
      return getInitialTasks();
    }
  });

  // 3. Checklists
  const [checklists, setChecklists] = useState<Checklist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
      return saved ? JSON.parse(saved) : getInitialChecklists();
    } catch {
      return getInitialChecklists();
    }
  });

  // 4. Expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : getInitialExpenses();
    } catch {
      return getInitialExpenses();
    }
  });

  // 5. Reminders
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return saved ? JSON.parse(saved) : getInitialReminders();
    } catch {
      return getInitialReminders();
    }
  });

  // 6. Categories
  const [categories, setCategories] = useState<ExpenseCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // 7. Active Notifications
  const [activeNotifications, setActiveNotifications] = useState<ActiveNotification[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isQuickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddInitialTab, setQuickAddInitialTab] = useState<'smart' | 'task' | 'expense' | 'reminder'>('smart');
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(getTodayDateString());
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  // Apply Theme (Dark / Light / System)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
      }
      // Update meta theme-color
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', isDark ? '#0c0a09' : '#10b981');
      }
    };

    if (preferences.theme === 'dark') {
      applyTheme(true);
    } else if (preferences.theme === 'light') {
      applyTheme(false);
    } else {
      // System mode
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        if (preferences.theme === 'system') {
          applyTheme(e.matches);
        }
      };

      mq.addEventListener('change', handleChange);
      return () => mq.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3200);
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
  };

  // Open Quick Add with preset tab
  const openQuickAdd = (tab: 'smart' | 'task' | 'expense' | 'reminder' = 'smart') => {
    setQuickAddInitialTab(tab);
    setQuickAddOpen(true);
  };

  // Tasks actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task added: "${newTask.title.slice(0, 24)}"`, 'success');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      let isCompletedNow = false;
      const updated = prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          isCompletedNow = nextCompleted;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      if (isCompletedNow) {
        const today = getTodayDateString();
        const todayPending = updated.filter((t) => t.dueDate === today && !t.completed);
        if (todayPending.length === 0) {
          fireConfetti();
          showToast('All tasks completed today! Amazing work! ✨', 'success');
        } else {
          showToast('Task marked completed', 'success');
        }
      }
      return updated;
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Task updated', 'info');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed', 'info');
  };

  // Checklist actions
  const addChecklist = (name: string, description?: string, icon: string = 'CheckSquare', color: string = 'emerald') => {
    const newChecklist: Checklist = {
      id: `check-${Date.now()}`,
      name,
      description,
      icon,
      color,
      createdAt: new Date().toISOString(),
      items: [],
    };
    setChecklists((prev) => [newChecklist, ...prev]);
    showToast(`Checklist "${name}" created`, 'success');
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists((prev) =>
      prev.map((c) => {
        if (c.id === checklistId) {
          const updatedItems = c.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          const allDone = updatedItems.length > 0 && updatedItems.every((i) => i.completed);
          if (allDone) {
            fireConfetti();
            showToast(`Checklist "${c.name}" completed! 🎉`, 'success');
          }
          return { ...c, items: updatedItems };
        }
        return c;
      })
    );
  };

  const addChecklistItem = (checklistId: string, title: string) => {
    if (!title.trim()) return;
    setChecklists((prev) =>
      prev.map((c) => {
        if (c.id === checklistId) {
          const newItem: ChecklistItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            checklistId,
            title: title.trim(),
            completed: false,
            position: c.items.length,
          };
          return { ...c, items: [...c.items, newItem] };
        }
        return c;
      })
    );
  };

  const removeChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklistId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      )
    );
  };

  const resetChecklist = (checklistId: string) => {
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklistId
          ? { ...c, items: c.items.map((item) => ({ ...item, completed: false })) }
          : c
      )
    );
    showToast('Checklist reset for reuse', 'info');
  };

  const duplicateChecklist = (checklistId: string) => {
    const target = checklists.find((c) => c.id === checklistId);
    if (!target) return;
    const newId = `check-${Date.now()}`;
    const duplicated: Checklist = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      items: target.items.map((i, idx) => ({
        ...i,
        id: `item-${Date.now()}-${idx}`,
        checklistId: newId,
        completed: false,
      })),
    };
    setChecklists((prev) => [duplicated, ...prev]);
    showToast('Checklist duplicated', 'success');
  };

  const deleteChecklist = (checklistId: string) => {
    setChecklists((prev) => prev.filter((c) => c.id !== checklistId));
    showToast('Checklist deleted', 'info');
  };

  const exportChecklistToToday = (checklistId: string) => {
    const list = checklists.find((c) => c.id === checklistId);
    if (!list || list.items.length === 0) return;
    const today = getTodayDateString();
    
    const newTasks: Task[] = list.items.map((item, idx) => ({
      id: `task-exp-${Date.now()}-${idx}`,
      title: `${list.name}: ${item.title}`,
      dueDate: today,
      priority: 'medium',
      completed: false,
      recurrence: 'none',
      category: list.name,
      createdAt: new Date().toISOString(),
    }));

    setTasks((prev) => [...newTasks, ...prev]);
    showToast(`Added ${newTasks.length} tasks to Today's list`, 'success');
  };

  // Expenses actions
  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Expense added: ${preferences.currencySymbol}${expenseData.amount}`, 'success');
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Expense updated', 'info');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Expense deleted', 'info');
  };

  const addCustomCategory = (name: string, icon: string = 'Tag', color: string = 'blue') => {
    const newCat: ExpenseCategory = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      color,
      isCustom: true,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${name}" added`, 'success');
  };

  // Reminders actions
  const addReminder = (remData: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...remData,
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newReminder, ...prev]);
    showToast(`Reminder set for ${remData.time || 'today'}`, 'success');
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.completed;
          return {
            ...r,
            completed: nextState,
            completedAt: nextState ? new Date().toISOString() : undefined,
          };
        }
        return r;
      })
    );
    showToast('Reminder status updated', 'info');
  };

  const snoozeReminder = (id: string, minutes: number = 15) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const snoozed = new Date(Date.now() + minutes * 60000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return { ...r, snoozedUntil: snoozed };
        }
        return r;
      })
    );
    showToast(`Snoozed for ${minutes} minutes`, 'info');
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder deleted', 'info');
  };

  // User Preferences
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    showToast('Preferences saved', 'success');
  };

  const resetToSampleData = () => {
    setPreferences(INITIAL_PREFERENCES);
    setTasks(getStarterTasks());
    setChecklists(getStarterChecklists());
    setExpenses(getStarterExpenses());
    setReminders(getStarterReminders());
    setCategories(DEFAULT_CATEGORIES);
    showToast('Reset to Cyrus starter templates & sample data', 'success');
  };

  const clearAllUserData = () => {
    setTasks([]);
    setChecklists([]);
    setExpenses([]);
    setReminders([]);
    showToast('Cleared all items. Clean slate ready!', 'info');
  };

  const exportDataJSON = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      preferences,
      tasks,
      checklists,
      expenses,
      reminders,
      categories,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tasks) setTasks(data.tasks);
      if (data.checklists) setChecklists(data.checklists);
      if (data.expenses) setExpenses(data.expenses);
      if (data.reminders) setReminders(data.reminders);
      if (data.preferences) setPreferences(data.preferences);
      if (data.categories) setCategories(data.categories);
      showToast('Data imported successfully!', 'success');
      return true;
    } catch (err) {
      showToast('Invalid backup file format', 'warning');
      return false;
    }
  };

  const dismissNotification = (id: string) => {
    setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const triggerSampleNotification = () => {
    const sampleNotifs: ActiveNotification[] = [
      {
        id: `notif-${Date.now()}`,
        title: 'Cyrus Reminder: Submit Assignment',
        message: 'Scheduled reminder for 11:00 AM.',
        time: 'Just now',
        type: 'reminder',
      },
      {
        id: `notif-${Date.now()}`,
        title: 'Daily Budget Check',
        message: 'You have spent ₹500 today. Still safely within daily pace.',
        time: 'Just now',
        type: 'budget',
      },
    ];
    const item = sampleNotifs[Math.floor(Math.random() * sampleNotifs.length)];
    setActiveNotifications((prev) => [item, ...prev]);
    showToast('Simulated push notification received', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        checklists,
        addChecklist,
        toggleChecklistItem,
        addChecklistItem,
        removeChecklistItem,
        resetChecklist,
        duplicateChecklist,
        deleteChecklist,
        exportChecklistToToday,
        expenses,
        categories,
        addExpense,
        updateExpense,
        deleteExpense,
        addCustomCategory,
        reminders,
        addReminder,
        toggleReminder,
        snoozeReminder,
        deleteReminder,
        preferences,
        updatePreferences,
        resetToSampleData,
        clearAllUserData,
        exportDataJSON,
        importDataJSON,
        activeNotifications,
        dismissNotification,
        triggerSampleNotification,
        activeTab,
        setActiveTab,
        isQuickAddOpen,
        setQuickAddOpen,
        quickAddInitialTab,
        openQuickAdd,
        isSearchOpen,
        setSearchOpen,
        isSettingsOpen,
        setSettingsOpen,
        isNotificationsOpen,
        setNotificationsOpen,
        selectedHistoryDate,
        setSelectedHistoryDate,
        toast,
        showToast,
        fireConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
