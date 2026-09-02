import { NextRequest, NextResponse } from 'next/server';
import { getComicDetail } from '@/lib/scraper';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const detail = await getComicDetail(slug);
    return NextResponse.json({ success: true, data: detail });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
