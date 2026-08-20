import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCheck, Clock, Trash2, Sparkles, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setNotificationsOpen,
    activeNotifications,
    dismissNotification,
    triggerSampleNotification,
    preferences,
    updatePreferences,
    showToast,
  } = useApp();

  const handleAction = (id: string, actionName: string) => {
    dismissNotification(id);
    showToast(`Marked as ${actionName}`, 'success');
  };

  return (
    <AnimatePresence>
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            id="notifications-modal"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="w-full sm:max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
          >
            {/* Mobile Sheet Handle */}
            <div className="sm:hidden w-full pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Reminders & Alerts
                  </h2>
                  <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                    {activeNotifications.length} active notifications
                  </span>
                </div>
              </div>

              <button
                onClick={() => setNotificationsOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {activeNotifications.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    All caught up!
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">
                    You have no pending reminder alerts right now.
                  </p>
                </div>
              ) : (
                activeNotifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    id={`notification-card-${notif.id}`}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                          {notif.title}
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-300 shrink-0">
                        {notif.time}
                      </span>
                    </div>

                    {/* Interactive Action Buttons (Done / Snooze) */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/50 dark:border-stone-800/60">
                      <button
                        onClick={() => handleAction(notif.id, 'Snoozed 15m')}
                        className="px-3.5 py-2 min-h-[40px] rounded-xl bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Snooze</span>
                      </button>

                      <button
                        onClick={() => handleAction(notif.id, 'Done')}
                        className="px-4 py-2 min-h-[40px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer with test simulator & preferences toggle */}
            <div className="p-4 bg-stone-50/80 dark:bg-stone-950/80 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <button
                onClick={triggerSampleNotification}
                className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline min-h-[40px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Push</span>
              </button>

              <label className="flex items-center gap-2 text-stone-600 dark:text-stone-400 cursor-pointer min-h-[40px]">
                <input
                  type="checkbox"
                  checked={preferences.notificationsEnabled}
                  onChange={(e) => updatePreferences({ notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Alerts</span>
              </label>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
