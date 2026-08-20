import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  CheckSquare,
  Receipt,
  Bell,
  Calendar,
  Clock,
  Repeat,
  Tag,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, Recurrence, PaymentMethod } from '../../types';
import {
  parseNaturalLanguageInput,
  getTodayDateString,
  formatCurrency,
  formatTime,
  formatDateLabel,
} from '../../utils/formatters';
import { CategoryIcon, getCategoryColorClasses } from '../common/CategoryIcon';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setQuickAddOpen,
    quickAddInitialTab,
    addTask,
    addExpense,
    addReminder,
    categories,
    preferences,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'smart' | 'task' | 'expense' | 'reminder'>('smart');

  // Smart magic entry state
  const [smartInput, setSmartInput] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ReturnType<typeof parseNaturalLanguageInput> | null>(null);

  // Manual Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState(getTodayDateString());
  const [taskTime, setTaskTime] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskRecurrence, setTaskRecurrence] = useState<Recurrence>('none');
  const [taskCategory, setTaskCategory] = useState('');

  // Manual Expense state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('food');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(getTodayDateString());
  const [expenseTime, setExpenseTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [expensePaymentMethod, setExpensePaymentMethod] = useState<PaymentMethod>('upi');

  // Manual Reminder state
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState(getTodayDateString());
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderRecurrence, setReminderRecurrence] = useState<Recurrence>('none');
  const [reminderNotes, setReminderNotes] = useState('');

  useEffect(() => {
    if (isQuickAddOpen) {
      setActiveTab(quickAddInitialTab || 'smart');
    }
  }, [isQuickAddOpen, quickAddInitialTab]);

  useEffect(() => {
    if (smartInput.trim()) {
      const parsed = parseNaturalLanguageInput(smartInput);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  }, [smartInput]);

  const handleClose = () => {
    setQuickAddOpen(false);
    setSmartInput('');
    setTaskTitle('');
    setExpenseAmount('');
    setExpenseDescription('');
    setReminderTitle('');
  };

  // Submit Smart Magic Entry
  const handleSmartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartInput.trim() || !parsedPreview) return;

    if (parsedPreview.type === 'expense') {
      addExpense({
        amount: parsedPreview.amount || 0,
        category: parsedPreview.category || 'other',
        description: parsedPreview.notes || 'Expense',
        paymentMethod: parsedPreview.paymentMethod || 'upi',
        date: parsedPreview.date || getTodayDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      });
    } else {
      addTask({
        title: parsedPreview.taskTitle || smartInput,
        dueDate: parsedPreview.date || getTodayDateString(),
        dueTime: parsedPreview.time,
        priority: parsedPreview.priority || 'medium',
        completed: false,
        recurrence: parsedPreview.recurrence || 'none',
        reminderEnabled: parsedPreview.reminderEnabled,
      });
    }

    handleClose();
  };

  // Submit Task
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      dueDate: taskDate,
      dueTime: taskTime || undefined,
      priority: taskPriority,
      completed: false,
      recurrence: taskRecurrence,
      category: taskCategory || undefined,
    });

    handleClose();
  };

  // Submit Expense
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) return;

    addExpense({
      amount,
      category: expenseCategory,
      description: expenseDescription.trim() || undefined,
      paymentMethod: expensePaymentMethod,
      date: expenseDate,
      time: expenseTime || undefined,
    });

    handleClose();
  };

  // Submit Reminder
  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    addReminder({
      title: reminderTitle.trim(),
      date: reminderDate,
      time: reminderTime,
      recurrence: reminderRecurrence,
      notificationEnabled: true,
      completed: false,
      notes: reminderNotes.trim() || undefined,
    });

    handleClose();
  };

  return (
    <AnimatePresence>
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            id="quick-add-modal"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full sm:max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10"
          >
            {/* Mobile Sheet Handle */}
            <div className="sm:hidden w-full pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  +
                </div>
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Quick Add
                </h2>
              </div>

              <button
                id="close-quick-add-btn"
                onClick={handleClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center p-1.5 bg-stone-100/80 dark:bg-stone-950/60 border-b border-stone-100 dark:border-stone-800 gap-1 text-xs font-semibold">
              {[
                { id: 'smart', label: 'Magic', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'task', label: 'Task', icon: <CheckSquare className="w-3.5 h-3.5" /> },
                { id: 'expense', label: 'Expense', icon: <Receipt className="w-3.5 h-3.5" /> },
                { id: 'reminder', label: 'Reminder', icon: <Bell className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl min-h-[40px] transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 shadow-sm border border-stone-200/60 dark:border-stone-800 font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: Smart Magic NLP Input */}
          {activeTab === 'smart' && (
            <form onSubmit={handleSmartSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Type naturally in one sentence
                </label>
                <textarea
                  id="smart-magic-textarea"
                  rows={3}
                  placeholder="e.g., 'Spent ₹250 on lunch at Subway' or 'Remind me to submit assignment tomorrow at 10 AM'"
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  autoFocus
                />
              </div>

              {/* Sample quick prompts */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-stone-400 self-center">Try:</span>
                {[
                  'Spent ₹180 on breakfast',
                  'Remind me to call Mom at 7 PM',
                  'Uber ₹220 travel',
                  'Water plants daily at 6 PM',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setSmartInput(sample)}
                    className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Live Preview Card of Parsed Result */}
              {parsedPreview && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px]">
                      Identified as {parsedPreview.type.toUpperCase()}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                      Instant Parse ✨
                    </span>
                  </div>

                  {parsedPreview.type === 'expense' ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100 capitalize">
                          {parsedPreview.notes || parsedPreview.category}
                        </span>
                        <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                          Category: <span className="capitalize font-semibold">{parsedPreview.category}</span> • Method: <span className="uppercase font-semibold">{parsedPreview.paymentMethod}</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(parsedPreview.amount || 0, preferences.currencySymbol, preferences.currency)}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {parsedPreview.taskTitle}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                        <span>Date: {formatDateLabel(parsedPreview.date || '')}</span>
                        {parsedPreview.time && <span>• Time: {formatTime(parsedPreview.time)}</span>}
                        {parsedPreview.recurrence !== 'none' && <span>• {parsedPreview.recurrence}</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!smartInput.trim()}
                className="w-full py-3 rounded-2xl bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Save Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: Manual Add Task */}
          {activeTab === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Task Name *
                </label>
                <input
                  id="manual-task-title-input"
                  type="text"
                  placeholder="e.g., Complete assignment, Buy groceries..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Recurrence
                  </label>
                  <select
                    value={taskRecurrence}
                    onChange={(e) => setTaskRecurrence(e.target.value as Recurrence)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="none">One-time</option>
                    <option value="daily">Daily Habit</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Tag / Category (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Work, Personal, Health, College"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={!taskTitle.trim()}
                className="w-full py-3 rounded-2xl bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all"
              >
                Create Task
              </button>
            </form>
          )}

          {/* TAB 3: Manual Add Expense (Ultra Fast 2-3 Tap Entry) */}
          {activeTab === 'expense' && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              {/* Big amount field */}
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Amount ({preferences.currencySymbol}) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg font-bold text-stone-400">
                    {preferences.currencySymbol}
                  </span>
                  <input
                    id="manual-expense-amount-input"
                    type="number"
                    step="any"
                    placeholder="0"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xl font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    autoFocus
                  />
                </div>

                {/* Quick amount presets */}
                <div className="flex gap-1.5 mt-2">
                  {[50, 100, 250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setExpenseAmount(String(preset))}
                      className="flex-1 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Grid */}
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1.5">
                  Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(0, 9).map((cat) => {
                    const isSelected = expenseCategory === cat.id;
                    const colorClasses = getCategoryColorClasses(cat.color);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setExpenseCategory(cat.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? `${colorClasses.lightBg} ${colorClasses.text} ${colorClasses.border} ring-2 ring-emerald-500/30 font-bold`
                            : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <CategoryIcon name={cat.icon || cat.id} size={15} />
                        <span className="truncate">{cat.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description note */}
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dinner with Rahul, Grocery restocking..."
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Payment Method & Date */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={expensePaymentMethod}
                    onChange={(e) => setExpensePaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="upi">UPI / GPay / PhonePe</option>
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!expenseAmount || parseFloat(expenseAmount) <= 0}
                className="w-full py-3 rounded-2xl bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all"
              >
                Record Expense ({preferences.currencySymbol}{expenseAmount || 0})
              </button>
            </form>
          )}

          {/* TAB 4: Manual Add Reminder */}
          {activeTab === 'reminder' && (
            <form onSubmit={handleReminderSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Reminder Title *
                </label>
                <input
                  id="manual-reminder-title-input"
                  type="text"
                  placeholder="e.g. Take medicine, Pay electricity bill, Water plants..."
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Recurrence
                </label>
                <select
                  value={reminderRecurrence}
                  onChange={(e) => setReminderRecurrence(e.target.value as Recurrence)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="none">One-time Reminder</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly (Bills & Subscriptions)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bill amount ~₹1,450 or with warm water"
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={!reminderTitle.trim()}
                className="w-full py-3 rounded-2xl bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all"
              >
                Set Reminder
              </button>
            </form>
          )}
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
