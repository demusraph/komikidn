'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ComicDetail } from '@/lib/types';
import ChapterList from '@/components/ChapterList';
import BookmarkButton from './BookmarkButton';
import { Sparkles, Layers, User, Tag, Calendar, CheckCircle, RefreshCw, BookOpen } from 'lucide-react';

function ComicDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [detail, setDetail] = useState<ComicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return;

    setLoading(true);
    setError(null);

    async function fetchDetail() {
      try {
        const res = await fetch(`/api/comics/${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (!isMounted) return;

        if (json.success && json.data) {
          setDetail(json.data);
        } else {
          setError(json.error || 'Komik tidak ditemukan atau gagal dimuat.');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="bg-[#0a0e17] border border-white/[0.08] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 animate-pulse">
          <div className="w-full sm:w-72 aspect-[3/4] rounded-2xl bg-[#131b26] flex-shrink-0" />
          <div className="flex-1 space-y-6">
            <div className="h-4 w-32 bg-[#131b26] rounded-full" />
            <div className="h-8 w-3/4 bg-[#131b26] rounded-full" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-[#131b26] rounded-full" />
              <div className="h-6 w-16 bg-[#131b26] rounded-full" />
            </div>
            <div className="h-20 bg-[#131b26] rounded-2xl" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#131b26] flex items-center justify-center text-[#c1fbd4] mx-auto border border-white/10 shadow-lg">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-light text-white font-display">Gagal Memuat Komik</h1>
          <p className="text-xs sm:text-sm text-[#9dabad] max-w-md mx-auto">
            {error || 'Data komik tidak dapat ditemukan.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full bg-[#c1fbd4] text-black text-xs font-bold hover:bg-[#a8f7c1] inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Coba Lagi
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-[#131b26] text-white text-xs font-semibold hover:bg-[#1b2636] border border-white/10"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Product Detail Banner (Shopify Dark Surface) */}
      <section className="bg-[#0a0e17] border border-white/[0.08] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] shopify-sheen">
        {/* Cover Photo Frame */}
        <div className="w-full sm:w-72 flex-shrink-0 mx-auto md:mx-0">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#131b26] shadow-2xl border border-white/10 relative group">
            {detail.thumbnail ? (
              <img
                src={detail.thumbnail}
                alt={detail.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#71717a] text-sm">
                No Cover
              </div>
            )}
            <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] pointer-events-none" />
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-mono text-[#c1fbd4] uppercase tracking-wider block font-semibold">
              Comic Catalog ID &bull; {detail.slug}
            </span>

            {/* Thin Display Title */}
            <h1 className="text-2xl sm:text-4xl font-light text-white tracking-tight leading-tight font-display">
              {detail.title}
            </h1>

            {detail.metadata['judul alternatif'] && (
              <p className="text-xs sm:text-sm text-[#9dabad] font-normal leading-relaxed">
                <span className="font-semibold text-white/90">Alias:</span> {detail.metadata['judul alternatif']}
              </p>
            )}

            {/* Shopify Genre Pills */}
            {detail.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {detail.genres.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/genres/${g.slug}`}
                    className="px-3.5 py-1 rounded-full bg-[#131b26] text-[#c1fbd4] text-xs font-semibold border border-[#c1fbd4]/20 hover:border-[#c1fbd4]/60 hover:bg-[#1b2636] transition-all"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Metadata Grid with Hairline Dividers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-white/[0.08] text-xs">
            {detail.metadata['status'] && (
              <div>
                <span className="text-[#71717a] block uppercase text-[10px] tracking-wider font-semibold">Status</span>
                <span className="font-semibold text-white text-sm mt-0.5 block">{detail.metadata['status']}</span>
              </div>
            )}
            {detail.metadata['pengarang'] && (
              <div>
                <span className="text-[#71717a] block uppercase text-[10px] tracking-wider font-semibold">Pengarang</span>
                <span className="font-semibold text-white text-sm mt-0.5 block truncate">{detail.metadata['pengarang']}</span>
              </div>
            )}
            <div>
              <span className="text-[#71717a] block uppercase text-[10px] tracking-wider font-semibold">Total Chapter</span>
              <span className="font-bold text-[#c1fbd4] text-sm mt-0.5 block font-mono">{detail.totalChapters} Chapter</span>
            </div>
          </div>

          {/* Synopsis */}
          {detail.synopsis && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9dabad]">Sinopsis</h3>
              <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar font-normal">
                {detail.synopsis}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex items-center gap-4">
            <BookmarkButton
              comic={{
                slug: detail.slug,
                title: detail.title,
                thumbnail: detail.thumbnail,
                type: 'Unknown',
                lastReadAt: Date.now(),
                addedAt: Date.now()
              }}
            />
          </div>
        </div>
      </section>

      {/* Chapter List Section */}
      <section>
        <ChapterList comicSlug={detail.slug} chapters={detail.chapters} />
      </section>
    </main>
  );
}

export default function ComicDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <ComicDetailContent />
    </Suspense>
  );
}
