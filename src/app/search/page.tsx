'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ComicCardItem } from '@/lib/types';
import ComicCard from '@/components/ComicCard';
import { Search, BookOpen, RefreshCw } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || '';
  const pageStr = searchParams.get('page');
  const currentPage = parseInt(pageStr || '1', 10);

  const [results, setResults] = useState<ComicCardItem[]>([]);
  const [title, setTitle] = useState('Pencarian Komik');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function fetchSearch() {
      try {
        let fetchUrl = '';
        if (sort === 'popular') {
          fetchUrl = '/api/comics/latest?popular=true';
          setTitle('Komik Populer (Trending)');
        } else if (type) {
          fetchUrl = `/api/comics/latest?category=${encodeURIComponent(type)}&page=${currentPage}`;
          setTitle(`Koleksi Komik: ${type}`);
        } else if (q.trim()) {
          fetchUrl = `/api/comics/search?q=${encodeURIComponent(q)}&page=${currentPage}`;
          setTitle(`Hasil Pencarian: "${q}"`);
        } else {
          fetchUrl = `/api/comics/latest?page=${currentPage}`;
          setTitle('Katalog Komik');
        }

        const res = await fetch(fetchUrl);
        const json = await res.json();
        if (!isMounted) return;

        if (json.success) {
          if (sort === 'popular' && json.popular) {
            setResults(json.popular);
          } else if (Array.isArray(json.data)) {
            setResults(json.data);
          }
        } else {
          setError(json.error || 'Pencarian tidak menemukan hasil.');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSearch();
    return () => {
      isMounted = false;
    };
  }, [q, type, sort, currentPage]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <span className="text-[11px] font-mono text-[#c1fbd4] uppercase tracking-wider block font-semibold">
            Catalog Explorer
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white flex items-center gap-3 font-display tracking-tight mt-1">
            <Search className="w-6 h-6 text-[#c1fbd4]" />
            {title}
          </h1>
          <p className="text-xs text-[#9dabad] mt-1">
            Menemukan <span className="text-white font-semibold">{results.length}</span> judul komik
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-[#0a0e17] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {results.map((comic) => (
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
              Coba periksa kembali ejaan judul atau gunakan kata kunci lain seperti nama pengarang atau genre.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <SearchContent />
    </Suspense>
  );
}
