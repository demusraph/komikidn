'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ComicCardItem } from '@/lib/types';
import ComicCard from '@/components/ComicCard';
import SidebarPopular from '@/components/SidebarPopular';
import { Search, BookOpen, RefreshCw } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || '';
  const pageStr = searchParams.get('page');
  const currentPage = parseInt(pageStr || '1', 10);

  const [results, setResults] = useState<ComicCardItem[]>([]);
  const [popularComics, setPopularComics] = useState<ComicCardItem[]>([]);
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
          setTitle('Komik Terpopuler (Hot)');
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

        const [res, popRes] = await Promise.all([
          fetch(fetchUrl),
          fetch('/api/comics/latest?popular=true')
        ]);
        const json = await res.json();
        const popJson = await popRes.json();
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

        if (popJson.success && Array.isArray(popJson.popular)) {
          setPopularComics(popJson.popular);
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-lg p-4 sm:p-5 space-y-4">
            <div className="border-b border-[#2d2d2d] pb-3">
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#0084ff]" />
                {title}
              </h1>
              <p className="text-xs text-[#888888] mt-0.5">
                Menemukan <span className="text-white font-medium">{results.length}</span> judul komik
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded bg-[#222222] border border-[#2d2d2d] animate-pulse" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {results.map((comic) => (
                  <ComicCard key={comic.slug} comic={comic} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded bg-[#222222] flex items-center justify-center text-gray-500 mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-400">Tidak ada komik yang sesuai dengan kata kunci pencarian.</p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#161616]" />}>
      <SearchContent />
    </Suspense>
  );
}
