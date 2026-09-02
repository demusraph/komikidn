'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ComicDetail, ComicCardItem } from '@/lib/types';
import ChapterList from '@/components/ChapterList';
import BookmarkButton from './BookmarkButton';
import SidebarPopular from '@/components/SidebarPopular';
import { BookOpen, Star, Play, RefreshCw, Layers, User, Palette, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Calendar } from 'lucide-react';

function ComicDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [detail, setDetail] = useState<ComicDetail | null>(null);
  const [popularComics, setPopularComics] = useState<ComicCardItem[]>([]);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
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
        <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl p-6 sm:p-8 animate-pulse flex flex-col md:flex-row gap-6">
          <div className="w-52 sm:w-60 aspect-[3/4] bg-[#242424] rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-7 w-3/4 bg-[#242424] rounded-md" />
            <div className="h-4 w-1/3 bg-[#242424] rounded-md" />
            <div className="h-32 bg-[#242424] rounded-lg" />
            <div className="h-10 w-48 bg-[#242424] rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#222222] flex items-center justify-center text-[#0084ff] mx-auto border border-[#333333]">
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
            className="px-5 py-2.5 rounded-lg bg-[#0084ff] text-white text-xs font-bold hover:bg-[#0070db] inline-flex items-center gap-2 shadow"
          >
            <RefreshCw className="w-4 h-4" /> Coba Lagi
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-[#222222] text-white text-xs font-semibold hover:bg-[#282828] border border-[#333333]"
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
          {/* Komikindo Detail Info Card with Ambient Glow */}
          <div className="relative bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 space-y-6 shadow-xl overflow-hidden">
            {/* Ambient Background Glow */}
            {detail.thumbnail && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl pointer-events-none scale-125"
                style={{ backgroundImage: `url(${detail.thumbnail})` }}
              />
            )}

            <div className="relative z-10 flex flex-col sm:flex-row gap-6">
              {/* Cover Art */}
              <div className="w-52 sm:w-60 mx-auto sm:mx-0 flex-shrink-0">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#222222] border border-[#383838] shadow-2xl relative group">
                  {detail.thumbnail ? (
                    <img
                      src={detail.thumbnail}
                      alt={detail.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Cover</div>
                  )}

                  {/* Status Badge */}
                  {detail.metadata['status'] && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                      {detail.metadata['status']}
                    </div>
                  )}

                  {/* Total Chapter Pill */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 font-mono">
                    {detail.totalChapters} Ch
                  </div>
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-1 space-y-3.5">
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight font-sans">
                    {detail.title}
                  </h1>

                  {detail.metadata['judul alternatif'] && (
                    <p className="text-xs text-[#999999] leading-relaxed">
                      <span className="text-[#666666] font-semibold">Judul Lain:</span> {detail.metadata['judul alternatif']}
                    </p>
                  )}
                </div>

                {/* Metadata Table (Komikindo Style) */}
                <div className="text-xs border border-[#2d2d2d] rounded-lg overflow-hidden bg-[#161616]/90 divide-y divide-[#222222]">
                  {detail.metadata['pengarang'] && (
                    <div className="flex px-3.5 py-2 items-center">
                      <span className="w-32 text-[#777777] flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-[#00a2ff]" /> Pengarang
                      </span>
                      <span className="flex-1 text-white font-semibold truncate">{detail.metadata['pengarang']}</span>
                    </div>
                  )}
                  {detail.metadata['ilustrator'] && (
                    <div className="flex px-3.5 py-2 items-center">
                      <span className="w-32 text-[#777777] flex items-center gap-1.5 font-medium">
                        <Palette className="w-3.5 h-3.5 text-amber-400" /> Ilustrator
                      </span>
                      <span className="flex-1 text-white font-semibold truncate">{detail.metadata['ilustrator']}</span>
                    </div>
                  )}
                  {detail.metadata['jenis komik'] && (
                    <div className="flex px-3.5 py-2 items-center">
                      <span className="w-32 text-[#777777] flex items-center gap-1.5 font-medium">
                        <Layers className="w-3.5 h-3.5 text-purple-400" /> Jenis Komik
                      </span>
                      <span className="flex-1 text-[#00a2ff] font-bold">{detail.metadata['jenis komik']}</span>
                    </div>
                  )}
                  {detail.metadata['tema'] && (
                    <div className="flex px-3.5 py-2 items-center">
                      <span className="w-32 text-[#777777] flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Tema
                      </span>
                      <span className="flex-1 text-white font-medium">{detail.metadata['tema']}</span>
                    </div>
                  )}
                  <div className="flex px-3.5 py-2 items-center">
                    <span className="w-32 text-[#777777] flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Total Chapter
                    </span>
                    <span className="flex-1 text-emerald-400 font-extrabold font-mono">{detail.totalChapters} Chapter Tersedia</span>
                  </div>
                </div>

                {/* Genre Tags */}
                {detail.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {detail.genres.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/genres/${g.slug}`}
                        className="px-2.5 py-1 rounded-md bg-[#242424] hover:bg-[#0084ff] text-xs text-[#cccccc] hover:text-white border border-[#333333] hover:border-[#0084ff] transition-all hover:-translate-y-0.5"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Action CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  {firstChapter && (
                    <Link
                      href={`/baca/${firstChapter.slug}`}
                      className="px-5 py-2.5 rounded-lg bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-all shadow-[0_4px_12px_rgba(0,132,255,0.4)] flex items-center gap-1.5 group/btn"
                    >
                      <Play className="w-3.5 h-3.5 fill-current group-hover/btn:scale-110 transition-transform" /> Baca Chapter 1
                    </Link>
                  )}
                  {latestChapter && (
                    <Link
                      href={`/baca/${latestChapter.slug}`}
                      className="px-4 py-2.5 rounded-lg bg-[#252525] hover:bg-[#303030] text-xs font-semibold text-white border border-[#383838] transition-colors"
                    >
                      Baca Terbaru ({latestChapter.title.replace(/^Chapter\s+/i, 'Ch. ')})
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

            {/* Expandable Synopsis Box */}
            {detail.synopsis && (
              <div className="space-y-2 pt-4 border-t border-[#2d2d2d] relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0084ff]" />
                  Sinopsis Lengkap {detail.title}
                </h3>
                <div className="relative">
                  <p
                    className={`text-xs sm:text-sm text-[#bbbbbb] leading-relaxed transition-all ${
                      !isSynopsisExpanded ? 'line-clamp-4' : ''
                    }`}
                  >
                    {detail.synopsis}
                  </p>
                  {detail.synopsis.length > 250 && (
                    <button
                      onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                      className="mt-2 text-xs font-bold text-[#00a2ff] hover:text-white inline-flex items-center gap-1 transition-colors"
                    >
                      {isSynopsisExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Sembunyikan Sinopsis
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Baca Selengkapnya...
                        </>
                      )}
                    </button>
                  )}
                </div>
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
