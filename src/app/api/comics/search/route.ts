import { NextRequest, NextResponse } from 'next/server';
import { searchComics } from '@/lib/scraper';

export const runtime = 'edge';
export const preferredRegion = 'sin1';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQ = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Input length and character hygiene
  const q = rawQ.slice(0, 100);

  try {
    const results = await searchComics(q, page);
    return NextResponse.json({ success: true, ...results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Gagal memproses pencarian' }, { status: 500 });
  }
}
