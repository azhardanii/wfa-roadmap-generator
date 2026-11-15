// Gemini API Client with Multi-Model Fallback Chain & Defensive JSON Parsing

const DEFAULT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

/**
 * Clean and parse defensive JSON response from LLM
 */
export function parseDefensiveJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Respons kosong atau tidak valid dari AI.');
  }

  // 1. Remove Markdown code blocks ```json ... ``` or ``` ... ```
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  // 2. Try direct JSON parse
  try {
    const parsed = JSON.parse(cleaned);
    return sanitizeRoadmapSchema(parsed);
  } catch (err) {
    // 3. Fallback: Try regex to extract first matching JSON object {...}
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return sanitizeRoadmapSchema(parsed);
      } catch (err2) {
        console.error('Failed to parse matched JSON substring:', err2);
      }
    }
    throw new Error('Gagal membaca format JSON dari AI. Silakan coba kembali.');
  }
}

/**
 * Validates and normalizes roadmap data structure to prevent UI breaks
 */
function sanitizeRoadmapSchema(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Format data tidak sesuai.');
  }

  const title = (data.title || 'Roadmap Rencana Baru').trim();
  const summary = (data.summary || 'Rencana langkah terstruktur menuju target finish line.').trim();

  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    throw new Error('Roadmap tidak memiliki langkah kerja minimal (minimal 1 langkah).');
  }

  const steps = data.steps.map((step, sIdx) => {
    const stepId = step.id || `step-${sIdx + 1}-${Date.now()}`;
    const stepTitle = (step.title || `Langkah ${sIdx + 1}`).trim();
    const duration = (step.duration || '1 Minggu').trim();
    const description = (step.description || '').trim();

    let tasks = [];
    if (Array.isArray(step.tasks)) {
      tasks = step.tasks.map((task, tIdx) => {
        if (typeof task === 'string') {
          return {
            id: `task-${sIdx + 1}-${tIdx + 1}-${Math.random().toString(36).substr(2, 4)}`,
            text: task.trim(),
            completed: false
          };
        }
        return {
          id: task.id || `task-${sIdx + 1}-${tIdx + 1}-${Math.random().toString(36).substr(2, 4)}`,
          text: (task.text || task.title || `Tugas ${tIdx + 1}`).trim(),
          completed: Boolean(task.completed)
        };
      });
    }

    if (tasks.length === 0) {
      tasks.push({
        id: `task-${sIdx + 1}-1`,
        text: 'Pelajari dasar dan susun rencana aksi awal',
        completed: false
      });
    }

    return {
      id: stepId,
      title: stepTitle,
      duration,
      description,
      tasks
    };
  });

  return {
    id: `roadmap-${Date.now()}`,
    title,
    summary,
    steps,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Call Gemini API endpoint with model fallback
 */
export async function generateRoadmapAI({
  goal,
  finishLine,
  detailLevel = 'standar',
  timeframe = '',
  apiKey,
  modelChain = DEFAULT_MODELS
}) {
  if (!goal?.trim() || !finishLine?.trim()) {
    throw new Error('Harap isi Tujuan dan Garis Finish terlebih dahulu.');
  }

  // If no API Key is supplied, offer intelligent fallback simulation with high quality data
  if (!apiKey || apiKey.trim() === '') {
    return generateSmartMockRoadmap({ goal, finishLine, detailLevel, timeframe });
  }

  const modelsToTry = Array.isArray(modelChain) && modelChain.length > 0 
    ? modelChain 
    : DEFAULT_MODELS;

  const targetStepsCount = detailLevel === 'ringkas' ? '5 langkah' : detailLevel === 'mendalam' ? '8 hingga 9 langkah' : '6 hingga 7 langkah';

  const systemInstruction = `Kamu adalah perencana langkah hidup dan strategi tujuan yang ramah, praktis, dan mudah dipahami siapa saja.
Tugasmu adalah mengubah dua input pengguna ("Apa yang ingin dilakukan" dan "Seperti apa garis finish-nya") menjadi roadmap terstruktur yang jelas, realistis, membumi, dan bebas dari istilah teknis yang membingungkan jika topiknya bersifat umum.

ATURAN WAJIB:
1. Bahasa: Gunakan bahasa yang sama dengan input pengguna (jika Indonesia, jawab dalam bahasa Indonesia yang hangat, lugas, dan mudah dipraktikkan orang awam).
2. Tanda Baca: DILARANG menggunakan tanda pisah panjang atau long dash (— atau –). Gunakan tanda koma, titik, atau tanda hubung biasa (-) bila diperlukan.
3. Format: Kamu HARUS merespons HANYA dengan JSON valid murni tanpa teks pembuka atau penutup.
4. Skema JSON harus tepat seperti ini:
{
  "title": "Judul roadmap yang memikat dan spesifik",
  "summary": "Ringkasan strategi 1-2 kalimat padat yang menjelaskan arah eksekusi",
  "steps": [
    {
      "id": "step-1",
      "title": "Nama langkah tindakan konkret",
      "duration": "Estimasi durasi (misal: '2 Minggu' atau '5 Hari')",
      "description": "Deskripsi singkat 1-2 kalimat tentang fokus dan tujuan langkah ini",
      "tasks": [
        { "id": "t1-1", "text": "Aksi spesifik yang bisa dicentang", "completed": false }
      ]
    }
  ]
}
5. Jumlah langkah: buat tepat ${targetStepsCount}.
6. Tugas per langkah: buat 3 sampai 5 aksi checklist per langkah.
7. Setiap tugas harus berupa kata kerja tindakan nyata yang langsung bisa dikerjakan hari ini.`;

  const userPrompt = `Tujuan / Apa yang ingin dicapai:
"${goal.trim()}"

Garis Finish / Indikator Berhasil:
"${finishLine.trim()}"
${timeframe ? `Target Jangka Waktu: ${timeframe}` : ''}

Buat roadmap JSON sesuai instruksi sekarang.`;

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        const errMsg = errorData?.error?.message || `HTTP ${status}`;
        console.warn(`Model ${model} gagal (${status}): ${errMsg}. Mencoba model cadangan...`);
        lastError = new Error(`Model ${model} error: ${errMsg}`);
        continue; // Fallback to next model
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        console.warn(`Model ${model} mengembalikan respons kosong. Mencoba fallback...`);
        lastError = new Error(`Model ${model} tidak mengembalikan teks.`);
        continue;
      }

      const parsedRoadmap = parseDefensiveJSON(generatedText);
      return {
        roadmap: {
          ...parsedRoadmap,
          goal: goal.trim(),
          finishLine: finishLine.trim(),
          modelUsed: model,
          startDate: new Date().toISOString().split('T')[0],
        },
        modelUsed: model
      };
    } catch (err) {
      console.warn(`Error saat memanggil ${model}:`, err);
      lastError = err;
    }
  }

  // If all models in the fallback chain failed
  throw new Error(
    `Semua model (${modelsToTry.join(', ')}) gagal dijalankan. ${
      lastError ? lastError.message : 'Silakan periksa API Key atau koneksi internet Anda.'
    }`
  );
}

/**
 * AI Step Action: Expand step or Simplify step
 */
export async function refineStepWithAI({
  step,
  action, // 'expand' | 'simplify' | 'add_tasks'
  goal,
  apiKey,
  modelChain = DEFAULT_MODELS
}) {
  if (!apiKey) {
    throw new Error('API Key diperlukan untuk menggunakan fitur AI per langkah.');
  }

  const model = modelChain[0] || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

  let instruction = '';
  if (action === 'expand') {
    instruction = `Pecah langkah berikut menjadi lebih detail dengan sub-tugas yang lebih spesifik, taktis, dan terurai. Pertahankan konteks tujuan umum: "${goal}".`;
  } else if (action === 'simplify') {
    instruction = `Sederhanakan langkah berikut agar lebih ringkas, fokus hanya pada hal paling esensial (3 tugas kunci saja). Pertahankan konteks tujuan umum: "${goal}".`;
  } else {
    instruction = `Tambahkan 2-3 tugas checklist relevan baru untuk memperkuat langkah ini.`;
  }

  const prompt = `${instruction}
Pastikan bahasa mudah dipahami dan JANGAN gunakan tanda pisah panjang (— atau –).
Langkah saat ini:
Judul: ${step.title}
Deskripsi: ${step.description}
Durasi: ${step.duration}
Tugas saat ini: ${step.tasks.map(t => `- ${t.text}`).join('\n')}

Keluarkan HANYA JSON dengan format:
{
  "title": "string (opsional update)",
  "description": "string",
  "duration": "string",
  "tasks": [
    { "text": "string", "completed": false }
  ]
}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
    })
  });

  if (!response.ok) {
    throw new Error('Gagal memperbarui langkah dengan AI.');
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, ''));

  return {
    ...step,
    title: parsed.title || step.title,
    description: parsed.description || step.description,
    duration: parsed.duration || step.duration,
    tasks: (parsed.tasks || []).map((t, idx) => ({
      id: `task-refined-${Date.now()}-${idx}`,
      text: typeof t === 'string' ? t : t.text,
      completed: false
    }))
  };
}

/**
 * Ping test to verify user's API Key
 */
export async function testGeminiKey(apiKey, model = 'gemini-2.5-flash') {
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, message: 'API Key tidak boleh kosong.' };
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Ping! Jawab hanya kata "OK".' }] }]
      })
    });

    if (response.ok) {
      return { success: true, message: `Koneksi berhasil! Model ${model} aktif dan siap digunakan.` };
    } else {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errData?.error?.message || `HTTP ${response.status}: Gagal terhubung ke Gemini.`
      };
    }
  } catch (err) {
    return { success: false, message: err.message || 'Koneksi jaringan gagal.' };
  }
}

/**
 * Smart Mock Roadmap generator if user has no API Key yet
 */
function generateSmartMockRoadmap({ goal, finishLine, detailLevel, timeframe }) {
  const g = goal.toLowerCase();
  let steps = [];

  const count = detailLevel === 'ringkas' ? 5 : detailLevel === 'mendalam' ? 8 : 6;

  // 1. HEALTH: berat badan, tidur, olahraga, sehat, makan, lari, gym, diet, bugar
  if (
    g.includes('sehat') || g.includes('berat') || g.includes('olahraga') ||
    g.includes('tidur') || g.includes('lari') || g.includes('diet') ||
    g.includes('bugar') || g.includes('gym') || g.includes('makan')
  ) {
    steps = [
      {
        title: 'Cek Kondisi Awal & Rapikan Lingkungan Harian',
        duration: '1 Minggu',
        description: 'Kenali kebiasaan harian saat ini agar perubahan terasa ringan dan realistis.',
        tasks: [
          { text: 'Catat berat badan, jam tidur, dan pola makan selama 3 hari pertama', completed: true },
          { text: 'Ganti camilan tinggi gula di rumah dengan buah potong atau kacang panggang', completed: false },
          { text: 'Siapkan botol minum 2 liter dan sepatu olahraga yang nyaman dipakai', completed: false }
        ]
      },
      {
        title: 'Perbaiki Kualitas Tidur & Hidrasi Tubuh',
        duration: '2 Minggu',
        description: 'Tidur cukup membantu mengendalikan rasa lapar dan memulihkan energi harian.',
        tasks: [
          { text: 'Tetapkan jam tidur yang konsisten sebelum pukul 22.30 setiap malam', completed: false },
          { text: 'Letakkan ponsel di luar jangkauan tempat tidur 30 menit sebelum terlelap', completed: false },
          { text: 'Minum segelas air putih segera setelah bangun tidur pagi', completed: false }
        ]
      },
      {
        title: 'Bangun Kebiasaan Gerak Ringan Secara Rutin',
        duration: '3 Minggu',
        description: 'Mulai dari gerakan sederhana agar tubuh beradaptasi tanpa rasa nyeri berlebihan.',
        tasks: [
          { text: 'Jalan kaki santai 30 menit minimal 4 kali seminggu di sekitar rumah', completed: false },
          { text: 'Lakukan peregangan 10 menit setiap sore setelah selesai beraktivitas', completed: false },
          { text: 'Ajak teman atau keluarga berjalan pagi di akhir pekan agar tetap semangat', completed: false }
        ]
      },
      {
        title: 'Atur Porsi Makan Seimbang & Latihan Otot Dasar',
        duration: '4 Minggu',
        description: 'Kombinasikan makanan bergizi rumahan dengan latihan kekuatan ringan.',
        tasks: [
          { text: 'Isi setengah piring dengan sayuran, seperempat protein, dan seperempat nasi', completed: false },
          { text: 'Masak menu sederhana untuk makan siang di kantor atau kampus', completed: false },
          { text: 'Lakukan latihan kekuatan tubuh dasar 2 kali seminggu selama 20 menit', completed: false }
        ]
      },
      {
        title: 'Evaluasi Berkala & Jaga Konsistensi Jangka Panjang',
        duration: '2 Minggu',
        description: 'Bandingkan kemajuan tubuh dan sesuaikan jadwal agar nyaman dijalani terus menerus.',
        tasks: [
          { text: 'Catat perubahan stamina, kualitas tidur, dan berat badan setiap akhir bulan', completed: false },
          { text: 'Berikan waktu istirahat aktif 1 hari dalam seminggu tanpa rasa bersalah', completed: false },
          { text: 'Pertahankan kebiasaan baik hingga mencapai garis finish yang ditargetkan', completed: false }
        ]
      }
    ];
  // 2. WEALTH: dana darurat, tabungan, utang, investasi, keuangan, rumah, gaji, nabung
  } else if (
    g.includes('dana') || g.includes('tabung') || g.includes('nabung') ||
    g.includes('utang') || g.includes('cicilan') || g.includes('uang') ||
    g.includes('investasi') || g.includes('rumah') || g.includes('budget') || g.includes('gaji')
  ) {
    steps = [
      {
        title: 'Audit Pemasukan, Pengeluaran & Daftar Kewajiban',
        duration: '1 Minggu',
        description: 'Ketahui ke mana perginya setiap rupiah agar mudah melihat pos yang bisa dihemat.',
        tasks: [
          { text: 'Kumpulkan catatan pengeluaran 30 hari terakhir dari rekening dan dompet digital', completed: true },
          { text: 'Pisahkan pengeluaran wajib (makan, tempat tinggal, tagihan) dan keinginan', completed: false },
          { text: 'Hitung total kewajiban atau cicilan yang masih berjalan beserta bunganya', completed: false }
        ]
      },
      {
        title: 'Rapikan Anggaran Bulanan & Potong Kebocoran Halus',
        duration: '2 Minggu',
        description: 'Pangkas langganan tidak terpakai dan terapkan batas belanja harian yang jelas.',
        tasks: [
          { text: 'Batalkan langganan aplikasi atau layanan yang jarang dibuka selama 2 bulan', completed: false },
          { text: 'Terapkan pembagian pos gaji otomatis (kebutuhan, tabungan, hiburan)', completed: false },
          { text: 'Siapkan rekening terpisah khusus tabungan tanpa kartu ATM untuk mencegah penarikan impulsif', completed: false }
        ]
      },
      {
        title: 'Mulai Setoran Rutin di Awal Bulan',
        duration: '4 Minggu',
        description: 'Sisihkan tabungan atau pelunasan tepat saat menerima penghasilan, bukan menunggu sisa.',
        tasks: [
          { text: 'Aktifkan transfer otomatis ke rekening tujuan setiap tanggal gajian', completed: false },
          { text: 'Prioritaskan pelunasan cicilan dengan bunga tertinggi atau nominal terkecil lebih dulu', completed: false },
          { text: 'Catat perkembangan saldo atau penurunan utang setiap akhir minggu', completed: false }
        ]
      },
      {
        title: 'Tambah Penghasilan Sampingan & Jual Barang Tidak Terpakai',
        duration: '4 Minggu',
        description: 'Percepat pencapaian target dengan menaikkan arus kas masuk dari aset sekitar.',
        tasks: [
          { text: 'Kumpulkan barang layak pakai di rumah dan jual secara daring', completed: false },
          { text: 'Tawarkan jasa keahlian lepas pada akhir pekan untuk menambah dana tabungan', completed: false },
          { text: 'Masukkan 100% penghasilan tambahan langsung ke pos garis finish keuangan', completed: false }
        ]
      },
      {
        title: 'Amankan Dana & Rayakan Pencapaian Garis Finish',
        duration: '2 Minggu',
        description: 'Tempatkan dana di instrumen aman yang mudah dicairkan saat dibutuhkan.',
        tasks: [
          { text: 'Pastikan dana darurat tersimpan di rekening terpisah atau reksa dana pasar uang resmi', completed: false },
          { text: 'Tinjau ulang target keuangan berikutnya setelah target pertama terpenuhi', completed: false },
          { text: 'Rayakan kebebasan finansial tahap awal bersama keluarga secara hemat', completed: false }
        ]
      }
    ];
  // 3. RELATION: menikah, keluarga, komunikasi, pasangan, teman, orang tua, sosial
  } else if (
    g.includes('nikah') || g.includes('keluarga') || g.includes('komunikasi') ||
    g.includes('pasangan') || g.includes('teman') || g.includes('orang tua') ||
    g.includes('relasi') || g.includes('hubungan') || g.includes('sosial')
  ) {
    steps = [
      {
        title: 'Refleksi Diri & Samakan Visi Bersama',
        duration: '1 Minggu',
        description: 'Buka ruang obrolan yang tenang untuk menyamakan harapan dan nilai yang dijunjung.',
        tasks: [
          { text: 'Luangkan waktu berbicara santai tanpa gangguan ponsel selama 30 menit', completed: true },
          { text: 'Tuliskan 3 hal terpenting yang diharapkan dari hubungan atau acara ini', completed: false },
          { text: 'Dengarkan sudut pandang pihak lain hingga tuntas tanpa menyela', completed: false }
        ]
      },
      {
        title: 'Susun Rencana Praktis & Pembagian Peran',
        duration: '2 Minggu',
        description: 'Ubah kesepakatan menjadi jadwal pertemuan, anggaran, atau tanggung jawab yang adil.',
        tasks: [
          { text: 'Buat daftar kebutuhan prioritas beserta estimasi biaya yang realistis', completed: false },
          { text: 'Bagi tugas secara seimbang agar tidak ada pihak yang merasa kewalahan sendirian', completed: false },
          { text: 'Tetapkan jadwal pertemuan keluarga atau kumpul rutin setiap minggu/bulan', completed: false }
        ]
      },
      {
        title: 'Bangun Kebiasaan Apresiasi & Komunikasi Sehat',
        duration: '3 Minggu',
        description: 'Perkuat ikatan emosional lewat perhatian kecil yang tulus dan konsisten.',
        tasks: [
          { text: 'Biasakan menyampaikan terima kasih secara spesifik atas bantuan kecil setiap hari', completed: false },
          { text: 'Gunakan kalimat yang fokus pada perasaan diri sendiri saat menyampaikan kritik', completed: false },
          { text: 'Rencanakan aktivitas berdua atau kumpul keluarga tanpa membahas pekerjaan', completed: false }
        ]
      },
      {
        title: 'Selesaikan Persiapan Teknis & Libatkan Orang Terdekat',
        duration: '3 Minggu',
        description: 'Pastikan seluruh detail logistik dan komunikasi dengan keluarga besar berjalan lancar.',
        tasks: [
          { text: 'Konfirmasi kesediaan pihak terkait dan selesaikan dokumen penting lebih awal', completed: false },
          { text: 'Adakan evaluasi ringan untuk memastikan semua pihak merasa nyaman dan didengar', completed: false },
          { text: 'Siapkan rencana cadangan apabila terjadi perubahan mendadak pada hari pelaksanaan', completed: false }
        ]
      },
      {
        title: 'Momen Puncak & Rawat Keharmonisan Berkelanjutan',
        duration: '1 Minggu',
        description: 'Nikmati momen kebersamaan dengan hati tenang dan lanjutkan kebiasaan baik setelahnya.',
        tasks: [
          { text: 'Jalani momen penting atau rutinitas baru dengan penuh kehadiran dan syukur', completed: false },
          { text: 'Evaluasi kebersamaan secara berkala setiap bulan agar komunikasi tetap hangat', completed: false }
        ]
      }
    ];
  // 4. SKILL: bahasa inggris, bicara, public speaking, masak, menyetir, belajar
  } else if (
    g.includes('bahasa') || g.includes('inggris') || g.includes('bicara') ||
    g.includes('speaking') || g.includes('masak') || g.includes('setir') ||
    g.includes('mobil') || g.includes('belajar') || g.includes('skripsi')
  ) {
    steps = [
      {
        title: 'Tentukan Materi Dasar & Jadwal Latihan Singkat Harian',
        duration: '1 Minggu',
        description: 'Siapkan sumber belajar yang ramah pemula dan sisihkan waktu tetap 20 menit sehari.',
        tasks: [
          { text: 'Pilih 1 sumber belajar utama saja agar tidak bingung kebanyakan referensi', completed: true },
          { text: 'Blok waktu 20 menit setiap pagi atau malam khusus untuk berlatih tanpa gangguan', completed: false },
          { text: 'Siapkan buku catatan atau daftar kosakata/resep dasar yang paling sering dipakai', completed: false }
        ]
      },
      {
        title: 'Praktik Terbimbing & Tiru Contoh Terbaik',
        duration: '2 Minggu',
        description: 'Fokus langsung mempraktikkan dasar keahlian dibandingkan hanya membaca teori.',
        tasks: [
          { text: 'Ulangi latihan dasar secara perlahan hingga gerakan atau pengucapan terasa alami', completed: false },
          { text: 'Rekam atau catat hasil latihan sendiri untuk melihat bagian yang perlu diperbaiki', completed: false },
          { text: 'Pelajari kesalahan umum pemula dan cara menghindarinya', completed: false }
        ]
      },
      {
        title: 'Tantangan Praktik Nyata Skala Kecil',
        duration: '3 Minggu',
        description: 'Uji keahlian di situasi sehari-hari yang aman agar rasa percaya diri tumbuh cepat.',
        tasks: [
          { text: 'Praktikkan langsung di depan cermin, keluarga, atau lingkungan yang mendukung', completed: false },
          { text: 'Selesaikan 3 proyek latihan mini dari awal sampai selesai tanpa bantuan penuh', completed: false },
          { text: 'Minta masukan jujur dari teman yang lebih berpengalaman', completed: false }
        ]
      },
      {
        title: 'Tingkatkan Kelancaran & Atasi Rasa Gugup',
        duration: '3 Minggu',
        description: 'Latih kecepatan, variasi kasus, dan ketenangan saat menghadapi tantangan nyata.',
        tasks: [
          { text: 'Uji kemampuan pada kondisi nyata dengan tingkat kesulitan bertahap', completed: false },
          { text: 'Catat 5 hal yang masih sering keliru lalu latih khusus bagian tersebut', completed: false },
          { text: 'Ikuti komunitas belajar atau forum diskusi agar tetap konsisten', completed: false }
        ]
      },
      {
        title: 'Uji Akhir & Pencapaian Garis Finish Keahlian',
        duration: '1 Minggu',
        description: 'Buktikan kemampuan baru dalam situasi sebenarnya sesuai target yang Anda tetapkan.',
        tasks: [
          { text: 'Laksanakan ujian praktik, presentasi, atau hidangan lengkap untuk dinilai hasilnya', completed: false },
          { text: 'Bagikan hasil belajar atau refleksi perjalanan sebagai pengingat kemajuan diri', completed: false }
        ]
      }
    ];
  // 5. CREATIVE & CONTENT: youtube, konten, buku, foto, video, tiktok, tulis
  } else if (
    g.includes('youtube') || g.includes('konten') || g.includes('content') ||
    g.includes('video') || g.includes('tiktok') || g.includes('buku') ||
    g.includes('tulis') || g.includes('foto') || g.includes('podcast')
  ) {
    steps = [
      {
        title: 'Tentukan Topik Khas & Kenali Calon Penikmat Karya',
        duration: '1 Minggu',
        description: 'Pilih tema utama yang paling Anda kuasai dan nikmati agar ide tidak cepat habis.',
        tasks: [
          { text: 'Tentukan 1 topik utama dan siapa orang yang paling terbantu oleh karya ini', completed: true },
          { text: 'Kumpulkan 15 ide judul atau topik menarik dari pertanyaan orang di sekitar', completed: false },
          { text: 'Rapikan tampilan profil, foto, dan bio agar langsung menjelaskan isi karya Anda', completed: false }
        ]
      },
      {
        title: 'Siapkan Alat Sederhana & Format Karya Baku',
        duration: '1 Minggu',
        description: 'Gunakan perangkat yang sudah ada dengan pencahayaan alami dan suara yang jernih.',
        tasks: [
          { text: 'Pilih sudut ruangan yang terang oleh cahaya jendela dan minim suara bising', completed: false },
          { text: 'Buat pola susunan karya (pembuka menarik, isi padat, ajakan penutup)', completed: false },
          { text: 'Lakukan 1 kali uji coba produksi singkat untuk mengecek kualitas gambar dan suara', completed: false }
        ]
      },
      {
        title: 'Produksi Karya Pertama Secara Berkelompok',
        duration: '2 Minggu',
        description: 'Hasilkan beberapa karya sekaligus dalam satu waktu agar jadwal tayang tetap aman.',
        tasks: [
          { text: 'Susun naskah atau kerangka singkat untuk 4 hingga 5 karya perdana', completed: false },
          { text: 'Rekam atau tulis draf awal tanpa terlalu khawatir pada kesempurnaan berlebihan', completed: false },
          { text: 'Sunting hasil akhir agar alurnya ringkas, rapi, dan enak diikuti', completed: false }
        ]
      },
      {
        title: 'Terbitkan Konsisten & Ajak Audiens Berinteraksi',
        duration: '3 Minggu',
        description: 'Bangun kebiasaan tayang di hari yang sama setiap minggu dan sapa setiap komentar.',
        tasks: [
          { text: 'Buat jadwal terbit rutin misal 2 kali seminggu pada jam santai audiens', completed: false },
          { text: 'Buat sampul depan dan judul yang jelas serta memancing rasa ingin tahu', completed: false },
          { text: 'Balas seluruh komentar dan catat ide baru yang muncul dari penonton atau pembaca', completed: false }
        ]
      },
      {
        title: 'Evaluasi Karya Terfavorit & Capai Garis Finish',
        duration: '2 Minggu',
        description: 'Lihat karya mana yang paling disukai lalu tingkatkan kualitas edisi berikutnya.',
        tasks: [
          { text: 'Bandingkan tingkat perhatian audiens pada 5 karya pertama', completed: false },
          { text: 'Perbaiki 3 detik atau paragraf pembuka berdasarkan karya yang paling berhasil', completed: false },
          { text: 'Capai target publikasi penuh dan lanjutkan seri karya berikutnya', completed: false }
        ]
      }
    ];
  // 6. WORK & GENERAL (Bisnis kecil, karier, pekerjaan, umum)
  } else {
    steps = [
      {
        title: 'Persiapan Awal & Pemetaan Kebutuhan Utama',
        duration: '1 Minggu',
        description: 'Uraikan gambaran besar tujuan Anda menjadi daftar kebutuhan yang konkret dan terukur.',
        tasks: [
          { text: 'Catat alasan utama dan hasil nyata yang ingin dirasakan saat target tercapai', completed: true },
          { text: 'Pelajari 2 hingga 3 contoh orang yang sudah berhasil mencapai tujuan serupa', completed: false },
          { text: 'Siapkan alat, waktu luang harian, dan catatan perkembangan khusus', completed: false }
        ]
      },
      {
        title: 'Bangun Fondasi & Uji Langkah Skala Kecil',
        duration: '2 Minggu',
        description: 'Mulai dari versi paling sederhana agar Anda segera mendapatkan pengalaman langsung.',
        tasks: [
          { text: 'Kerjakan bagian paling penting dalam bentuk percobaan kecil lebih dulu', completed: false },
          { text: 'Catat kendala yang muncul pada percobaan pertama dan cari solusi praktisnya', completed: false },
          { text: 'Sesuaikan jadwal harian agar progres tetap berjalan meski sedang sibuk', completed: false }
        ]
      },
      {
        title: 'Eksekusi Tahap Inti Secara Terjadwal',
        duration: '3 Minggu',
        description: 'Fokus menyelesaikan separuh perjalanan dengan menjaga ritme kerja yang konsisten.',
        tasks: [
          { text: 'Selesaikan target mingguan satu per satu tanpa menunda pekerjaan utama', completed: false },
          { text: 'Evaluasi hasil kerja setiap akhir minggu dan perbaiki bagian yang kurang rapi', completed: false },
          { text: 'Kurangi gangguan kecil yang sering memecah konsentrasi saat jam fokus', completed: false }
        ]
      },
      {
        title: 'Penyempurnaan Kualitas & Masukan Orang Terpercaya',
        duration: '2 Minggu',
        description: 'Haluskan hasil kerja dan minta pandangan orang lain sebelum menuju tahap akhir.',
        tasks: [
          { text: 'Periksa kembali kelengkapan hasil agar sesuai dengan standar garis finish Anda', completed: false },
          { text: 'Minta saran konstruktif dari mentor, rekan, atau orang yang berpengalaman', completed: false },
          { text: 'Lakukan perbaikan terakhir berdasarkan masukan yang paling berdampak', completed: false }
        ]
      },
      {
        title: 'Penyelesaian Akhir Menuju Garis Finish',
        duration: '1 Minggu',
        description: `Tuntaskan detail terakhir hingga terwujud: ${finishLine}.`,
        tasks: [
          { text: 'Periksa daftar akhir seluruh syarat keberhasilan sebelum dinyatakan selesai', completed: false },
          { text: 'Selesaikan atau luncurkan hasil akhir dengan percaya diri', completed: false },
          { text: 'Apresiasi diri Anda atas komitmen yang terjaga hingga garis finish!', completed: false }
        ]
      }
    ];
  }

  // Pad or slice cleanly to match requested depth (5 to 8 steps)
  while (steps.length < count) {
    const num = steps.length + 1;
    steps.splice(steps.length - 1, 0, {
      title: `Penguatan Kebiasaan & Evaluasi Tahap ${num}`,
      duration: '1 Minggu',
      description: 'Pastikan hasil tahap sebelumnya sudah berjalan lancar sebelum masuk ke tahap penutup.',
      tasks: [
        { text: 'Tinjau ulang kendala harian dan sesuaikan strategi agar lebih nyaman', completed: false },
        { text: 'Selesaikan tugas tertunda dari minggu sebelumnya', completed: false },
        { text: 'Catat kemajuan utama yang sudah berhasil dirasakan', completed: false }
      ]
    });
  }

  const adjustedSteps = steps.slice(0, count).map((s, idx) => ({
    id: `step-${idx + 1}-${Date.now()}`,
    title: s.title,
    duration: s.duration,
    description: s.description,
    tasks: s.tasks.map((t, tIdx) => ({
      id: `task-${idx + 1}-${tIdx + 1}`,
      text: t.text,
      completed: Boolean(t.completed)
    }))
  }));

  return {
    roadmap: {
      id: `roadmap-${Date.now()}`,
      title: goal,
      summary: `Rencana langkah terstruktur menuju target: ${finishLine}.`,
      goal,
      finishLine,
      steps: adjustedSteps,
      modelUsed: '',
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    modelUsed: ''
  };
}

