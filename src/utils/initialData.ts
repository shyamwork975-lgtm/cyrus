import { Task, Checklist, Expense, Reminder, UserPreferences } from '../types';
import { getTodayDateString } from './formatters';

export const INITIAL_PREFERENCES: UserPreferences = {
  name: '',
  currency: 'INR',
  currencySymbol: '₹',
  monthlyBudget: 25000,
  theme: 'system',
  notificationsEnabled: true,
  soundEnabled: true,
};

// Default initial state: Zero dummy data for pristine new user experience
export function getInitialTasks(): Task[] {
  return [];
}

export function getInitialChecklists(): Checklist[] {
  return [];
}

export function getInitialReminders(): Reminder[] {
  return [];
}

export function getInitialExpenses(): Expense[] {
  return [];
}

// Optional Starter Templates for Settings > "Load Starter Templates"
export function getStarterTasks(): Task[] {
  const today = getTodayDateString();
  const now = new Date();
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return [
    {
      id: 'task-1',
      title: 'Drink 2L of water throughout the day',
      dueDate: today,
      dueTime: '08:30',
      priority: 'low',
      completed: false,
      recurrence: 'daily',
      reminderEnabled: true,
      category: 'Health',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Review daily top priorities',
      dueDate: today,
      dueTime: '09:00',
      priority: 'high',
      completed: false,
      recurrence: 'daily',
      reminderEnabled: true,
      category: 'Personal',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'Evening 30-min brisk walk',
      dueDate: today,
      dueTime: '19:30',
      priority: 'medium',
      completed: false,
      recurrence: 'daily',
      reminderEnabled: true,
      category: 'Health',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getStarterChecklists(): Checklist[] {
  return [
    {
      id: 'check-1',
      name: 'Morning Routine',
      description: 'Start every day energized and focused',
      icon: 'Sun',
      color: 'amber',
      createdAt: new Date().toISOString(),
      items: [
        { id: 'c1-1', checklistId: 'check-1', title: 'Wake up on first alarm', completed: false, position: 0 },
        { id: 'c1-2', checklistId: 'check-1', title: 'Drink glass of water', completed: false, position: 1 },
        { id: 'c1-3', checklistId: 'check-1', title: '10-min stretch & breathing', completed: false, position: 2 },
        { id: 'c1-4', checklistId: 'check-1', title: 'Healthy breakfast', completed: false, position: 3 },
      ],
    },
    {
      id: 'check-2',
      name: 'Daily Bag & Essentials',
      description: 'Never forget key belongings',
      icon: 'Briefcase',
      color: 'indigo',
      createdAt: new Date().toISOString(),
      items: [
        { id: 'c2-1', checklistId: 'check-2', title: 'Phone, keys & wallet', completed: false, position: 0 },
        { id: 'c2-2', checklistId: 'check-2', title: 'Laptop & charger adapter', completed: false, position: 1 },
        { id: 'c2-3', checklistId: 'check-2', title: 'Water bottle & earphones', completed: false, position: 2 },
      ],
    },
  ];
}

export function getStarterReminders(): Reminder[] {
  const today = getTodayDateString();
  return [
    {
      id: 'rem-1',
      title: 'Take daily multi-vitamins / medicines',
      date: today,
      time: '09:00',
      recurrence: 'daily',
      notificationEnabled: true,
      completed: false,
      notes: 'After breakfast with water',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getStarterExpenses(): Expense[] {
  return [];
}
