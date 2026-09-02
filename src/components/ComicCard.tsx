'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface ComicCardProps {
  comic: ComicCardItem;
}

export default function ComicCard({ comic }: ComicCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('komik_bookmarks');
      if (saved) {
        const list = JSON.parse(saved);
        setIsBookmarked(list.some((b: any) => b.slug === comic.slug));
      }
    } catch {}
  }, [comic.slug]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('komik_bookmarks');
      let list = saved ? JSON.parse(saved) : [];

      if (isBookmarked) {
        list = list.filter((b: any) => b.slug !== comic.slug);
        setIsBookmarked(false);
      } else {
        list.unshift({
          slug: comic.slug,
          title: comic.title,
          thumbnail: comic.thumbnail,
          type: comic.type,
          addedAt: Date.now()
        });
        setIsBookmarked(true);
      }

      localStorage.setItem('komik_bookmarks', JSON.stringify(list));
      window.dispatchEvent(new Event('bookmarks-updated'));
    } catch {}
  };

  const getTypeBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'manhwa':
        return { label: 'Manhwa', color: 'bg-emerald-600', flag: '🇰🇷' };
      case 'manhua':
        return { label: 'Manhua', color: 'bg-amber-600', flag: '🇨🇳' };
      case 'manga':
        return { label: 'Manga', color: 'bg-rose-600', flag: '🇯🇵' };
      default:
        return { label: 'Komik', color: 'bg-blue-600', flag: '📖' };
    }
  };

  const badge = getTypeBadge(comic.type);

  return (
    <div className="group relative bg-[#1f1f1f] hover:bg-[#252525] border border-[#2b2b2b] hover:border-[#444444] rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 shadow hover:shadow-xl hover:-translate-y-0.5">
      {/* Thumbnail Container */}
      <Link href={`/komik/${comic.slug}`} className="relative aspect-[3/4] bg-[#141414] block overflow-hidden">
        {comic.thumbnail ? (
          <img
            src={comic.thumbnail}
            alt={comic.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#666666] text-xs">
            No Cover
          </div>
        )}

        {/* Top-Left Type & Format Badges */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white shadow ${badge.color}`}>
            {badge.label}
          </span>
          {comic.isColor && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow">
              Warna
            </span>
          )}
        </div>

        {/* Top-Right Quick Bookmark Toggle */}
        <button
          onClick={toggleBookmark}
          aria-label={isBookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
          title={isBookmarked ? 'Tersimpan di koleksi' : 'Simpan ke koleksi'}
          className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-20 ${
            isBookmarked
              ? 'bg-[#0084ff] text-white shadow-lg scale-100 opacity-100'
              : 'bg-black/60 hover:bg-[#0084ff] text-white/80 hover:text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
          }`}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Bottom Dark Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1f1f1f] via-[#1f1f1f]/60 to-transparent pointer-events-none" />
      </Link>

      {/* Info Section */}
      <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
        {/* Title */}
        <Link href={`/komik/${comic.slug}`} className="block" title={comic.title}>
          <h3 className="font-bold text-xs text-white group-hover:text-[#0084ff] line-clamp-2 leading-snug transition-colors">
            {comic.title}
          </h3>
        </Link>

        {/* Chapter & Updated Timestamp */}
        {comic.latestChapter ? (
          <div className="pt-1.5 border-t border-[#2b2b2b] flex items-center justify-between text-[11px] gap-1">
            <Link
              href={`/baca/${comic.latestChapter.slug}`}
              className="text-[#00a2ff] hover:text-white font-semibold truncate hover:underline"
              title={comic.latestChapter.title}
            >
              {comic.latestChapter.title.replace(/^Chapter\s+/i, 'Ch. ')}
            </Link>
            <span className="text-[#888888] text-[10px] whitespace-nowrap flex-shrink-0">
              {comic.latestChapter.updated}
            </span>
          </div>
        ) : (
          <div className="pt-1.5 border-t border-[#2b2b2b] text-[10px] text-[#666666]">
            Komik Catalog
          </div>
        )}
      </div>
    </div>
  );
}
