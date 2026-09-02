import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComicsByGenre } from '@/lib/scraper';
import ComicCard from '@/components/ComicCard';
import { Tag, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';

interface GenrePageProps {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const revalidate = 180; // 3 minutes cache

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { genre } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = parseInt(pageStr || '1', 10);

  const cleanGenre = genre.toLowerCase().trim();

  let resData;
  try {
    resData = await getComicsByGenre(cleanGenre, currentPage);
  } catch (err) {
    notFound();
  }

  const genreName = cleanGenre.replace(/-/g, ' ').toUpperCase();

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
            Menampilkan <span className="text-white font-semibold">{resData.data.length}</span> judul komik genre {genreName}
          </p>
        </div>
      </div>

      {/* Comics Grid */}
      {resData.data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {resData.data.map((comic) => (
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

        {resData.hasNextPage && (
          <Link
            href={`/genres/${cleanGenre}?page=${currentPage + 1}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c1fbd4] hover:bg-[#a8f7c1] text-xs font-bold text-black shadow-lg shadow-[#c1fbd4]/15 transition-all"
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </main>
  );
}
