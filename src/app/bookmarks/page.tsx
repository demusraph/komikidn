'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookmarkItem } from '@/lib/types';
import { Bookmark, History, Trash2, Clock, ArrowRight, BookOpen } from 'lucide-react';

interface HistoryItem {
  comicSlug: string;
  comicTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  timestamp: number;
}

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadData = () => {
    try {
      const b = localStorage.getItem('komik_bookmarks');
      setBookmarks(b ? JSON.parse(b) : []);

      const h = localStorage.getItem('komik_history');
      setHistory(h ? JSON.parse(h) : []);
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter((b) => b.slug !== slug);
    setBookmarks(updated);
    localStorage.setItem('komik_bookmarks', JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarks-updated'));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('komik_history');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Shopify Tab Pill Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
        <div>
          <span className="text-[11px] font-mono text-[#c1fbd4] uppercase tracking-wider block font-semibold">
            User Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white flex items-center gap-3 font-display tracking-tight mt-1">
            <Bookmark className="w-6 h-6 text-[#c1fbd4]" />
            Koleksi &amp; Riwayat Bacaan
          </h1>
          <p className="text-xs text-[#9dabad] mt-1">
            Data tersimpan privat di local storage peramban tanpa perlu login.
          </p>
        </div>

        {/* Shopify Pill Switcher */}
        <div className="flex items-center p-1.5 bg-[#0a0e17] border border-white/10 rounded-full self-start shadow-md">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-[#c1fbd4] text-black shadow-lg shadow-[#c1fbd4]/20'
                : 'text-[#9dabad] hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Favorit ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-[#c1fbd4] text-black shadow-lg shadow-[#c1fbd4]/20'
                : 'text-[#9dabad] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Riwayat ({history.length})
          </button>
        </div>
      </div>

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
              {bookmarks.map((comic) => (
                <div
                  key={comic.slug}
                  className="group bg-[#0a0e17] border border-white/[0.08] hover:border-[#c1fbd4]/40 rounded-2xl overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all relative"
                >
                  <Link href={`/komik/${comic.slug}`} className="relative aspect-[3/4] bg-[#131b26] block overflow-hidden">
                    {comic.thumbnail ? (
                      <img
                        src={comic.thumbnail}
                        alt={comic.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#71717a] text-xs">No Image</div>
                    )}
                    <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] pointer-events-none" />
                  </Link>

                  <div className="p-3.5 space-y-3">
                    <Link href={`/komik/${comic.slug}`} className="block">
                      <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-[#c1fbd4] line-clamp-2 leading-snug transition-colors">
                        {comic.title}
                      </h3>
                    </Link>

                    <button
                      onClick={() => removeBookmark(comic.slug)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#131b26] hover:bg-rose-500/20 text-[#d4d4d8] hover:text-rose-400 text-xs font-semibold border border-white/10 hover:border-rose-500/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-4 bg-[#0a0e17] border border-white/[0.08] rounded-3xl p-8 shopify-sheen">
              <div className="w-16 h-16 rounded-full bg-[#131b26] flex items-center justify-center text-[#9dabad] mx-auto border border-white/10">
                <Bookmark className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold text-base sm:text-lg font-display">Belum Ada Komik Favorit</p>
                <p className="text-[#71717a] text-xs max-w-sm mx-auto">
                  Buka halaman detail komik yang kamu suka lalu klik tombol "Simpan ke Koleksi".
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {history.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#131b26] hover:bg-rose-500/20 text-[#d4d4d8] hover:text-rose-400 text-xs font-semibold border border-white/10 hover:border-rose-500/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Bersihkan Riwayat
              </button>
            </div>
          )}

          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0e17] border border-white/[0.08] hover:border-[#c1fbd4]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] shopify-sheen"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/komik/${item.comicSlug}`}
                      className="font-bold text-sm sm:text-base text-white hover:text-[#c1fbd4] transition-colors block font-display"
                    >
                      {item.comicTitle}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-[#9dabad]">
                      <span className="text-[#c1fbd4] font-medium font-mono">{item.chapterTitle}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#71717a]" />
                        {new Date(item.timestamp).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/baca/${item.chapterSlug}`}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#c1fbd4] hover:bg-[#a8f7c1] text-black text-xs font-bold shadow-lg shadow-[#c1fbd4]/15 transition-all self-start sm:self-auto"
                  >
                    Lanjut Baca <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-4 bg-[#0a0e17] border border-white/[0.08] rounded-3xl p-8 shopify-sheen">
              <div className="w-16 h-16 rounded-full bg-[#131b26] flex items-center justify-center text-[#9dabad] mx-auto border border-white/10">
                <History className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold text-base sm:text-lg font-display">Belum Ada Riwayat Bacaan</p>
                <p className="text-[#71717a] text-xs max-w-sm mx-auto">
                  Setiap kali kamu membuka chapter komik, riwayat bacaanmu akan otomatis tercatat di sini.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
