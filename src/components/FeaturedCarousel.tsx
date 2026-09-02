'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ComicCardItem, FeaturedSliderItem } from '@/lib/types';
import { ChevronLeft, ChevronRight, Play, Star, Sparkles } from 'lucide-react';

interface FeaturedCarouselProps {
  sliderItems?: FeaturedSliderItem[];
  comics?: ComicCardItem[];
}

export default function FeaturedCarousel({ sliderItems = [], comics = [] }: FeaturedCarouselProps) {
  // Unify items into a standard rich structure
  const rawItems: FeaturedSliderItem[] = sliderItems.length > 0
    ? sliderItems
    : comics.slice(0, 10).map((c) => ({
        title: c.title,
        slug: c.slug,
        thumbnail: c.thumbnail,
        synopsis: `Ikuti petualangan seru dan menegangkan dalam komik ${c.title}. Update chapter terbaru kualitas HD bebas iklan.`,
        genres: 'Action, Fantasy, Adventure',
        illustrator: 'Studio Team',
        author: 'Creator',
        status: 'Berjalan',
        score: '8.8 / 10',
        type: c.type || 'Manhwa'
      }));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = rawItems.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-slide loop with pause on hover
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [total, isPaused, handleNext]);

  // Touch Swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
  };

  if (total === 0) return null;

  const activeItem = rawItems[activeIndex];

  // Calculate a visible window of cards around the active index
  // On desktop, show 2 cards to the left, active composite, and 2-3 cards to the right
  const getVisibleCards = () => {
    const indices: number[] = [];
    const count = Math.min(total, 7);
    const half = Math.floor(count / 2);
    for (let i = -half; i <= half; i++) {
      indices.push((activeIndex + i + total) % total);
    }
    return indices;
  };

  const visibleIndices = getVisibleCards();

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#181818] to-[#121212] border border-[#2a2a2a] p-3 sm:p-5 shadow-2xl select-none group/slider transition-all"
    >
      {/* Dynamic Ambient Cover Glow */}
      {activeItem.thumbnail && (
        <div
          key={activeItem.slug + '-ambient'}
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-125 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${activeItem.thumbnail})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Navigation Arrow Left (Komikindo Style) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Comic"
        className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-8 sm:w-9 h-14 sm:h-16 rounded-lg bg-black/75 hover:bg-[#0084ff] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:scale-105 active:scale-95 shadow-2xl z-40 opacity-80 group-hover/slider:opacity-100"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Navigation Arrow Right (Komikindo Style) */}
      <button
        onClick={handleNext}
        aria-label="Next Comic"
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-8 sm:w-9 h-14 sm:h-16 rounded-lg bg-black/75 hover:bg-[#0084ff] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:scale-105 active:scale-95 shadow-2xl z-40 opacity-80 group-hover/slider:opacity-100"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Horizontal Slider Track Container */}
      <div
        ref={trackRef}
        className="relative z-20 flex items-center justify-center gap-2.5 sm:gap-3.5 overflow-hidden py-3 px-8 sm:px-12 min-h-[300px] sm:min-h-[340px]"
      >
        {visibleIndices.map((idx, pos) => {
          const item = rawItems[idx];
          const isActive = idx === activeIndex;

          if (isActive) {
            // THE ACTIVE CARD WITH ATTACHED DARK INFO TOOLTIP (100% Match Komikindo Screenshot)
            return (
              <div
                key={item.slug + '-active'}
                className="flex items-stretch rounded-xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.9)] border-2 border-[#0084ff]/60 ring-4 ring-[#0084ff]/10 z-30 transition-all duration-300 transform scale-102 flex-shrink-0 animate-fade-in-up"
              >
                {/* Active Cover Image */}
                <Link
                  href={`/komik/${item.slug}`}
                  className="relative w-44 sm:w-56 aspect-[3/4] bg-[#1a1a1a] block overflow-hidden flex-shrink-0 group/cover"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#222222] flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* Dark gradient overlay with title & genre */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-8 text-center">
                    <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#00a2ff] font-semibold mt-0.5">
                      {item.genres?.split(',')[0] || 'Aksi'}
                    </p>
                  </div>
                </Link>

                {/* Attached Dark Info Box (stooltip from Komikindo) */}
                <div className="hidden md:flex flex-col justify-between w-72 lg:w-84 bg-[#1e1e1e] p-4 sm:p-5 text-left border-l border-[#2e2e2e] relative">
                  {/* Title & Divider */}
                  <div className="space-y-1.5">
                    <Link href={`/komik/${item.slug}`} className="block group/t">
                      <h4 className="text-base lg:text-lg font-bold text-white group-hover/t:text-[#0084ff] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-[#a0a0a0] line-clamp-3 leading-relaxed pt-1">
                      {item.synopsis}
                    </p>
                  </div>

                  {/* 2-Column Metadata Grid */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs py-3 border-y border-[#2d2d2d] my-2">
                    <div>
                      <span className="text-[#777777] block text-[10px] uppercase font-bold">Genres</span>
                      <span className="text-[#dddddd] font-semibold truncate block text-[11px]">
                        {item.genres || 'Action, Adventure'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#777777] block text-[10px] uppercase font-bold">Ilustrator</span>
                      <span className="text-[#dddddd] font-semibold truncate block text-[11px]">
                        {item.illustrator || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#777777] block text-[10px] uppercase font-bold">Pengarang</span>
                      <span className="text-[#dddddd] font-semibold truncate block text-[11px]">
                        {item.author || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#777777] block text-[10px] uppercase font-bold">Status</span>
                      <span className="text-emerald-400 font-bold block text-[11px]">
                        {item.status || 'Berjalan'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Bar: Rating, Type, and Circular Blue Play Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.score || '8.5'}
                      </span>
                      <span className="text-[#888888] font-medium">&bull;</span>
                      <span className="text-[#00a2ff] font-bold uppercase tracking-wider text-[11px]">
                        {item.type || 'Manhwa'}
                      </span>
                    </div>

                    {/* Floating Circular Blue Play Button (Komikindo read_label) */}
                    <Link
                      href={`/komik/${item.slug}`}
                      aria-label={`Baca ${item.title}`}
                      className="w-10 h-10 rounded-full bg-[#0084ff] hover:bg-[#0070db] text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,132,255,0.7)] hover:scale-115 active:scale-95 transition-all duration-200"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          }

          // INACTIVE COMIC CARDS IN THE ROW
          return (
            <button
              key={item.slug + '-' + pos}
              onClick={() => setActiveIndex(idx)}
              className="relative w-28 sm:w-36 lg:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#0084ff]/50 opacity-60 hover:opacity-95 scale-95 hover:scale-100 transition-all duration-300 flex-shrink-0 cursor-pointer shadow-lg group/item text-left hidden sm:block"
            >
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-[#222222]" />
              )}

              {/* Inactive Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-2.5 pt-6 text-center">
                <h4 className="font-bold text-xs text-white line-clamp-1 group-hover/item:text-[#0084ff] transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[#777777] mt-0.5">
                  {item.genres?.split(',')[0] || 'Aksi'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Slide Indicator Dots at Bottom */}
      <div className="flex items-center justify-center gap-1.5 pt-2 relative z-20">
        {rawItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-[#0084ff]' : 'w-1.5 bg-[#444444] hover:bg-[#666666]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
