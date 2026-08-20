import React from 'react';
import { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (priority === 'high') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        High
      </span>
    );
  }

  if (priority === 'medium') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Medium
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700 ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
      Low
    </span>
  );
};
