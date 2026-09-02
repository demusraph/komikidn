import { NextRequest, NextResponse } from 'next/server';
import { getLatestComics, getPopularComics, getComicsByCategory, getFeaturedSlider } from '@/lib/scraper';

export const runtime = 'edge';
export const preferredRegion = 'sin1';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const includePopular = searchParams.get('popular') === 'true';
  const category = searchParams.get('category');

  try {
    if (category) {
      const catData = await getComicsByCategory(category, page);
      return NextResponse.json({ success: true, ...catData });
    }

    const latest = await getLatestComics(page);
    let popular = null;
    let slider = null;
    if (includePopular || page === 1) {
      const [popData, slideData] = await Promise.all([
        getPopularComics(),
        getFeaturedSlider()
      ]);
      popular = popData;
      slider = slideData;
    }
    return NextResponse.json({ success: true, ...latest, popular, slider });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
