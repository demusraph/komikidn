import React from 'react';
import { notFound } from 'next/navigation';
import { getChapterImages, getComicDetail } from '@/lib/scraper';
import WebtoonReader from '@/components/WebtoonReader';

interface ChapterPageProps {
  params: Promise<{ chapterSlug: string }>;
}

export const revalidate = 3600; // 1 hour cache

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;

  let chapterData;
  try {
    chapterData = await getChapterImages(chapterSlug);
  } catch (err) {
    notFound();
  }

  if (!chapterData || chapterData.totalImages === 0) {
    notFound();
  }

  // Fetch parent comic details for full chapter selector
  let comicTitle = chapterData.chapterSlug.replace(/-/g, ' ').toUpperCase();
  let allChapters: { slug: string; title: string }[] = [];

  if (chapterData.comicSlug) {
    try {
      const comicDetail = await getComicDetail(chapterData.comicSlug);
      if (comicDetail && comicDetail.title) {
        comicTitle = comicDetail.title;
        allChapters = comicDetail.chapters.map((c) => ({
          slug: c.slug,
          title: c.title
        }));
      }
    } catch {}
  }

  return (
    <WebtoonReader
      chapterData={chapterData}
      comicTitle={comicTitle}
      allChapters={allChapters}
    />
  );
}
