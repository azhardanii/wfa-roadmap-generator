import React, { useState, useRef } from 'react';
import OrbVisual from './OrbVisual';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Clock,
  AlertCircle,
  Heart,
  Wallet,
  Users,
  GraduationCap,
  Briefcase,
  Palette,
  Check,
  ArrowUpRight,
  Target,
  Flag,
  RotateCcw,
  CheckCircle2,
  PenLine,
  ArrowDown
} from 'lucide-react';

const PRESET_CATEGORIES = [
  { id: 'all', label: 'Semua', icon: Sparkles },
  { id: 'health', label: 'Kesehatan', icon: Heart },
  { id: 'wealth', label: 'Keuangan', icon: Wallet },
  { id: 'relation', label: 'Hubungan', icon: Users },
  { id: 'skill', label: 'Keahlian', icon: GraduationCap },
  { id: 'work', label: 'Karier & Kerja', icon: Briefcase },
  { id: 'creative', label: 'Kreatif', icon: Palette }
];

const PRESET_TEMPLATES = [
  // Kesehatan
  {
    category: 'health',
    label: '🏃 Rutin Lari & Bugar',
    goal: 'Membangun kebiasaan lari pagi 3 kali seminggu agar tubuh lebih bugar dan stamina meningkat',
    finish: 'Sanggup berlari santai 5 km tanpa mudah lelah dan berat badan terasa lebih ideal',
    time: '3 Bulan',
    level: 'standar'
  },
  {
    category: 'health',
    label: '🥗 Bekal Makan Sehat',
    goal: 'Mengurangi makanan cepat saji dan membiasakan masak bekal bergizi setiap hari kerja',
    finish: 'Konsisten membawa bekal sehat buatan sendiri 5 hari seminggu dan tubuh terasa lebih ringan',
    time: '1 Bulan',
    level: 'ringkas'
  },
  {
    category: 'health',
    label: '😴 Tidur Teratur',
    goal: 'Memperbaiki jam tidur agar tidak sering begadang dan bangun pagi dengan perasaan segar',
    finish: 'Tidur teratur sebelum pukul 22.30 selama sebulan penuh dan bangun pagi tanpa lemas',
    time: '1 Bulan',
    level: 'ringkas'
  },
  {
    category: 'health',
    label: '🧘 Pikiran Lebih Tenang',
    goal: 'Mengurangi stres harian lewat olahraga ringan, jalan sore rutin, dan catatan syukur harian',
    finish: 'Memiliki kebiasaan harian untuk melepas penat dan lebih tenang menghadapi kesibukan',
    time: '3 Bulan',
    level: 'standar'
  },
  // Keuangan
  {
    category: 'wealth',
    label: '💰 Dana Darurat Keluarga',
    goal: 'Menabung secara rutin setiap gajian untuk menyiapkan dana darurat keluarga yang aman',
    finish: 'Terkumpul dana darurat sebesar 6 kali pengeluaran bulanan di rekening khusus terpisah',
    time: '1 Tahun',
    level: 'standar'
  },
  {
    category: 'wealth',
    label: '🧾 Bebas Utang Cicilan',
    goal: 'Melunasi cicilan konsumtif secara bertahap sekaligus merapikan catatan pengeluaran bulanan',
    finish: 'Semua cicilan konsumtif lunas dan sisa penghasilan bulanan kembali aman untuk ditabung',
    time: '6 Bulan',
    level: 'standar'
  },
  {
    category: 'wealth',
    label: '📈 Mulai Menabung Rutin',
    goal: 'Membuat anggaran bulanan keluarga dan mulai menyisihkan uang secara otomatis tiap awal bulan',
    finish: 'Pengeluaran tercatat rapi dan minimal 20 persen penghasilan selalu tersimpan untuk masa depan',
    time: '3 Bulan',
    level: 'standar'
  },
  {
    category: 'wealth',
    label: '🏡 Tabungan Rumah / Nikah',
    goal: 'Mengumpulkan tabungan khusus untuk rencana besar masa depan dengan target bulanan realistis',
    finish: 'Dana awal tercapai sesuai jadwal tanpa mengganggu biaya kebutuhan pokok harian',
    time: '1 Tahun',
    level: 'mendalam'
  },
  // Hubungan
  {
    category: 'relation',
    label: '💬 Komunikasi Hangat',
    goal: 'Memperbaiki cara mendengar dan berbicara dengan pasangan atau keluarga agar minim salah paham',
    finish: 'Punya waktu mengobrol santai tiap minggu dan mampu berdiskusi tenang saat ada perbedaan pendapat',
    time: '3 Bulan',
    level: 'standar'
  },
  {
    category: 'relation',
    label: '👨‍👩‍👧 Waktu Keluarga',
    goal: 'Menjadwalkan kebersamaan berkualitas dengan orang tua dan keluarga di sela kesibukan kerja',
    finish: 'Minimal 2 akhir pekan setiap bulan benar-benar fokus bersama keluarga tanpa sibuk bermain ponsel',
    time: '3 Bulan',
    level: 'ringkas'
  },
  {
    category: 'relation',
    label: '🤝 Teman & Komunitas',
    goal: 'Menjalin pertemanan baru yang sehat melalui kegiatan olahraga bersama atau komunitas hobi',
    finish: 'Aktif ikut kegiatan positif minimal 2 kali sebulan dan memiliki lingkaran teman yang saling mendukung',
    time: '3 Bulan',
    level: 'standar'
  },
  // Keahlian
  {
    category: 'skill',
    label: '🗣️ Lancar Bahasa Inggris',
    goal: 'Berlatih mendengar dan berbicara bahasa Inggris tiap hari agar percaya diri saat bercakap',
    finish: 'Mampu mengobrol dan mengikuti rapat dalam bahasa Inggris dengan lancar dan tidak gugup',
    time: '6 Bulan',
    level: 'standar'
  },
  {
    category: 'skill',
    label: '🍳 Jago Masak Rumahan',
    goal: 'Belajar teknik memasak dasar dan menguasai resep hidangan rumahan favorit keluarga',
    finish: 'Mampu memasak minimal 15 menu makanan rumahan lezat dengan cepat dan hemat biaya makan luar',
    time: '3 Bulan',
    level: 'ringkas'
  },
  {
    category: 'skill',
    label: '🚗 Lancar Nyetir Mobil',
    goal: 'Belajar mengemudi dengan aman di jalan raya, mahir parkir, dan memahami aturan lalu lintas',
    finish: 'Percaya diri menyetir di jalanan ramai, lancar parkir di tempat sempit, dan mengantongi SIM resmi',
    time: '1 Bulan',
    level: 'ringkas'
  },
  {
    category: 'skill',
    label: '🎤 Berani Bicara Umum',
    goal: 'Mengatasi rasa gugup dan belajar menyusun penyampaian pesan yang jelas di depan banyak orang',
    finish: 'Sanggup membawakan presentasi berdurasi 15 menit dengan tenang, terstruktur, dan meyakinkan',
    time: '3 Bulan',
    level: 'standar'
  },
  // Karier & Kerja
  {
    category: 'work',
    label: '💼 Karier Lebih Baik',
    goal: 'Memperbarui daftar pengalaman kerja, melatih wawancara, dan melamar ke posisi yang lebih baik',
    finish: 'Mendapatkan tawaran kerja baru dengan lingkungan kerja nyaman dan penghasilan sesuai harapan',
    time: '3 Bulan',
    level: 'standar'
  },
  {
    category: 'work',
    label: '🛍️ Rintis Usaha Sampingan',
    goal: 'Memulai usaha kecil rumahan atau berjualan online tanpa mengganggu pekerjaan utama',
    finish: 'Usaha sampingan berjalan stabil dengan pembeli tetap dan menambah pemasukan bulanan',
    time: '3 Bulan',
    level: 'standar'
  },
  {
    category: 'work',
    label: '⚖️ Kerja Tanpa Lembur',
    goal: 'Mengatur prioritas kerja harian supaya tugas selesai tepat waktu dan punya waktu istirahat cukup',
    finish: 'Bisa menutup pekerjaan tepat waktu setiap hari tanpa membawa beban pekerjaan ke waktu istirahat',
    time: '1 Bulan',
    level: 'ringkas'
  },
  // Kreatif
  {
    category: 'creative',
    label: '📚 Menulis Buku / Cerita',
    goal: 'Menumbuhkan kebiasaan menulis 500 kata tiap hari untuk merangkai gagasan menjadi naskah utuh',
    finish: 'Menyelesaikan draf utuh buku atau kumpulan cerita siap baca dengan alur yang rapi',
    time: '6 Bulan',
    level: 'mendalam'
  },
  {
    category: 'creative',
    label: '📸 Foto & Video Harian',
    goal: 'Belajar komposisi foto, pencahayaan alami, dan penyuntingan sederhana untuk mengabadikan momen',
    finish: 'Menghasilkan kumpulan foto dan video perjalanan yang rapi serta enak ditonton keluarga',
    time: '3 Bulan',
    level: 'ringkas'
  },
  {
    category: 'creative',
    label: '🪴 Kebun Mini di Rumah',
    goal: 'Menata sudut rumah menjadi ruang hijau nyaman serta belajar merawat tanaman hias dan sayur',
    finish: 'Sudut rumah tertata rapi dengan tanaman tumbuh subur terawat dan suasana rumah terasa sejuk',
    time: '3 Bulan',
    level: 'ringkas'
  }
];

export default function RoadmapForm({
  onGenerate,
  isLoading,
  error
}) {
  const [goal, setGoal] = useState('');
  const [finishLine, setFinishLine] = useState('');
  const [detailLevel, setDetailLevel] = useState('standar');
  const [timeframe, setTimeframe] = useState('3 Bulan');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [validationError, setValidationError] = useState('');
  const [activeField, setActiveField] = useState('goal');
  const [justAppliedTemplate, setJustAppliedTemplate] = useState('');

  const inputStageRef = useRef(null);
  const goalInputRef = useRef(null);

  const filteredTemplates = selectedCategory === 'all'
    ? PRESET_TEMPLATES
    : PRESET_TEMPLATES.filter((t) => t.category === selectedCategory);

  const filledCount = (goal.trim() ? 1 : 0) + (finishLine.trim() ? 1 : 0);

  const handleApplyTemplate = (tmpl) => {
    setGoal(tmpl.goal);
    setFinishLine(tmpl.finish);
    setTimeframe(tmpl.time);
    setDetailLevel(tmpl.level);
    setValidationError('');
    setJustAppliedTemplate(tmpl.label);
    setActiveField('goal');

    requestAnimationFrame(() => {
      inputStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleClearInputs = () => {
    setGoal('');
    setFinishLine('');
    setJustAppliedTemplate('');
    setValidationError('');
    setActiveField('goal');
    requestAnimationFrame(() => {
      goalInputRef.current?.focus();
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      setValidationError('Silakan isi apa yang ingin kamu lakukan atau capai.');
      setActiveField('goal');
      goalInputRef.current?.focus();
      return;
    }
    if (!finishLine.trim()) {
      setValidationError('Silakan tentukan seperti apa garis finish atau hasil akhirnya.');
      setActiveField('finish');
      return;
    }
    setValidationError('');
    onGenerate({
      goal: goal.trim(),
      finishLine: finishLine.trim(),
      detailLevel,
      timeframe
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero Atmosphere Banner with Floating Emblem & 3-Step Guide */}
      <div className="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-b from-pine-900 via-pine-800 to-pine-950 p-6 sm:p-8 text-white shadow-card text-center">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <OrbVisual size="md" className="mb-4" />

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display mb-2 text-white">
            Ubah Tujuanmu Jadi Langkah Nyata
          </h1>
          <p className="text-emerald-100/85 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Cukup isi dua kolom utama di bawah ini untuk langsung menyusun peta perjalanan terarah yang mudah dipantau dan dicetak.
          </p>

          {/* Visual 3-Step Cue Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-[11px] sm:text-xs font-semibold text-emerald-100 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-emerald-400 text-pine-950 font-extrabold text-[10px] inline-flex items-center justify-center shrink-0">1</span>
              <span>Tulis Tujuan</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-300/70 hidden sm:block shrink-0" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-[11px] sm:text-xs font-semibold text-emerald-100 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-amber-300 text-pine-950 font-extrabold text-[10px] inline-flex items-center justify-center shrink-0">2</span>
              <span>Tentukan Garis Finish</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-300/70 hidden sm:block shrink-0" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/35 text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Jadi Peta Langkah</span>
            </span>
          </div>
        </div>
      </div>

      {/* Primary Spotlight Input Form Card (Highlighted First) */}
      <form
        ref={inputStageRef}
        onSubmit={handleSubmit}
        className="scroll-mt-20 relative rounded-3xl bg-white border-2 border-emerald-700/20 p-4 sm:p-7 shadow-card overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-pine-700 to-amber-400" />

        {/* Spotlight Stage Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-stone-100 pt-1">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
              <PenLine className="w-3 h-3 shrink-0" />
              <span>Mulai Dari Sini</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-pine-950 font-display leading-snug">
              Tuliskan Rencana Tujuanmu
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${
                filledCount === 2
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : filledCount === 1
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-surface-100 text-stone-600 border-stone-200'
              }`}
            >
              {filledCount === 2 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>2/2 Kolom Siap</span>
                </>
              ) : filledCount === 1 ? (
                <span>1/2 Kolom Terisi</span>
              ) : (
                <span>Isi 2 Kolom Utama</span>
              )}
            </span>

            {(goal || finishLine) && (
              <button
                type="button"
                onClick={handleClearInputs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-rose-700 bg-surface-100 hover:bg-rose-50 border border-stone-200/80 hover:border-rose-200 transition-colors btn-press whitespace-nowrap"
                title="Bersihkan isi kedua kolom"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Kosongkan</span>
              </button>
            )}
          </div>
        </div>

        {/* Applied Template Feedback Banner */}
        {justAppliedTemplate && (
          <div className="mb-5 px-3.5 py-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">
                Diisi dari inspirasi: <strong className="font-bold">{justAppliedTemplate}</strong> (bebas kamu sesuaikan kembali)
              </span>
            </div>
          </div>
        )}

        {/* Spotlight Input Card 1: Goal */}
        <div
          onClick={() => {
            setActiveField('goal');
            goalInputRef.current?.focus();
          }}
          className={`rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-text ${
            activeField === 'goal'
              ? 'border-emerald-500 ring-4 ring-emerald-500/15 bg-white shadow-card'
              : 'border-emerald-600/30 bg-gradient-to-b from-emerald-50/60 via-white to-white shadow-soft hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs shadow-sm transition-colors ${
                  goal.trim() || activeField === 'goal'
                    ? 'bg-pine-900 text-emerald-300'
                    : 'bg-emerald-100 text-pine-900'
                }`}
              >
                01
              </div>
              <div className="min-w-0">
                <label
                  htmlFor="goal-input"
                  className="text-sm sm:text-base font-extrabold text-pine-950 flex items-center gap-1.5 cursor-text leading-snug"
                >
                  <Target className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Apa tujuan utama yang ingin kamu capai?</span>
                </label>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Tuliskan perubahan, kebiasaan, atau target utama yang ingin kamu mulai sekarang.
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 ${
                goal.trim()
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/70'
              }`}
            >
              {goal.trim() ? (
                <>
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Terisi</span>
                </>
              ) : (
                <span>Wajib Diisi</span>
              )}
            </span>
          </div>

          <div
            className={`rounded-2xl border-2 bg-white transition-colors ${
              activeField === 'goal' ? 'border-emerald-400/70' : 'border-stone-200'
            }`}
          >
            <textarea
              ref={goalInputRef}
              id="goal-input"
              rows={3}
              value={goal}
              onFocus={() => setActiveField('goal')}
              onChange={(e) => {
                setGoal(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Contoh: Mulai rutin olahraga pagi 3 kali seminggu, mengumpulkan dana darurat keluarga, atau lancar berbahasa Inggris..."
              className="w-full px-4 py-3.5 rounded-2xl bg-transparent text-base sm:text-[17px] font-semibold text-pine-950 placeholder:text-stone-400 placeholder:font-normal leading-relaxed focus:outline-none resize-none"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] text-stone-500">
            <span>Tulis bebas dengan bahasamu sendiri, tidak perlu bahasa formal.</span>
            {goal.trim().length > 0 && (
              <span className="font-semibold text-emerald-700 whitespace-nowrap">
                {goal.trim().length} karakter
              </span>
            )}
          </div>
        </div>

        {/* Visual Journey Connector */}
        <div className="relative flex flex-col items-center py-2.5">
          <div className="w-0.5 h-3 bg-gradient-to-b from-emerald-400 to-amber-400 rounded-full" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-100 border border-stone-200/80 text-[11px] font-bold text-pine-900 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Menuju Bukti Garis Finish</span>
          </div>
          <div className="w-0.5 h-3 bg-gradient-to-b from-amber-400 to-emerald-500 rounded-full" />
        </div>

        {/* Spotlight Input Card 2: Finish Line */}
        <div
          onClick={() => setActiveField('finish')}
          className={`rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-text mb-6 ${
            activeField === 'finish'
              ? 'border-emerald-500 ring-4 ring-emerald-500/15 bg-white shadow-card'
              : 'border-pine-800/20 bg-gradient-to-b from-amber-50/45 via-white to-white shadow-soft hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs shadow-sm transition-colors ${
                  finishLine.trim() || activeField === 'finish'
                    ? 'bg-amber-400 text-pine-950'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                02
              </div>
              <div className="min-w-0">
                <label
                  htmlFor="finish-input"
                  className="text-sm sm:text-base font-extrabold text-pine-950 flex items-center gap-1.5 cursor-text leading-snug"
                >
                  <Flag className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Seperti apa bukti nyata saat tujuan ini berhasil?</span>
                </label>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Bayangkan hasil akhir paling konkret yang menandakan kamu sudah sampai di garis finish.
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 ${
                finishLine.trim()
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/70'
              }`}
            >
              {finishLine.trim() ? (
                <>
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Terisi</span>
                </>
              ) : (
                <span>Wajib Diisi</span>
              )}
            </span>
          </div>

          <div
            className={`rounded-2xl border-2 bg-white transition-colors ${
              activeField === 'finish' ? 'border-emerald-400/70' : 'border-stone-200'
            }`}
          >
            <textarea
              id="finish-input"
              rows={3}
              value={finishLine}
              onFocus={() => setActiveField('finish')}
              onChange={(e) => {
                setFinishLine(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Contoh: Sanggup berlari santai 5 km tanpa lemas, tabungan darurat terkumpul penuh, atau percaya diri presentasi 15 menit..."
              className="w-full px-4 py-3.5 rounded-2xl bg-transparent text-base sm:text-[17px] font-semibold text-pine-950 placeholder:text-stone-400 placeholder:font-normal leading-relaxed focus:outline-none resize-none"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] text-stone-500">
            <span>Semakin jelas hasil akhirnya, semakin terarah langkah harian yang tersusun.</span>
            {finishLine.trim().length > 0 && (
              <span className="font-semibold text-emerald-700 whitespace-nowrap">
                {finishLine.trim().length} karakter
              </span>
            )}
          </div>
        </div>

        {/* Options Row: Detail Level & Timeframe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-4 border-t border-stone-100">
          <div>
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-pine-700 shrink-0" />
              <span>Tingkat Kedalaman</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-100 rounded-2xl border border-stone-200/60">
              {[
                { id: 'ringkas', label: 'Ringkas', steps: '5 tahap' },
                { id: 'standar', label: 'Standar', steps: '6-7 tahap' },
                { id: 'mendalam', label: 'Mendalam', steps: '8-9 tahap' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setDetailLevel(opt.id)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-medium text-center transition-all min-w-0 ${
                    detailLevel === opt.id
                      ? 'bg-white text-pine-950 font-bold shadow-soft border border-stone-200/80'
                      : 'text-stone-600 hover:text-pine-900'
                  }`}
                >
                  <div className="whitespace-nowrap">{opt.label}</div>
                  <div className="text-[10px] text-stone-400 font-normal whitespace-nowrap mt-0.5">{opt.steps}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-pine-700 shrink-0" />
              <span>Target Jangka Waktu</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-surface-100 rounded-2xl border border-stone-200/60">
              {['1 Bulan', '3 Bulan', '6 Bulan', '1 Tahun'].map((time) => (
                <button
                  type="button"
                  key={time}
                  onClick={() => setTimeframe(time)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium text-center whitespace-nowrap transition-all ${
                    timeframe === time
                      ? 'bg-white text-pine-950 font-bold shadow-soft border border-stone-200/80'
                      : 'text-stone-600 hover:text-pine-900'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Validation or Error Alerts */}
        {(validationError || error) && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{validationError ? 'Periksa Kembali Input' : 'Penyusunan Belum Berhasil'}</p>
              <p className="mt-0.5 leading-relaxed">{validationError || error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-full font-bold text-sm sm:text-base text-white flex items-center justify-center gap-2 shadow-card transition-all btn-press ${
            isLoading
              ? 'bg-pine-800 cursor-not-allowed opacity-90'
              : 'bg-pine-900 hover:bg-pine-800 active:bg-pine-950'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sedang Menyusun Rencana Langkah...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="whitespace-nowrap">Buat Rencana Langkah</span>
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-stone-400 mt-3 leading-relaxed">
          Semua langkah bebas kamu ubah kapan saja dan dapat disimpan menjadi gambar atau PDF cetak.
        </p>
      </form>

      {/* Secondary Discovery Section Below Form: Quick Inspirations (1-Klik) */}
      <section className="mt-6 bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-7 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Inspirasi Cepat (1-Klik)</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-pine-950 font-display">
              Belum punya gambaran? Pilih salah satu contoh di bawah
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
              Klik kartu contoh untuk langsung mengisi kedua kolom tujuan dan garis finish di atas secara otomatis.
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-100 border border-stone-200/70 text-stone-500 whitespace-nowrap shrink-0">
            {filteredTemplates.length} pilihan tujuan
          </span>
        </div>

        {/* Segmented Category Tab Bar */}
        <div className="p-1.5 rounded-2xl bg-surface-100 border border-stone-200/80 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? PRESET_TEMPLATES.length
                  : PRESET_TEMPLATES.filter((t) => t.category === cat.id).length;

              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all btn-press ${
                    isActive
                      ? 'bg-pine-900 text-white shadow-soft font-bold'
                      : 'bg-transparent text-stone-600 hover:bg-white hover:text-pine-900 font-semibold'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-emerald-300' : 'text-stone-400'
                    }`}
                  />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-none ${
                      isActive
                        ? 'bg-white/15 text-emerald-200'
                        : 'bg-stone-200/70 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Structured 2-Column Inspiration Cards inside Recessed Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-2.5 rounded-2xl bg-surface-50/90 border border-stone-200/70">
          {filteredTemplates.map((tmpl, idx) => {
            const [emoji, ...titleParts] = tmpl.label.split(' ');
            const cleanTitle = titleParts.join(' ');
            const isSelected = goal === tmpl.goal;

            return (
              <button
                type="button"
                key={`${tmpl.category}-${idx}`}
                onClick={() => handleApplyTemplate(tmpl)}
                className={`rounded-2xl p-3 border text-left transition-all flex items-start gap-3 group btn-press ${
                  isSelected
                    ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-400/20 shadow-soft'
                    : 'bg-white hover:bg-emerald-50/50 border-stone-200/80 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 shadow-sm transition-colors ${
                    isSelected
                      ? 'bg-white border-emerald-200'
                      : 'bg-surface-100 group-hover:bg-white border-stone-200/60'
                  }`}
                >
                  {emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs sm:text-[13px] font-bold text-pine-950 leading-snug">
                      {cleanTitle}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 whitespace-nowrap shrink-0">
                      {tmpl.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug mt-1">
                    {tmpl.goal}
                  </p>
                </div>

                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-pine-800 transition-colors shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
