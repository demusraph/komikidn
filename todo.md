# 📋 Task List & Roadmap: Komikindo Clean Reader

## Phase 1: Core Scraper & API Engine
- [x] Reverse engineer HTML struktur Komikindo.ch (8-phase framework).
- [x] Identifikasi mekanisme popunder dan click-hijack.
- [x] Implementasi core scraper TypeScript (`src/lib/scraper.ts`).
- [x] Implementasi in-memory caching mechanism.
- [x] Buat Next.js Route Handlers:
  - [x] `GET /api/comics/latest` (Paginasi komik terbaru).
  - [x] `GET /api/comics/search` (Pencarian query).
  - [x] `GET /api/comics/[slug]` (Detail komik & chapter list).
  - [x] `GET /api/chapters/[slug]` (Ekstraksi gambar murni).

## Phase 2: Design System & Shared Components
- [x] Setup Tailwind CSS dengan palette Dark Slate / Blue Accent (`#0053b8`).
- [x] Komponen `Navbar.tsx` (Logo, menu navigasi, quick search, bookmark badge).
- [x] Komponen `ComicCard.tsx` (Kartu komik, type badge, color badge, link chapter terbaru).
- [x] Komponen `ChapterList.tsx` (Daftar chapter interaktif dengan filter search instan).
- [x] Komponen `WebtoonReader.tsx` (Continuous vertical scroll reader, floating control bar).
- [x] Komponen `Footer.tsx` (Footer minimalis clean reader).

## Phase 3: Application Pages
- [x] `src/app/page.tsx` — Homepage (Latest updates grid, Popular slider/grid, paginasi).
- [x] `src/app/komik/[slug]/page.tsx` — Halaman Detail Komik (Cover, sinopsis, metadata, chapter selector).
- [x] `src/app/baca/[chapterSlug]/page.tsx` — Halaman Baca Chapter Bebas Iklan.
- [x] `src/app/search/page.tsx` — Halaman Hasil Pencarian.
- [x] `src/app/bookmarks/page.tsx` — Halaman Favorit & Riwayat Bacaan Terakhir.

## Phase 4: Polish, Optimization & Verification
- [x] Keyboard navigation di reader (`ArrowLeft` = Prev, `ArrowRight` = Next).
- [x] Mobile touch navigation & drawer chapter list.
- [x] Image lazy-loading & error fallback.
- [x] Build verification (`npm run build`).
