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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-4 sm:p-6 space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d2d2d] pb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#0084ff]" />
              Koleksi &amp; Riwayat Bacaan
            </h1>
            <p className="text-xs text-[#888888] mt-0.5">
              Data tersimpan otomatis di browser kamu tanpa perlu registrasi akun.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#222222] p-1 rounded border border-[#333333]">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors ${
                activeTab === 'bookmarks'
                  ? 'bg-[#0084ff] text-white'
                  : 'text-[#aaaaaa] hover:text-white'
              }`}
            >
              Favorit ({bookmarks.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'bg-[#0084ff] text-white'
                  : 'text-[#aaaaaa] hover:text-white'
              }`}
            >
              Riwayat ({history.length})
            </button>
          </div>
        </div>

        {/* Bookmarks Grid */}
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3.5">
                {bookmarks.map((comic) => (
                  <div
                    key={comic.slug}
                    className="bg-[#222222] border border-[#2e2e2e] hover:border-[#444444] rounded overflow-hidden flex flex-col justify-between"
                  >
                    <Link href={`/komik/${comic.slug}`} className="relative aspect-[3/4] bg-[#1a1a1a] block overflow-hidden">
                      {comic.thumbnail ? (
                        <img
                          src={comic.thumbnail}
                          alt={comic.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Cover</div>
                      )}
                    </Link>

                    <div className="p-2.5 space-y-2">
                      <Link href={`/komik/${comic.slug}`} className="block">
                        <h3 className="font-semibold text-xs text-white hover:text-[#0084ff] line-clamp-2 leading-snug">
                          {comic.title}
                        </h3>
                      </Link>

                      <button
                        onClick={() => removeBookmark(comic.slug)}
                        className="w-full py-1.5 rounded bg-[#2a2a2a] hover:bg-rose-950 text-rose-400 text-[11px] font-medium border border-[#383838] transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <p className="text-gray-400 text-xs">Belum ada komik favorit yang disimpan.</p>
                <Link
                  href="/"
                  className="px-4 py-2 rounded bg-[#0084ff] text-white text-xs font-bold inline-block hover:bg-[#0070db]"
                >
                  Jelajahi Komik
                </Link>
              </div>
            )}
          </div>
        )}

        {/* History List */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {history.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearHistory}
                  className="px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-rose-950 text-rose-400 text-xs font-semibold border border-[#383838] transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Bersihkan Riwayat
                </button>
              </div>
            )}

            {history.length > 0 ? (
              <div className="border border-[#2d2d2d] rounded bg-[#181818] divide-y divide-[#222222]">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#202020] transition-colors"
                  >
                    <div className="space-y-1">
                      <Link
                        href={`/komik/${item.comicSlug}`}
                        className="font-bold text-sm text-white hover:text-[#0084ff] transition-colors"
                      >
                        {item.comicTitle}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-[#888888]">
                        <span className="text-[#00a2ff]">{item.chapterTitle}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#666666]" />
                          {new Date(item.timestamp).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/baca/${item.chapterSlug}`}
                      className="px-4 py-2 rounded bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow"
                    >
                      Lanjut Baca <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-gray-400">
                Belum ada riwayat bacaan.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
