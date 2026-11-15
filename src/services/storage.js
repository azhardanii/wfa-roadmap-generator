// Storage Service for Jalur AI Roadmap Generator

const STORAGE_KEYS = {
  ACTIVE_ROADMAP: 'jalur_active_roadmap',
  HISTORY: 'jalur_history',
  SETTINGS: 'jalur_settings'
};

export const DEFAULT_SETTINGS = {
  apiKey: '',
  models: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'],
  theme: 'emerald-pine',
  autoSave: true,
};

// Initial demo roadmap to show right away before generating
export const INITIAL_DEMO_ROADMAP = {
  id: 'demo-sehat-90-hari',
  title: 'Hidup Lebih Sehat & Bugar dalam 90 Hari',
  summary: 'Langkah bertahap membangun kebiasaan olahraga rutin, pola makan bergizi, dan tidur berkualitas tanpa merasa terbebani.',
  goal: 'Membangun kebiasaan olahraga rutin, pola makan bersih, dan tidur berkualitas',
  finishLine: 'Tubuh terasa ringan, turun 5 kg secara sehat, dan bugar menjalani aktivitas harian tanpa mudah lelah',
  modelUsed: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  startDate: new Date().toISOString().split('T')[0],
  targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  steps: [
    {
      id: 'step-1',
      title: 'Pemetaan Kebiasaan & Cek Kondisi Awal',
      duration: '1 Minggu',
      description: 'Catat kebiasaan harian saat ini untuk menentukan target perubahan yang realistis dan nyaman dimulai.',
      tasks: [
        { id: 't1-1', text: 'Timbang berat badan, ukur lingkar pinggang, dan catat jam tidur rata-rata', completed: true },
        { id: 't1-2', text: 'Rapikan dapur dan ganti camilan manis dengan buah segar atau kacang', completed: true },
        { id: 't1-3', text: 'Siapkan botol minum 2 liter untuk target hidrasi harian', completed: true }
      ]
    },
    {
      id: 'step-2',
      title: 'Perbaiki Pola Tidur & Ritme Pagi',
      duration: '2 Minggu',
      description: 'Tidur cukup adalah kunci pemulihan tubuh dan pengendalian nafsu makan harian.',
      tasks: [
        { id: 't2-1', text: 'Pasang pengingat tidur pukul 22.00 dan jauhkan ponsel 30 menit sebelumnya', completed: true },
        { id: 't2-2', text: 'Biasakan minum segelas air putih dan berjemur pagi 10 menit setelah bangun', completed: false },
        { id: 't2-3', text: 'Kurangi konsumsi kafein setelah pukul 14.00 siang', completed: false }
      ]
    },
    {
      id: 'step-3',
      title: 'Mulai Rutinitas Gerak Ringan yang Konsisten',
      duration: '3 Minggu',
      description: 'Bangun kebiasaan bergerak minimal 30 menit tanpa memaksakan tubuh secara berlebihan.',
      tasks: [
        { id: 't3-1', text: 'Jalan kaki santai 7.000 langkah sehari atau senam ringan 3 kali seminggu', completed: false },
        { id: 't3-2', text: 'Lakukan peregangan tubuh 10 menit setiap selesai bekerja duduk lama', completed: false },
        { id: 't3-3', text: 'Pilih tangga dibandingkan lift saat naik 1 hingga 3 lantai', completed: false }
      ]
    },
    {
      id: 'step-4',
      title: 'Atur Porsi Makan Seimbang & Latihan Kekuatan',
      duration: '4 Minggu',
      description: 'Terapkan porsi makan seimbang di rumah dan tingkatkan intensitas latihan agar metabolisme aktif.',
      tasks: [
        { id: 't4-1', text: 'Gunakan panduan isi piring: setengah sayur, seperempat protein, seperempat karbohidrat', completed: false },
        { id: 't4-2', text: 'Tambahkan latihan beban tubuh (squat, push-up dinding, plank) 2 kali seminggu', completed: false },
        { id: 't4-3', text: 'Siapkan bekal makan siang sehat minimal 4 hari kerja dalam seminggu', completed: false }
      ]
    },
    {
      id: 'step-5',
      title: 'Evaluasi Hasil & Pertahankan Gaya Hidup Baru',
      duration: '2 Minggu',
      description: 'Ukur perubahan kondisi fisik dan jadikan pola hidup sehat sebagai rutinitas permanen yang menyenangkan.',
      tasks: [
        { id: 't5-1', text: 'Timbang ulang dan bandingkan energi harian dengan minggu pertama', completed: false },
        { id: 't5-2', text: 'Temukan olahraga atau komunitas akhir pekan yang disukai agar tetap semangat', completed: false },
        { id: 't5-3', text: 'Rayakan pencapaian target berat dan kebugaran dengan hadiah non-makanan', completed: false }
      ]
    }
  ]
};

// Storage helper functions
export const getStoredSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
};

export const getStoredRoadmap = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROADMAP);
    if (!data) return INITIAL_DEMO_ROADMAP;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load roadmap:', e);
    return INITIAL_DEMO_ROADMAP;
  }
};

export const saveActiveRoadmap = (roadmap) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(roadmap));
    
    // Also sync to history list
    const history = getRoadmapHistory();
    const existingIndex = history.findIndex(item => item.id === roadmap.id);
    const summaryItem = {
      id: roadmap.id,
      title: roadmap.title,
      summary: roadmap.summary,
      stepCount: roadmap.steps?.length || 0,
      completedTaskCount: roadmap.steps?.reduce((acc, s) => acc + (s.tasks?.filter(t => t.completed)?.length || 0), 0) || 0,
      totalTaskCount: roadmap.steps?.reduce((acc, s) => acc + (s.tasks?.length || 0), 0) || 0,
      updatedAt: roadmap.updatedAt || new Date().toISOString()
    };
    
    let updatedHistory;
    if (existingIndex >= 0) {
      updatedHistory = [...history];
      updatedHistory[existingIndex] = summaryItem;
    } else {
      updatedHistory = [summaryItem, ...history];
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    return true;
  } catch (e) {
    console.error('Failed to save active roadmap:', e);
    return false;
  }
};

export const getRoadmapHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) {
      // Seed with initial demo summary
      const initial = [{
        id: INITIAL_DEMO_ROADMAP.id,
        title: INITIAL_DEMO_ROADMAP.title,
        summary: INITIAL_DEMO_ROADMAP.summary,
        stepCount: INITIAL_DEMO_ROADMAP.steps.length,
        completedTaskCount: 4,
        totalTaskCount: 15,
        updatedAt: INITIAL_DEMO_ROADMAP.updatedAt
      }];
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
  }
};

export const deleteRoadmapFromHistory = (id) => {
  try {
    const history = getRoadmapHistory().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return true;
  } catch (e) {
    console.error('Failed to delete history item:', e);
    return false;
  }
};

export const exportAllDataAsJSON = () => {
  const activeRoadmap = getStoredRoadmap();
  const history = getRoadmapHistory();
  const settings = getStoredSettings();
  
  // Safe export omitting sensitive API key unless asked
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    activeRoadmap,
    history,
    models: settings.models,
    theme: settings.theme
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Jalur-Backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

