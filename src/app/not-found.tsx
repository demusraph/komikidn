import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#131b26] flex items-center justify-center text-[#c1fbd4] mx-auto border border-white/10 shadow-lg">
        <BookOpen className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-light text-white font-display">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-xs sm:text-sm text-[#9dabad] max-w-md mx-auto">
          Komik atau halaman yang kamu tuju mungkin sudah dipindahkan atau URL salah.
        </p>
      </div>
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c1fbd4] text-black text-xs font-bold hover:bg-[#a8f7c1] transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
