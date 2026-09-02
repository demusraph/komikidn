'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Flame, Bookmark, ShieldCheck, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Keyboard shortcut (Ctrl+K or / to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <header className="bg-[#141414]/95 backdrop-blur-md border-b border-[#262626] sticky top-0 z-50 transition-all">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Top Left Quick Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-[#b3b3b3]">
            <Link
              href="/search?sort=popular"
              className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#222222]"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Komik HOT</span>
            </Link>
            <Link
              href="/bookmarks"
              className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#222222]"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#00a2ff]" />
              <span>Koleksi ({bookmarkCount})</span>
            </Link>
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded text-[11px] font-medium">
              <ShieldCheck className="w-3 h-3" /> 100% Bebas Iklan
            </span>
          </div>

          {/* Center Brand Logo */}
          <div className="flex-1 lg:flex-initial flex items-center justify-start lg:justify-center">
            <Link href="/" className="flex items-center group py-1">
              <img
                src="/logo.png"
                alt="KOMIKIDN"
                className="h-9 sm:h-10 w-auto object-contain brightness-110 drop-shadow group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Right Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pencarian komik... (Ctrl + K)"
                className="w-full bg-[#202020] text-white text-xs sm:text-sm rounded-lg border border-[#333333] pl-3 pr-16 py-2 focus:outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-all placeholder-[#777777]"
              />

              {/* Clear button if has text */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-10 text-gray-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                aria-label="Cari"
                className="absolute right-0 top-0 bottom-0 px-3 bg-[#2a2a2a] hover:bg-[#0084ff] text-[#aaaaaa] hover:text-white rounded-r-lg transition-colors flex items-center justify-center border-l border-[#333333]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Bar */}
      <nav className="bg-[#181818] border-t border-[#262626] overflow-x-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs whitespace-nowrap py-1.5">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/'
                ? 'bg-[#0084ff] text-white font-bold shadow'
                : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
            }`}
          >
            Komik Terbaru
          </Link>
          <Link
            href="/kategori/manhwa"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/kategori/manhwa'
                ? 'bg-[#0084ff] text-white font-bold shadow'
                : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
            }`}
          >
            Manhwa (Komik Korea)
          </Link>
          <Link
            href="/kategori/manga"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/kategori/manga'
                ? 'bg-[#0084ff] text-white font-bold shadow'
                : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
            }`}
          >
            Manga (Komik Jepang)
          </Link>
          <Link
            href="/kategori/manhua"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/kategori/manhua'
                ? 'bg-[#0084ff] text-white font-bold shadow'
                : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
            }`}
          >
            Manhua (Komik China)
          </Link>
          <Link
            href="/kategori/daftar-manga"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/kategori/daftar-manga'
                ? 'bg-[#0084ff] text-white font-bold shadow'
                : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
            }`}
          >
            Daftar Komik
          </Link>
          <Link
            href="/search?sort=popular"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/search'
                ? 'bg-[#0084ff] text-white font-bold shadow'
                : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
            }`}
          >
            Komik Populer
          </Link>
          <Link
            href="/bookmarks"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/bookmarks'
                ? 'bg-[#0084ff] text-white font-bold shadow'
                : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
            }`}
          >
            Koleksi ({bookmarkCount})
          </Link>
        </div>
      </nav>
    </header>
  );
}
