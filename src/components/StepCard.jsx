import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  Calendar,
  Edit2,
  Wand2,
  ChevronRight
} from 'lucide-react';

export default function StepCard({
  step,
  index,
  totalSteps,
  onUpdateStep,
  onDeleteStep,
  onMoveUp,
  onMoveDown,
  onRefineWithAI,
  isRefining,
  estimatedDateRange,
  isActiveStep = false,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  layoutSide = 'full' // 'left' | 'right' | 'full'
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [localCollapsed, setLocalCollapsed] = useState(false);

  const isCollapsed = typeof controlledCollapsed === 'boolean' ? controlledCollapsed : localCollapsed;
  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(step.id);
    } else {
      setLocalCollapsed((prev) => !prev);
    }
  };

  const completedTasksCount = step.tasks?.filter(t => t.completed)?.length || 0;
  const totalTasksCount = step.tasks?.length || 0;
  const stepPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const isAllCompleted = totalTasksCount > 0 && completedTasksCount === totalTasksCount;
  const formattedNumber = String(index + 1).padStart(2, '0');

  // Toggle task completion
  const handleToggleTask = (taskId) => {
    const updatedTasks = step.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateStep(step.id, { ...step, tasks: updatedTasks });
  };

  // Add new task
  const handleAddTask = (e) => {
    e?.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: `task-${step.id}-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false
    };
    onUpdateStep(step.id, {
      ...step,
      tasks: [...(step.tasks || []), newTask]
    });
    setNewTaskText('');
  };

  // Update existing task text
  const handleUpdateTaskText = (taskId, newText) => {
    const updatedTasks = step.tasks.map(t => 
      t.id === taskId ? { ...t, text: newText.trim() || t.text } : t
    );
    onUpdateStep(step.id, { ...step, tasks: updatedTasks });
    setEditingTaskId(null);
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    const updatedTasks = step.tasks.filter(t => t.id !== taskId);
    onUpdateStep(step.id, { ...step, tasks: updatedTasks });
  };

  // Dynamic card styling based on completion / active milestone state
  const cardSurfaceClass = isAllCompleted
    ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-300 shadow-soft'
    : isActiveStep
    ? 'bg-white border-pine-700/40 shadow-card ring-2 ring-emerald-400/25'
    : 'bg-white border-stone-200/80 shadow-soft hover:shadow-card hover:border-emerald-300/80';

  return (
    <div 
      className={`relative rounded-3xl transition-all duration-300 border ${cardSurfaceClass} p-4 sm:p-6`}
    >
      {/* Clipped Background Watermark Layer (keeps card menus/content never clipped) */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none" aria-hidden="true">
        <span
          className={`select-none font-display font-extrabold text-6xl sm:text-7xl leading-none absolute -top-1 right-4 transition-colors ${
            isAllCompleted
              ? 'text-emerald-500/10'
              : isActiveStep
              ? 'text-pine-900/[0.06]'
              : 'text-stone-900/[0.04]'
          }`}
        >
          {formattedNumber}
        </span>
      </div>

      {/* Top Meta Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Dynamic Status Badge */}
          {isAllCompleted ? (
            <span className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 bg-emerald-600 text-white shadow-sm">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Tuntas</span>
            </span>
          ) : isActiveStep ? (
            <span className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 bg-pine-900 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fokus Saat Ini</span>
            </span>
          ) : (
            <span className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold bg-surface-200 text-pine-900 border border-stone-200/60">
              Tahap {formattedNumber}
            </span>
          )}

          {/* Duration Badge (Inline Editable) */}
          {isEditingDuration ? (
            <input
              type="text"
              defaultValue={step.duration}
              autoFocus
              onBlur={(e) => {
                onUpdateStep(step.id, { ...step, duration: e.target.value.trim() || step.duration });
                setIsEditingDuration(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateStep(step.id, { ...step, duration: e.target.value.trim() || step.duration });
                  setIsEditingDuration(false);
                }
              }}
              className="text-xs px-2.5 py-0.5 rounded-full border border-pine-600 bg-white font-medium text-stone-800 w-28 outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingDuration(true)}
              className="whitespace-nowrap text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-100 hover:bg-emerald-50 text-stone-600 hover:text-pine-900 border border-stone-200/70 inline-flex items-center gap-1 transition-all"
              title="Klik untuk ubah durasi"
            >
              <Clock className="w-3 h-3 text-pine-700 shrink-0" />
              <span>{step.duration || '1 Minggu'}</span>
            </button>
          )}

          {/* Estimated Calendar Range */}
          {estimatedDateRange && (
            <span className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-stone-100/90 text-stone-600 inline-flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
              <span>{estimatedDateRange}</span>
            </span>
          )}
        </div>

        {/* Right Controls: Progress Pill + Reorder + Inline Assistant Toggle + Delete */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-1 sm:pt-0 border-t border-stone-100/80 sm:border-t-0">
          {/* Step Progress Percentage Pill */}
          <span
            className={`whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isAllCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : stepPercentage > 0
                ? 'bg-amber-100/80 text-amber-900'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            {stepPercentage}% selesai
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {/* Accessible Move Up */}
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Pindahkan langkah ke atas"
              aria-label="Pindahkan langkah ke atas"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Accessible Move Down */}
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === totalSteps - 1}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Pindahkan langkah ke bawah"
              aria-label="Pindahkan langkah ke bawah"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Step Assistant Inline Panel Toggle (zero overlap) */}
            <button
              type="button"
              onClick={() => setShowAiMenu((prev) => !prev)}
              aria-expanded={showAiMenu}
              className={`px-2.5 py-1.5 rounded-full transition-all inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap border ${
                showAiMenu
                  ? 'bg-pine-900 text-white border-pine-900 shadow-sm'
                  : 'bg-emerald-50/80 text-pine-800 border-emerald-200/80 hover:bg-emerald-100/80'
              }`}
              title="Opsi bantu sesuaikan langkah ini"
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${showAiMenu ? 'text-emerald-300' : 'text-emerald-600'}`} />
              <span>Bantu</span>
            </button>

            {/* Delete Step Button */}
            <button
              type="button"
              onClick={() => onDeleteStep(step.id, step.title)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="Hapus langkah ini"
              aria-label="Hapus langkah ini"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Inline Collapsible Assistant Panel (in-flow, never overlaps neighboring elements) */}
      {showAiMenu && (
        <div className="relative z-10 mb-4 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-pine-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sesuaikan Langkah Ini</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAiMenu(false)}
              className="text-[11px] font-semibold text-stone-500 hover:text-pine-900 px-2 py-0.5 rounded-full hover:bg-white transition-colors"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAiMenu(false);
                onRefineWithAI(step, 'expand');
              }}
              disabled={isRefining}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200/70 text-xs font-semibold text-pine-950 flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Pecah Lebih Detail</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAiMenu(false);
                onRefineWithAI(step, 'simplify');
              }}
              disabled={isRefining}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200/70 text-xs font-semibold text-pine-950 flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Sederhanakan Langkah</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAiMenu(false);
                onRefineWithAI(step, 'add_tasks');
              }}
              disabled={isRefining}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200/70 text-xs font-semibold text-pine-950 flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-pine-700 shrink-0" />
              <span>Tambah Tugas Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* Step Title (Inline Editable) */}
      <div className="relative z-10 mb-1.5 pr-8">
        {isEditingTitle ? (
          <input
            type="text"
            defaultValue={step.title}
            autoFocus
            onBlur={(e) => {
              onUpdateStep(step.id, { ...step, title: e.target.value.trim() || step.title });
              setIsEditingTitle(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdateStep(step.id, { ...step, title: e.target.value.trim() || step.title });
                setIsEditingTitle(false);
              }
            }}
            className="w-full font-display text-base sm:text-lg font-bold text-pine-950 px-2.5 py-1 border border-pine-600 rounded-xl outline-none bg-white"
          />
        ) : (
          <h3 
            onClick={() => setIsEditingTitle(true)}
            className="font-display text-base sm:text-lg font-bold text-pine-950 cursor-pointer hover:text-pine-800 transition-colors flex items-center gap-1.5 group"
            title="Klik untuk mengedit judul langkah"
          >
            <span>{step.title}</span>
            <Edit2 className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </h3>
        )}
      </div>

      {/* Step Description (Inline Editable) */}
      <div className="relative z-10 mb-3">
        {isEditingDesc ? (
          <textarea
            defaultValue={step.description}
            rows={2}
            autoFocus
            onBlur={(e) => {
              onUpdateStep(step.id, { ...step, description: e.target.value.trim() });
              setIsEditingDesc(false);
            }}
            className="w-full text-xs sm:text-sm text-stone-600 px-3 py-1.5 border border-pine-600 rounded-xl outline-none resize-none bg-white"
          />
        ) : (
          <p 
            onClick={() => setIsEditingDesc(true)}
            className="text-xs sm:text-sm text-stone-600 cursor-pointer hover:text-stone-800 leading-relaxed group flex items-start gap-1"
            title="Klik untuk mengedit deskripsi"
          >
            <span>{step.description || 'Klik untuk menambahkan deskripsi tujuan langkah ini...'}</span>
            <Edit2 className="w-3 h-3 text-stone-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
          </p>
        )}
      </div>

      {/* Mini Step Progress Bar */}
      <div className="relative z-10 mb-3">
        <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAllCompleted
                ? 'bg-emerald-500'
                : isActiveStep
                ? 'bg-gradient-to-r from-pine-800 to-emerald-500'
                : 'bg-pine-600'
            }`}
            style={{ width: `${stepPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Header + Collapse/Expand Toggle */}
      <div className="relative z-10 pt-2 border-t border-stone-100/90">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 hover:text-pine-900 transition-colors"
          >
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isCollapsed ? '' : 'rotate-90'
              }`}
            />
            <span>Daftar Tugas ({completedTasksCount}/{totalTasksCount})</span>
          </button>

          <button
            type="button"
            onClick={handleToggleCollapse}
            className="text-[11px] font-semibold text-pine-700 hover:text-pine-950"
          >
            {isCollapsed ? 'Tampilkan Tugas' : 'Lipat'}
          </button>
        </div>

        {/* Tactile Pill Row Checklist (matching reference UI pill option style) */}
        {!isCollapsed && (
          <div className="space-y-2">
            {step.tasks?.map((task) => {
              const isTaskEditing = editingTaskId === task.id;
              return (
                <div 
                  key={task.id}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border transition-all group ${
                    task.completed
                      ? 'bg-emerald-50/75 border-emerald-300/80 shadow-sm'
                      : 'bg-surface-50/70 hover:bg-white border-stone-200/80 hover:border-pine-300'
                  }`}
                >
                  {/* Task Text (Inline Editable) */}
                  <div className="flex-1 min-w-0">
                    {isTaskEditing ? (
                      <input
                        type="text"
                        defaultValue={task.text}
                        autoFocus
                        onBlur={(e) => handleUpdateTaskText(task.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateTaskText(task.id, e.target.value);
                        }}
                        className="w-full text-xs sm:text-sm px-2.5 py-1 border border-pine-600 rounded-xl outline-none bg-white"
                      />
                    ) : (
                      <p 
                        onClick={() => setEditingTaskId(task.id)}
                        className={`text-xs sm:text-sm cursor-pointer select-none leading-snug transition-all font-medium ${
                          task.completed 
                            ? 'line-through text-stone-400' 
                            : 'text-stone-800 hover:text-pine-950'
                        }`}
                        title="Klik untuk mengedit teks tugas"
                      >
                        {task.text}
                      </p>
                    )}
                  </div>

                  {/* Right Actions: Delete + Tactile Circular Check Indicator */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-65 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 text-stone-400 hover:text-rose-500 p-1 rounded-lg transition-opacity"
                      title="Hapus tugas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all custom-checkbox ${
                        task.completed 
                          ? 'bg-pine-900 text-white shadow-sm scale-105' 
                          : 'border-2 border-stone-300 hover:border-pine-600 bg-white'
                      }`}
                      aria-label={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add New Task Form */}
            <form onSubmit={handleAddTask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="+ Tambah tugas baru untuk tahap ini..."
                className="min-w-0 flex-1 px-3.5 py-2 text-xs rounded-2xl bg-surface-50 border border-stone-200/80 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-pine-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="shrink-0 whitespace-nowrap px-4 py-2 rounded-full bg-surface-200 hover:bg-pine-900 text-stone-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all btn-press"
              >
                Tambah
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
