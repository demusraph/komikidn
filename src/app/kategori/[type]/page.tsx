'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ComicCardItem } from '@/lib/types';
import ComicCard from '@/components/ComicCard';
import SidebarPopular from '@/components/SidebarPopular';
import { Layers, ChevronRight, ChevronLeft, BookOpen, RefreshCw } from 'lucide-react';

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const type = (params?.type as string) || 'manhwa';
  const pageStr = searchParams.get('page');
  const currentPage = parseInt(pageStr || '1', 10);

  const cleanType = type.toLowerCase().trim();
  const validCategories: Record<string, { title: string; subtitle: string; flag: string }> = {
    manhwa: {
      title: 'Daftar Komik Manhwa',
      subtitle: 'Koleksi komik Korea format webtoon full-color',
      flag: 'Manhwa'
    },
    manga: {
      title: 'Daftar Komik Manga',
      subtitle: 'Koleksi komik Jepang klasik dan modern',
      flag: 'Manga'
    },
    manhua: {
      title: 'Daftar Komik Manhua',
      subtitle: 'Koleksi komik China tema martial arts dan cultivation',
      flag: 'Manhua'
    },
    'daftar-manga': {
      title: 'Daftar Seluruh Komik',
      subtitle: 'Direktori lengkap komik Manga, Manhwa, dan Manhua',
      flag: 'Semua'
    }
  };

  const catMeta = validCategories[cleanType] || {
    title: `Kategori: ${cleanType.toUpperCase()}`,
    subtitle: `Koleksi komik kategori ${cleanType}`,
    flag: cleanType
  };

  const [comics, setComics] = useState<ComicCardItem[]>([]);
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
        const [catRes, popRes] = await Promise.all([
          fetch(`/api/comics/latest?category=${encodeURIComponent(cleanType)}&page=${currentPage}`),
          fetch('/api/comics/latest?popular=true')
        ]);
        const json = await catRes.json();
        const popJson = await popRes.json();
        if (!isMounted) return;

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setComics(json.data);
          setHasNextPage(json.hasNextPage ?? true);
        } else {
          setError(json.error || 'Gagal memuat komik kategori.');
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

    loadData();
    return () => {
      isMounted = false;
    };
  }, [cleanType, currentPage]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Category Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2d2d] pb-3">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0084ff]" />
                  {catMeta.title}
                </h1>
                <p className="text-xs text-[#888888] mt-0.5">
                  {catMeta.subtitle} &bull; Menampilkan <span className="text-white font-medium">{comics.length}</span> judul
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <Link
                  href="/kategori/manhwa"
                  className={`px-3 py-1 rounded transition-colors ${
                    cleanType === 'manhwa' ? 'bg-[#0084ff] text-white font-semibold' : 'bg-[#252525] text-[#cccccc] hover:bg-[#333333]'
                  }`}
                >
                  Manhwa
                </Link>
                <Link
                  href="/kategori/manga"
                  className={`px-3 py-1 rounded transition-colors ${
                    cleanType === 'manga' ? 'bg-[#0084ff] text-white font-semibold' : 'bg-[#252525] text-[#cccccc] hover:bg-[#333333]'
                  }`}
                >
                  Manga
                </Link>
                <Link
                  href="/kategori/manhua"
                  className={`px-3 py-1 rounded transition-colors ${
                    cleanType === 'manhua' ? 'bg-[#0084ff] text-white font-semibold' : 'bg-[#252525] text-[#cccccc] hover:bg-[#333333]'
                  }`}
                >
                  Manhua
                </Link>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded bg-[#222222] border border-[#2d2d2d] animate-pulse" />
                ))}
              </div>
            ) : comics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {comics.map((comic) => (
                  <ComicCard key={comic.slug} comic={comic} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <p className="text-sm text-gray-400">{error || 'Tidak ada komik di halaman ini.'}</p>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && comics.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2d2d2d]">
                {currentPage > 1 && (
                  <Link
                    href={`/kategori/${cleanType}?page=${currentPage - 1}`}
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
                    href={`/kategori/${cleanType}?page=${currentPage + 1}`}
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

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#161616]" />}>
      <CategoryContent />
    </Suspense>
  );
}
