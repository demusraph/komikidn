'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ComicDetail, ComicCardItem } from '@/lib/types';
import ChapterList from '@/components/ChapterList';
import BookmarkButton from './BookmarkButton';
import SidebarPopular from '@/components/SidebarPopular';
import { BookOpen, Star, Play, RefreshCw, Layers } from 'lucide-react';

function ComicDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [detail, setDetail] = useState<ComicDetail | null>(null);
  const [popularComics, setPopularComics] = useState<ComicCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return;

    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const [res, popRes] = await Promise.all([
          fetch(`/api/comics/${encodeURIComponent(slug)}`),
          fetch('/api/comics/latest?popular=true')
        ]);
        const json = await res.json();
        const popJson = await popRes.json();
        if (!isMounted) return;

        if (json.success && json.data) {
          setDetail(json.data);
        } else {
          setError(json.error || 'Komik tidak ditemukan atau gagal dimuat.');
        }

        if (popJson.success && Array.isArray(popJson.popular)) {
          setPopularComics(popJson.popular);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-6 animate-pulse flex flex-col md:flex-row gap-6">
          <div className="w-48 sm:w-56 aspect-[3/4] bg-[#222222] rounded flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-6 w-3/4 bg-[#222222] rounded" />
            <div className="h-4 w-1/2 bg-[#222222] rounded" />
            <div className="h-24 bg-[#222222] rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded bg-[#222222] flex items-center justify-center text-[#0084ff] mx-auto border border-[#333333]">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gagal Memuat Komik</h1>
          <p className="text-xs sm:text-sm text-[#888888] max-w-md mx-auto">
            {error || 'Data komik tidak dapat ditemukan.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded bg-[#0084ff] text-white text-xs font-bold hover:bg-[#0070db] inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Coba Lagi
          </button>
          <Link
            href="/"
            className="px-5 py-2 rounded bg-[#222222] text-white text-xs font-semibold hover:bg-[#282828] border border-[#333333]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const firstChapter = detail.chapters[detail.chapters.length - 1];
  const latestChapter = detail.chapters[0];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Info + Chapters */}
        <div className="lg:col-span-8 space-y-6">
          {/* Komikindo Detail Info Card */}
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Cover Art */}
              <div className="w-48 sm:w-56 mx-auto sm:mx-0 flex-shrink-0">
                <div className="aspect-[3/4] rounded overflow-hidden bg-[#222222] border border-[#383838] shadow-lg relative">
                  {detail.thumbnail ? (
                    <img
                      src={detail.thumbnail}
                      alt={detail.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Cover</div>
                  )}
                  {/* Status Badge */}
                  {detail.metadata['status'] && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {detail.metadata['status']}
                    </div>
                  )}
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-1 space-y-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {detail.title}
                </h1>

                {detail.metadata['judul alternatif'] && (
                  <p className="text-xs text-[#aaaaaa]">
                    <span className="text-[#666666]">Alias:</span> {detail.metadata['judul alternatif']}
                  </p>
                )}

                {/* Metadata Table (Komikindo Style) */}
                <div className="text-xs border border-[#2d2d2d] rounded overflow-hidden bg-[#181818] divide-y divide-[#262626]">
                  {detail.metadata['pengarang'] && (
                    <div className="flex px-3 py-1.5">
                      <span className="w-32 text-[#777777]">Pengarang</span>
                      <span className="flex-1 text-white font-medium">{detail.metadata['pengarang']}</span>
                    </div>
                  )}
                  {detail.metadata['ilustrator'] && (
                    <div className="flex px-3 py-1.5">
                      <span className="w-32 text-[#777777]">Ilustrator</span>
                      <span className="flex-1 text-white font-medium">{detail.metadata['ilustrator']}</span>
                    </div>
                  )}
                  {detail.metadata['jenis komik'] && (
                    <div className="flex px-3 py-1.5">
                      <span className="w-32 text-[#777777]">Jenis Komik</span>
                      <span className="flex-1 text-[#00a2ff] font-medium">{detail.metadata['jenis komik']}</span>
                    </div>
                  )}
                  {detail.metadata['tema'] && (
                    <div className="flex px-3 py-1.5">
                      <span className="w-32 text-[#777777]">Tema</span>
                      <span className="flex-1 text-white font-medium">{detail.metadata['tema']}</span>
                    </div>
                  )}
                  <div className="flex px-3 py-1.5">
                    <span className="w-32 text-[#777777]">Total Chapter</span>
                    <span className="flex-1 text-emerald-400 font-bold font-mono">{detail.totalChapters} Chapter</span>
                  </div>
                </div>

                {/* Genre Tags */}
                {detail.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {detail.genres.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/genres/${g.slug}`}
                        className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#0084ff] text-xs text-[#cccccc] hover:text-white border border-[#333333] transition-colors"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  {firstChapter && (
                    <Link
                      href={`/baca/${firstChapter.slug}`}
                      className="px-4 py-2.5 rounded bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors shadow flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Baca Awal
                    </Link>
                  )}
                  {latestChapter && (
                    <Link
                      href={`/baca/${latestChapter.slug}`}
                      className="px-4 py-2.5 rounded bg-[#2a2a2a] hover:bg-[#333333] text-xs font-semibold text-white border border-[#383838] transition-colors"
                    >
                      Baca Terbaru
                    </Link>
                  )}
                  <BookmarkButton
                    comic={{
                      slug: detail.slug,
                      title: detail.title,
                      thumbnail: detail.thumbnail,
                      type: (detail.metadata['jenis komik'] as any) || 'Unknown',
                      lastReadAt: Date.now(),
                      addedAt: Date.now()
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Synopsis Box */}
            {detail.synopsis && (
              <div className="space-y-2 pt-4 border-t border-[#2d2d2d]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0084ff]" />
                  Sinopsis {detail.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#bbbbbb] leading-relaxed">
                  {detail.synopsis}
                </p>
              </div>
            )}
          </div>

          {/* Chapter List Component */}
          <ChapterList comicSlug={detail.slug} chapters={detail.chapters} />
        </div>

        {/* Right Column (4 cols): Sidebar */}
        <div className="lg:col-span-4">
          <SidebarPopular popularComics={popularComics} />
        </div>
      </div>
    </main>
  );
}

export default function ComicDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#161616]" />}>
      <ComicDetailContent />
    </Suspense>
  );
}
