'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bookmark, Flame, BookOpen } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('komik_bookmarks');
        if (saved) {
          const list = JSON.parse(saved);
          setBookmarkCount(Array.isArray(list) ? list.length : 0);
        }
      } catch {}
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('bookmarks-updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('bookmarks-updated', updateCount);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* Shopify Brand Wordmark */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000] shadow-[0_0_20px_rgba(193,251,212,0.3)] group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-display">
                  KOMIK<span className="text-[#c1fbd4]">IDN</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c1fbd4] text-[#000000] tracking-wider uppercase">
                  AD-FREE
                </span>
              </div>
              <p className="text-[11px] text-[#9dabad] font-normal tracking-wide hidden sm:block">
                Platform Baca Komik Bebas Iklan
              </p>
            </div>
          </Link>

          {/* Shopify Search Pill */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komik (Solo Leveling, Eleceed, Magic Emperor)..."
                className="w-full bg-[#0a0e17] text-white placeholder-[#71717a] text-xs sm:text-sm rounded-full pl-11 pr-5 py-2.5 border border-white/10 focus:outline-none focus:border-[#c1fbd4] focus:ring-1 focus:ring-[#c1fbd4] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
              />
              <Search className="w-4 h-4 text-[#9dabad] absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Nav Actions (Shopify Pill System) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-[#d4d4d8] hover:text-white hover:bg-[#131b26] border border-transparent hover:border-white/10 transition-all"
            >
              <Flame className="w-4 h-4 text-[#c1fbd4]" />
              <span className="hidden sm:inline">Terbaru</span>
            </Link>

            <Link
              href="/kategori/manhwa"
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#d4d4d8] hover:text-[#c1fbd4] hover:bg-[#131b26] transition-all hidden lg:inline"
            >
              Manhwa
            </Link>
            <Link
              href="/kategori/manga"
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#d4d4d8] hover:text-[#c1fbd4] hover:bg-[#131b26] transition-all hidden lg:inline"
            >
              Manga
            </Link>
            <Link
              href="/kategori/manhua"
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#d4d4d8] hover:text-[#c1fbd4] hover:bg-[#131b26] transition-all hidden lg:inline"
            >
              Manhua
            </Link>

            {/* Bookmarks Pill */}
            <Link
              href="/bookmarks"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#131b26] text-white border border-white/10 hover:border-[#c1fbd4]/50 hover:bg-[#1b2636] transition-all shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-[#c1fbd4]" />
              <span className="hidden sm:inline">Koleksi</span>
              {bookmarkCount > 0 && (
                <span className="px-2 py-0.2 text-[10px] font-bold bg-[#c1fbd4] text-[#000000] rounded-full">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Pill */}
        <div className="pb-3.5 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komik..."
                className="w-full bg-[#0a0e17] text-white placeholder-[#71717a] text-xs rounded-full pl-10 pr-4 py-2.5 border border-white/10 focus:outline-none focus:border-[#c1fbd4]"
              />
              <Search className="w-4 h-4 text-[#9dabad] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
