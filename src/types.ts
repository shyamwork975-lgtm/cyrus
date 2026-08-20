export type Priority = 'low' | 'medium' | 'high';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
export type PaymentMethod = 'upi' | 'cash' | 'card' | 'netbanking' | 'other';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  completed: boolean;
  completedAt?: string; // ISO timestamp
  reminderEnabled?: boolean;
  recurrence: Recurrence;
  category?: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  title: string;
  completed: boolean;
  position: number;
}

export interface Checklist {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  items: ChecklistItem[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  recurrence: Recurrence;
  notificationEnabled: boolean;
  completed: boolean;
  completedAt?: string;
  snoozedUntil?: string;
  notes?: string;
  createdAt: string;
}

export interface UserPreferences {
  name: string;
  currency: string; // e.g. 'INR', 'USD', 'EUR', 'GBP'
  currencySymbol: string; // '₹', '$', '€', '£'
  monthlyBudget: number;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface DailyInsight {
  id: string;
  type: 'spending' | 'budget' | 'productivity' | 'streak';
  title: string;
  message: string;
  icon: string;
  level: 'info' | 'success' | 'warning';
}

export interface ActiveNotification {
  id: string;
  reminderId?: string;
  title: string;
  message: string;
  time: string;
  type: 'reminder' | 'budget' | 'streak';
}
