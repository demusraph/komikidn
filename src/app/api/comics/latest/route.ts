import { NextRequest, NextResponse } from 'next/server';
import { getLatestComics, getPopularComics } from '@/lib/scraper';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const includePopular = searchParams.get('popular') === 'true';

  try {
    const latest = await getLatestComics(page);
    let popular = null;
    if (includePopular) {
      popular = await getPopularComics();
    }
    return NextResponse.json({ success: true, ...latest, popular });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
