import { NextRequest, NextResponse } from 'next/server';
import { getChapterImages } from '@/lib/scraper';

export const runtime = 'edge';
export const preferredRegion = 'sin1';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const chapterData = await getChapterImages(slug);
    return NextResponse.json({ success: true, data: chapterData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
