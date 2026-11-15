import React, { useState } from 'react';
import { X, Key, Cpu, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Download, Upload } from 'lucide-react';
import { testGeminiKey } from '../services/gemini';
import { exportAllDataAsJSON } from '../services/storage';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [models, setModels] = useState(settings.models || ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']);
  const [newModelInput, setNewModelInput] = useState('');
  const [testStatus, setTestStatus] = useState(null); // { success: boolean, message: string }
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestStatus(null);
    const primaryModel = models[0] || 'gemini-2.5-flash';
    const res = await testGeminiKey(apiKey, primaryModel);
    setTestStatus(res);
    setIsTesting(false);
  };

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      apiKey: apiKey.trim(),
      models: models.filter(m => Boolean(m.trim()))
    });
    onClose();
  };

  const handleAddModel = (e) => {
    e?.preventDefault();
    if (!newModelInput.trim()) return;
    if (!models.includes(newModelInput.trim())) {
      setModels([...models, newModelInput.trim()]);
    }
    setNewModelInput('');
  };

  const handleRemoveModel = (index) => {
    if (models.length <= 1) return;
    setModels(models.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pine-100 text-pine-900 flex items-center justify-center">
              <Key className="w-4 h-4 text-pine-800" />
            </div>
            <div>
              <h2 className="text-base font-bold text-pine-950">Pengaturan & Kunci Layanan</h2>
              <p className="text-xs text-stone-500">Kunci disimpan aman hanya di perangkat Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* API Key Section */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label className="text-xs font-bold text-pine-950 uppercase tracking-wider">
                Kunci Google Gemini
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline font-semibold whitespace-nowrap"
              >
                Ambil Kunci Gratis ↗
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus(null);
                }}
                placeholder="Masukkan kunci Anda di sini..."
                className="w-full px-4 py-2.5 pr-10 text-xs sm:text-sm rounded-2xl bg-surface-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-pine-600/20 focus:border-pine-600 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Test Connection Button */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={!apiKey.trim() || isTesting}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-surface-100 hover:bg-emerald-50 text-stone-700 hover:text-pine-900 border border-stone-200/80 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-pine-700" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Uji Sambungan</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-stone-400">
                Tersimpan aman hanya di perangkat Anda
              </span>
            </div>

            {/* Test Status Feedback */}
            {testStatus && (
              <div className={`mt-3 p-3 rounded-2xl text-xs flex items-start gap-2 ${
                testStatus.success 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}
          </div>

          {/* Fallback Model Chain Section */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-pine-950 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-pine-700 shrink-0" />
                <span>Daftar Cadangan Otomatis</span>
              </label>
              <span className="text-[10px] text-stone-400 whitespace-nowrap">Urutan Prioritas</span>
            </div>
            <p className="text-xs text-stone-500 mb-3 leading-relaxed">
              Jika layanan utama sedang sibuk atau mencapai batas harian, sistem akan otomatis berpindah ke pilihan berikutnya.
            </p>

            <div className="space-y-2 mb-3">
              {models.map((model, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-50 border border-stone-200/80 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-pine-100 text-pine-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-mono font-medium text-stone-800 truncate">{model}</span>
                    {idx === 0 && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        Utama
                      </span>
                    )}
                  </div>
                  {models.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveModel(idx)}
                      className="text-stone-400 hover:text-rose-500 text-xs px-2 py-0.5 shrink-0"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Model Input */}
            <form onSubmit={handleAddModel} className="flex items-center gap-2">
              <input
                type="text"
                value={newModelInput}
                onChange={(e) => setNewModelInput(e.target.value)}
                placeholder="Tambah nama cadangan..."
                className="min-w-0 flex-1 px-3 py-1.5 text-xs rounded-xl bg-surface-50 border border-stone-200 text-stone-800 outline-none focus:border-pine-600 font-mono"
              />
              <button
                type="submit"
                disabled={!newModelInput.trim()}
                className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-pine-900 text-stone-700 hover:text-white text-xs font-semibold disabled:opacity-40 transition-all"
              >
                + Tambah
              </button>
            </form>
          </div>

          {/* Backup & Data Section */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-pine-950 uppercase tracking-wider">
                Cadangan Data
              </label>
              <button
                type="button"
                onClick={exportAllDataAsJSON}
                className="whitespace-nowrap text-xs font-semibold text-pine-800 hover:text-pine-950 flex items-center gap-1 hover:underline"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Unduh Cadangan</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Simpan seluruh riwayat rencanamu ke perangkat untuk cadangan atau dipindahkan ke perangkat lain.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-surface-50 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-pine-900 hover:bg-pine-800 text-white text-xs font-bold shadow-soft transition-all btn-press"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}

