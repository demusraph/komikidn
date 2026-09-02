import React from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { Flame, Heart, Tag, Sparkles, ChevronRight } from 'lucide-react';

interface SidebarPopularProps {
  popularComics: ComicCardItem[];
}

const POPULAR_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Isekai',
  'Martial Arts', 'Mystery', 'Romance', 'School Life', 'Sci-Fi',
  'Seinen', 'Shounen', 'Slice of Life', 'Supernatural'
];

export default function SidebarPopular({ popularComics }: SidebarPopularProps) {
  const getRankBadgeClass = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105';
      case 1:
        return 'bg-gradient-to-br from-slate-200 to-slate-400 text-black font-extrabold shadow';
      case 2:
        return 'bg-gradient-to-br from-amber-700 to-amber-900 text-white font-extrabold shadow';
      default:
        return 'bg-[#2a2a2a] text-[#aaaaaa] font-semibold border border-[#383838]';
    }
  };

  return (
    <aside className="space-y-6">
      {/* Widget 1: Komik Terpopuler */}
      <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl overflow-hidden shadow-lg">
        <div className="bg-[#242424] px-4 py-3 border-b border-[#2d2d2d] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            Komik Terpopuler
          </h3>
          <Link
            href="/search?sort=popular"
            className="text-[11px] text-[#00a2ff] hover:text-white flex items-center gap-0.5 transition-colors font-medium"
          >
            Lihat Semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-[#262626] p-2">
          {popularComics.slice(0, 10).map((comic, idx) => (
            <div
              key={comic.slug}
              className="p-2.5 flex items-center gap-3 hover:bg-[#252525] rounded-lg transition-all group"
            >
              {/* Rank Number Badge */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-transform group-hover:scale-110 ${getRankBadgeClass(
                  idx
                )}`}
              >
                {idx + 1}
              </div>

              {/* Cover Thumbnail */}
              <Link
                href={`/komik/${comic.slug}`}
                className="w-12 h-16 rounded-md overflow-hidden bg-[#222222] flex-shrink-0 border border-[#333333] group-hover:border-[#0084ff] transition-colors relative block"
              >
                {comic.thumbnail ? (
                  <img
                    src={comic.thumbnail}
                    alt={comic.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-500">No img</div>
                )}
              </Link>

              {/* Title & Stats */}
              <div className="flex-1 min-w-0 space-y-1">
                <Link href={`/komik/${comic.slug}`} className="block">
                  <h4 className="font-bold text-xs text-white group-hover:text-[#0084ff] line-clamp-2 leading-snug transition-colors">
                    {comic.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 text-[11px] text-[#888888]">
                  <span className="text-[#00a2ff] font-semibold text-[10px] uppercase bg-[#0084ff]/10 px-1.5 py-0.2 rounded">
                    {comic.type}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-0.5 text-rose-400 font-semibold text-[11px]">
                    <Heart className="w-3 h-3 fill-current" /> 8.{(9 - idx > 0 ? 9 - idx : 7)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 2: Genre Tag Cloud */}
      <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl overflow-hidden shadow-lg">
        <div className="bg-[#242424] px-4 py-3 border-b border-[#2d2d2d] flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#00a2ff]" />
          <h3 className="text-sm font-bold text-white">Genre Komik Pilihan</h3>
        </div>

        <div className="p-3.5 flex flex-wrap gap-1.5">
          {POPULAR_GENRES.map((g) => {
            const slug = g.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={slug}
                href={`/genres/${slug}`}
                className="px-3 py-1 rounded-md bg-[#242424] hover:bg-[#0084ff] text-[#cccccc] hover:text-white text-xs border border-[#333333] hover:border-[#0084ff] transition-all hover:shadow-[0_2px_8px_rgba(0,132,255,0.3)] hover:-translate-y-0.5"
              >
                {g}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
