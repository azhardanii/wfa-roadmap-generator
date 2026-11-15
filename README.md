# Jalur — AI Roadmap Generator

> **Ubah Ide & Ambisi Jadi Langkah Nyata dalam Hitungan Detik.**  
> Terinspirasi dari estetika modern *emerald-pine & crystal pearl*, dibangun tanpa *AI slop*, mobile-first, dan sepenuhnya siap ekspor 16:9.

---

## ✨ Fitur Utama

- 🎯 **Dua Input Sederhana**: Cukup masukkan *Apa yang ingin dicapai* dan *Seperti apa garis finish-nya*.
- ⚡ **Generasi AI Cepat & Andal**: Menggunakan Gemini REST API dengan rantai fallback multi-model (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash`).
- 🔮 **Desain Premium Tanpa Slop**: Mengadopsi prinsip `Leonxlnx/taste-skill` dengan palet *deep pine emerald*, *glassmorphism crystal sphere*, dan tipografi rapi.
- ✏️ **Edit Penuh Inline**: Semua teks (judul, ringkasan, langkah, durasi, deskripsi, dan checklist aksi) dapat diedit langsung di tempat.
- 🔄 **Aksi AI per Langkah (P1)**: Pecah langkah lebih detail, sederhanakan, atau tambahkan tugas checklist secara kontekstual.
- 📊 **Pelacakan Progres & Perayaan**: Progres terhitung otomatis dari checklist. Kartu langkah otomatis berubah status saat 100% tuntas lengkap dengan efek konfeti!
- 📸 **Ekspor Gambar 16:9 HD (P0)**: Render resolusi tinggi 1600×900 (skala 2x 3200×1800) dengan font auto-fit dan bullet dots rapi untuk dibagikan di media sosial atau presentasi.
- 💾 **Auto-save & Riwayat**: Tersimpan otomatis di `localStorage` peramban Anda; kelola beberapa roadmap, buat salinan (duplikasi), dan ekspor cadangan JSON.
- 🔒 **Privasi 100% Client-Side**: API key dan data Anda tersimpan lokal di browser, tidak dikirim ke server pihak ketiga mana pun selain Google Gemini API.

---

## 🛠️ Tech Stack (Context7 & Modern Web Standard)

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom pine/moss palette & animations)
- **Icons**: Lucide React
- **Ekspor Gambar**: html2canvas
- **Mikro-Interaksi**: canvas-confetti, CSS transitions
- **AI Engine**: Google Gemini REST API dengan JSON structured output

---

## 🚀 Cara Menjalankan

### Menjalankan Server Development:
```bash
npm run dev
```
Akses di browser: `http://localhost:5173`

### Membangun Versi Produksi:
```bash
npm run build
npm run preview
```
Output tersimpan di folder `dist/`.

---

## 🔑 Pengaturan API Key

1. Buka aplikasi di peramban.
2. Klik tombol **API Key** di sudut kanan atas.
3. Masukkan Google Gemini API Key Anda (dapat dibuat gratis di [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. Klik **Tes Koneksi API** untuk memverifikasi.
5. Anda juga dapat mengatur urutan model cadangan (fallback chain) sesuai kebutuhan.

