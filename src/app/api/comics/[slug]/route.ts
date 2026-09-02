import { NextRequest, NextResponse } from 'next/server';
import { getComicDetail, sanitizeSlug } from '@/lib/scraper';

export const runtime = 'edge';
export const preferredRegion = 'sin1';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const safeSlug = sanitizeSlug(slug);

  if (!safeSlug) {
    return NextResponse.json({ success: false, error: 'Invalid slug' }, { status: 400 });
  }

  try {
    const detail = await getComicDetail(safeSlug);
    return NextResponse.json({ success: true, data: detail });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Komik tidak ditemukan atau gagal dimuat' }, { status: 404 });
  }
}
