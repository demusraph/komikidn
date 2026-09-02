'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChapterItem } from '@/lib/types';
import { Search, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Layers } from 'lucide-react';

interface ChapterListProps {
  comicSlug: string;
  chapters: ChapterItem[];
}

export default function ChapterList({ comicSlug, chapters }: ChapterListProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [readChapters, setReadChapters] = useState<string[]>([]);

  useEffect(() => {
    try {
      const history = localStorage.getItem('komik_read_chapters');
      if (history) {
        setReadChapters(JSON.parse(history));
      }
    } catch {}
  }, []);

  const filtered = chapters.filter((c) =>
    c.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const newestChapter = chapters.length > 0 ? chapters[0] : null;
  const oldestChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;

  return (
    <div className="bg-[#0a0e17] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] shopify-sheen">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5 font-display tracking-tight">
            <Layers className="w-5 h-5 text-[#c1fbd4]" />
            Daftar Chapter
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1e2c31] text-[#c1fbd4] border border-white/10">
              {chapters.length}
            </span>
          </h2>
          <p className="text-xs text-[#9dabad] mt-0.5">Pilih chapter untuk membaca langsung</p>
        </div>

        {/* Shopify Search Pill */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari chapter (misal: 45)..."
            className="w-full bg-[#131b26] text-white placeholder-[#71717a] text-xs sm:text-sm rounded-full pl-10 pr-4 py-2 border border-white/10 focus:outline-none focus:border-[#c1fbd4] focus:ring-1 focus:ring-[#c1fbd4] transition-all"
          />
          <Search className="w-4 h-4 text-[#9dabad] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Shopify Quick Action Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {oldestChapter && (
          <Link
            href={`/baca/${oldestChapter.slug}`}
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#131b26] hover:bg-[#1b2636] border border-white/10 hover:border-[#c1fbd4]/30 group transition-all"
          >
            <div>
              <span className="text-[10px] text-[#9dabad] uppercase tracking-wider block font-semibold">
                Chapter Pertama
              </span>
              <span className="font-bold text-sm text-white group-hover:text-[#c1fbd4] transition-colors">
                {oldestChapter.title}
              </span>
            </div>
            <ArrowUpCircle className="w-5 h-5 text-[#9dabad] group-hover:text-[#c1fbd4] group-hover:scale-110 transition-transform" />
          </Link>
        )}

        {newestChapter && (
          <Link
            href={`/baca/${newestChapter.slug}`}
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#c1fbd4]/10 hover:bg-[#c1fbd4]/15 border border-[#c1fbd4]/30 group transition-all"
          >
            <div>
              <span className="text-[10px] text-[#c1fbd4] uppercase tracking-wider block font-semibold">
                Chapter Terbaru
              </span>
              <span className="font-bold text-sm text-white group-hover:text-[#c1fbd4] transition-colors">
                {newestChapter.title}
              </span>
            </div>
            <ArrowDownCircle className="w-5 h-5 text-[#c1fbd4] group-hover:scale-110 transition-transform" />
          </Link>
        )}
      </div>

      {/* Chapter Rows */}
      <div className="max-h-[480px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map((chap) => {
            const isRead = readChapters.includes(chap.slug);
            return (
              <Link
                key={chap.slug}
                href={`/baca/${chap.slug}`}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  isRead
                    ? 'bg-black/40 border-transparent text-[#71717a] hover:text-white hover:bg-[#131b26]'
                    : 'bg-[#131b26]/50 border-white/[0.04] text-[#d4d4d8] hover:bg-[#131b26] hover:border-[#c1fbd4]/30 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isRead ? (
                    <CheckCircle2 className="w-4 h-4 text-[#c1fbd4] flex-shrink-0" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c1fbd4] flex-shrink-0" />
                  )}
                  <span className="font-semibold text-xs sm:text-sm">{chap.title}</span>
                </div>
                <span className="text-[11px] text-[#71717a] font-mono">{chap.date}</span>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-10 text-[#71717a] text-xs sm:text-sm">
            Tidak ada chapter yang cocok dengan "{filterQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
