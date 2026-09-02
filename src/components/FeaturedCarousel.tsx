'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { ChevronLeft, ChevronRight, Play, Star, Sparkles, BookOpen, Layers, Bookmark, BookmarkCheck, Flame } from 'lucide-react';

interface FeaturedCarouselProps {
  comics: ComicCardItem[];
}

export default function FeaturedCarousel({ comics }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const featured = comics.slice(0, 6);
  const SLIDE_DURATION = 6000; // 6 seconds per slide

  // Check bookmark status of active comic
  useEffect(() => {
    if (!featured[currentIndex]) return;
    try {
      const saved = localStorage.getItem('komik_bookmarks');
      if (saved) {
        const list = JSON.parse(saved);
        setIsBookmarked(list.some((b: any) => b.slug === featured[currentIndex].slug));
      } else {
        setIsBookmarked(false);
      }
    } catch {}
  }, [currentIndex, featured]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
    setProgress(0);
  }, [featured.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
    setProgress(0);
  }, [featured.length]);

  // Smooth Auto-slide Progress Loop
  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;

    const intervalTime = 50; // update every 50ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [featured.length, isPaused, handleNext]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!featured[currentIndex]) return;
    const current = featured[currentIndex];
    try {
      const saved = localStorage.getItem('komik_bookmarks');
      let list = saved ? JSON.parse(saved) : [];

      if (isBookmarked) {
        list = list.filter((b: any) => b.slug !== current.slug);
        setIsBookmarked(false);
      } else {
        list.unshift({
          slug: current.slug,
          title: current.title,
          thumbnail: current.thumbnail,
          type: current.type,
          addedAt: Date.now()
        });
        setIsBookmarked(true);
      }

      localStorage.setItem('komik_bookmarks', JSON.stringify(list));
      window.dispatchEvent(new Event('bookmarks-updated'));
    } catch {}
  };

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  if (featured.length === 0) return null;

  const current = featured[currentIndex];
  const prevIndex = (currentIndex - 1 + featured.length) % featured.length;
  const nextIndex = (currentIndex + 1) % featured.length;
  const prevComic = featured[prevIndex];
  const nextComic = featured[nextIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative rounded-2xl overflow-hidden border border-[#2e2e2e] bg-gradient-to-b from-[#1c1c1c] via-[#161616] to-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-5 sm:p-7 transition-all group/container select-none"
    >
      {/* 1. Cinematic Ambient Background Glow */}
      {current.thumbnail && (
        <div
          key={current.slug + '-bg'}
          className="absolute inset-0 bg-cover bg-center opacity-25 blur-3xl scale-125 transition-all duration-1000 pointer-events-none animate-pulse-glow"
          style={{ backgroundImage: `url(${current.thumbnail})` }}
        />
      )}

      {/* Subtle Radial Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/90 via-[#161616]/70 to-[#121212]/90 pointer-events-none" />

      {/* 2. Main Content Grid */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        {/* Left Column: 3D Cover-Flow Perspective */}
        <div className="relative flex items-center justify-center w-full lg:w-auto flex-shrink-0 py-2">
          {/* Peeking Previous Card (Clickable) */}
          {prevComic && (
            <button
              onClick={handlePrev}
              aria-label="Komik Sebelumnya"
              className="hidden sm:block absolute -left-12 lg:-left-16 w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden opacity-35 hover:opacity-75 scale-90 -rotate-6 transition-all duration-500 blur-[1px] hover:blur-0 shadow-2xl cursor-pointer hover:scale-95 z-10 border border-white/10"
            >
              {prevComic.thumbnail ? (
                <img src={prevComic.thumbnail} alt={prevComic.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#222]" />
              )}
              <div className="absolute inset-0 bg-black/40" />
            </button>
          )}

          {/* Active Centerpiece Comic Card with 3D Float */}
          <div className="relative z-20 w-52 sm:w-60 aspect-[3/4] rounded-2xl overflow-hidden bg-[#222222] shadow-[0_15px_40px_rgba(0,132,255,0.25)] border-2 border-[#0084ff]/40 hover:border-[#00a2ff] transition-all duration-500 group/card animate-float-gentle">
            {current.thumbnail ? (
              <img
                key={current.slug}
                src={current.thumbnail}
                alt={current.title}
                className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Cover</div>
            )}

            {/* Top Badges (Glassmorphism) */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-30">
              <span className="bg-[#0084ff]/90 backdrop-blur-md text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow-lg tracking-wider border border-white/20">
                {current.type}
              </span>
              {current.isColor && (
                <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-md shadow-lg border border-white/20">
                  WARNA
                </span>
              )}
            </div>

            {/* Bottom Overlay with Glow Tag */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-3.5 pt-8 text-center">
              <p className="text-white font-bold text-xs line-clamp-1 group-hover/card:text-[#00a2ff] transition-colors">
                {current.title}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3 fill-amber-400 text-amber-400" /> Sedang Tren &bull; HOT
                </span>
              </div>
            </div>

            {/* Arrow Nav Buttons on Card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Slide"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-[#0084ff] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:scale-110 active:scale-95 shadow-lg z-30 opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Slide"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-[#0084ff] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:scale-110 active:scale-95 shadow-lg z-30 opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Peeking Next Card (Clickable) */}
          {nextComic && (
            <button
              onClick={handleNext}
              aria-label="Komik Selanjutnya"
              className="hidden sm:block absolute -right-12 lg:-right-16 w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden opacity-35 hover:opacity-75 scale-90 rotate-6 transition-all duration-500 blur-[1px] hover:blur-0 shadow-2xl cursor-pointer hover:scale-95 z-10 border border-white/10"
            >
              {nextComic.thumbnail ? (
                <img src={nextComic.thumbnail} alt={nextComic.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#222]" />
              )}
              <div className="absolute inset-0 bg-black/40" />
            </button>
          )}
        </div>

        {/* Right Column: Information & Animated Metadata */}
        <div key={current.slug} className="flex-1 space-y-4 text-left w-full animate-fade-in-up">
          {/* Top Pill Tag */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0084ff]/15 border border-[#0084ff]/40 text-[#00a2ff] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              PILIHAN KOMIK POPULER HARI INI
            </span>
          </div>

          {/* Comic Title */}
          <Link href={`/komik/${current.slug}`} className="block group/title">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white group-hover/title:text-[#0084ff] transition-colors leading-tight font-sans tracking-tight">
              {current.title}
            </h2>
          </Link>

          {/* Synopsis Excerpt */}
          <p className="text-xs sm:text-sm text-[#cccccc] line-clamp-3 leading-relaxed border-l-2 border-[#0084ff]/50 pl-3">
            Ikuti perjalanan seru dan update chapter terbaru dari komik <strong className="text-white">{current.title}</strong>. Nikmati kualitas gambar jernih beresolusi tinggi, 100% bebas dari gangguan iklan judol, banner mengambang, maupun popunder.
          </p>

          {/* 4 Sleek Floating Glass Metadata Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-[#1e1e1e]/80 backdrop-blur border border-[#333333] hover:border-[#0084ff]/40 rounded-xl p-2.5 transition-all hover:bg-[#252525]">
              <span className="text-[#888888] text-[10px] uppercase font-bold block flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#00a2ff]" /> Tipe Komik
              </span>
              <span className="font-extrabold text-white text-xs mt-1 block truncate">{current.type}</span>
            </div>

            <div className="bg-[#1e1e1e]/80 backdrop-blur border border-[#333333] hover:border-emerald-500/40 rounded-xl p-2.5 transition-all hover:bg-[#252525]">
              <span className="text-[#888888] text-[10px] uppercase font-bold block flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-emerald-400" /> Status
              </span>
              <span className="font-extrabold text-emerald-400 text-xs mt-1 block">Ongoing</span>
            </div>

            <div className="bg-[#1e1e1e]/80 backdrop-blur border border-[#333333] hover:border-purple-500/40 rounded-xl p-2.5 transition-all hover:bg-[#252525]">
              <span className="text-[#888888] text-[10px] uppercase font-bold block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> Format
              </span>
              <span className="font-extrabold text-white text-xs mt-1 block">{current.isColor ? 'Full Color' : 'Hitam Putih'}</span>
            </div>

            <div className="bg-[#1e1e1e]/80 backdrop-blur border border-[#333333] hover:border-amber-500/40 rounded-xl p-2.5 transition-all hover:bg-[#252525]">
              <span className="text-[#888888] text-[10px] uppercase font-bold block flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Rating
              </span>
              <span className="font-extrabold text-amber-400 text-xs mt-1 flex items-center gap-1">
                9.{(8 - (currentIndex % 3))} <span className="text-[#666666] font-normal text-[10px]">/ 10</span>
              </span>
            </div>
          </div>

          {/* Action CTAs & Slide Progress Bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Primary Glowing Button */}
              <Link
                href={`/komik/${current.slug}`}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#0094ff] hover:to-[#0077ee] text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(0,132,255,0.45)] hover:shadow-[0_0_30px_rgba(0,132,255,0.7)] hover:scale-102 active:scale-98 flex items-center gap-2 group/btn"
              >
                <Play className="w-3.5 h-3.5 fill-current group-hover/btn:scale-125 transition-transform" />
                <span>BACA SEKARANG</span>
              </Link>

              {/* Bookmark Toggle Button */}
              <button
                onClick={toggleBookmark}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isBookmarked
                    ? 'bg-[#0084ff]/20 text-[#00a2ff] border-[#0084ff]'
                    : 'bg-[#222222] hover:bg-[#2c2c2c] text-[#cccccc] hover:text-white border-[#383838]'
                }`}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 fill-current text-[#0084ff]" /> Tersimpan
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Simpan
                  </>
                )}
              </button>
            </div>

            {/* Slide Indicator Dots with Active Countdown Progress Bar */}
            <div className="flex items-center gap-2">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgress(0);
                  }}
                  className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                    idx === currentIndex ? 'w-9 bg-[#333333]' : 'w-2.5 bg-[#444444] hover:bg-[#666666]'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                >
                  {idx === currentIndex && (
                    <div
                      className="absolute inset-y-0 left-0 bg-[#0084ff] transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
