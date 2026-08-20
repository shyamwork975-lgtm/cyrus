import { ExpenseCategory, Priority, Recurrence } from '../types';

export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: 'emerald' },
  { id: 'travel', name: 'Travel & Commute', icon: 'Car', color: 'blue' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'purple' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'Receipt', color: 'amber' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: 'rose' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'indigo' },
  { id: 'health', name: 'Health & Fitness', icon: 'HeartPulse', color: 'teal' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'CreditCard', color: 'cyan' },
  { id: 'other', name: 'Other', icon: 'Sparkles', color: 'stone' },
];

/**
 * Formats numbers into currency format (supports Indian ₹ 1,25,000 format)
 */
export function formatCurrency(amount: number, symbol: string = '₹', currencyCode: string = 'INR'): string {
  if (isNaN(amount)) return `${symbol}0`;
  
  if (currencyCode === 'INR') {
    // Custom Indian numbering system formatting: 1,23,456
    const isNegative = amount < 0;
    const absVal = Math.abs(Math.round(amount));
    const str = absVal.toString();
    
    let lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${isNegative ? '-' : ''}${symbol}${formatted}`;
  }

  // Standard international formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount).replace(/^[A-Z]{3}\s?/, symbol);
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts a YYYY-MM-DD date string to a human friendly label
 */
export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return '';
  const today = getTodayDateString();
  
  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];
  
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== todayDate.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Formats HH:mm 24-hour time to 12-hour AM/PM format
 */
export function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${String(minutes || 0).padStart(2, '0')} ${ampm}`;
}

/**
 * Returns appropriate greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Good night';
}

/**
 * Calculates user's daily consistency streak based on completed tasks
 */
export function calculateStreak(tasks: { completed: boolean; dueDate: string }[]): number {
  const completedDates = new Set(
    tasks.filter((t) => t.completed && t.dueDate).map((t) => t.dueDate)
  );

  if (completedDates.size === 0) return 0;

  const today = getTodayDateString();
  let streak = 0;
  const curr = new Date();

  // If completed something today
  if (completedDates.has(today)) {
    streak = 1;
    curr.setDate(curr.getDate() - 1);
  } else {
    // Or if completed yesterday
    curr.setDate(curr.getDate() - 1);
    const yestStr = curr.toISOString().split('T')[0];
    if (completedDates.has(yestStr)) {
      streak = 1;
      curr.setDate(curr.getDate() - 1);
    } else {
      return 0;
    }
  }

  while (true) {
    const dStr = curr.toISOString().split('T')[0];
    if (completedDates.has(dStr)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export interface ParsedSmartEntry {
  type: 'expense' | 'task';
  // Expense fields
  amount?: number;
  category?: string;
  paymentMethod?: 'upi' | 'cash' | 'card' | 'netbanking' | 'other';
  // Task fields
  taskTitle?: string;
  date?: string;
  time?: string;
  priority?: Priority;
  recurrence?: Recurrence;
  reminderEnabled?: boolean;
  notes?: string;
}

/**
 * Smart Natural Language Parser for Quick Entry
 */
export function parseNaturalLanguageInput(rawInput: string): ParsedSmartEntry {
  const text = rawInput.trim();
  const lower = text.toLowerCase();
  
  // Check if it looks like an expense
  // Patterns like: "Spent 250 on food", "₹300 travel", "Paid 1200 for electricity via UPI", "Dinner 450", "Coffee 150"
  const amountMatch = text.match(/(?:spent|paid|cost|for)?\s*(?:₹|\$|€|£|rs\.?|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:₹|\$|€|£|rs\.?|inr)?/i);
  const isExplicitExpense = /^(?:spent|paid|bought|expense|cost|coffee|tea|lunch|dinner|breakfast|fuel|petrol|uber|auto|metro|recharge|movie|groceries|swiggy|zomato|blinkit|zepto)\b/i.test(text) ||
    /₹|\$|€|£|rs\b|inr\b/i.test(text);

  if (amountMatch && (isExplicitExpense || text.length < 35)) {
    const rawAmount = amountMatch[1].replace(',', '');
    const amount = parseFloat(rawAmount);

    if (!isNaN(amount) && amount > 0) {
      // Determine category
      let category = 'other';
      if (/food|lunch|dinner|breakfast|coffee|tea|cafe|snack|burger|pizza|restaurant|swiggy|zomato|eat|meal/i.test(lower)) {
        category = 'food';
      } else if (/travel|cab|uber|ola|auto|metro|bus|train|flight|petrol|diesel|fuel|commute|ride|taxi/i.test(lower)) {
        category = 'travel';
      } else if (/shop|dress|clothes|amazon|flipkart|shoes|watch|bag|blinkit|zepto|groceries|market/i.test(lower)) {
        category = 'shopping';
      } else if (/bill|electricity|water|wifi|broadband|recharge|gas|maintenance|rent/i.test(lower)) {
        category = 'bills';
      } else if (/movie|cinema|game|concert|party|netflix|prime|theatre|club/i.test(lower)) {
        category = 'entertainment';
      } else if (/book|course|udemy|tuition|exam|college|school|class|study|stationery/i.test(lower)) {
        category = 'education';
      } else if (/med|medicine|doctor|hospital|gym|protein|health|clinic|pharmacy/i.test(lower)) {
        category = 'health';
      } else if (/sub|subscription|spotify|youtube|icloud|google/i.test(lower)) {
        category = 'subscriptions';
      }

      // Determine payment method
      let paymentMethod: 'upi' | 'cash' | 'card' | 'netbanking' | 'other' = 'upi';
      if (/cash/i.test(lower)) paymentMethod = 'cash';
      else if (/card|credit|debit/i.test(lower)) paymentMethod = 'card';
      else if (/netbanking|transfer|bank/i.test(lower)) paymentMethod = 'netbanking';

      // Clean description
      let description = text
        .replace(/^(?:spent|paid|bought)\s*/i, '')
        .replace(/(?:₹|\$|€|£|rs\.?|inr)?\s*\d+(?:[.,]\d+)?\s*(?:₹|\$|€|£|rs\.?|inr)?/gi, '')
        .replace(/\b(?:via|by|on|for|in|using|upi|gpay|cash|card)\b/gi, '')
        .trim();

      if (!description) {
        description = category.charAt(0).toUpperCase() + category.slice(1);
      }

      return {
        type: 'expense',
        amount,
        category,
        paymentMethod,
        notes: description,
        date: getTodayDateString(),
      };
    }
  }

  // Parse as Task / Reminder
  let date = getTodayDateString();
  if (/tomorrow/i.test(lower)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    date = d.toISOString().split('T')[0];
  } else if (/next week/i.test(lower)) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    date = d.toISOString().split('T')[0];
  }

  // Time extraction (e.g. 10 AM, 4:30 PM, 18:00, 7pm)
  let time = '09:00';
  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i) || text.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\b/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const mins = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridian = timeMatch[3]?.toLowerCase();
    
    if (meridian === 'pm' && hours < 12) hours += 12;
    if (meridian === 'am' && hours === 12) hours = 0;
    
    time = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  // Priority extraction
  let priority: Priority = 'medium';
  if (/urgent|high priority|important|asap/i.test(lower)) priority = 'high';
  else if (/low priority|whenever|someday/i.test(lower)) priority = 'low';

  // Recurrence extraction
  let recurrence: Recurrence = 'none';
  if (/daily|every day/i.test(lower)) recurrence = 'daily';
  else if (/weekly|every week/i.test(lower)) recurrence = 'weekly';
  else if (/monthly|every month/i.test(lower)) recurrence = 'monthly';

  // Clean task title
  let taskTitle = text
    .replace(/^(?:remind me to|remind me|todo|task:?)\s*/i, '')
    .replace(/\b(?:tomorrow|today|next week)\b/gi, '')
    .replace(/\b(?:at\s+)?\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/gi, '')
    .replace(/\b(?:urgent|high priority|low priority|daily|weekly|monthly)\b/gi, '')
    .trim();

  if (!taskTitle) taskTitle = 'New Reminder';

  return {
    type: 'task',
    taskTitle,
    date,
    time,
    priority,
    recurrence,
    reminderEnabled: true,
  };
}
