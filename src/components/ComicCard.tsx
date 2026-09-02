import React from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { Clock } from 'lucide-react';

interface ComicCardProps {
  comic: ComicCardItem;
}

export default function ComicCard({ comic }: ComicCardProps) {
  // Determine Type Flag Color
  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'manhwa':
        return { label: 'Manhwa', color: 'bg-emerald-600 text-white', flag: '🇰🇷' };
      case 'manhua':
        return { label: 'Manhua', color: 'bg-amber-600 text-white', flag: '🇨🇳' };
      case 'manga':
        return { label: 'Manga', color: 'bg-rose-600 text-white', flag: '🇯🇵' };
      default:
        return { label: 'Comic', color: 'bg-gray-700 text-white', flag: '📖' };
    }
  };

  const badge = getTypeBadge(comic.type);

  return (
    <div className="group bg-[#222222] hover:bg-[#282828] border border-[#2e2e2e] hover:border-[#444444] rounded overflow-hidden flex flex-col justify-between transition-all duration-200">
      {/* Thumbnail Container */}
      <Link href={`/komik/${comic.slug}`} className="relative aspect-[3/4] bg-[#1a1a1a] block overflow-hidden">
        {comic.thumbnail ? (
          <img
            src={comic.thumbnail}
            alt={comic.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#666666] text-xs">
            No Cover
          </div>
        )}

        {/* Top Badges (Komikindo Style) */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm ${badge.color}`}>
            {badge.label}
          </span>
          {comic.isColor && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-sm">
              Warna
            </span>
          )}
        </div>

        {/* Top Right Flag */}
        <div className="absolute top-1.5 right-1.5 text-xs bg-black/60 px-1 py-0.5 rounded shadow">
          {badge.flag}
        </div>

        {/* Subtle Dark Gradient Overlay at Bottom of Image */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#222222] to-transparent pointer-events-none" />
      </Link>

      {/* Info Section */}
      <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
        {/* Title */}
        <Link href={`/komik/${comic.slug}`} className="block">
          <h3 className="font-semibold text-xs text-white group-hover:text-[#0084ff] line-clamp-2 leading-snug transition-colors">
            {comic.title}
          </h3>
        </Link>

        {/* Chapter & Updated Date */}
        {comic.latestChapter ? (
          <div className="pt-1 border-t border-[#333333] flex items-center justify-between text-[11px]">
            <Link
              href={`/baca/${comic.latestChapter.slug}`}
              className="text-[#00a2ff] hover:text-white font-medium truncate max-w-[65%] hover:underline"
            >
              {comic.latestChapter.title}
            </Link>
            <span className="text-[#888888] text-[10px] whitespace-nowrap">
              {comic.latestChapter.updated}
            </span>
          </div>
        ) : (
          <div className="pt-1 border-t border-[#333333] text-[10px] text-[#777777]">
            Komikidn Catalog
          </div>
        )}
      </div>
    </div>
  );
}
