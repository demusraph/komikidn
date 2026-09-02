'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChapterData } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Maximize2,
  Minimize2,
  RefreshCw,
  CheckCircle,
  Sliders
} from 'lucide-react';

interface WebtoonReaderProps {
  chapterData: ChapterData;
  comicTitle?: string;
  allChapters?: { slug: string; title: string }[];
}

export default function WebtoonReader({
  chapterData,
  comicTitle,
  allChapters = []
}: WebtoonReaderProps) {
  const [fitWidth, setFitWidth] = useState(true);
  const router = useRouter();

  // Save read history to localStorage
  useEffect(() => {
    try {
      const readChapters = JSON.parse(localStorage.getItem('komik_read_chapters') || '[]');
      if (!readChapters.includes(chapterData.chapterSlug)) {
        readChapters.push(chapterData.chapterSlug);
        localStorage.setItem('komik_read_chapters', JSON.stringify(readChapters));
      }

      const historyList = JSON.parse(localStorage.getItem('komik_history') || '[]');
      const filtered = historyList.filter((item: any) => item.comicSlug !== chapterData.comicSlug);
      filtered.unshift({
        comicSlug: chapterData.comicSlug,
        comicTitle: comicTitle || chapterData.comicSlug,
        chapterSlug: chapterData.chapterSlug,
        chapterTitle: chapterData.chapterSlug.replace(/-/g, ' ').toUpperCase(),
        timestamp: Date.now()
      });
      localStorage.setItem('komik_history', JSON.stringify(filtered.slice(0, 30)));
    } catch {}
  }, [chapterData, comicTitle]);

  // Keyboard Shortcuts (ArrowLeft = Prev, ArrowRight = Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft' && chapterData.prevChapter) {
        router.push(`/baca/${chapterData.prevChapter}`);
      } else if (e.key === 'ArrowRight' && chapterData.nextChapter) {
        router.push(`/baca/${chapterData.nextChapter}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterData, router]);

  const handleChapterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    if (slug) {
      router.push(`/baca/${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center selection:bg-[#c1fbd4] selection:text-black">
      {/* Top Sticky Header */}
      <div className="w-full sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-3 min-w-0">
          {chapterData.comicSlug && (
            <Link
              href={`/komik/${chapterData.comicSlug}`}
              className="p-2 rounded-full bg-[#131b26] hover:bg-[#1e2c31] border border-white/10 text-[#d4d4d8] hover:text-white transition-all"
              title="Kembali ke Detail Komik"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          <div className="min-w-0">
            <h1 className="font-semibold text-xs sm:text-sm text-white truncate max-w-[180px] sm:max-w-md font-display">
              {comicTitle || 'Baca Komik'}
            </h1>
            <p className="text-[11px] text-[#c1fbd4] uppercase tracking-wider truncate font-mono">
              {chapterData.chapterSlug.replace(/-/g, ' ')}
            </p>
          </div>
        </div>

        {/* Right Top Actions (Shopify Pill Controls) */}
        <div className="flex items-center gap-2">
          {allChapters.length > 0 && (
            <select
              value={chapterData.chapterSlug}
              onChange={handleChapterSelect}
              className="bg-[#0a0e17] text-[#d4d4d8] text-xs rounded-full px-3.5 py-1.5 border border-white/15 focus:outline-none focus:border-[#c1fbd4] max-w-[130px] sm:max-w-xs cursor-pointer font-medium"
            >
              {allChapters.map((c) => (
                <option key={c.slug} value={c.slug} className="bg-[#0a0e17]">
                  {c.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setFitWidth(!fitWidth)}
            className="p-2 rounded-full bg-[#131b26] hover:bg-[#1e2c31] border border-white/10 text-[#d4d4d8] hover:text-white transition-all hidden sm:flex items-center"
            title={fitWidth ? 'Mode Lebar Penuh' : 'Mode Rata Tengah'}
          >
            {fitWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Continuous Vertical Reader Stream */}
      <main
        className={`w-full ${
          fitWidth ? 'max-w-3xl' : 'max-w-5xl'
        } transition-all duration-300 flex flex-col items-center py-2 px-0 sm:px-2 select-none`}
      >
        {chapterData.images.length > 0 ? (
          chapterData.images.map((imgUrl, index) => (
            <div key={index} className="w-full relative min-h-[300px] bg-[#05080e] flex items-center justify-center">
              <img
                src={imgUrl}
                alt={`Halaman ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain block"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.retried) {
                    target.dataset.retried = 'true';
                    target.src = imgUrl;
                  }
                }}
              />
            </div>
          ))
        ) : (
          <div className="py-24 text-center space-y-4">
            <p className="text-[#9dabad] text-sm">Gambar chapter sedang dimuat atau gagal diekstrak.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-[#c1fbd4] text-black text-xs font-bold hover:bg-[#a8f7c1] flex items-center gap-2 mx-auto shadow-lg shadow-[#c1fbd4]/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Muat Ulang Halaman
            </button>
          </div>
        )}
      </main>

      {/* End of Chapter Card (Shopify Dark Section) */}
      <div className="w-full max-w-3xl px-4 py-16 flex flex-col items-center gap-6 text-center border-t border-white/[0.08] mt-10 bg-[#0a0e17] rounded-t-3xl shopify-sheen">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c1fbd4]/10 text-[#c1fbd4] text-xs font-semibold border border-[#c1fbd4]/20">
            <CheckCircle className="w-3.5 h-3.5 text-[#c1fbd4]" /> Chapter Selesai
          </span>
          <h3 className="font-extrabold text-xl text-white font-display">Kamu Telah Membaca Seluruh Halaman</h3>
          <p className="text-xs text-[#9dabad]">Total {chapterData.totalImages} gambar komik berhasil dimuat.</p>
        </div>

        {/* Navigation Pills */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md">
          {chapterData.prevChapter ? (
            <Link
              href={`/baca/${chapterData.prevChapter}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#131b26] hover:bg-[#1b2636] border border-white/10 text-xs font-semibold text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev Chapter
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 py-3 px-5 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-semibold text-[#52525b] cursor-not-allowed"
            >
              Prev Chapter
            </button>
          )}

          {chapterData.comicSlug && (
            <Link
              href={`/komik/${chapterData.comicSlug}`}
              className="p-3 rounded-full bg-[#131b26] hover:bg-[#1b2636] border border-white/10 text-[#d4d4d8] hover:text-white transition-colors"
              title="Daftar Chapter"
            >
              <BookOpen className="w-4 h-4" />
            </Link>
          )}

          {chapterData.nextChapter ? (
            <Link
              href={`/baca/${chapterData.nextChapter}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#c1fbd4] hover:bg-[#a8f7c1] text-black text-xs font-bold shadow-lg shadow-[#c1fbd4]/20 transition-all"
            >
              Next Chapter <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 py-3 px-5 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-semibold text-[#52525b] cursor-not-allowed"
            >
              Chapter Terakhir
            </button>
          )}
        </div>
      </div>

      {/* Floating Bottom Quick Bar */}
      <div className="fixed bottom-6 z-40 bg-[#000000]/85 backdrop-blur-xl border border-white/15 rounded-full px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(193,251,212,0.15)] flex items-center gap-3">
        {chapterData.prevChapter && (
          <Link
            href={`/baca/${chapterData.prevChapter}`}
            className="p-2 rounded-full hover:bg-[#131b26] text-[#d4d4d8] hover:text-white transition-colors"
            title="Chapter Sebelumnya (Shortcut: ◄)"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        )}

        {chapterData.comicSlug && (
          <Link
            href={`/komik/${chapterData.comicSlug}`}
            className="px-3 py-1 text-xs font-semibold text-[#c1fbd4] hover:text-[#a8f7c1] flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" /> Info Komik
          </Link>
        )}

        {chapterData.nextChapter && (
          <Link
            href={`/baca/${chapterData.nextChapter}`}
            className="p-2 rounded-full bg-[#c1fbd4] hover:bg-[#a8f7c1] text-black transition-all shadow-md"
            title="Chapter Selanjutnya (Shortcut: ►)"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
