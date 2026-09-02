'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReaderPage = pathname?.startsWith('/baca/');

  if (isReaderPage) {
    return <div className="min-h-screen bg-[#000000]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#161616] text-[#ffffff] pb-14 lg:pb-0">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileNav />
    </div>
  );
}
