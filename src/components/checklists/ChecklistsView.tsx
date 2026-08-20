import React, { useState } from 'react';
import {
  ListChecks,
  Plus,
  RotateCcw,
  Copy,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowUpRight,
  Sun,
  Briefcase,
  Plane,
  ShoppingBag,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Checklist } from '../../types';

export const ChecklistsView: React.FC = () => {
  const {
    checklists,
    addChecklist,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    resetChecklist,
    duplicateChecklist,
    deleteChecklist,
    exportChecklistToToday,
  } = useApp();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [newChecklistDesc, setNewChecklistDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sun');
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});

  const handleCreateChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistName.trim()) return;
    addChecklist(newChecklistName.trim(), newChecklistDesc.trim(), selectedIcon);
    setNewChecklistName('');
    setNewChecklistDesc('');
    setIsCreatingNew(false);
  };

  const handleAddItem = (checklistId: string) => {
    const title = newItemInputs[checklistId];
    if (!title || !title.trim()) return;
    addChecklistItem(checklistId, title.trim());
    setNewItemInputs((prev) => ({ ...prev, [checklistId]: '' }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Daily Routines & Checklists
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5">
            Routines and habits you can reset and reuse daily.
          </p>
        </div>

        <button
          id="create-checklist-btn"
          onClick={() => setIsCreatingNew(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all shrink-0 min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Routine</span>
        </button>
      </div>

      {/* New Checklist Creator Form */}
      {isCreatingNew && (
        <form
          onSubmit={handleCreateChecklist}
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-emerald-500/40 shadow-md space-y-3 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              Create New Routine
            </h3>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Routine Name *
              </label>
              <input
                id="new-checklist-name-input"
                type="text"
                placeholder="e.g., Morning Routine, Workout, Night Wind Down..."
                value={newChecklistName}
                onChange={(e) => setNewChecklistName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Description (Optional)
              </label>
              <input
                id="new-checklist-desc-input"
                type="text"
                placeholder="e.g., 5-step night relaxation"
                value={newChecklistDesc}
                onChange={(e) => setNewChecklistDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newChecklistName.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
            >
              Save Routine
            </button>
          </div>
        </form>
      )}

      {/* Checklists List */}
      {checklists.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800">
          <ListChecks className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            No routines yet
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">
            Create recurring templates for morning routines, workouts, or packing.
          </p>
          <button
            onClick={() => setIsCreatingNew(true)}
            className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
          >
            + Create First Routine
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {checklists.map((list) => {
            const completedCount = list.items.filter((i) => i.completed).length;
            const totalCount = list.items.length;
            const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={list.id}
                id={`checklist-card-${list.id}`}
                className="rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs p-3.5 sm:p-5 space-y-3"
              >
                {/* Header of Checklist */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate">
                        {list.name}
                      </h2>
                      <span className="px-2 py-0.2 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 shrink-0">
                        {percentage}%
                      </span>
                    </div>
                    {list.description && (
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium mt-0.5 truncate">
                        {list.description}
                      </p>
                    )}
                  </div>

                  {/* Actions: Reset, Send to Today, Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      id={`export-checklist-${list.id}`}
                      onClick={() => exportChecklistToToday(list.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold transition-colors active:scale-95"
                      title="Add to Today's Tasks"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      <span className="hidden xs:inline">To Today</span>
                    </button>

                    <button
                      id={`reset-checklist-${list.id}`}
                      onClick={() => resetChecklist(list.id)}
                      className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-colors"
                      title="Reset routine"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`delete-checklist-${list.id}`}
                      onClick={() => deleteChecklist(list.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 active:scale-95 transition-colors"
                      title="Delete routine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Checklist Items */}
                <div className="space-y-1.5">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      id={`checklist-item-${item.id}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/80 dark:bg-stone-950/40 border border-stone-200/50 dark:border-stone-800/60"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" onClick={() => toggleChecklistItem(list.id, item.id)}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChecklistItem(list.id, item.id);
                          }}
                          className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            item.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <span
                          className={`text-xs font-medium truncate ${
                            item.completed
                              ? 'line-through text-stone-600 dark:text-stone-300'
                              : 'text-stone-900 dark:text-stone-100'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      <button
                        onClick={() => removeChecklistItem(list.id, item.id)}
                        className="p-1 text-stone-400 hover:text-rose-500 rounded transition-colors active:scale-90"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Inline Add Item Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddItem(list.id);
                  }}
                  className="flex items-center gap-2 pt-0.5"
                >
                  <input
                    type="text"
                    placeholder="+ Add step (e.g. Brush teeth)..."
                    value={newItemInputs[list.id] || ''}
                    onChange={(e) =>
                      setNewItemInputs((prev) => ({ ...prev, [list.id]: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!newItemInputs[list.id]?.trim()}
                    className="px-3 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 disabled:opacity-40 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
