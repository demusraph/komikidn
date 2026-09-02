import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#262626] py-10 text-[#888888] text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#0084ff] flex items-center justify-center text-white">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 12h-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM9 18H5v-4h4v4zm0-6H5V8h4v4zm0-6H5V4h4v2zm6 12h-4v-4h4v4zm0-6h-4V8h4v4zm4 6h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
            </div>
            <span className="font-bold text-base text-white">
              komik<span className="text-[#00a2ff]">idn</span>
            </span>
          </div>

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
