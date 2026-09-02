import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-white/[0.08] py-12 text-[#9dabad] text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c1fbd4] flex items-center justify-center text-black shadow-md">
              <BookOpen className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight font-display">
                KOMIK<span className="text-[#c1fbd4]">IDN</span>
              </span>
              <p className="text-[11px] text-[#71717a]">Platform Baca Komik Bebas Iklan &bull; Shopify Design</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131b26] border border-white/10 text-[#d4d4d8] text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c1fbd4]" /> 100% Ad-Free Guarantee
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131b26] border border-white/10 text-[#d4d4d8] text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Ultra-Fast Image Stream
            </span>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-[#71717a]">
          <p>
            Personal Clean Web Reader &bull; Designed with Shopify Design System (Polaris / Editorial)
          </p>
          <div className="flex items-center gap-4 text-[#9dabad]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/bookmarks" className="hover:text-white transition-colors">Koleksi</Link>
            <Link href="/kategori/manhwa" className="hover:text-white transition-colors">Manhwa</Link>
            <Link href="/kategori/manga" className="hover:text-white transition-colors">Manga</Link>
            <Link href="/kategori/manhua" className="hover:text-white transition-colors">Manhua</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
