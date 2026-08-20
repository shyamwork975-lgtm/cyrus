import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          id="cyrus-global-toast"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none"
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-50 border-emerald-700/80 shadow-emerald-950/20'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-amber-50 border-amber-700/80 shadow-amber-950/20'
                : 'bg-stone-900/90 text-stone-50 border-stone-700/80 shadow-stone-950/20'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-sm font-medium leading-tight">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
