import React from 'react';
import { searchComics, getPopularComics } from '@/lib/scraper';
import ComicCard from '@/components/ComicCard';
import { Search, Sparkles } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string; sort?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', type = '', sort = '', page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10);

  let results: any[] = [];
  let title = 'Pencarian Komik';

  if (sort === 'popular') {
    results = await getPopularComics();
    title = 'Komik Populer (Trending)';
  } else if (type) {
    const searchRes = await searchComics(type, currentPage);
    results = searchRes.data;
    title = `Koleksi Komik: ${type}`;
  } else if (q.trim()) {
    const searchRes = await searchComics(q, currentPage);
    results = searchRes.data;
    title = `Hasil Pencarian: "${q}"`;
  }

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

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {results.map((comic) => (
            <ComicCard key={comic.slug} comic={comic} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 bg-[#0a0e17] border border-white/[0.08] rounded-3xl p-8 shopify-sheen">
          <div className="w-16 h-16 rounded-full bg-[#131b26] flex items-center justify-center text-[#9dabad] mx-auto border border-white/10">
            <Search className="w-7 h-7" />
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
