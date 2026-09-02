'use client';

import React from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { Palette, Clock, ArrowUpRight } from 'lucide-react';

interface ComicCardProps {
  comic: ComicCardItem;
}

export default function ComicCard({ comic }: ComicCardProps) {
  const getTypeBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'manhwa':
        return 'bg-[#c1fbd4] text-[#000000] font-bold';
      case 'manga':
        return 'bg-[#ffffff] text-[#000000] font-bold';
      case 'manhua':
        return 'bg-[#d4f9e0] text-[#000000] font-bold';
      default:
        return 'bg-[#27272a] text-[#ffffff] font-medium border border-white/10';
    }
  };

  return (
    <div className="group bg-[#0a0e17] border border-white/[0.08] hover:border-[#c1fbd4]/40 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(193,251,212,0.1)] transition-all duration-300 flex flex-col justify-between">
      {/* Photo Frame Container */}
      <Link href={`/komik/${comic.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#131b26] block">
        {comic.thumbnail ? (
          <img
            src={comic.thumbnail}
            alt={comic.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#71717a] text-xs">
            No Cover
          </div>
        )}

        {/* Top edge sheen & bottom gradient */}
        <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-black/20 pointer-events-none" />

        {/* Shopify Pill Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-1">
          {comic.type !== 'Unknown' && (
            <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md ${getTypeBadgeStyle(comic.type)}`}>
              {comic.type}
            </span>
          )}

          {comic.isColor && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-[#c1fbd4] border border-[#c1fbd4]/30 backdrop-blur-md flex items-center gap-1">
              <Palette className="w-2.5 h-2.5 text-[#c1fbd4]" /> Color
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <Link href={`/komik/${comic.slug}`} className="block group/title">
          <h3 className="font-semibold text-xs sm:text-sm text-white group-hover/title:text-[#c1fbd4] line-clamp-2 leading-snug tracking-tight transition-colors">
            {comic.title}
          </h3>
        </Link>

        {/* Latest Chapter Pill Link */}
        {comic.latestChapter && (
          <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <Link
              href={`/baca/${comic.latestChapter.slug}`}
              className="font-medium text-[#c1fbd4] hover:text-[#a8f7c1] hover:underline line-clamp-1 max-w-[65%] flex items-center gap-1"
            >
              {comic.latestChapter.title}
              <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-[11px] text-[#71717a] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#71717a]" />
              {comic.latestChapter.updated}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
