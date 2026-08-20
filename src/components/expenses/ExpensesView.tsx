import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Filter,
  Trash2,
  Calendar,
  CreditCard,
  Download,
  Tag,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Expense } from '../../types';
import {
  formatCurrency,
  formatDateLabel,
  formatTime,
  getTodayDateString,
} from '../../utils/formatters';
import { CategoryIcon, getCategoryColorClasses } from '../common/CategoryIcon';

type DateFilter = 'today' | 'week' | 'month' | 'all';

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    categories,
    deleteExpense,
    preferences,
    openQuickAdd,
    addCustomCategory,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const today = getTodayDateString();

  // Helper to check date range
  const isInRange = (dateStr: string, filter: DateFilter) => {
    if (filter === 'all') return true;
    if (filter === 'today') return dateStr === today;

    const targetDate = new Date(dateStr);
    const now = new Date();

    if (filter === 'month') {
      return (
        targetDate.getFullYear() === now.getFullYear() &&
        targetDate.getMonth() === now.getMonth()
      );
    }

    if (filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return targetDate >= oneWeekAgo && targetDate <= now;
    }

    return true;
  };

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    if (!isInRange(e.date, dateFilter)) return false;
    if (selectedCategory !== 'all' && e.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedPaymentMethod !== 'all' && e.paymentMethod !== selectedPaymentMethod) {
      return false;
    }
    if (searchQuery.trim()) {
      const matchDesc = e.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = e.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchDesc && !matchCat) return false;
    }
    return true;
  });

  // Sort latest first
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return (b.time || '').localeCompare(a.time || '');
  });

  const totalFilteredSpent = sortedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by Date for beautiful timeline
  const groupedByDate: Record<string, Expense[]> = {};
  sortedExpenses.forEach((e) => {
    if (!groupedByDate[e.date]) groupedByDate[e.date] = [];
    groupedByDate[e.date].push(e);
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCustomCategory(newCatName.trim(), 'Tag', 'purple');
    setNewCatName('');
    setIsAddingCategory(false);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Time', 'Category', 'Description', 'Amount', 'Payment Method'];
    const rows = sortedExpenses.map((e) => [
      e.date,
      e.time || '',
      e.category,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      e.amount,
      e.paymentMethod,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyrus-expenses-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Expense Tracker
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
            Track spending, categorize expenses, and stay on budget.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="expenses-export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all active:scale-95 min-h-[36px]"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            id="expenses-add-expense-btn"
            onClick={() => openQuickAdd('expense')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Total Card for Current Filter */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            {dateFilter === 'today'
              ? "Today's Spending"
              : dateFilter === 'week'
              ? 'Past 7 Days'
              : dateFilter === 'month'
              ? 'This Month'
              : 'All Time'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold mt-0.5 tracking-tight text-white">
            {formatCurrency(totalFilteredSpent, preferences.currencySymbol, preferences.currency)}
          </div>
          <span className="text-[11px] text-stone-300 mt-0.5 block font-medium">
            {sortedExpenses.length} transaction{sortedExpenses.length === 1 ? '' : 's'}
          </span>
        </div>

        <button
          onClick={() => openQuickAdd('expense')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold backdrop-blur-sm transition-all min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Filter Controls & Search */}
      <div className="space-y-2.5">
        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: '7 Days' },
            { id: 'month', label: 'Month' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`expense-date-filter-${tab.id}`}
              onClick={() => setDateFilter(tab.id as DateFilter)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap text-xs transition-all active:scale-95 ${
                dateFilter === tab.id
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category / Payment Method Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Search input */}
          <div className="relative">
            <input
              id="expense-search-input"
              type="text"
              placeholder="Search description, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
          </div>

          {/* Category Selector */}
          <select
            id="expense-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Method Selector */}
          <select
            id="expense-payment-filter"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Payment Methods</option>
            <option value="upi">UPI / GPay / PhonePe</option>
            <option value="cash">Cash</option>
            <option value="card">Debit / Credit Card</option>
            <option value="netbanking">Net Banking</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Category Manager Quick Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const colorClasses = getCategoryColorClasses(cat.color);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? `${colorClasses.lightBg} ${colorClasses.text} ${colorClasses.border} ring-2 ring-emerald-500/20`
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <CategoryIcon name={cat.icon || cat.id} size={13} />
                <span>{cat.name}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="px-2 py-1 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-[11px] font-medium whitespace-nowrap"
          >
            + Custom Category
          </button>
        </div>
      </div>

      {/* Custom Category Form */}
      {isAddingCategory && (
        <form
          onSubmit={handleCreateCategory}
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
              Create New Category
            </span>
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="text-xs text-stone-600 dark:text-stone-300 font-medium"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Pet Care, Gaming, Hobbies..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!newCatName.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold hover:bg-emerald-700 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Transactions List Grouped by Date */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800">
          <Receipt className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            No expenses recorded
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">
            No transactions match your current filters.
          </p>
          <button
            onClick={() => openQuickAdd('expense')}
            className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
          >
            + Add Expense
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedByDate).map((dateKey) => {
            const dayList = groupedByDate[dateKey];
            const dayTotal = dayList.reduce((sum, item) => sum + item.amount, 0);

            return (
              <div key={dateKey} className="space-y-2">
                {/* Date group header */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{formatDateLabel(dateKey)}</span>
                    <span className="text-stone-600 dark:text-stone-300 font-medium text-[11px]">
                      ({dateKey})
                    </span>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(dayTotal, preferences.currencySymbol, preferences.currency)}
                  </span>
                </div>

                {/* Date item list */}
                <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm divide-y divide-stone-100 dark:divide-stone-800/80 overflow-hidden">
                  {dayList.map((exp) => {
                    const colorClasses = getCategoryColorClasses(exp.category);
                    return (
                      <div
                        key={exp.id}
                        id={`expense-row-${exp.id}`}
                        className="flex items-center justify-between p-3.5 hover:bg-stone-50/60 dark:hover:bg-stone-950/40 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-xl ${colorClasses.lightBg} ${colorClasses.text} flex items-center justify-center shrink-0`}
                          >
                            <CategoryIcon name={exp.category} size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block truncate capitalize">
                              {exp.description || exp.category}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
                              <span className="capitalize">{exp.category}</span>
                              <span>•</span>
                              <span className="uppercase text-[10px] font-bold text-stone-600 dark:text-stone-300 px-1.5 py-0.2 bg-stone-100 dark:bg-stone-800 rounded">
                                {exp.paymentMethod}
                              </span>
                              {exp.time && <span>• {formatTime(exp.time)}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            {formatCurrency(exp.amount, preferences.currencySymbol, preferences.currency)}
                          </span>
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors opacity-80 group-hover:opacity-100"
                            title="Delete expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
