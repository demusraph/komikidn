import { NextRequest, NextResponse } from 'next/server';
import { searchComics } from '@/lib/scraper';

export const runtime = 'edge';
export const preferredRegion = 'sin1';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const results = await searchComics(q, page);
    return NextResponse.json({ success: true, ...results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
