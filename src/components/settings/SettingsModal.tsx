import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  DollarSign,
  Moon,
  Sun,
  Laptop,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    preferences,
    updatePreferences,
    resetToSampleData,
    clearAllUserData,
    exportDataJSON,
    importDataJSON,
    showToast,
  } = useApp();

  const [name, setName] = useState(preferences.name || '');
  const [currency, setCurrency] = useState(preferences.currency || 'INR');
  const [currencySymbol, setCurrencySymbol] = useState(preferences.currencySymbol || '₹');
  const [monthlyBudget, setMonthlyBudget] = useState(String(preferences.monthlyBudget || 25000));
  const [confirmClear, setConfirmClear] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      name: name.trim() || 'Friend',
      currency,
      currencySymbol,
      monthlyBudget: parseFloat(monthlyBudget) || 0,
    });
    setSettingsOpen(false);
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      AUD: 'A$',
      CAD: 'C$',
      AED: 'AED ',
    };
    setCurrencySymbol(symbols[curr] || '$');
  };

  const handleDownloadBackup = () => {
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyrus-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded safely', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSettingsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            id="settings-modal"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full sm:max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            {/* Mobile Sheet Handle */}
            <div className="sm:hidden w-full pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  ⚙
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Preferences & Settings
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                    Personalize your Cyrus companion.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSettingsOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              <form onSubmit={handleSavePreferences} className="space-y-4">
            {/* User Name */}
            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Your Name
              </label>
              <input
                id="settings-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Currency Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Currency
                </label>
                <select
                  id="settings-currency-select"
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                  <option value="GBP">£ GBP (British Pound)</option>
                  <option value="JPY">¥ JPY (Japanese Yen)</option>
                  <option value="AED">AED (UAE Dirham)</option>
                  <option value="CAD">C$ CAD (Canadian Dollar)</option>
                  <option value="AUD">A$ AUD (Australian Dollar)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Monthly Target Budget ({currencySymbol})
                </label>
                <input
                  id="settings-budget-input"
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="25000"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Theme Mode */}
            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
                Appearance & Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
                  { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
                  { id: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-stone-500" /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => updatePreferences({ theme: mode.id as ThemeMode })}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      preferences.theme === mode.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </form>

          {/* Backup & Restore Section */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Data Safety & Backups</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadBackup}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {/* Reset & Wipe Section */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <h3 className="font-bold text-stone-900 dark:text-stone-100">
              Reset & Templates
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  resetToSampleData();
                  setSettingsOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Starter Templates</span>
              </button>

              {!confirmClear ? (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      clearAllUserData();
                      setConfirmClear(false);
                      setSettingsOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold transition-all"
                  >
                    Confirm Wipe
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 text-stone-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
