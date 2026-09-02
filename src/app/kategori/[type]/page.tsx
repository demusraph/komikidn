'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ComicCardItem } from '@/lib/types';
import ComicCard from '@/components/ComicCard';
import { Layers, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';

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
      subtitle: 'Koleksi komik Korea Selatan format webtoon full-color',
      flag: 'Manhwa'
    },
    manga: {
      title: 'Daftar Komik Manga',
      subtitle: 'Koleksi komik Jepang klasik dan modern',
      flag: 'Manga'
    },
    manhua: {
      title: 'Daftar Komik Manhua',
      subtitle: 'Koleksi komik China/Tiongkok tema martial arts dan cultivation',
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
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const catRes = await fetch(`/api/comics/latest?category=${encodeURIComponent(cleanType)}&page=${currentPage}`);
        const json = await catRes.json();
        if (!isMounted) return;

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setComics(json.data);
          setHasNextPage(json.hasNextPage ?? true);
        } else {
          setError(json.error || 'Gagal memuat komik kategori.');
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#c1fbd4] uppercase tracking-wider block font-semibold">
              Category Archive &bull; {catMeta.flag}
            </span>
            <span className="text-[10px] font-mono text-[#71717a] px-2 py-0.5 rounded-full bg-[#131b26] border border-white/5">
              Halaman {currentPage}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-light text-white flex items-center gap-3 font-display tracking-tight">
            <Layers className="w-7 h-7 text-[#c1fbd4]" />
            {catMeta.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#9dabad]">
            {catMeta.subtitle} &bull; Menampilkan <span className="text-white font-semibold">{comics.length}</span> judul
          </p>
        </div>

        {/* Quick Category Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <Link
            href="/kategori/manhwa"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              cleanType === 'manhwa'
                ? 'bg-[#c1fbd4] text-black shadow-lg shadow-[#c1fbd4]/20'
                : 'bg-[#131b26] text-[#d4d4d8] hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            Manhwa
          </Link>
          <Link
            href="/kategori/manga"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              cleanType === 'manga'
                ? 'bg-[#c1fbd4] text-black shadow-lg shadow-[#c1fbd4]/20'
                : 'bg-[#131b26] text-[#d4d4d8] hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            Manga
          </Link>
          <Link
            href="/kategori/manhua"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              cleanType === 'manhua'
                ? 'bg-[#c1fbd4] text-black shadow-lg shadow-[#c1fbd4]/20'
                : 'bg-[#131b26] text-[#d4d4d8] hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            Manhua
          </Link>
        </div>
      </div>

      {/* Comics Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-[#0a0e17] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : comics.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {comics.map((comic) => (
            <ComicCard key={comic.slug} comic={comic} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 bg-[#0a0e17] border border-white/[0.08] rounded-3xl p-8 shopify-sheen">
          <div className="w-16 h-16 rounded-full bg-[#131b26] flex items-center justify-center text-[#9dabad] mx-auto border border-white/10">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-semibold text-base sm:text-lg font-display">Belum Ada Komik di Halaman Ini</p>
            <p className="text-[#71717a] text-xs max-w-md mx-auto">
              Silakan kembali ke halaman sebelumnya.
            </p>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && comics.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-8 pb-4">
          {currentPage > 1 && (
            <Link
              href={`/kategori/${cleanType}?page=${currentPage - 1}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#131b26] hover:bg-[#1b2636] border border-white/10 text-xs font-semibold text-white transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </Link>
          )}

          <span className="px-4 py-2 rounded-full bg-[#c1fbd4]/10 border border-[#c1fbd4]/30 text-xs font-bold text-[#c1fbd4] font-mono">
            {currentPage}
          </span>

          {hasNextPage && (
            <Link
              href={`/kategori/${cleanType}?page=${currentPage + 1}`}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c1fbd4] hover:bg-[#a8f7c1] text-xs font-bold text-black shadow-lg shadow-[#c1fbd4]/15 transition-all"
            >
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <CategoryContent />
    </Suspense>
  );
}
