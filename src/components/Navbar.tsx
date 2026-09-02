'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Flame, Bookmark, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

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
    <header className="bg-[#111111] border-b border-[#262626] sticky top-0 z-50">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Top Left Quick Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-[#b3b3b3]">
            <Link
              href="/search?sort=popular"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Komik HOT</span>
            </Link>
            <Link
              href="/bookmarks"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#00a2ff]" />
              <span>Koleksi ({bookmarkCount})</span>
            </Link>
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded text-[11px]">
              <ShieldCheck className="w-3 h-3" /> 100% Tanpa Iklan
            </span>
          </div>

          {/* Center Brand Logo (Komikindo Style) */}
          <div className="flex-1 lg:flex-initial flex items-center justify-start lg:justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Komikindo Puzzle Icon */}
              <div className="w-8 h-8 rounded bg-[#0084ff] flex items-center justify-center text-white shadow-sm group-hover:bg-[#00a2ff] transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 12h-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM9 18H5v-4h4v4zm0-6H5V8h4v4zm0-6H5V4h4v2zm6 12h-4v-4h4v4zm0-6h-4V8h4v4zm4 6h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                komik<span className="text-[#00a2ff]">idn</span>
              </span>
            </Link>
          </div>

          {/* Right Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pencarian..."
                className="w-full bg-[#222222] text-white text-xs sm:text-sm rounded border border-[#333333] pl-3 pr-10 py-2 focus:outline-none focus:border-[#0084ff] transition-colors placeholder-[#777777]"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute right-0 top-0 bottom-0 px-3 bg-[#2a2a2a] hover:bg-[#0084ff] text-[#aaaaaa] hover:text-white rounded-r transition-colors flex items-center justify-center border-l border-[#333333]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Bar (Komikindo Dark Menu) */}
      <nav className="bg-[#1a1a1a] border-t border-[#262626] overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs whitespace-nowrap py-1.5">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/'
                ? 'bg-[#0084ff] text-white font-semibold'
                : 'text-[#cccccc] hover:bg-[#282828] hover:text-white'
            }`}
          >
            Komik Terbaru
          </Link>
          <Link
            href="/kategori/manhwa"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/kategori/manhwa'
                ? 'bg-[#0084ff] text-white font-semibold'
                : 'text-[#cccccc] hover:bg-[#282828] hover:text-white'
            }`}
          >
            Manhwa (Komik Korea)
          </Link>
          <Link
            href="/kategori/manga"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/kategori/manga'
                ? 'bg-[#0084ff] text-white font-semibold'
                : 'text-[#cccccc] hover:bg-[#282828] hover:text-white'
            }`}
          >
            Manga (Komik Jepang)
          </Link>
          <Link
            href="/kategori/manhua"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/kategori/manhua'
                ? 'bg-[#0084ff] text-white font-semibold'
                : 'text-[#cccccc] hover:bg-[#282828] hover:text-white'
            }`}
          >
            Manhua (Komik China)
          </Link>
          <Link
            href="/kategori/daftar-manga"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/kategori/daftar-manga'
                ? 'bg-[#0084ff] text-white font-semibold'
                : 'text-[#cccccc] hover:bg-[#282828] hover:text-white'
            }`}
          >
            Daftar Komik
          </Link>
          <Link
            href="/search?sort=popular"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/search'
                ? 'bg-[#0084ff] text-white font-semibold'
                : 'text-[#cccccc] hover:bg-[#282828] hover:text-white'
            }`}
          >
            Komik Populer
          </Link>
          <Link
            href="/bookmarks"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/bookmarks'
                ? 'bg-[#0084ff] text-white font-semibold'
                : 'text-[#cccccc] hover:bg-[#282828] hover:text-white'
            }`}
          >
            Koleksi Saya
          </Link>
        </div>
      </nav>
    </header>
  );
}
