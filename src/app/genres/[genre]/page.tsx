'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ComicCardItem } from '@/lib/types';
import ComicCard from '@/components/ComicCard';
import { Tag, ChevronRight, ChevronLeft, BookOpen, RefreshCw } from 'lucide-react';

function GenreContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const genre = (params?.genre as string) || '';
  const pageStr = searchParams.get('page');
  const currentPage = parseInt(pageStr || '1', 10);

  const cleanGenre = genre.toLowerCase().trim();
  const genreName = cleanGenre.replace(/-/g, ' ').toUpperCase();

  const [comics, setComics] = useState<ComicCardItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!cleanGenre) return;

    setLoading(true);
    setError(null);

    async function fetchGenre() {
      try {
        const res = await fetch(`/api/comics/search?q=${encodeURIComponent(cleanGenre)}&page=${currentPage}`);
        const json = await res.json();
        if (!isMounted) return;

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setComics(json.data);
          setHasNextPage(json.hasNextPage ?? true);
        } else {
          setError(json.error || 'Tidak ada komik untuk genre ini.');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGenre();
    return () => {
      isMounted = false;
    };
  }, [cleanGenre, currentPage]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Genre Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-[#c1fbd4] uppercase tracking-wider block font-semibold">
            Genre Archive &bull; {genreName}
          </span>
          <h1 className="text-2xl sm:text-4xl font-light text-white flex items-center gap-3 font-display tracking-tight">
            <Tag className="w-7 h-7 text-[#c1fbd4]" />
            Genre: {genreName}
          </h1>
          <p className="text-xs sm:text-sm text-[#9dabad]">
            Menampilkan <span className="text-white font-semibold">{comics.length}</span> judul komik
          </p>
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
            <p className="text-white font-semibold text-base sm:text-lg font-display">Tidak Ada Komik Ditemukan</p>
            <p className="text-[#71717a] text-xs max-w-md mx-auto">
              Belum ada komik dengan genre ini di halaman ini.
            </p>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && comics.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-8 pb-4">
          {currentPage > 1 && (
            <Link
              href={`/genres/${cleanGenre}?page=${currentPage - 1}`}
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
              href={`/genres/${cleanGenre}?page=${currentPage + 1}`}
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

export default function GenrePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <GenreContent />
    </Suspense>
  );
}
