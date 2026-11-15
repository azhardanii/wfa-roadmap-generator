import React from 'react';
import { X, Bookmark, ChevronRight, Trash2, Copy, Clock, Layers } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  activeRoadmapId,
  onSelectRoadmap,
  onDuplicateRoadmap,
  onDeleteRoadmap
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-surface-50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-pine-100 text-pine-900 flex items-center justify-center shrink-0">
                <Bookmark className="w-4 h-4 text-pine-800" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-pine-950">Riwayat Rencana</h2>
                <p className="text-xs text-stone-500">{history.length} rencana tersimpan di perangkat ini</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of roadmaps */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                Belum ada roadmap yang tersimpan.
              </div>
            ) : (
              history.map((item) => {
                const isActive = item.id === activeRoadmapId;
                const percentage = item.totalTaskCount > 0 
                  ? Math.round((item.completedTaskCount / item.totalTaskCount) * 100) 
                  : 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isActive 
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-soft' 
                        : 'bg-white border-stone-200 hover:border-emerald-200 hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 
                        onClick={() => {
                          onSelectRoadmap(item.id);
                          onClose();
                        }}
                        className="text-sm font-bold text-pine-950 hover:text-pine-700 cursor-pointer leading-snug"
                      >
                        {item.title}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                          Aktif
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 leading-relaxed mb-3">
                      {item.summary}
                    </p>

                    {/* Progress Bar in History */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                        <span>Progres ({item.completedTaskCount}/{item.totalTaskCount} tugas)</span>
                        <span className="font-bold text-stone-700">{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.updatedAt || Date.now()).toLocaleDateString('id-ID')}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDuplicateRoadmap(item.id)}
                          className="p-1 text-stone-400 hover:text-pine-800 rounded transition-colors"
                          title="Duplikasi roadmap ini"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRoadmap(item.id, item.title)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus dari riwayat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onSelectRoadmap(item.id);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface-200 hover:bg-pine-900 text-stone-700 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <span>Buka</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

