import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'KOMIKIDN - Baca Komik Manga, Manhwa, Manhua Bebas Iklan',
  description: 'Platform pembaca komik online manga, manhwa, dan manhua bahasa Indonesia tanpa gangguan iklan judol dan redirect.',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#161616] text-[#ffffff] antialiased selection:bg-[#0084ff] selection:text-white pb-14 lg:pb-0">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
