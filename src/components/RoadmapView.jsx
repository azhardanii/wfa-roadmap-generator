import React, { useState, useEffect } from 'react';
import StepCard from './StepCard';
import RoadmapCanvasMap from './RoadmapCanvasMap';
import OrbVisual from './OrbVisual';
import confetti from 'canvas-confetti';
import { 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Plus, 
  Calendar, 
  Edit3, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Map,
  GitBranch,
  Target,
  Flag,
  Trophy,
  Play,
  ChevronsDownUp,
  ChevronsUpDown
} from 'lucide-react';
import { formatRoadmapAsMarkdown } from '../services/exportImage';

export default function RoadmapView({
  roadmap,
  onUpdateRoadmap,
  onOpenExportModal,
  onBackToForm,
  onRefineStep,
  isRefining,
  onRequestDeleteStep
}) {
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [title, setTitle] = useState(roadmap.title || '');
  const [summary, setSummary] = useState(roadmap.summary || '');
  const [copiedMd, setCopiedMd] = useState(false);
  const [visualMode, setVisualMode] = useState('timeline'); // 'timeline' | 'snake' | 'focus'
  const [activeStepId, setActiveStepId] = useState(null);
  const [collapsedMap, setCollapsedMap] = useState({});
  const [allCollapsed, setAllCollapsed] = useState(false);

  // Sync local edit state when switching roadmaps
  useEffect(() => {
    setTitle(roadmap.title || '');
    setSummary(roadmap.summary || '');
    setIsEditingHeader(false);
    setCollapsedMap({});
    setAllCollapsed(false);
  }, [roadmap.id, roadmap.title, roadmap.summary]);

  // Calculate overall stats
  const steps = roadmap.steps || [];
  const totalSteps = steps.length;
  const allTasks = steps.flatMap(s => s.tasks || []);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedStepsCount = steps.filter(s => {
    const t = s.tasks || [];
    return t.length > 0 && t.every(item => item.completed);
  }).length;

  // Determine the current focus step (first step with incomplete tasks)
  const firstIncompleteStep = steps.find(s => (s.tasks || []).some(t => !t.completed));
  const currentFocusStepId = firstIncompleteStep?.id || steps[steps.length - 1]?.id || null;

  // Trigger celebration confetti on 100% completion
  useEffect(() => {
    if (progressPercentage === 100 && totalTasks > 0) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#2A7058', '#5FA88E', '#C2DFD2', '#FFD166']
      });
    }
  }, [progressPercentage, totalTasks]);

  // Update step
  const handleUpdateStep = (stepId, updatedStep) => {
    const updatedSteps = steps.map(s => s.id === stepId ? updatedStep : s);
    onUpdateRoadmap({
      ...roadmap,
      steps: updatedSteps,
      updatedAt: new Date().toISOString()
    });
  };

  // Add new step
  const handleAddNewStep = () => {
    const newStepNumber = totalSteps + 1;
    const newStep = {
      id: `step-${Date.now()}`,
      title: `Tahap ${newStepNumber}: Milestone Baru`,
      duration: '1 Minggu',
      description: 'Deskripsikan tujuan dan target tindakan dari tahap ini.',
      tasks: [
        { id: `task-${Date.now()}-1`, text: 'Tentukan target spesifik dan sumber daya yang dibutuhkan', completed: false },
        { id: `task-${Date.now()}-2`, text: 'Mulai eksekusi tugas utama tahap ini', completed: false }
      ]
    };
    onUpdateRoadmap({
      ...roadmap,
      steps: [...steps, newStep],
      updatedAt: new Date().toISOString()
    });
    setActiveStepId(newStep.id);
  };

  // Move step up
  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index - 1];
    newSteps[index - 1] = temp;
    onUpdateRoadmap({ ...roadmap, steps: newSteps, updatedAt: new Date().toISOString() });
  };

  // Move step down
  const handleMoveDown = (index) => {
    if (index >= totalSteps - 1) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    onUpdateRoadmap({ ...roadmap, steps: newSteps, updatedAt: new Date().toISOString() });
  };

  // Save title and summary inline edit
  const handleSaveHeader = () => {
    onUpdateRoadmap({
      ...roadmap,
      title: title.trim() || roadmap.title,
      summary: summary.trim() || roadmap.summary,
      updatedAt: new Date().toISOString()
    });
    setIsEditingHeader(false);
  };

  // Copy Markdown
  const handleCopyMarkdown = async () => {
    try {
      const md = formatRoadmapAsMarkdown(roadmap);
      await navigator.clipboard.writeText(md);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (e) {
      console.error('Failed to copy markdown:', e);
    }
  };

  // Toggle collapse single step
  const handleToggleCollapseStep = (stepId) => {
    setCollapsedMap(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // Toggle collapse all steps
  const handleToggleCollapseAll = () => {
    const nextState = !allCollapsed;
    const updatedMap = {};
    steps.forEach(s => {
      updatedMap[s.id] = nextState;
    });
    setCollapsedMap(updatedMap);
    setAllCollapsed(nextState);
  };

  // Compute estimated calendar ranges per step based on roadmap.startDate
  const computeStepDateRange = (stepIndex) => {
    if (!roadmap.startDate) return null;
    try {
      const start = new Date(roadmap.startDate);
      if (Number.isNaN(start.getTime())) return null;

      let cumulativeDays = 0;
      for (let i = 0; i < stepIndex; i++) {
        const dStr = (steps[i]?.duration || '').toLowerCase();
        if (dStr.includes('hari')) {
          cumulativeDays += parseInt(dStr, 10) || 3;
        } else if (dStr.includes('minggu') || dStr.includes('week')) {
          cumulativeDays += (parseInt(dStr, 10) || 1) * 7;
        } else if (dStr.includes('bulan') || dStr.includes('month')) {
          cumulativeDays += (parseInt(dStr, 10) || 1) * 30;
        } else {
          cumulativeDays += 7;
        }
      }

      const stepStart = new Date(start.getTime() + cumulativeDays * 24 * 60 * 60 * 1000);
      const curDur = (steps[stepIndex]?.duration || '').toLowerCase();
      let stepDays = 7;
      if (curDur.includes('hari')) stepDays = parseInt(curDur, 10) || 3;
      else if (curDur.includes('minggu') || curDur.includes('week')) stepDays = (parseInt(curDur, 10) || 1) * 7;
      else if (curDur.includes('bulan') || curDur.includes('month')) stepDays = (parseInt(curDur, 10) || 1) * 30;

      const stepEnd = new Date(stepStart.getTime() + stepDays * 24 * 60 * 60 * 1000);
      const formatD = (d) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return `${formatD(stepStart)} s/d ${formatD(stepEnd)}`;
    } catch (e) {
      return null;
    }
  };

  // Circular progress ring dimensions for Hero Mission Control
  const heroRingSize = 104;
  const heroStroke = 8;
  const heroRadius = (heroRingSize - heroStroke) / 2;
  const heroCircumference = 2 * Math.PI * heroRadius;
  const heroOffset = heroCircumference - (progressPercentage / 100) * heroCircumference;

  return (
    <div className="w-full max-w-6xl mx-auto pb-16">
      {/* Top Back / Auto-Save Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <button
          type="button"
          onClick={onBackToForm}
          className="whitespace-nowrap inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-pine-900 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 hover:bg-emerald-50 transition-all btn-press shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>Buat Rencana Baru</span>
        </button>

        <div className="whitespace-nowrap flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/70 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] text-stone-500 font-medium">
            Tersimpan otomatis
          </span>
        </div>
      </div>

      {/* HERO MISSION CONTROL BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pine-950 via-pine-900 to-pine-800 text-white p-5 sm:p-7 md:p-8 shadow-float mb-6 border border-emerald-500/20">
        {/* Ambient glows & subtle dot texture */}
        <div className="absolute inset-0 roadmap-grid-bg-dark opacity-30 pointer-events-none" />
        <div className="absolute -top-24 right-10 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Orb + Editable Title/Summary + Goal->Finish Flow */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="whitespace-nowrap inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-[11px] font-bold text-emerald-200">
                <OrbVisual size="sm" className="scale-[0.42] -my-4 -ml-2" />
                <span>Peta Perjalananmu</span>
              </div>

              <div className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] text-emerald-100">
                <Calendar className="w-3 h-3 text-emerald-300 shrink-0" />
                <span>Mulai:</span>
                <input
                  type="date"
                  value={roadmap.startDate || ''}
                  onChange={(e) => onUpdateRoadmap({ ...roadmap, startDate: e.target.value })}
                  className="bg-transparent text-white font-semibold outline-none cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            {isEditingHeader ? (
              <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                    Judul Roadmap
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full font-display text-xl sm:text-2xl font-extrabold text-white bg-white/10 px-3 py-2 border border-emerald-400/50 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                    Ringkasan Strategi
                  </label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full text-xs sm:text-sm text-emerald-50 bg-white/10 px-3 py-2 border border-emerald-400/50 rounded-xl outline-none resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveHeader}
                    className="px-4 py-1.5 rounded-full bg-emerald-500 text-pine-950 text-xs font-bold hover:bg-emerald-400 transition-all btn-press"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle(roadmap.title);
                      setSummary(roadmap.summary);
                      setIsEditingHeader(false);
                    }}
                    className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-2.5 mb-2">
                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {roadmap.title}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setIsEditingHeader(true)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-all shrink-0 mt-1"
                    title="Edit judul dan ringkasan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-2xl mb-4">
                  {roadmap.summary}
                </p>
              </div>
            )}

            {/* Journey Goal -> Finish Line Pill Bar */}
            {(roadmap.goal || roadmap.finishLine) && (
              <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-3 p-3.5 rounded-2xl bg-black/20 border border-white/10 text-xs">
                {roadmap.goal && (
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase shrink-0 mt-0.5">
                      Tujuan
                    </span>
                    <span className="text-emerald-50/95 leading-relaxed">{roadmap.goal}</span>
                  </div>
                )}
                {roadmap.goal && roadmap.finishLine && (
                  <ArrowRight className="hidden sm:block w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                )}
                {roadmap.finishLine && (
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase shrink-0 mt-0.5">
                      Finish
                    </span>
                    <span className="text-white font-semibold leading-relaxed">{roadmap.finishLine}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Circular Progress Hub + Primary Studio CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:justify-between lg:items-end gap-4 bg-white/[0.07] border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-md shrink-0 lg:min-w-[270px]">
            <div className="flex items-center gap-4 w-full sm:w-auto lg:w-full justify-between">
              <div className="relative flex items-center justify-center shrink-0">
                <svg width={heroRingSize} height={heroRingSize} className="-rotate-90">
                  <circle
                    cx={heroRingSize / 2}
                    cy={heroRingSize / 2}
                    r={heroRadius}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={heroStroke}
                  />
                  <circle
                    cx={heroRingSize / 2}
                    cy={heroRingSize / 2}
                    r={heroRadius}
                    fill="transparent"
                    stroke="#6EE7B7"
                    strokeWidth={heroStroke}
                    strokeDasharray={heroCircumference}
                    strokeDashoffset={heroOffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-display text-2xl font-extrabold text-white leading-none">
                    {progressPercentage}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-200/80 font-bold mt-0.5">
                    Progres
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div>
                  <div className="text-lg font-extrabold font-display text-white leading-tight">
                    {completedStepsCount} / {totalSteps}
                  </div>
                  <div className="text-[11px] text-emerald-200/80">Langkah Tuntas</div>
                </div>
                <div className="pt-1 border-t border-white/10">
                  <div className="text-xs font-bold text-emerald-300">
                    {completedTasks} dari {totalTasks} tugas
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
              <button
                type="button"
                onClick={onOpenExportModal}
                className="w-full px-5 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-pine-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow transition-all btn-press whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Pratinjau & Unduh Gambar</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="w-full px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all btn-press whitespace-nowrap"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>{copiedMd ? 'Tersalin!' : 'Salin Ringkasan Teks'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW SWITCHER & QUICK CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-white p-2.5 sm:p-3 rounded-3xl border border-stone-200/80 shadow-soft">
        {/* 3 Interactive Visualization Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-surface-100 p-1 rounded-2xl border border-stone-200/60">
          {[
            { id: 'timeline', label: 'Jalur Langkah', icon: Map },
            { id: 'snake', label: 'Peta Alur', icon: GitBranch },
            { id: 'focus', label: 'Mode Fokus', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = visualMode === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setVisualMode(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all btn-press ${
                  isActive
                    ? 'bg-pine-900 text-white shadow-soft'
                    : 'text-stone-600 hover:text-pine-950 hover:bg-white/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 px-1">
          {visualMode === 'timeline' && (
            <button
              type="button"
              onClick={handleToggleCollapseAll}
              className="whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-100 hover:bg-stone-200/70 text-stone-700 text-xs font-semibold transition-all btn-press"
            >
              {allCollapsed ? (
                <>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-pine-700 shrink-0" />
                  <span>Buka Semua Tugas</span>
                </>
              ) : (
                <>
                  <ChevronsDownUp className="w-3.5 h-3.5 text-pine-700 shrink-0" />
                  <span>Lipat Semua Tugas</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleAddNewStep}
            className="whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-pine-900 border border-emerald-200/80 text-xs font-bold transition-all btn-press ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Tambah Langkah</span>
          </button>
        </div>
      </div>

      {/* VISUALIZATION CONTENT BASED ON ACTIVE TAB */}
      {visualMode === 'snake' || visualMode === 'focus' ? (
        <RoadmapCanvasMap
          mode={visualMode}
          roadmap={roadmap}
          activeStepId={activeStepId || currentFocusStepId}
          onSelectStep={(id) => setActiveStepId(id)}
          onUpdateStep={handleUpdateStep}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRefineWithAI={onRefineStep}
          isRefining={isRefining}
          onDeleteStep={onRequestDeleteStep}
          computeStepDateRange={computeStepDateRange}
        />
      ) : (
        /* DEFAULT MODE: WINDING TIMELINE MAP (ZIG-ZAG CENTER SPINE) */
        <div className="relative pt-2">
          {/* START POINT NODE */}
          <div className="relative z-10 flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-pine-900 text-white shadow-card border-2 border-emerald-400/50">
              <div className="w-6 h-6 rounded-full bg-emerald-400 text-pine-950 flex items-center justify-center shrink-0">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-widest text-emerald-300 font-bold leading-none">
                  Garis Mulai
                </div>
                <div className="text-xs font-bold leading-tight whitespace-nowrap">
                  {roadmap.startDate
                    ? new Date(roadmap.startDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Mulai Hari Ini'}
                </div>
              </div>
            </div>
          </div>

          {/* TIMELINE TRACK & MILESTONE ROWS */}
          <div className="relative">
            {/* Base Spine Track Line (Centered on both Mobile and Desktop so cards keep full 100% width on mobile) */}
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 lg:w-1.5 rounded-full bg-stone-200/80 overflow-hidden"
            >
              {/* Active Animated Progress Fill along the Spine */}
              <div
                className="w-full rounded-full bg-gradient-to-b from-emerald-500 via-teal-400 to-pine-700 transition-all duration-700 ease-out"
                style={{ height: `${progressPercentage}%` }}
              />
            </div>

            <div className="space-y-6 lg:space-y-8 relative z-10">
              {steps.map((step, index) => {
                const isEvenIndex = index % 2 === 0; // Left side on desktop, odd on right side
                const totalT = step.tasks?.length || 0;
                const doneT = step.tasks?.filter(t => t.completed).length || 0;
                const pct = totalT > 0 ? Math.round((doneT / totalT) * 100) : 0;
                const isDone = totalT > 0 && doneT === totalT;
                const isFocus = step.id === currentFocusStepId && !isDone;
                const dateRange = computeStepDateRange(index);

                // Circular SVG ring on timeline hub
                const nodeSize = 52;
                const nodeStroke = 4;
                const nodeRadius = (nodeSize - nodeStroke) / 2;
                const nodeCirc = 2 * Math.PI * nodeRadius;
                const nodeOffset = nodeCirc - (pct / 100) * nodeCirc;

                return (
                  <div key={step.id} className="relative flex flex-col lg:flex-row lg:items-center">
                    {/* MOBILE COMPACT INLINE HUB (above full-width card, zero overlap) */}
                    <div className="flex lg:hidden items-center justify-center mb-2.5">
                      <div
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-soft border transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : isFocus
                            ? 'bg-pine-900 text-white border-emerald-400/60 ring-4 ring-emerald-400/20'
                            : 'bg-white text-pine-950 border-stone-200'
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="font-display">{String(index + 1).padStart(2, '0')}</span>
                        )}
                        <span className="text-[11px] font-semibold opacity-90">
                          {isDone ? 'Selesai' : isFocus ? 'Fokus Saat Ini' : `Tahap ${index + 1}`}
                        </span>
                      </div>
                    </div>

                    {/* DESKTOP (lg+): Zig-Zag alternating Left / Right; MOBILE: Full Width Card */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-20 items-start relative">
                      {/* Left Column (Desktop: holds even index cards; Mobile: full width if even) */}
                      <div className={`${isEvenIndex ? 'block' : 'hidden lg:block'}`}>
                        {isEvenIndex ? (
                          <div className="relative">
                            {/* Desktop Horizontal Branch Connector to Center Hub */}
                            <div
                              aria-hidden="true"
                              className={`hidden lg:block absolute top-10 -right-10 w-10 h-0.5 ${
                                isDone
                                  ? 'bg-emerald-500'
                                  : isFocus
                                  ? 'bg-pine-700'
                                  : 'bg-stone-300'
                              }`}
                            />
                            <StepCard
                              step={step}
                              index={index}
                              totalSteps={totalSteps}
                              onUpdateStep={handleUpdateStep}
                              onDeleteStep={onRequestDeleteStep}
                              onMoveUp={handleMoveUp}
                              onMoveDown={handleMoveDown}
                              onRefineWithAI={onRefineStep}
                              isRefining={isRefining}
                              estimatedDateRange={dateRange}
                              isActiveStep={isFocus}
                              isCollapsed={Boolean(collapsedMap[step.id])}
                              onToggleCollapse={handleToggleCollapseStep}
                              layoutSide="left"
                            />
                          </div>
                        ) : (
                          /* Subtle date/duration milestone marker on opposite side */
                          <div className="hidden lg:flex flex-col items-end justify-center pt-7 pr-6 text-right opacity-80">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200/80 text-xs font-bold text-pine-900 shadow-sm mb-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{step.duration || '1 Minggu'}</span>
                            </span>
                            {dateRange && (
                              <span className="text-xs text-stone-500 font-medium">{dateRange}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* DESKTOP MILESTONE NODE HUB ON SPINE */}
                      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-4 z-20 flex-col items-center">
                        <div
                          className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-card transition-all duration-300 ${
                            isDone
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                              : isFocus
                              ? 'bg-pine-900 text-white ring-4 ring-emerald-400/40 scale-110'
                              : 'bg-white text-pine-950 border border-stone-200'
                          }`}
                        >
                          <svg width={nodeSize} height={nodeSize} className="absolute inset-0 -rotate-90">
                            <circle
                              cx={nodeSize / 2}
                              cy={nodeSize / 2}
                              r={nodeRadius}
                              fill="transparent"
                              stroke="currentColor"
                              strokeWidth={nodeStroke}
                              className={
                                isDone
                                  ? 'text-emerald-400/30'
                                  : isFocus
                                  ? 'text-white/15'
                                  : 'text-stone-100'
                              }
                            />
                            <circle
                              cx={nodeSize / 2}
                              cy={nodeSize / 2}
                              r={nodeRadius}
                              fill="transparent"
                              stroke="currentColor"
                              strokeWidth={nodeStroke}
                              strokeDasharray={nodeCirc}
                              strokeDashoffset={nodeOffset}
                              strokeLinecap="round"
                              className={
                                isDone
                                  ? 'text-white'
                                  : isFocus
                                  ? 'text-emerald-400'
                                  : 'text-emerald-600'
                              }
                            />
                          </svg>

                          <span className="font-display text-sm font-extrabold relative z-10">
                            {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Right Column (Desktop: holds odd index cards; Mobile: full width if odd) */}
                      <div className={`${!isEvenIndex ? 'block' : 'hidden lg:block'}`}>
                        {!isEvenIndex ? (
                          <div className="relative">
                            {/* Desktop Horizontal Branch Connector to Center Hub */}
                            <div
                              aria-hidden="true"
                              className={`hidden lg:block absolute top-10 -left-10 w-10 h-0.5 ${
                                isDone
                                  ? 'bg-emerald-500'
                                  : isFocus
                                  ? 'bg-pine-700'
                                  : 'bg-stone-300'
                              }`}
                            />
                            <StepCard
                              step={step}
                              index={index}
                              totalSteps={totalSteps}
                              onUpdateStep={handleUpdateStep}
                              onDeleteStep={onRequestDeleteStep}
                              onMoveUp={handleMoveUp}
                              onMoveDown={handleMoveDown}
                              onRefineWithAI={onRefineStep}
                              isRefining={isRefining}
                              estimatedDateRange={dateRange}
                              isActiveStep={isFocus}
                              isCollapsed={Boolean(collapsedMap[step.id])}
                              onToggleCollapse={handleToggleCollapseStep}
                              layoutSide="right"
                            />
                          </div>
                        ) : (
                          /* Subtle date/duration milestone marker on opposite side */
                          <div className="hidden lg:flex flex-col items-start justify-center pt-7 pl-6 text-left opacity-80">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200/80 text-xs font-bold text-pine-900 shadow-sm mb-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{step.duration || '1 Minggu'}</span>
                            </span>
                            {dateRange && (
                              <span className="text-xs text-stone-500 font-medium">{dateRange}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FINISH LINE MONUMENT CARD */}
          <div className="relative z-10 mt-8 lg:max-w-xl lg:mx-auto">
            <div
              className={`rounded-3xl p-5 sm:p-6 border shadow-card transition-all ${
                progressPercentage === 100
                  ? 'bg-gradient-to-r from-emerald-600 via-pine-800 to-pine-900 text-white border-emerald-400'
                  : 'bg-white text-pine-950 border-emerald-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-soft ${
                      progressPercentage === 100
                        ? 'bg-amber-300 text-pine-950'
                        : 'bg-pine-900 text-amber-300'
                    }`}
                  >
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div
                      className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                        progressPercentage === 100 ? 'text-emerald-200' : 'text-emerald-700'
                      }`}
                    >
                      <Flag className="w-3 h-3 shrink-0" />
                      <span>Garis Finish Target</span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-extrabold leading-snug mt-0.5">
                      {roadmap.finishLine || 'Semua langkah tuntas & siap dirayakan!'}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenExportModal}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap transition-all btn-press ${
                    progressPercentage === 100
                      ? 'bg-white text-pine-950 hover:bg-emerald-50'
                      : 'bg-pine-900 text-white hover:bg-pine-800'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>Simpan Gambar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Add Step Button */}
          <div className="mt-6 lg:max-w-xl lg:mx-auto">
            <button
              type="button"
              onClick={handleAddNewStep}
              className="w-full py-3.5 rounded-3xl border-2 border-dashed border-stone-300 hover:border-emerald-500/80 bg-white/80 hover:bg-emerald-50/40 text-stone-600 hover:text-pine-900 text-xs font-bold flex items-center justify-center gap-2 transition-all btn-press"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Tahap Baru ke Jalur Ini</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
