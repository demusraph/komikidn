export type ComicType = 'Manga' | 'Manhwa' | 'Manhua' | 'Unknown';

export interface ComicCardItem {
  title: string;
  slug: string;
  thumbnail: string;
  type: ComicType;
  isColor: boolean;
  latestChapter: {
    slug: string;
    title: string;
    updated: string;
  } | null;
}

export interface FeaturedSliderItem {
  title: string;
  slug: string;
  thumbnail: string;
  synopsis: string;
  genres: string;
  illustrator: string;
  author: string;
  status: string;
  score: string;
  type: string;
}

export interface Genre {
  slug: string;
  name: string;
}

export interface ChapterItem {
  slug: string;
  title: string;
  date: string;
}

export interface ComicDetail {
  title: string;
  slug: string;
  thumbnail: string;
  metadata: Record<string, string>;
  synopsis: string;
  genres: Genre[];
  totalChapters: number;
  chapters: ChapterItem[];
}

export interface ChapterData {
  chapterSlug: string;
  comicSlug: string | null;
  prevChapter: string | null;
  nextChapter: string | null;
  totalImages: number;
  images: string[];
}

export interface BookmarkItem {
  slug: string;
  title: string;
  thumbnail: string;
  type: ComicType;
  lastReadChapterSlug?: string;
  lastReadChapterTitle?: string;
  lastReadAt: number;
  addedAt: number;
}
