# PRD: Jalur — AI Roadmap Generator

Versi 1.0 · Bahasa: Indonesia · Status: Draft siap dikembangkan

## 1. Ringkasan
Jalur adalah web app yang mengubah dua input singkat (apa yang ingin dilakukan dan seperti apa garis finish-nya) menjadi roadmap terstruktur: judul, ringkasan, langkah berurutan, deskripsi, estimasi durasi, dan checklist. Hasilnya bisa diedit penuh, dilacak progresnya, dan diekspor menjadi gambar landscape 16:9 untuk dibagikan.

## 2. Masalah dan Tujuan
**Masalah:** orang punya tujuan besar tetapi bingung memecahnya menjadi langkah konkret. Template statis tidak sesuai konteks, dan menulis roadmap manual memakan waktu.

**Tujuan produk**
1. Dari input ke roadmap lengkap dalam kurang dari 30 detik.
2. Hasil AI bisa diedit sepenuhnya tanpa menulis ulang dari nol.
3. Output visual rapi dan siap diposting (16:9).
4. Tetap berfungsi saat model utama kena limit (fallback otomatis).

**Bukan tujuan (v1):** kolaborasi real-time, manajemen proyek penuh, penagihan.

## 3. Target Pengguna
| Persona | Kebutuhan |
|---|---|
| Konten kreator | Roadmap channel, kolaborasi brand, rencana trip konten, bagikan ke audiens |
| Freelancer dan pekerja remote | Rencana skill, karier, transisi kerja |
| Mahasiswa dan pelajar | Rencana belajar, skripsi, ujian |
| Founder pemula | Rencana peluncuran produk |

## 4. User Flow
1. Buka app, isi API key di Pengaturan (sekali saja).
2. Isi dua kolom: "Apa yang ingin kamu lakukan?" dan "Seperti apa garis finish-nya?".
3. Klik "Buat roadmap" lalu tunggu proses AI.
4. Roadmap muncul: edit teks, centang tugas, urutkan langkah.
5. Klik "Simpan sebagai gambar" untuk mengunduh PNG 16:9 tanpa checkbox.

## 5. Kebutuhan Fungsional

### 5.1 Input (P0)
- FR-1: Dua field wajib: Tujuan dan Garis Finish. Validasi kosong dengan pesan jelas.
- FR-2: Bahasa output mengikuti bahasa input.
- FR-3: Tombol berubah menjadi status loading dan tidak bisa diklik ganda.

### 5.2 Generasi AI (P0)
- FR-4: Memanggil Gemini API (`generateContent`) dengan respons JSON.
- FR-5: Skema output: `title`, `summary`, `steps[]` (`title`, `description`, `duration`, `tasks[]`). Jumlah langkah 5–9, tugas per langkah 3–6.
- FR-6: Rantai model: `gemini-4-hydrogen` → `gemini-3.8-flash` → `gemini-3.5-flash-lite`. Pindah ke model berikutnya saat HTTP 429, 404, 500, 502, 503, 504. Nama model bisa diubah di Pengaturan tanpa mengubah kode.
- FR-7: Parsing JSON defensif (menghapus code fence, validasi minimal 1 langkah). Jika gagal, tampilkan pesan dan tawarkan ulangi.
- FR-8: Menampilkan model mana yang akhirnya dipakai.

### 5.3 Tampilan dan Edit Roadmap (P0)
- FR-9: Setiap langkah menampilkan headline, deskripsi, durasi, daftar tugas dengan checkbox.
- FR-10: Edit inline untuk judul roadmap, ringkasan, judul langkah, deskripsi, durasi, teks tugas.
- FR-11: Tambah dan hapus langkah serta tugas. Konfirmasi sebelum menghapus langkah.
- FR-12: Urutkan langkah lewat drag and drop dan tombol naik/turun (aksesibel untuk keyboard dan mobile).
- FR-13: Progress bar total, dihitung dari tugas yang tercentang. Langkah selesai otomatis berubah warna.
- FR-14: Auto-save ke penyimpanan lokal browser.

### 5.4 Ekspor Gambar (P0)
- FR-15: Ekspor PNG rasio 16:9 (1600×900, render 2x).
- FR-16: Checkbox otomatis disembunyikan; tugas tampil sebagai bullet.
- FR-17: Ukuran font otomatis menyesuaikan agar seluruh langkah muat dalam satu gambar.
- FR-18: Nama file diambil dari judul roadmap.

### 5.5 Pengaturan (P0)
- FR-19: Input API key (disimpan lokal) dan tiga slot model.

## 6. Fitur Tambahan yang Direkomendasikan
| Prioritas | Fitur | Nilai |
|---|---|---|
| P1 | Regenerate per langkah ("pecah lebih detail", "sederhanakan") | Kontrol tanpa membuat ulang semuanya |
| P1 | Pilihan jangka waktu dan level detail (ringkas, standar, mendalam) | Hasil lebih sesuai konteks |
| P1 | Tanggal mulai dan target, otomatis menghitung jadwal tiap langkah | Roadmap jadi rencana nyata |
| P1 | Beberapa roadmap tersimpan (riwayat) dan duplikasi | Kelola banyak tujuan |
| P1 | Ekspor tambahan: PDF, Markdown, JSON, salin teks | Fleksibel dibagikan |
| P2 | Tema visual untuk gambar (kuning-hijau-biru, gelap, minimalis) dan rasio 1:1 atau 9:16 | Cocok untuk konten sosial |
| P2 | Impor/ekspor JSON untuk backup | Data tidak hilang |
| P2 | Link publik hanya-baca | Berbagi progres |
| P2 | Pengingat dan streak harian | Konsistensi |
| P3 | Template awal (channel YouTube, skripsi, trip, belajar coding) | Mulai lebih cepat |
| P3 | Undo/redo | Aman saat mengedit |

## 7. Kebutuhan Non-Fungsional
- **Performa:** generasi rata-rata < 30 detik; UI tetap responsif saat menunggu.
- **Keandalan:** fallback tiga lapis; pesan error spesifik (key salah, kuota habis, jaringan putus).
- **Aksesibilitas:** fokus keyboard terlihat, kontras memadai, label ARIA pada kontrol, hormati `prefers-reduced-motion`.
- **Responsif:** nyaman dari 360px sampai desktop. Mendukung mode terang dan gelap.
- **Privasi:** data roadmap hanya di browser pengguna; hanya teks input yang dikirim ke Gemini.

## 8. Keamanan API Key (penting)
API key yang dipakai langsung di sisi browser **terlihat oleh siapa pun** yang membuka app. Karena itu:
- Versi ini tidak menanam key di kode. Key diisi lewat Pengaturan dan disimpan di browser pemakai.
- Jika app akan dipublikasikan, buat **backend proxy** (mis. Cloudflare Worker atau Vercel Function) yang menyimpan key sebagai environment variable dan meneruskan permintaan.
- Batasi key di Google AI Studio/Cloud (pembatasan referrer/IP dan kuota harian).
- Key yang sudah pernah ditempel di chat atau repo sebaiknya dianggap bocor: cabut dan buat yang baru.

## 9. Arsitektur
- **Frontend:** React + Vite + Tailwind (mobile first design UI & reponsive for desktop).
- **AI:** Gemini REST API dengan `responseMimeType: application/json`.
- **Penyimpanan:** localStorage (v1); v2 database dengan akun.
- **Ekspor gambar:** html2canvas pada elemen khusus 1600×900 di luar layar.
- **Integrasi skill Gemini:** repo `google-gemini/gemini-skills` adalah paket untuk agen coding (CLI). Pemasangannya dilakukan di lingkungan pengembangan, bukan di runtime app. Perintah: `agy plugin install https://github.com/google-gemini/gemini-skills`.

## 10. Desain
- Gaya: glassmorphism di atas latar gradien kuning, hijau, dan biru; kartu transparan blur, aksen hijau per langkah, berubah biru saat selesai.
- Tipografi: Bricolage Grotesque (judul) dan DM Sans (isi).
- Satu momen utama: tombol generate bergradien; elemen lain dibuat tenang.
- Gambar ekspor memakai latar solid-gradien (tanpa blur) agar hasil render konsisten.

## 11. Metrik Keberhasilan
| Metrik | Target |
|---|---|
| Waktu hingga roadmap pertama | < 30 detik |
| Tingkat generasi berhasil (termasuk fallback) | > 98% |
| Pengguna yang mengedit hasil AI | > 60% |
| Pengguna yang mengekspor gambar | > 40% |
| Rata-rata progres roadmap setelah 7 hari | > 25% |

## 12. Edge Case
- Input terlalu pendek: minta detail lebih (validasi panjang minimum 10 karakter di v1.1).
- Semua model gagal: tampilkan error dan simpan input agar tidak hilang.
- Terlalu banyak langkah untuk satu gambar: font mengecil otomatis hingga batas bawah.
- Teks sangat panjang hasil edit: dipotong rapi di gambar ekspor.
- Browser tanpa localStorage: app tetap jalan, tanpa auto-save.

## 13. Rilis Bertahap
1. **v1.0:** semua P0 (sudah ada di file `roadmap-generator.html`).
2. **v1.1:** regenerate per langkah, jadwal tanggal, PDF/Markdown.
3. **v1.2:** riwayat roadmap, tema gambar, backend proxy.
4. **v2.0:** akun, sinkronisasi, link publik, pengingat.

## 14. Risiko
| Risiko | Mitigasi |
|---|---|
| Nama model berubah atau belum tersedia | Nama bisa diedit di Pengaturan; fallback bertingkat |
| Key bocor | Proxy backend, batasi key, rotasi |
| Output AI tidak akurat | Semua bisa diedit; regenerate per langkah |
| Kuota habis | Fallback model, pesan jelas |