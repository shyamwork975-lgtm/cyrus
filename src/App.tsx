import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeView } from './components/dashboard/HomeView';
import { TasksView } from './components/tasks/TasksView';
import { ChecklistsView } from './components/checklists/ChecklistsView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { InsightsView } from './components/insights/InsightsView';
import { CalendarView } from './components/calendar/CalendarView';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { Toast } from './components/common/Toast';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-8 max-w-6xl mx-auto w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'checklists' && <ChecklistsView />}
          {activeTab === 'expenses' && <ExpensesView />}
          {activeTab === 'insights' && <InsightsView />}
          {activeTab === 'calendar' && <CalendarView />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col md:flex-row font-sans transition-colors selection:bg-emerald-500 selection:text-white">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
          {/* Top Navbar */}
          <Navbar />

          {/* Active Screen View */}
          <MainContent />

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </div>

        {/* Global Modals & Sheets */}
        <QuickAddModal />
        <GlobalSearchModal />
        <NotificationsModal />
        <SettingsModal />

        {/* Global Toast */}
        <Toast />
      </div>
    </AppProvider>
  );
}

