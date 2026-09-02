import React from 'react';
import Link from 'next/link';
import { getLatestComics, getPopularComics } from '@/lib/scraper';
import ComicCard from '@/components/ComicCard';
import { Flame, Sparkles, ChevronRight, ChevronLeft, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export const revalidate = 180; // 3 minutes cache

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageStr } = await searchParams;
  const currentPage = parseInt(pageStr || '1', 10);

  // Parallel data fetching
  const [latestRes, popularComics] = await Promise.all([
    getLatestComics(currentPage),
    currentPage === 1 ? getPopularComics() : Promise.resolve([])
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Shopify Cinematic Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0e17] via-[#111822] to-[#000000] p-8 sm:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] shopify-sheen">
        <div className="relative z-10 max-w-3xl space-y-4">
          {/* Eyebrow Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c1fbd4]/10 border border-[#c1fbd4]/30 text-[#c1fbd4] text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-[#c1fbd4]" />
            100% Zero Ads &bull; No Judol Banners &bull; No Popunders
          </div>

          {/* Thin Headline (Shopify Signature) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.05] font-display">
            Pengalaman Baca Komik <br />
            <span className="font-semibold text-[#c1fbd4]">Murni &amp; Tanpa Gangguan.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#9dabad] font-normal leading-relaxed max-w-2xl pt-1">
            Menghadirkan seluruh katalog Manga, Manhwa, dan Manhua dalam antarmuka berkecepatan tinggi tanpa satu pun skrip iklan popunder, redirect Shopee, atau banner judi online.
          </p>

          {/* Quick Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <Link
              href="/kategori/manhwa"
              className="px-4 py-2 rounded-full bg-[#c1fbd4] text-black text-xs font-bold hover:bg-[#a8f7c1] transition-all shadow-md flex items-center gap-1.5"
            >
              Jelajahi Manhwa <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/kategori/manga"
              className="px-4 py-2 rounded-full bg-[#131b26] text-white text-xs font-semibold hover:bg-[#1b2636] border border-white/10 hover:border-white/20 transition-all"
            >
              Manga Jepang
            </Link>
            <Link
              href="/kategori/manhua"
              className="px-4 py-2 rounded-full bg-[#131b26] text-white text-xs font-semibold hover:bg-[#1b2636] border border-white/10 hover:border-white/20 transition-all"
            >
              Manhua China
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#c1fbd4]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Popular Comics Band (Shopify Featured Collection) */}
      {currentPage === 1 && popularComics.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <span className="text-[11px] font-mono text-[#c1fbd4] uppercase tracking-wider block font-semibold">
                Trending Now
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-display tracking-tight">
                <Sparkles className="w-5 h-5 text-[#c1fbd4]" />
                Komik Paling Populer
              </h2>
            </div>
            <Link
              href="/search?sort=popular"
              className="px-3.5 py-1.5 rounded-full bg-[#131b26] text-xs font-semibold text-[#d4d4d8] hover:text-white border border-white/10 hover:border-[#c1fbd4]/40 transition-all flex items-center gap-1"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-5">
            {popularComics.slice(0, 6).map((comic) => (
              <ComicCard key={comic.slug} comic={comic} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Updated Comics Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div>
            <span className="text-[11px] font-mono text-[#9dabad] uppercase tracking-wider block font-semibold">
              Live Feed
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-display tracking-tight">
              <Flame className="w-5 h-5 text-[#c1fbd4]" />
              Rilisan Chapter Terbaru
            </h2>
          </div>
          <span className="text-xs font-mono text-[#71717a] px-3 py-1 rounded-full bg-[#0a0e17] border border-white/5">
            Halaman {currentPage}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {latestRes.data.map((comic) => (
            <ComicCard key={comic.slug} comic={comic} />
          ))}
        </div>

        {/* Shopify Pagination Pills */}
        <div className="flex items-center justify-center gap-3 pt-8 pb-4">
          {currentPage > 1 && (
            <Link
              href={`/?page=${currentPage - 1}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#131b26] hover:bg-[#1b2636] border border-white/10 text-xs font-semibold text-white transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </Link>
          )}

          <span className="px-4 py-2 rounded-full bg-[#c1fbd4]/10 border border-[#c1fbd4]/30 text-xs font-bold text-[#c1fbd4] font-mono">
            {currentPage}
          </span>

          {latestRes.hasNextPage && (
            <Link
              href={`/?page=${currentPage + 1}`}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c1fbd4] hover:bg-[#a8f7c1] text-xs font-bold text-black shadow-lg shadow-[#c1fbd4]/15 transition-all"
            >
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
