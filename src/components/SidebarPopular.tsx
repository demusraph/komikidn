import React from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { Flame, Heart, Tag } from 'lucide-react';

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
        return 'bg-amber-500 text-black font-extrabold shadow';
      case 1:
        return 'bg-gray-300 text-black font-extrabold shadow';
      case 2:
        return 'bg-amber-700 text-white font-extrabold shadow';
      default:
        return 'bg-[#333333] text-[#aaaaaa] font-semibold';
    }
  };

  return (
    <aside className="space-y-6">
      {/* Widget 1: Komik Terpopuler */}
      <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg overflow-hidden">
        <div className="bg-[#242424] px-4 py-2.5 border-b border-[#2d2d2d] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            Komik Terpopuler
          </h3>
          <Link href="/search?sort=popular" className="text-[11px] text-[#00a2ff] hover:underline">
            Semua
          </Link>
        </div>

        <div className="divide-y divide-[#262626] p-2">
          {popularComics.slice(0, 10).map((comic, idx) => (
            <div key={comic.slug} className="p-2.5 flex items-center gap-3 hover:bg-[#252525] rounded transition-colors group">
              {/* Rank Number Badge */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${getRankBadgeClass(
                  idx
                )}`}
              >
                {idx + 1}
              </div>

              {/* Cover Thumbnail */}
              <Link href={`/komik/${comic.slug}`} className="w-12 h-16 rounded overflow-hidden bg-[#222222] flex-shrink-0 border border-[#333333]">
                {comic.thumbnail ? (
                  <img src={comic.thumbnail} alt={comic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-500">No img</div>
                )}
              </Link>

              {/* Title & Stats */}
              <div className="flex-1 min-w-0 space-y-1">
                <Link href={`/komik/${comic.slug}`} className="block">
                  <h4 className="font-semibold text-xs text-white group-hover:text-[#0084ff] line-clamp-2 leading-snug transition-colors">
                    {comic.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 text-[11px] text-[#888888]">
                  <span className="text-[#00a2ff] font-medium">{comic.type}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-0.5 text-rose-400">
                    <Heart className="w-3 h-3 fill-current" /> 8.{(9 - idx > 0 ? 9 - idx : 5)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 2: Genre Tag Cloud */}
      <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg overflow-hidden">
        <div className="bg-[#242424] px-4 py-2.5 border-b border-[#2d2d2d] flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#00a2ff]" />
          <h3 className="text-sm font-bold text-white">Genre Komik</h3>
        </div>

        <div className="p-3 flex flex-wrap gap-1.5">
          {POPULAR_GENRES.map((g) => {
            const slug = g.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={slug}
                href={`/genres/${slug}`}
                className="px-2.5 py-1 rounded bg-[#252525] hover:bg-[#0084ff] text-[#cccccc] hover:text-white text-xs border border-[#333333] transition-colors"
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
