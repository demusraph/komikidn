'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, BookOpen, Bookmark } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/search?sort=popular', label: 'Populer', icon: Flame },
    { href: '/kategori/daftar-manga', label: 'Daftar Isi', icon: BookOpen },
    { href: '/bookmarks', label: 'Koleksi', icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#161616] border-t border-[#262626] z-50 lg:hidden shadow-2xl">
      <div className="grid grid-cols-4 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-[#0084ff]' : 'text-[#888888] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
