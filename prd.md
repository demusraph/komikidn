# 📄 Product Requirement Document (PRD): Komikindo Clean Reader

## 1. Executive Summary & Problem Statement
Membaca komik di situs-situs scanlation publik (seperti Komikindo) seringkali memberikan pengalaman pengguna (*user experience*) yang sangat buruk akibat:
1. **Click-Hijacking & Popunders:** Begitu pengguna menyentuh layar untuk scroll atau zoom, skrip pihak ketiga (`windowylarvule.com`, `ileacringes.com`) mencegat klik dan membuka aplikasi lain seperti Shopee/Lazada atau dialihkan ke halaman judi online.
2. **In-Page Gambling Banners:** Adanya belasan GIF animasi judol (`PENTASLOT`, `KAIKOSLOT`, `RUSIA777`, dll.) di dalam container `.img-landmine` tepat di sekitar lembar komik.
3. **Beban Data & Lag:** Berbagai tracker, skrip iklan agresif, dan overlay jebakan memperlambat performa rendering di perangkat mobile.

**Solusi:**
Membangun **Komikindo Clean Reader** — web application mandiri yang bertindak sebagai *clean presentation & reading client*. Sistem mengekstraksi metadata dan gambar murni langsung dari sumber tanpa mengeksekusi atau merender skrip iklan, popunder, maupun banner judol apa pun.

---

## 2. Target Persona & User Stories
* **Target Pengguna:** Pembaca komik webtoon/manga/manhwa/manhua yang menginginkan kenyamanan membaca tanpa interupsi, cepat di mobile, dan bebas konten terlarang (judol/phishing).

### User Stories:
1. *Sebagai pembaca*, saya ingin menjelajahi daftar komik terbaru dan populer dengan tampilan kartu yang rapi dan familiar.
2. *Sebagai pembaca*, saya ingin mencari komik berdasarkan judul secara instan.
3. *Sebagai pembaca*, saya ingin melihat detail komik (sinopsis, status, pengarang, genre) dan memilih chapter dari daftar yang mudah difilter.
4. *Sebagai pembaca*, saya ingin membaca chapter komik dalam mode vertikal (*webtoon continuous scroll*) dengan gambar berkualitas tinggi tanpa ada satu pun iklan judol di antara halaman.
5. *Sebagai pembaca*, saya dapat berpindah ke chapter selanjutnya atau sebelumnya dengan mudah melalui tombol navigasi melayang (*floating bottom bar*) atau tombol keyboard.
6. *Sebagai pembaca*, saya ingin menandai komik favorit (*bookmark*) dan mencatat chapter terakhir yang dibaca (*history*) tersimpan di browser secara lokal.

---

## 3. Scope & Feature Specifications

### 3.1 Core Features (MVP)
* **Katalog Komik Terbaru & Populer:** Grid komik dengan cover, badge tipe (`Manga`, `Manhwa`, `Manhua`), label warna, dan link chapter terbaru.
* **Pencarian Komik:** Form pencarian responsif untuk mencari komik berdasarkan query nama.
* **Halaman Detail Komik:**
  * Header informasi: Judul, Judul Alternatif, Cover, Status, Pengarang, Genre tags.
  * Sinopsis lengkap.
  * Filter & pencarian nomor chapter (misal ketik "45" langsung memfilter daftar).
* **Halaman Webtoon Reader:**
  * Aliran gambar vertikal (*continuous stream*) dengan lazy loading (`loading="lazy"`).
  * 100% bebas banner judol GIF.
  * Floating Navigation Bar: Tombol Prev Chapter, Next Chapter, Drawer Daftar Chapter, dan Kembali ke Info Komik.
  * Dukungan Hotkey Keyboard (`ArrowLeft` = Prev, `ArrowRight` = Next).
* **Bookmark & History Lokal:**
  * Simpan komik favorit ke `localStorage`.
  * Pelacakan progress bacaan per chapter otomatis.

### 3.2 Out of Scope (Non-Goals)
* Akun login server-side (cukup menggunakan `localStorage` untuk kesederhanaan & privasi).
* Modifikasi data atau pengunggahan komik (hanya mode read-only client).

---

## 4. Non-Functional Requirements
1. **Kecepatan & Performa:** Waktu respon API $\le 500\text{ ms}$ dengan in-memory caching.
2. **Nol Iklan (Zero-Ad Guarantee):** Filter ketat pada scraper memastikan tidak ada domain eksternal berbahaya yang dimuat.
3. **Mobile-First UX:** Touch target minimal $44 \times 44\text{ px}$, tata letak adaptif di semua resolusi layar (HP, tablet, desktop).
4. **Desain Visual:** Dark theme dengan warna utama dark navy/slate (`#0f172a`), aksen biru khas Komikindo (`#0053b8` / `#3b82f6`), dan kontras teks tinggi.
