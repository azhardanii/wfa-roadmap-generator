import React from 'react';
import { Compass, Settings, Bookmark, PlusCircle, Sparkles, KeyRound } from 'lucide-react';

export default function Header({ 
  onOpenSettings, 
  onOpenHistory, 
  onNewRoadmap, 
  hasApiKey, 
  historyCount = 0 
}) {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 border-b border-emerald-950/5 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={onNewRoadmap} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pine-900 to-pine-800 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform shrink-0">
            <Compass className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-pine-950 font-sans leading-tight">Jalur</span>
            <span className="text-[11px] text-stone-500 hidden sm:inline leading-tight">
              Perencana Langkah Tujuan
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-pine-900 hover:bg-emerald-50/70 border border-stone-200/80 transition-all btn-press whitespace-nowrap shrink-0"
            title="Lihat riwayat roadmap tersimpan"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="ml-0.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* New Roadmap Button */}
          <button
            type="button"
            onClick={onNewRoadmap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-pine-900 hover:bg-emerald-50/70 border border-stone-200/80 transition-all btn-press whitespace-nowrap shrink-0"
            title="Buat roadmap baru"
          >
            <PlusCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="hidden sm:inline">Buat Baru</span>
          </button>

          {/* Settings / API Key Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all btn-press border whitespace-nowrap shrink-0 ${
              hasApiKey 
                ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
            title="Pengaturan"
          >
            {hasApiKey ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <Settings className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <span className="hidden sm:inline">Pengaturan</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

