import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#262626] py-10 text-[#888888] text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="KOMIKIDN"
              className="h-8 w-auto object-contain brightness-110"
            />
          </Link>

          {/* Badges */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1c1c1c] border border-[#2d2d2d] text-[#cccccc] text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Bebas Iklan &amp; Popunder
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1c1c1c] border border-[#2d2d2d] text-[#cccccc] text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Direct CDN Stream
            </span>
          </div>
        </div>

        {/* Links & Disclaimer */}
        <div className="pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-[#777777]">
          <p>
            KOMIKIDN &bull; Platform pembaca manga, manhwa &amp; manhua online bahasa Indonesia.
          </p>
          <div className="flex items-center gap-4 text-[#aaaaaa]">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
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
