import React from 'react';
import { motion } from 'motion/react';
import { Home, CheckSquare, Plus, Receipt, Calendar, BarChart3, ListChecks } from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openQuickAdd, tasks } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const pendingCount = tasks.filter((t) => t.dueDate === today && !t.completed).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" />, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'checklists', label: 'Routines', icon: <ListChecks className="w-5 h-5" /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) for Mobile Quick Add */}
      <div className="md:hidden fixed bottom-[72px] right-4 z-40">
        <motion.button
          id="mobile-floating-add-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => openQuickAdd('smart')}
          className="flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 active:bg-emerald-700 text-white shadow-lg shadow-emerald-600/35 border-2 border-white/20 dark:border-stone-900/40"
          aria-label="Quick Add"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </motion.button>
      </div>

      {/* Bottom Navigation Bar with Blur and Safe Area Spacing */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl border-t border-stone-200/80 dark:border-stone-800/80 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-colors shadow-lg"
      >
        <div className="flex items-center justify-between h-14 px-2 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 min-h-[44px] text-[10px] transition-all active:scale-95 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
                }`}
              >
                <div className="relative p-0.5">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTabGlow"
                      className="absolute -inset-1 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className="tracking-tight mt-0.5">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeBottomTabDot"
                    className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

