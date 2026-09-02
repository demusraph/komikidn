'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { ChevronLeft, ChevronRight, Play, Star, Sparkles, BookOpen, Layers } from 'lucide-react';

interface FeaturedCarouselProps {
  comics: ComicCardItem[];
}

export default function FeaturedCarousel({ comics }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = comics.slice(0, 6);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[currentIndex];
  const prevIndex = (currentIndex - 1 + featured.length) % featured.length;
  const nextIndex = (currentIndex + 1) % featured.length;
  const prevComic = featured[prevIndex];
  const nextComic = featured[nextIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl overflow-hidden shadow-2xl p-4 sm:p-6 transition-all">
      {/* Dynamic Ambient Background Glow */}
      {current.thumbnail && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 blur-3xl pointer-events-none scale-125 transition-all duration-700"
          style={{ backgroundImage: `url(${current.thumbnail})` }}
        />
      )}

      {/* Komikindo 3-Card Depth Carousel */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        {/* Visual Cards Centerpiece with Left & Right Peeking Cards */}
        <div className="relative flex items-center justify-center w-full lg:w-auto flex-shrink-0 py-2">
          {/* Left Peeking Card (Desktop) */}
          {prevComic && (
            <button
              onClick={handlePrev}
              aria-label="Previous Comic"
              className="hidden sm:block absolute -left-12 lg:-left-16 w-32 sm:w-36 aspect-[3/4] rounded-lg overflow-hidden opacity-30 hover:opacity-60 scale-85 transition-all duration-500 blur-[1px] hover:blur-0 shadow-lg cursor-pointer"
            >
              {prevComic.thumbnail ? (
                <img src={prevComic.thumbnail} alt={prevComic.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#222]" />
              )}
            </button>
          )}

          {/* Active Center Card */}
          <div className="relative z-20 w-52 sm:w-60 aspect-[3/4] rounded-lg overflow-hidden bg-[#222222] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-[#444444] group">
            {current.thumbnail ? (
              <img
                src={current.thumbnail}
                alt={current.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Cover</div>
            )}

            {/* Comic Type & Format Badges */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span className="bg-[#0084ff] text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow">
                {current.type}
              </span>
              {current.isColor && (
                <span className="bg-amber-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded shadow">
                  WARNA
                </span>
              )}
            </div>

            {/* Bottom Gradient with Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 text-center">
              <p className="text-white font-bold text-xs line-clamp-1 group-hover:text-[#00a2ff] transition-colors">
                {current.title}
              </p>
              <p className="text-[#00a2ff] text-[10px] font-semibold mt-0.5 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Sedang Tren &bull; HOT
              </p>
            </div>

            {/* Navigation Arrows on Center Thumbnail */}
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-black/75 hover:bg-[#0084ff] text-white flex items-center justify-center transition-colors shadow z-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-black/75 hover:bg-[#0084ff] text-white flex items-center justify-center transition-colors shadow z-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Peeking Card (Desktop) */}
          {nextComic && (
            <button
              onClick={handleNext}
              aria-label="Next Comic"
              className="hidden sm:block absolute -right-12 lg:-right-16 w-32 sm:w-36 aspect-[3/4] rounded-lg overflow-hidden opacity-30 hover:opacity-60 scale-85 transition-all duration-500 blur-[1px] hover:blur-0 shadow-lg cursor-pointer"
            >
              {nextComic.thumbnail ? (
                <img src={nextComic.thumbnail} alt={nextComic.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#222]" />
              )}
            </button>
          )}
        </div>

        {/* Comic Detail Info Box (Right Side of Carousel) */}
        <div className="flex-1 space-y-4 text-left w-full">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0084ff]/20 border border-[#0084ff]/40 text-[#00a2ff] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Pilihan Komik Populer Hari Ini
            </div>
            <Link href={`/komik/${current.slug}`} className="block">
              <h2 className="text-xl sm:text-3xl font-extrabold text-white hover:text-[#0084ff] transition-colors leading-tight font-sans">
                {current.title}
              </h2>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-[#bbbbbb] line-clamp-3 leading-relaxed">
            Ikuti petualangan seru dan menegangkan dalam komik {current.title}. Nikmati update chapter tercepat dengan kualitas gambar jernih HD, 100% bebas dari gangguan banner judol dan iklan popunder.
          </p>

          {/* Key Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs py-2.5 border-y border-[#2d2d2d] bg-[#141414]/60 p-3 rounded">
            <div>
              <span className="text-[#777777] block text-[10px] uppercase font-semibold">Tipe Komik</span>
              <span className="font-bold text-white mt-0.5 block">{current.type}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px] uppercase font-semibold">Status</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">Ongoing</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px] uppercase font-semibold">Warna</span>
              <span className="font-bold text-white mt-0.5 block">{current.isColor ? 'Full Color' : 'Hitam Putih'}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px] uppercase font-semibold">Rating</span>
              <span className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> 8.9 / 10
              </span>
            </div>
          </div>

          {/* Action Buttons & Indicator Dots */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/komik/${current.slug}`}
                className="px-6 py-2.5 rounded-lg bg-[#0084ff] hover:bg-[#0070db] text-white text-xs font-bold transition-all shadow-[0_4px_15px_rgba(0,132,255,0.4)] flex items-center gap-2 group/btn"
              >
                <Play className="w-3.5 h-3.5 fill-current group-hover/btn:scale-110 transition-transform" /> Baca Sekarang
              </Link>
              <Link
                href={`/komik/${current.slug}`}
                className="px-4 py-2.5 rounded-lg bg-[#262626] hover:bg-[#303030] text-[#cccccc] hover:text-white text-xs font-semibold border border-[#383838] transition-colors"
              >
                Detail Lengkap
              </Link>
            </div>

            {/* Slide Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-[#0084ff] w-6' : 'bg-[#444444] hover:bg-[#666666] w-2'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
