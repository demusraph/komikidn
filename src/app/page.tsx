'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ComicCardItem } from '@/lib/types';
import ComicCard from '@/components/ComicCard';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import SidebarPopular from '@/components/SidebarPopular';
import { Flame, Sparkles, ChevronRight, ChevronLeft, ShieldCheck, RefreshCw, BookOpen } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const pageStr = searchParams.get('page');
  const currentPage = parseInt(pageStr || '1', 10);

  const [latestComics, setLatestComics] = useState<ComicCardItem[]>([]);
  const [popularComics, setPopularComics] = useState<ComicCardItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const res = await fetch(`/api/comics/latest?page=${currentPage}&popular=true`);
        const json = await res.json();
        if (!isMounted) return;

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLatestComics(json.data);
          setHasNextPage(json.hasNextPage ?? true);
          if (json.popular) {
            setPopularComics(json.popular);
          }
        } else {
          setError(json.error || 'Gagal memuat data komik.');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* 1. Hero Featured Carousel (Komikindo Style) */}
      {popularComics.length > 0 && currentPage === 1 && (
        <FeaturedCarousel comics={popularComics} />
      )}

      {/* 2. Main 2-Column Grid (Main Feed + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Welcome Info Box */}
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-4 sm:p-5 space-y-2">
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0084ff]" />
              KOMIKIDN - Baca Manga, Manhwa &amp; Manhua Online
            </h1>
            <p className="text-xs text-[#aaaaaa] leading-relaxed">
              KOMIKIDN merupakan platform baca komik online dengan ribuan koleksi komik terlengkap dan terupdate setiap hari secara gratis. Nikmati pengalaman membaca komik berkecepatan tinggi yang 100% bebas dari gangguan iklan popunder judol dan aplikasi lain.
            </p>
          </div>

          {/* Popular Strip (5 Horizontal Cards with Flags) */}
          {currentPage === 1 && popularComics.length > 0 && (
            <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#2d2d2d] pb-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Baca Komik Terpopuler Hari Ini
                </h2>
                <Link href="/search?sort=popular" className="text-xs text-[#00a2ff] hover:underline">
                  Lihat Semua
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {popularComics.slice(0, 5).map((comic) => (
                  <Link
                    key={comic.slug}
                    href={`/komik/${comic.slug}`}
                    className="group relative aspect-[3/4] rounded overflow-hidden bg-[#222222] border border-[#333333] hover:border-[#0084ff] transition-all block"
                  >
                    {comic.thumbnail && (
                      <img
                        src={comic.thumbnail}
                        alt={comic.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {/* Country Flag Badge */}
                    <div className="absolute top-1 right-1 text-xs bg-black/70 px-1 py-0.5 rounded shadow">
                      {comic.type === 'Manhwa' ? '🇰🇷' : comic.type === 'Manhua' ? '🇨🇳' : '🇯🇵'}
                    </div>
                    {/* Bottom Title Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-1.5">
                      <p className="text-[11px] font-bold text-white group-hover:text-[#00a2ff] line-clamp-1 transition-colors">
                        {comic.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest Released Comics Section */}
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2d2d] pb-2.5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#0084ff]" />
                Komik Rilis Terbaru
              </h2>
              <span className="text-xs text-[#777777] bg-[#222222] px-2.5 py-0.5 rounded border border-[#2d2d2d]">
                Halaman {currentPage}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded bg-[#222222] border border-[#2d2d2d] animate-pulse" />
                ))}
              </div>
            ) : latestComics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {latestComics.map((comic) => (
                  <ComicCard key={comic.slug} comic={comic} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <p className="text-sm text-gray-400">{error || 'Tidak ada data komik.'}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded bg-[#0084ff] text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#0070db]"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && latestComics.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2d2d2d]">
                {currentPage > 1 && (
                  <Link
                    href={`/?page=${currentPage - 1}`}
                    className="flex items-center gap-1 px-4 py-2 rounded bg-[#252525] hover:bg-[#333333] border border-[#383838] text-xs font-semibold text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </Link>
                )}

                <span className="px-3.5 py-2 rounded bg-[#0084ff] text-xs font-bold text-white">
                  {currentPage}
                </span>

                {hasNextPage && (
                  <Link
                    href={`/?page=${currentPage + 1}`}
                    className="flex items-center gap-1 px-5 py-2 rounded bg-[#0084ff] hover:bg-[#0070db] text-xs font-bold text-white transition-colors shadow"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Sidebar */}
        <div className="lg:col-span-4">
          <SidebarPopular popularComics={popularComics} />
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#161616]" />}>
      <HomeContent />
    </Suspense>
  );
}
