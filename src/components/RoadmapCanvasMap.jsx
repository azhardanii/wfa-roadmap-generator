import React from 'react';
import StepCard from './StepCard';
import {
  Check,
  Clock,
  Flag,
  Play,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Sparkles,
  Calendar
} from 'lucide-react';

/**
 * Circular SVG progress ring used on milestone nodes
 */
function MiniProgressRing({ percentage, isCompleted, isActive, size = 38 }) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={isActive ? 'text-emerald-200/40' : 'text-stone-200'}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`transition-all duration-500 ${
          isCompleted
            ? 'text-emerald-500'
            : isActive
            ? 'text-emerald-400'
            : 'text-pine-700'
        }`}
      />
    </svg>
  );
}

export default function RoadmapCanvasMap({
  mode = 'snake', // 'snake' | 'focus'
  roadmap,
  activeStepId,
  onSelectStep,
  onUpdateStep,
  onMoveUp,
  onMoveDown,
  onRefineWithAI,
  isRefining,
  onDeleteStep,
  computeStepDateRange
}) {
  const steps = roadmap?.steps || [];

  // Determine active step index (fallback to first incomplete or 0)
  const firstIncompleteIdx = steps.findIndex(
    (s) => (s.tasks?.length || 0) > 0 && s.tasks.some((t) => !t.completed)
  );
  const resolvedActiveIdx = (() => {
    const byId = steps.findIndex((s) => s.id === activeStepId);
    if (byId >= 0) return byId;
    return firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0;
  })();

  const activeStep = steps[resolvedActiveIdx] || steps[0];

  if (steps.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-10 text-center text-sm text-stone-500">
        Belum ada langkah pada roadmap ini. Tambahkan langkah baru untuk memvisualisasikan peta.
      </div>
    );
  }

  // ==================== MODE FOKUS (STEPPER + FOCUS DECK) ====================
  if (mode === 'focus') {
    const canPrev = resolvedActiveIdx > 0;
    const canNext = resolvedActiveIdx < steps.length - 1;

    return (
      <div className="space-y-5">
        {/* Horizontal Stepper Rail inspired by modern onboarding / weekly plan UI */}
        <div className="bg-gradient-to-br from-pine-950 via-pine-900 to-pine-800 rounded-3xl p-4 sm:p-5 text-white shadow-card border border-emerald-500/20">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Urutan Tahap ({resolvedActiveIdx + 1} dari {steps.length})</span>
            </span>
            <span className="text-[11px] text-emerald-100/75">
              Ketuk tahap untuk berpindah fokus
            </span>
          </div>

          <div className="flex items-stretch gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
            {steps.map((step, idx) => {
              const total = step.tasks?.length || 0;
              const done = step.tasks?.filter((t) => t.completed).length || 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const isDone = total > 0 && done === total;
              const isCurrent = idx === resolvedActiveIdx;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => onSelectStep(step.id)}
                    className={`group shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all btn-press text-left min-w-[175px] max-w-[235px] ${
                      isCurrent
                        ? 'bg-white text-pine-950 border-white shadow-float'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-50 border-emerald-400/40 hover:bg-emerald-500/30'
                        : 'bg-white/10 text-emerald-50 border-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className="relative flex items-center justify-center shrink-0">
                      <MiniProgressRing
                        percentage={pct}
                        isCompleted={isDone}
                        isActive={isCurrent}
                        size={34}
                      />
                      <span
                        className={`absolute text-[10px] font-extrabold font-display flex items-center justify-center ${
                          isCurrent
                            ? 'text-pine-950'
                            : isDone
                            ? 'text-emerald-200'
                            : 'text-white'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isCurrent ? 'text-emerald-700' : 'text-emerald-300/80'
                        }`}
                      >
                        {step.duration || '1 Minggu'}
                      </div>
                      <div className="text-xs font-bold leading-snug mt-0.5">{step.title}</div>
                    </div>
                  </button>

                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-emerald-300/40 shrink-0 self-center" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active Step Focus Deck */}
        {activeStep && (
          <div>
            <StepCard
              step={activeStep}
              index={resolvedActiveIdx}
              totalSteps={steps.length}
              onUpdateStep={onUpdateStep}
              onDeleteStep={onDeleteStep}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onRefineWithAI={onRefineWithAI}
              isRefining={isRefining}
              estimatedDateRange={computeStepDateRange?.(resolvedActiveIdx)}
              isActiveStep={true}
              isCollapsed={false}
            />

            {/* Prev / Next Navigation Footer */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => canPrev && onSelectStep(steps[resolvedActiveIdx - 1].id)}
                disabled={!canPrev}
                className="whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-pine-900 disabled:opacity-40 disabled:pointer-events-none transition-all btn-press shadow-soft"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="sm:hidden">Sebelumnya</span>
                <span className="hidden sm:inline">Langkah Sebelumnya</span>
              </button>

              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                {resolvedActiveIdx + 1} / {steps.length}
              </span>

              <button
                type="button"
                onClick={() => canNext && onSelectStep(steps[resolvedActiveIdx + 1].id)}
                disabled={!canNext}
                className="whitespace-nowrap inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-pine-900 hover:bg-pine-800 text-white text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition-all btn-press shadow-soft"
              >
                <span className="sm:hidden">Berikutnya</span>
                <span className="hidden sm:inline">Langkah Berikutnya</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== MODE PETA S-CURVE (SNAKE BOARD) ====================
  // Chunk steps into rows of 3 for desktop S-Curve winding path
  const CHUNK_SIZE = 3;
  const rows = [];
  for (let i = 0; i < steps.length; i += CHUNK_SIZE) {
    rows.push({
      rowIndex: rows.length,
      items: steps.slice(i, i + CHUNK_SIZE).map((step, localIdx) => ({
        step,
        globalIndex: i + localIdx
      }))
    });
  }

  return (
    <div className="space-y-6">
      {/* Interactive Topology Canvas Board */}
      <div className="relative rounded-3xl border border-emerald-950/10 bg-white/95 roadmap-grid-bg p-4 sm:p-6 md:p-8 shadow-card overflow-hidden">
        {/* Soft decorative ambient blobs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-teal-200/25 blur-3xl pointer-events-none" />

        {/* Board Top Legend Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200/70">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-900 text-white text-[11px] font-bold shadow-soft">
              <Play className="w-3 h-3 fill-emerald-300 text-emerald-300" />
              <span>Mulai</span>
            </span>
            <span className="text-xs font-medium text-stone-600 leading-relaxed">
              Ketuk tahap mana pun untuk membuka detail dan menandai tugasnya
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Selesai
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pine-900 ring-2 ring-emerald-300" />
              Dipilih
            </span>
          </div>
        </div>

        {/* S-Curve Rows */}
        <div className="relative z-10 space-y-5">
          {rows.map((row) => {
            const isOddRow = row.rowIndex % 2 === 1;
            const hasNextRow = row.rowIndex < rows.length - 1;

            return (
              <div key={row.rowIndex} className="relative">
                {/* Desktop S-Curve Row (reverses direction on odd rows) */}
                <div
                  className={`flex flex-col md:flex-row items-stretch gap-3 md:gap-2 ${
                    isOddRow ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  {row.items.map(({ step, globalIndex }, localIdx) => {
                    const totalTasks = step.tasks?.length || 0;
                    const doneTasks = step.tasks?.filter((t) => t.completed).length || 0;
                    const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
                    const isDone = totalTasks > 0 && doneTasks === totalTasks;
                    const isSelected = activeStep?.id === step.id;
                    const isLastInRow = localIdx === row.items.length - 1;
                    const dateRange = computeStepDateRange?.(globalIndex);

                    return (
                      <React.Fragment key={step.id}>
                        {/* Node Card */}
                        <button
                          type="button"
                          onClick={() => onSelectStep(step.id)}
                          className={`group relative flex-1 text-left rounded-2xl p-4 border transition-all duration-200 btn-press flex flex-col justify-between min-h-[144px] ${
                            isSelected
                              ? 'bg-gradient-to-br from-pine-900 via-pine-800 to-pine-950 text-white border-pine-900 shadow-float ring-4 ring-emerald-400/30 -translate-y-0.5'
                              : isDone
                              ? 'bg-gradient-to-br from-emerald-50 to-white text-pine-950 border-emerald-300 shadow-soft hover:shadow-card'
                              : 'bg-white text-pine-950 border-stone-200/90 shadow-soft hover:border-emerald-400 hover:shadow-card'
                          }`}
                        >
                          {/* Subtle big number watermark */}
                          <span
                            className={`absolute top-2.5 right-3.5 font-display text-3xl font-extrabold leading-none pointer-events-none select-none ${
                              isSelected
                                ? 'text-white/10'
                                : isDone
                                ? 'text-emerald-600/15'
                                : 'text-stone-900/[0.05]'
                            }`}
                          >
                            {String(globalIndex + 1).padStart(2, '0')}
                          </span>

                          <div>
                            <div className="flex items-center gap-2.5 mb-2.5">
                              {/* Circular ring + index */}
                              <div className="relative flex items-center justify-center">
                                <MiniProgressRing
                                  percentage={pct}
                                  isCompleted={isDone}
                                  isActive={isSelected}
                                  size={36}
                                />
                                <span
                                  className={`absolute text-[10px] font-extrabold font-display flex items-center justify-center ${
                                    isSelected
                                      ? 'text-white'
                                      : isDone
                                      ? 'text-emerald-700'
                                      : 'text-pine-900'
                                  }`}
                                >
                                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : String(globalIndex + 1).padStart(2, '0')}
                                </span>
                              </div>

                              <div className="min-w-0">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    isSelected
                                      ? 'bg-white/15 text-emerald-200'
                                      : isDone
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-surface-100 text-stone-600'
                                  }`}
                                >
                                  <Clock className="w-2.5 h-2.5 shrink-0" />
                                  <span>{step.duration || '1 Minggu'}</span>
                                </span>
                                {dateRange && (
                                  <div
                                    className={`text-[10px] mt-0.5 flex items-center gap-1 ${
                                      isSelected ? 'text-emerald-100/70' : 'text-stone-400'
                                    }`}
                                  >
                                    <Calendar className="w-2.5 h-2.5 shrink-0" />
                                    <span>{dateRange}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <h3 className="font-display font-bold text-sm leading-snug pr-4 mb-1.5">
                              {step.title}
                            </h3>
                          </div>

                          {/* Bottom Progress Mini Strip */}
                          <div className="pt-2.5 mt-1 border-t border-current/10 flex items-center justify-between gap-2 text-[11px]">
                            <span
                              className={
                                isSelected
                                  ? 'text-emerald-200 font-medium'
                                  : isDone
                                  ? 'text-emerald-700 font-semibold'
                                  : 'text-stone-500'
                              }
                            >
                              {doneTasks}/{totalTasks} aksi
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isSelected
                                  ? 'bg-emerald-400 text-pine-950'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {pct}%
                            </span>
                          </div>
                        </button>

                        {/* Horizontal Connector between cards in the same row */}
                        {!isLastInRow && (
                          <div className="flex items-center justify-center py-0.5 md:py-0 md:px-0.5 shrink-0">
                            {/* Mobile down arrow */}
                            <div className="md:hidden w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </div>
                            {/* Desktop curved/flowing connector */}
                            <div className="hidden md:flex items-center">
                              <svg
                                width="32"
                                height="24"
                                viewBox="0 0 32 24"
                                className={isDone ? 'text-emerald-500' : 'text-pine-400/70'}
                              >
                                <path
                                  d={isOddRow ? 'M30 12 L4 12' : 'M2 12 L28 12'}
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  className={isDone ? '' : 'roadmap-path-animated'}
                                />
                                <path
                                  d={isOddRow ? 'M9 7 L3 12 L9 17' : 'M23 7 L29 12 L23 17'}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* Spacer when last odd row has fewer than 3 items so vertical U-turn stays aligned */}
                  {row.items.length < CHUNK_SIZE &&
                    Array.from({ length: CHUNK_SIZE - row.items.length }).map((_, emptyIdx) => (
                      <div key={`empty-${emptyIdx}`} className="hidden md:block flex-1" />
                    ))}
                </div>

                {/* Vertical U-Turn Connector to Next Row */}
                {hasNextRow && (
                  <div
                    className={`flex items-center py-2 ${
                      isOddRow ? 'justify-center md:justify-start md:pl-[14%]' : 'justify-center md:justify-end md:pr-[14%]'
                    }`}
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-bold shadow-sm">
                      <ArrowDown className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                      <span>Lanjut ke Baris {row.rowIndex + 2}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Finish Line Monument Strip at Bottom of Snake Board */}
        <div className="relative z-10 mt-6 pt-5 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/80 via-surface-50 to-emerald-50/80 rounded-2xl p-4 border border-emerald-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pine-900 text-amber-300 flex items-center justify-center shadow-soft shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Garis Finish Target
              </div>
              <div className="text-xs sm:text-sm font-bold text-pine-950">
                {roadmap.finishLine || roadmap.title}
              </div>
            </div>
          </div>
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-pine-900 text-[11px] font-bold shrink-0">
            <Flag className="w-3 h-3 text-emerald-600" />
            <span>{steps.length} Tahap</span>
          </span>
        </div>
      </div>

      {/* Step Inspector Panel for Selected Stage */}
      {activeStep && (
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pine-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Detail Tahap #{resolvedActiveIdx + 1}</span>
            </span>
            <span className="text-[11px] text-stone-500">
              Ketuk teks untuk mengedit atau tandai tugas selesai
            </span>
          </div>

          <StepCard
            step={activeStep}
            index={resolvedActiveIdx}
            totalSteps={steps.length}
            onUpdateStep={onUpdateStep}
            onDeleteStep={onDeleteStep}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRefineWithAI={onRefineWithAI}
            isRefining={isRefining}
            estimatedDateRange={computeStepDateRange?.(resolvedActiveIdx)}
            isActiveStep={true}
            isCollapsed={false}
          />
        </div>
      )}
    </div>
  );
}

