'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChapterData } from '@/lib/types';
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, ArrowUp, Maximize2, Minimize2, Settings } from 'lucide-react';

interface WebtoonReaderProps {
  chapterData: ChapterData;
  comicTitle: string;
  allChapters: { slug: string; title: string }[];
}

export default function WebtoonReader({
  chapterData,
  comicTitle,
  allChapters
}: WebtoonReaderProps) {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readerWidth, setReaderWidth] = useState<'normal' | 'wide' | 'full'>('normal');

  // Mark as read & save history
  useEffect(() => {
    try {
      const savedRead = localStorage.getItem('komik_read_chapters');
      let readSet = savedRead ? JSON.parse(savedRead) : [];
      if (!readSet.includes(chapterData.chapterSlug)) {
        readSet.push(chapterData.chapterSlug);
        localStorage.setItem('komik_read_chapters', JSON.stringify(readSet));
      }

      const savedHist = localStorage.getItem('komik_history');
      let historyList = savedHist ? JSON.parse(savedHist) : [];
      historyList = historyList.filter(
        (h: any) => h.chapterSlug !== chapterData.chapterSlug
      );
      historyList.unshift({
        comicSlug: chapterData.comicSlug || '',
        comicTitle: comicTitle,
        chapterSlug: chapterData.chapterSlug,
        chapterTitle: chapterData.chapterSlug.replace(/-/g, ' ').toUpperCase(),
        timestamp: Date.now()
      });
      localStorage.setItem('komik_history', JSON.stringify(historyList.slice(0, 30)));
    } catch {}
  }, [chapterData.chapterSlug, chapterData.comicSlug, comicTitle]);

  // Scroll Progress and Scroll-to-Top Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Navigation (Left / Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && chapterData.prevChapter) {
        router.push(`/baca/${chapterData.prevChapter}`);
      } else if (e.key === 'ArrowRight' && chapterData.nextChapter) {
        router.push(`/baca/${chapterData.nextChapter}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterData.prevChapter, chapterData.nextChapter, router]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getContainerMaxWidth = () => {
    switch (readerWidth) {
      case 'wide':
        return 'max-w-5xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-3xl';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center select-none">
      {/* 1. Top Real-time Reading Progress Bar */}
      <div className="fixed top-0 inset-x-0 h-1 bg-[#1a1a1a] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#0084ff] to-[#00d2ff] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Top Controls Header (Komikindo Reader Bar) */}
      <div className="sticky top-0 z-40 w-full bg-[#141414]/95 backdrop-blur border-b border-[#262626] px-4 py-2.5 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Comic Title & Back Button */}
          <div className="flex items-center gap-2 truncate w-full sm:w-auto">
            {chapterData.comicSlug && (
              <Link
                href={`/komik/${chapterData.comicSlug}`}
                className="px-2.5 py-1.5 rounded bg-[#222222] hover:bg-[#333333] text-xs font-semibold text-[#cccccc] hover:text-white flex items-center gap-1 border border-[#333333] transition-colors"
                title="Kembali ke Detail Komik"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Detail</span>
              </Link>
            )}
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {comicTitle} &bull; <span className="text-[#00a2ff]">{chapterData.chapterSlug.replace(/-/g, ' ')}</span>
            </h1>
          </div>

          {/* Controls: Width Adjuster + Chapter Select + Prev/Next Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Width Mode Toggle Button */}
            <button
              onClick={() => {
                if (readerWidth === 'normal') setReaderWidth('wide');
                else if (readerWidth === 'wide') setReaderWidth('full');
                else setReaderWidth('normal');
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#222222] hover:bg-[#2e2e2e] text-[#aaaaaa] hover:text-white text-xs border border-[#333333] transition-colors"
              title="Atur Lebar Gambar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold">{readerWidth}</span>
            </button>

            {/* Prev Chapter Button */}
            {chapterData.prevChapter ? (
              <Link
                href={`/baca/${chapterData.prevChapter}`}
                className="px-3.5 py-1.5 rounded bg-[#222222] hover:bg-[#0084ff] text-xs font-bold text-white border border-[#333333] transition-colors flex items-center gap-1"
                title="Chapter Sebelumnya (Keyboard: Panah Kiri)"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Link>
            ) : (
              <span className="px-3.5 py-1.5 rounded bg-[#1a1a1a] text-xs text-[#555555] border border-[#262626] cursor-not-allowed">
                Prev
              </span>
            )}

            {/* Chapter Selector Dropdown */}
            {allChapters.length > 0 && (
              <select
                value={chapterData.chapterSlug}
                onChange={(e) => router.push(`/baca/${e.target.value}`)}
                className="bg-[#222222] text-white text-xs rounded border border-[#333333] px-2.5 py-1.5 focus:outline-none focus:border-[#0084ff] max-w-[140px] sm:max-w-[190px] font-medium"
              >
                {allChapters.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            )}

            {/* Next Chapter Button */}
            {chapterData.nextChapter ? (
              <Link
                href={`/baca/${chapterData.nextChapter}`}
                className="px-4 py-1.5 rounded bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors flex items-center gap-1 shadow-[0_2px_10px_rgba(0,132,255,0.4)]"
                title="Chapter Selanjutnya (Keyboard: Panah Kanan)"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="px-4 py-1.5 rounded bg-[#1a1a1a] text-xs text-[#555555] border border-[#262626] cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Image Stream (Continuous Vertical Webtoon) */}
      <main className={`w-full ${getContainerMaxWidth()} flex flex-col items-center py-4 transition-all duration-300`}>
        {chapterData.images.length > 0 ? (
          chapterData.images.map((imgUrl, idx) => (
            <div key={idx} className="w-full bg-[#0d0d0d] flex justify-center relative">
              <img
                src={imgUrl}
                alt={`Halaman ${idx + 1} - ${comicTitle}`}
                loading={idx < 4 ? 'eager' : 'lazy'}
                className="w-full h-auto object-contain block shadow-sm"
              />
            </div>
          ))
        ) : (
          <div className="py-24 text-center space-y-3">
            <p className="text-gray-400 text-sm">Tidak ada gambar yang dapat dimuat.</p>
          </div>
        )}
      </main>

      {/* 4. Bottom Navigation Controls Bar */}
      <div className="w-full bg-[#141414] border-t border-[#262626] py-8 px-4 mt-6">
        <div className="max-w-xl mx-auto flex flex-col items-center space-y-4">
          <div className="text-xs text-[#888888] font-mono">
            Selesai membaca &bull; {chapterData.totalImages} Halaman ({Math.round(scrollProgress)}%)
          </div>

          <div className="flex items-center gap-3">
            {chapterData.prevChapter && (
              <Link
                href={`/baca/${chapterData.prevChapter}`}
                className="px-5 py-2.5 rounded-lg bg-[#252525] hover:bg-[#333333] text-xs font-semibold text-white border border-[#383838] transition-colors flex items-center gap-1.5 shadow"
              >
                <ChevronLeft className="w-4 h-4" /> Chapter Sebelumnya
              </Link>
            )}
            {chapterData.nextChapter && (
              <Link
                href={`/baca/${chapterData.nextChapter}`}
                className="px-6 py-2.5 rounded-lg bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-[#0084ff]/20"
              >
                Chapter Selanjutnya <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {chapterData.comicSlug && (
            <Link
              href={`/komik/${chapterData.comicSlug}`}
              className="text-xs text-[#00a2ff] hover:underline flex items-center gap-1.5 pt-2"
            >
              <BookOpen className="w-4 h-4" /> Lihat Daftar Semua Chapter {comicTitle}
            </Link>
          )}
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll ke atas"
          title="Scroll ke atas"
          className="fixed bottom-20 right-6 w-11 h-11 rounded-full bg-[#0084ff] hover:bg-[#0070db] text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 z-50 border border-white/10"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
