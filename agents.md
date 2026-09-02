# 🤖 Agents & Contributor Guidelines: Komikindo Clean Reader

Dokumen ini ditujukan sebagai panduan instruksi peran bagi AI Agent maupun developer manusia yang memelihara atau memperluas fungsionalitas project **Komikindo Clean Reader**.

---

## 1. Role: Scraper & Data Integrity Agent (`@scraper-maintainer`)

### Tanggung Jawab:
* Memantau dan memastikan integritas parser regex/DOM di `src/lib/scraper.ts`.
* Jika pihak Komikindo mengubah nama class/id (misal mengganti `#chimg-auh` atau `.animepost`), lakukan probing langsung menggunakan Node.js fetch untuk mengidentifikasi container baru.
* **Invariant:** Jangan pernah meneruskan elemen gambar bertipe `.gif` atau berasal dari domain `blogger.googleusercontent.com` ke frontend karena itu adalah banner iklan judi.

### Runbook Pembaruan Scraper:
1. Ambil sampel HTML target menggunakan curl atau node fetch.
2. Identifikasi kontainer utama pembungkus gambar komik.
3. Perbarui fungsi ekstraksi dan jalankan test API lokal di `/api/chapters/[slug]`.

---

## 2. Role: UI/UX & Reader Experience Agent (`@ui-specialist`)

### Tanggung Jawab:
* Menjaga pengalaman membaca yang mulus, responsif, dan bebas gangguan (*distraction-free reading*).
* Memastikan kontras warna teks dan background memenuhi standar WCAG (Dark theme `#090d16` dengan teks `#f8fafc`).
* Memastikan reader mode mendukung:
  * Vertikal terus menerus (Webtoon mode)
  * Touch gesture / Swipe pada perangkat mobile
  * Navigasi keyboard (Panah Kiri / Panah Kanan)
  * Preloading gambar berikutnya untuk transisi instan tanpa buffering

---

## 3. Role: Performance & Cache Agent (`@performance-specialist`)

### Tanggung Jawab:
* Mengelola strategi caching di `src/lib/cache.ts` atau in-memory map.
* Mengatur TTL (Time-To-Live) cache:
  * Detail Komik: 10 - 30 menit.
  * Chapter Images: 1 - 2 jam (konten gambar chapter statis).
  * Latest Updates: 2 - 5 menit.
* Menerapkan image optimization / lazy-loading di komponen React.
