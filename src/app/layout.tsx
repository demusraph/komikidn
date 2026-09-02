import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'KOMIKIDN - Baca Komik Manga, Manhwa, Manhua Bebas Iklan',
  description: 'Platform pembaca komik online manga, manhwa, dan manhua bahasa Indonesia tanpa gangguan iklan judol dan redirect.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
