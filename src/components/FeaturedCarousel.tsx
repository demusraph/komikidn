'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ComicCardItem } from '@/lib/types';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';

interface FeaturedCarouselProps {
  comics: ComicCardItem[];
}

export default function FeaturedCarousel({ comics }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = comics.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg overflow-hidden p-4 sm:p-6 shadow-xl">
      {/* Background Ambient Blur */}
      {current.thumbnail && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl pointer-events-none scale-125"
          style={{ backgroundImage: `url(${current.thumbnail})` }}
        />
      )}

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Cover Art Container */}
        <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-md overflow-hidden bg-[#222222] shadow-2xl border border-[#383838] flex-shrink-0 group">
          {current.thumbnail ? (
            <img
              src={current.thumbnail}
              alt={current.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Cover</div>
          )}

          {/* Title Overlay at bottom of thumbnail */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 text-center">
            <p className="text-white font-bold text-xs line-clamp-1">{current.title}</p>
            <span className="text-[#00a2ff] text-[10px] font-semibold">{current.type} &bull; Hot</span>
          </div>

          {/* Prev/Next Buttons on Thumbnail */}
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-black/70 hover:bg-[#0084ff] text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-black/70 hover:bg-[#0084ff] text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Comic Information Column (Komikindo Hero Style) */}
        <div className="flex-1 space-y-3.5 text-left w-full">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#00a2ff] uppercase tracking-wide">
              Komik Terpopuler Hari Ini
            </span>
            <Link href={`/komik/${current.slug}`} className="block">
              <h2 className="text-xl sm:text-2xl font-bold text-white hover:text-[#00a2ff] transition-colors leading-tight">
                {current.title}
              </h2>
            </Link>
          </div>

          <p className="text-xs text-[#b3b3b3] line-clamp-3 leading-relaxed">
            Ikuti perjalanan seru dalam komik {current.title}. Baca gratis full chapter dalam kualitas HD tanpa gangguan iklan judol dan popunder.
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs py-2 border-y border-[#2d2d2d]">
            <div>
              <span className="text-[#777777] block text-[10px]">Tipe:</span>
              <span className="font-semibold text-white">{current.type}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">Status:</span>
              <span className="font-semibold text-emerald-400">Berjalan (Ongoing)</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">Format:</span>
              <span className="font-semibold text-white">{current.isColor ? 'Full Color' : 'Standard'}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">Rating:</span>
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> 8.8 / 10
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/komik/${current.slug}`}
                className="px-5 py-2 rounded bg-[#0084ff] hover:bg-[#0070db] text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Baca Sekarang
              </Link>
              <Link
                href={`/komik/${current.slug}`}
                className="px-4 py-2 rounded bg-[#2a2a2a] hover:bg-[#333333] text-[#cccccc] hover:text-white text-xs font-semibold border border-[#383838] transition-colors"
              >
                Detail Komik
              </Link>
            </div>

            {/* Thumbnail dots */}
            <div className="flex items-center gap-1.5">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-[#0084ff] w-5' : 'bg-[#444444] hover:bg-[#666666]'
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
