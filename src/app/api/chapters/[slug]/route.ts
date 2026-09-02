import { NextRequest, NextResponse } from 'next/server';
import { getChapterImages, sanitizeSlug } from '@/lib/scraper';

export const runtime = 'edge';
export const preferredRegion = 'sin1';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const safeSlug = sanitizeSlug(slug);

  if (!safeSlug) {
    return NextResponse.json({ success: false, error: 'Invalid chapter slug' }, { status: 400 });
  }

  try {
    const chapterData = await getChapterImages(safeSlug);
    return NextResponse.json({ success: true, data: chapterData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Chapter tidak ditemukan atau gagal dimuat' }, { status: 404 });
  }
}
