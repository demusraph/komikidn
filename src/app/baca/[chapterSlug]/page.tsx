'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChapterData } from '@/lib/types';
import WebtoonReader from '@/components/WebtoonReader';
import { RefreshCw, BookOpen, ArrowLeft } from 'lucide-react';

function ChapterContent() {
  const params = useParams();
  const chapterSlug = (params?.chapterSlug as string) || '';

  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [comicTitle, setComicTitle] = useState<string>('');
  const [allChapters, setAllChapters] = useState<{ slug: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!chapterSlug) return;

    setLoading(true);
    setError(null);

    async function fetchChapter() {
      try {
        const res = await fetch(`/api/chapters/${encodeURIComponent(chapterSlug)}`);
        const json = await res.json();
        if (!isMounted) return;

        if (json.success && json.data && json.data.totalImages > 0) {
          setChapterData(json.data);
          let title = json.data.chapterSlug.replace(/-/g, ' ').toUpperCase();
          setComicTitle(title);

          if (json.data.comicSlug) {
            try {
              const cRes = await fetch(`/api/comics/${encodeURIComponent(json.data.comicSlug)}`);
              const cJson = await cRes.json();
              if (isMounted && cJson.success && cJson.data) {
                setComicTitle(cJson.data.title);
                setAllChapters(cJson.data.chapters.map((c: any) => ({
                  slug: c.slug,
                  title: c.title
                })));
              }
            } catch {}
          }
        } else {
          setError(json.error || 'Chapter tidak ditemukan atau belum rilis.');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchChapter();
    return () => {
      isMounted = false;
    };
  }, [chapterSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#c1fbd4] border-t-transparent animate-spin" />
        <p className="text-xs text-[#9dabad] font-mono tracking-wider uppercase animate-pulse">
          Memuat Gambar Chapter...
        </p>
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#131b26] flex items-center justify-center text-[#c1fbd4] mx-auto border border-white/10 shadow-lg">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-light text-white font-display">Gagal Memuat Chapter</h1>
          <p className="text-xs sm:text-sm text-[#9dabad] max-w-md mx-auto">
            {error || 'Gambar chapter ini sedang tidak tersedia.'}
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
            className="px-6 py-2.5 rounded-full bg-[#131b26] text-white text-xs font-semibold hover:bg-[#1b2636] border border-white/10 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <WebtoonReader
      chapterData={chapterData}
      comicTitle={comicTitle}
      allChapters={allChapters}
    />
  );
}

export default function ChapterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <ChapterContent />
    </Suspense>
  );
}
