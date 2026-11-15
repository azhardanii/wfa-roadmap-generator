import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RoadmapForm from './components/RoadmapForm';
import RoadmapView from './components/RoadmapView';
import ExportPreviewModal from './components/ExportPreviewModal';
import SettingsModal from './components/SettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { 
  getStoredRoadmap, 
  saveActiveRoadmap, 
  getStoredSettings, 
  saveStoredSettings, 
  getRoadmapHistory,
  deleteRoadmapFromHistory,
  INITIAL_DEMO_ROADMAP
} from './services/storage';
import { generateRoadmapAI, refineStepWithAI } from './services/gemini';

export default function App() {
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [settings, setSettings] = useState(getStoredSettings());
  const [history, setHistory] = useState([]);
  const [viewMode, setViewMode] = useState('roadmap'); // 'roadmap' | 'form'
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [apiError, setApiError] = useState('');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Load initial data on mount
  useEffect(() => {
    const loadedRoadmap = getStoredRoadmap();
    const loadedSettings = getStoredSettings();
    const loadedHistory = getRoadmapHistory();

    setActiveRoadmap(loadedRoadmap || INITIAL_DEMO_ROADMAP);
    setSettings(loadedSettings);
    setHistory(loadedHistory);
  }, []);

  // Save active roadmap on changes
  const handleUpdateRoadmap = (updated) => {
    setActiveRoadmap(updated);
    saveActiveRoadmap(updated);
    setHistory(getRoadmapHistory());
  };

  // Generate new roadmap from Form
  const handleGenerate = async ({ goal, finishLine, detailLevel, timeframe }) => {
    setIsLoading(true);
    setApiError('');

    try {
      const result = await generateRoadmapAI({
        goal,
        finishLine,
        detailLevel,
        timeframe,
        apiKey: settings.apiKey,
        modelChain: settings.models
      });

      handleUpdateRoadmap(result.roadmap);
      setViewMode('roadmap');
    } catch (err) {
      console.error('Generation error:', err);
      setApiError(err.message || 'Terjadi kesalahan saat memproses roadmap.');
    } finally {
      setIsLoading(false);
    }
  };

  // AI Refine Step (Pecah Lebih Detail, Sederhanakan, Tambah Tugas)
  const handleRefineStep = async (step, action) => {
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsRefining(true);
    try {
      const updatedStep = await refineStepWithAI({
        step,
        action,
        goal: activeRoadmap.goal || activeRoadmap.title,
        apiKey: settings.apiKey,
        modelChain: settings.models
      });

      const updatedSteps = activeRoadmap.steps.map(s => s.id === step.id ? updatedStep : s);
      handleUpdateRoadmap({
        ...activeRoadmap,
        steps: updatedSteps,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Refine step error:', err);
      alert('Gagal menyempurnakan langkah: ' + err.message);
    } finally {
      setIsRefining(false);
    }
  };

  // Request Delete Step with modal confirmation
  const handleRequestDeleteStep = (stepId, stepTitle) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Hapus Langkah?',
      message: `Apakah Anda yakin ingin menghapus "${stepTitle || 'langkah ini'}" beserta seluruh checklist tugasnya?`,
      onConfirm: () => {
        const updatedSteps = activeRoadmap.steps.filter(s => s.id !== stepId);
        handleUpdateRoadmap({
          ...activeRoadmap,
          steps: updatedSteps,
          updatedAt: new Date().toISOString()
        });
      }
    });
  };

  // Select roadmap from history
  const handleSelectHistoryRoadmap = (id) => {
    if (activeRoadmap?.id === id) {
      setViewMode('roadmap');
      return;
    }
    // Check if it's the demo or load from storage
    if (id === INITIAL_DEMO_ROADMAP.id) {
      setActiveRoadmap(INITIAL_DEMO_ROADMAP);
    } else {
      // In localStorage, check active roadmap or reload
      const current = getStoredRoadmap();
      if (current && current.id === id) {
        setActiveRoadmap(current);
      }
    }
    setViewMode('roadmap');
  };

  // Duplicate roadmap
  const handleDuplicateRoadmap = (id) => {
    const duplicated = {
      ...activeRoadmap,
      id: `roadmap-${Date.now()}`,
      title: `${activeRoadmap.title} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: activeRoadmap.steps.map((s, idx) => ({
        ...s,
        id: `step-${Date.now()}-${idx}`,
        tasks: s.tasks.map((t, tIdx) => ({
          ...t,
          id: `task-${Date.now()}-${idx}-${tIdx}`
        }))
      }))
    };
    handleUpdateRoadmap(duplicated);
  };

  // Delete roadmap from history
  const handleDeleteRoadmap = (id, title) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Hapus Roadmap?',
      message: `Apakah Anda yakin ingin menghapus roadmap "${title}" dari riwayat?`,
      onConfirm: () => {
        deleteRoadmapFromHistory(id);
        setHistory(getRoadmapHistory());
        if (activeRoadmap?.id === id) {
          setActiveRoadmap(INITIAL_DEMO_ROADMAP);
        }
      }
    });
  };

  // Save updated settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col font-sans selection:bg-emerald-200 selection:text-pine-950">
      {/* Top Navbar */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewRoadmap={() => setViewMode('form')}
        hasApiKey={Boolean(settings.apiKey)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        {viewMode === 'form' ? (
          <RoadmapForm
            onGenerate={handleGenerate}
            isLoading={isLoading}
            error={apiError}
            hasApiKey={Boolean(settings.apiKey)}
          />
        ) : (
          activeRoadmap && (
            <RoadmapView
              roadmap={activeRoadmap}
              onUpdateRoadmap={handleUpdateRoadmap}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onBackToForm={() => setViewMode('form')}
              onRefineStep={handleRefineStep}
              isRefining={isRefining}
              onRequestDeleteStep={handleRequestDeleteStep}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-950/5 py-6 text-center text-xs text-stone-500 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-pine-950">Jalur</span>
            <span className="text-stone-400">|</span>
            <span>Perencana Langkah Tujuan</span>
          </div>
          <div className="text-stone-400 text-[11px]">
            <span>Teman merencanakan tujuan dan langkah harianmu</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        roadmap={activeRoadmap}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        activeRoadmapId={activeRoadmap?.id}
        onSelectRoadmap={handleSelectHistoryRoadmap}
        onDuplicateRoadmap={handleDuplicateRoadmap}
        onDeleteRoadmap={handleDeleteRoadmap}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        onConfirm={deleteConfirm.onConfirm}
        onClose={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

