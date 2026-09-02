'use client';

import React, { useState, useEffect } from 'react';
import { BookmarkItem } from '@/lib/types';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarkButtonProps {
  comic: BookmarkItem;
}

export default function BookmarkButton({ comic }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('komik_bookmarks');
      if (saved) {
        const list: BookmarkItem[] = JSON.parse(saved);
        setIsBookmarked(list.some((b) => b.slug === comic.slug));
      }
    } catch {}
  }, [comic.slug]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem('komik_bookmarks');
      let list: BookmarkItem[] = saved ? JSON.parse(saved) : [];

      if (isBookmarked) {
        list = list.filter((b) => b.slug !== comic.slug);
        setIsBookmarked(false);
      } else {
        list.unshift({
          ...comic,
          addedAt: Date.now()
        });
        setIsBookmarked(true);
      }

      localStorage.setItem('komik_bookmarks', JSON.stringify(list));
      window.dispatchEvent(new Event('bookmarks-updated'));
    } catch {}
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-xl ${
        isBookmarked
          ? 'bg-[#131b26] hover:bg-[#1b2636] text-[#c1fbd4] border border-[#c1fbd4]/40 shadow-[0_0_20px_rgba(193,251,212,0.15)]'
          : 'bg-[#c1fbd4] hover:bg-[#a8f7c1] text-black shadow-lg shadow-[#c1fbd4]/20'
      }`}
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="w-4 h-4 text-[#c1fbd4]" /> Tersimpan di Koleksi
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 text-black" /> Simpan ke Koleksi
        </>
      )}
    </button>
  );
}
