'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChapterItem } from '@/lib/types';
import { Search, ArrowUpDown, BookOpen, ChevronRight, CheckCircle2, Flame } from 'lucide-react';

interface ChapterListProps {
  comicSlug: string;
  chapters: ChapterItem[];
}

export default function ChapterList({ comicSlug, chapters }: ChapterListProps) {
  const [search, setSearch] = useState('');
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set());
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('komik_read_chapters');
      if (saved) {
        setReadChapters(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  const filteredChapters = chapters
    .filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
    )
    .slice();

  if (isReversed) {
    filteredChapters.reverse();
  }

  const firstChapter = chapters[chapters.length - 1];
  const latestChapter = chapters[0];

  const readCount = chapters.filter((c) => readChapters.has(c.slug)).length;
  const progressPercent = chapters.length > 0 ? Math.round((readCount / chapters.length) * 100) : 0;

  return (
    <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl overflow-hidden space-y-4 p-4 sm:p-6 shadow-lg">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2d2d] pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0084ff]" />
            Daftar Chapter Komik ({chapters.length})
          </h2>
          {readCount > 0 ? (
            <p className="text-xs text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Kamu sudah membaca {readCount} dari {chapters.length} chapter ({progressPercent}%)
            </p>
          ) : (
            <p className="text-xs text-[#888888] mt-0.5">
              Klik chapter untuk mulai membaca secara instan tanpa iklan
            </p>
          )}
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex items-center gap-2">
          {firstChapter && (
            <Link
              href={`/baca/${firstChapter.slug}`}
              className="px-3.5 py-1.5 rounded-md bg-[#252525] hover:bg-[#0084ff] text-xs font-semibold text-[#cccccc] hover:text-white border border-[#383838] transition-colors"
            >
              Ch. Pertama
            </Link>
          )}
          {latestChapter && (
            <Link
              href={`/baca/${latestChapter.slug}`}
              className="px-3.5 py-1.5 rounded-md bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors shadow flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5" /> Ch. Terbaru
            </Link>
          )}
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor chapter (contoh: 185)..."
            className="w-full bg-[#202020] text-white placeholder-[#777777] text-xs rounded-lg border border-[#333333] pl-9 pr-4 py-2 focus:outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-all"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <button
          onClick={() => setIsReversed(!isReversed)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#202020] hover:bg-[#282828] border border-[#333333] text-xs font-medium text-[#cccccc] hover:text-white transition-colors flex-shrink-0"
          title="Urutkan Chapter"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-[#00a2ff]" />
          <span>{isReversed ? 'Terlama' : 'Terbaru'}</span>
        </button>
      </div>

      {/* Chapters Table List */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar border border-[#2d2d2d] rounded-lg bg-[#161616] divide-y divide-[#222222]">
        {filteredChapters.length > 0 ? (
          filteredChapters.map((chap) => {
            const isRead = readChapters.has(chap.slug);
            return (
              <Link
                key={chap.slug}
                href={`/baca/${chap.slug}`}
                className={`flex items-center justify-between px-4 py-3 hover:bg-[#202020] transition-colors group ${
                  isRead ? 'text-[#777777]' : 'text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate max-w-[70%] sm:max-w-[80%]">
                  <span
                    className={`font-semibold text-xs sm:text-sm group-hover:text-[#0084ff] transition-colors truncate ${
                      isRead ? 'line-through text-[#666666]' : ''
                    }`}
                  >
                    {chap.title}
                  </span>
                  {isRead && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-mono flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Dibaca
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#777777] flex-shrink-0">
                  <span className="text-[11px] font-mono">{chap.date || 'Rilis'}</span>
                  <ChevronRight className="w-4 h-4 text-[#555555] group-hover:text-[#0084ff] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-10 text-center text-xs text-[#777777]">
            Tidak ada chapter yang cocok dengan pencarian "{search}".
          </div>
        )}
      </div>
    </div>
  );
}
