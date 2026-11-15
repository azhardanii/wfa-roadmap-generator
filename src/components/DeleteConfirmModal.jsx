import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-stone-200">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Trash2 className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-pine-950 mb-2">
            {title}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed mb-6">
            {message}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-full border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-soft transition-all btn-press"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

