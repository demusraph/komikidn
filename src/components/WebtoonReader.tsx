'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChapterData } from '@/lib/types';
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, ArrowUp } from 'lucide-react';

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

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center">
      {/* 1. Top Controls Header (Komikindo Reader Bar) */}
      <div className="sticky top-0 z-40 w-full bg-[#111111]/95 backdrop-blur border-b border-[#262626] px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Comic Title & Back Button */}
          <div className="flex items-center gap-2 truncate w-full sm:w-auto">
            {chapterData.comicSlug && (
              <Link
                href={`/komik/${chapterData.comicSlug}`}
                className="px-2.5 py-1 rounded bg-[#222222] hover:bg-[#333333] text-xs font-semibold text-[#cccccc] hover:text-white flex items-center gap-1 border border-[#333333]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Detail</span>
              </Link>
            )}
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {comicTitle} &bull; <span className="text-[#00a2ff]">{chapterData.chapterSlug.replace(/-/g, ' ')}</span>
            </h1>
          </div>

          {/* Chapter Selector Dropdown & Nav Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
            {chapterData.prevChapter ? (
              <Link
                href={`/baca/${chapterData.prevChapter}`}
                className="px-3 py-1.5 rounded bg-[#222222] hover:bg-[#0084ff] text-xs font-bold text-white border border-[#333333] transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded bg-[#1c1c1c] text-xs text-[#555555] border border-[#262626] cursor-not-allowed">
                Prev
              </span>
            )}

            {allChapters.length > 0 && (
              <select
                value={chapterData.chapterSlug}
                onChange={(e) => router.push(`/baca/${e.target.value}`)}
                className="bg-[#222222] text-white text-xs rounded border border-[#333333] px-2.5 py-1.5 focus:outline-none focus:border-[#0084ff] max-w-[150px] sm:max-w-[200px]"
              >
                {allChapters.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            )}

            {chapterData.nextChapter ? (
              <Link
                href={`/baca/${chapterData.nextChapter}`}
                className="px-3 py-1.5 rounded bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors flex items-center gap-1 shadow"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded bg-[#1c1c1c] text-xs text-[#555555] border border-[#262626] cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Image Stream (Continuous Vertical Reader) */}
      <main className="w-full max-w-3xl flex flex-col items-center py-4 select-none">
        {chapterData.images.length > 0 ? (
          chapterData.images.map((imgUrl, idx) => (
            <div key={idx} className="w-full bg-[#111111] flex justify-center relative">
              <img
                src={imgUrl}
                alt={`Halaman ${idx + 1} - ${comicTitle}`}
                loading={idx < 3 ? 'eager' : 'lazy'}
                className="w-full h-auto object-contain block"
              />
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-3">
            <p className="text-gray-400 text-sm">Tidak ada gambar yang dapat dimuat.</p>
          </div>
        )}
      </main>

      {/* 3. Bottom Navigation Controls Bar (Komikindo Style) */}
      <div className="w-full bg-[#111111] border-t border-[#262626] py-6 px-4">
        <div className="max-w-xl mx-auto flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3">
            {chapterData.prevChapter && (
              <Link
                href={`/baca/${chapterData.prevChapter}`}
                className="px-5 py-2.5 rounded bg-[#252525] hover:bg-[#333333] text-xs font-semibold text-white border border-[#383838] transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Chapter Sebelumnya
              </Link>
            )}
            {chapterData.nextChapter && (
              <Link
                href={`/baca/${chapterData.nextChapter}`}
                className="px-6 py-2.5 rounded bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors flex items-center gap-1 shadow-lg"
              >
                Chapter Selanjutnya <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {chapterData.comicSlug && (
            <Link
              href={`/komik/${chapterData.comicSlug}`}
              className="text-xs text-[#00a2ff] hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" /> Lihat Semua Chapter {comicTitle}
            </Link>
          )}
        </div>
      </div>

      {/* Scroll to top floating button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-6 w-11 h-11 rounded-full bg-[#0084ff] hover:bg-[#0070db] text-white flex items-center justify-center shadow-xl transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
