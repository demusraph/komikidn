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
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded font-semibold text-xs transition-colors shadow ${
        isBookmarked
          ? 'bg-[#2a2a2a] hover:bg-[#333333] text-emerald-400 border border-emerald-500/30'
          : 'bg-[#0084ff] hover:bg-[#0070db] text-white'
      }`}
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="w-4 h-4 text-emerald-400" /> Tersimpan di Koleksi
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 text-white" /> + Tambah ke Koleksi
        </>
      )}
    </button>
  );
}
