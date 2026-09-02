import { ComicCardItem, ComicDetail, ChapterData, Genre, ComicType, FeaturedSliderItem } from './types';

const BASE_HOSTS = ['https://komikindo.ch', 'https://komikindo.org'];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Sec-Ch-Ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1'
};

// In-Memory Cache with TTL
interface CacheEntry<T> {
  data: T;
  expiry: number;
}
const cache = new Map<string, CacheEntry<any>>();

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setInCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs
  });
}

/**
 * Defensive Security: Sanitize slugs to prevent Path Traversal, SSRF, & URL Spoofing
 */
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  // Only allow alphanumeric, hyphens, and underscores
  return slug.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 150);
}

async function fetchHtml(path: string): Promise<string> {
  // Prevent path traversal, protocol injection, control characters, and invalid paths
  if (!path || path.includes('..') || path.includes('//') || path.includes('\\') || /[\r\n\0]/.test(path)) {
    throw new Error('Invalid path parameter detected');
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  let lastError: any = null;

  for (const host of BASE_HOSTS) {
    const url = `${host}${cleanPath}`;
    try {
      const res = await fetch(url, {
        headers: {
          ...HEADERS,
          Referer: `${host}/`
        },
        next: { revalidate: 180 }
      });
      if (res.ok) {
        return await res.text();
      }
      lastError = new Error(`HTTP error ${res.status} when fetching ${url}`);
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error(`Failed to fetch ${path} from all mirror hosts`);
}

function parseCardsFromHtml(html: string): ComicCardItem[] {
  const cards: ComicCardItem[] = [];
  const regex = /<div class=["']animepost["']>([\s\S]*?)<\/div>\s*<\/div>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const cardHtml = match[1];
    const urlMatch = cardHtml.match(/href=["']https?:\/\/komikindo\.[a-z]+\/komik\/([^"'\/]+)\/?["']/i);
    if (!urlMatch) continue;
    const slug = urlMatch[1];

    const titleMatch = cardHtml.match(/<h3[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
                       cardHtml.match(/title=["']Komik ([^"']+)["']/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : slug;

    const imgMatch = cardHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    const thumbnail = imgMatch ? imgMatch[1] : '';

    const typeMatch = cardHtml.match(/class=["']typeflag\s+([^"']+)["']/i);
    const typeStr = typeMatch ? typeMatch[1].trim() : 'Unknown';
    const type: ComicType = ['Manga', 'Manhwa', 'Manhua'].includes(typeStr) ? (typeStr as ComicType) : 'Unknown';

    const isColor = cardHtml.includes('warnalabel');

    const chapMatch = cardHtml.match(/<div class=["']lsch["']>[\s\S]*?<a\s+href=["']https?:\/\/komikindo\.[a-z]+\/([^"'\/]+)\/?["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<span class=["']datech["']>([\s\S]*?)<\/span>/i);
    const latestChapter = chapMatch ? {
      slug: chapMatch[1],
      title: chapMatch[2].replace(/<[^>]+>/g, '').trim(),
      updated: chapMatch[3].replace(/<[^>]+>/g, '').trim()
    } : null;

    cards.push({
      title,
      slug,
      thumbnail,
      type,
      isColor,
      latestChapter
    });
  }

  return cards;
}

/**
 * 1. Ambil Komik Berdasarkan Kategori (Manhwa, Manga, Manhua, dll)
 */
export async function getComicsByCategory(
  category: string,
  page = 1
): Promise<{ category: string; page: number; hasNextPage: boolean; data: ComicCardItem[] }> {
  const cleanCat = sanitizeSlug(category).toLowerCase();
  const safePage = Math.max(1, Math.min(100, Math.floor(Number(page) || 1)));
  if (!cleanCat) return { category: '', page: safePage, hasNextPage: false, data: [] };

  const cacheKey = `cat_${cleanCat}_p${safePage}`;
  const cached = getFromCache<{ category: string; page: number; hasNextPage: boolean; data: ComicCardItem[] }>(cacheKey);
  if (cached) return cached;

  const path = safePage === 1 ? `/${cleanCat}/` : `/${cleanCat}/page/${safePage}/`;
  const html = await fetchHtml(path);

  const cards = parseCardsFromHtml(html);
  const hasNextPage = html.includes(`/page/${safePage + 1}/`);
  const result = { category: cleanCat, page: safePage, hasNextPage, data: cards };

  setInCache(cacheKey, result, 5 * 60 * 1000); // 5 mins cache
  return result;
}

/**
 * 2. Ambil Komik Berdasarkan Genre
 */
export async function getComicsByGenre(
  genreSlug: string,
  page = 1
): Promise<{ genre: string; page: number; hasNextPage: boolean; data: ComicCardItem[] }> {
  const cleanGenre = sanitizeSlug(genreSlug).toLowerCase();
  const safePage = Math.max(1, Math.min(100, Math.floor(Number(page) || 1)));
  if (!cleanGenre) return { genre: '', page: safePage, hasNextPage: false, data: [] };

  const cacheKey = `genre_${cleanGenre}_p${safePage}`;
  const cached = getFromCache<{ genre: string; page: number; hasNextPage: boolean; data: ComicCardItem[] }>(cacheKey);
  if (cached) return cached;

  const path = safePage === 1 ? `/genres/${cleanGenre}/` : `/genres/${cleanGenre}/page/${safePage}/`;
  const html = await fetchHtml(path);

  const cards = parseCardsFromHtml(html);
  const hasNextPage = html.includes(`/page/${safePage + 1}/`);
  const result = { genre: cleanGenre, page: safePage, hasNextPage, data: cards };

  setInCache(cacheKey, result, 5 * 60 * 1000);
  return result;
}

/**
 * 3. Ambil Komik Terbaru (Paginasi)
 */
export async function getLatestComics(page = 1): Promise<{ page: number; hasNextPage: boolean; data: ComicCardItem[] }> {
  const res = await getComicsByCategory('komik-terbaru', page);
  return { page: res.page, hasNextPage: res.hasNextPage, data: res.data };
}

/**
 * 4. Ambil Komik Populer
 */
export async function getPopularComics(): Promise<ComicCardItem[]> {
  const cacheKey = 'popular_comics';
  const cached = getFromCache<ComicCardItem[]>(cacheKey);
  if (cached) return cached;

  const html = await fetchHtml('/komik-populer/');
  const cards = parseCardsFromHtml(html);

  setInCache(cacheKey, cards, 15 * 60 * 1000); // 15 mins cache
  return cards;
}

/**
 * 4.5 Ambil Data BigSlider Komik Populer dari Homepage
 */
export async function getFeaturedSlider(): Promise<FeaturedSliderItem[]> {
  const cacheKey = 'featured_slider';
  const cached = getFromCache<FeaturedSliderItem[]>(cacheKey);
  if (cached) return cached;

  const html = await fetchHtml('/');
  const sliderRegex = /<div class="bigcover">([\s\S]*?)<div class="slidshad"><\/div>\s*<\/div>\s*<\/div>/gi;
  const items: FeaturedSliderItem[] = [];
  let m;
  while ((m = sliderRegex.exec(html)) !== null) {
    const block = m[1];
    const titleMatch = block.match(/<h2>\s*([\s\S]*?)\s*<\/h2>/i);
    const linkMatch = block.match(/href="https?:\/\/[^\/]+\/komik\/([^\/"]+)\/?"/i);
    const imgMatch = block.match(/<img[^>]+src="([^"]+)"/i);
    const synMatch = block.match(/<div class="ttls">\s*([\s\S]*?)\s*<\/div>/i);
    const genMatch = block.match(/<span><b>Genres<\/b>\s*([\s\S]*?)\s*<\/span>/i);
    const ilusMatch = block.match(/<span><b>Ilustrator<\/b>\s*([\s\S]*?)\s*<\/span>/i);
    const pengMatch = block.match(/<span><b>Pengarang<\/b>\s*([\s\S]*?)\s*<\/span>/i);
    const statMatch = block.match(/<span><b>Status<\/b>\s*([\s\S]*?)\s*<\/span>/i);
    const skorMatch = block.match(/<span class="skor">\s*([\s\S]*?)\s*<\/span>/i);
    const typeMatch = block.match(/<div class="metadata">[\s\S]*?<span>\s*([A-Za-z]+)\s*<\/span>/i);

    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1].trim(),
        slug: linkMatch[1].trim(),
        thumbnail: imgMatch ? imgMatch[1] : '',
        synopsis: synMatch ? synMatch[1].trim() : '',
        genres: genMatch ? genMatch[1].trim() : 'Aksi, Petualangan',
        illustrator: ilusMatch ? ilusMatch[1].trim() : '-',
        author: pengMatch ? pengMatch[1].trim() : '-',
        status: statMatch ? statMatch[1].trim() : 'Berjalan',
        score: skorMatch ? skorMatch[1].replace(/\s+/g, ' ').trim() : '8.5',
        type: typeMatch ? typeMatch[1].trim() : 'Manhwa'
      });
    }
  }

  setInCache(cacheKey, items, 15 * 60 * 1000); // 15 mins cache
  return items;
}

/**
 * 5. Pencarian Komik
 */
export async function searchComics(query: string, page = 1): Promise<{ query: string; page: number; data: ComicCardItem[] }> {
  const safeQuery = query.replace(/[^\w\s\-\.]/gi, '').trim().slice(0, 80);
  const safePage = Math.max(1, Math.min(100, Math.floor(Number(page) || 1)));
  if (!safeQuery) return { query: '', page: safePage, data: [] };
  
  const cacheKey = `search_${encodeURIComponent(safeQuery.toLowerCase())}_p${safePage}`;
  const cached = getFromCache<{ query: string; page: number; data: ComicCardItem[] }>(cacheKey);
  if (cached) return cached;

  const path = safePage === 1 ? `/?s=${encodeURIComponent(safeQuery)}` : `/page/${safePage}/?s=${encodeURIComponent(safeQuery)}`;
  const html = await fetchHtml(path);

  const cards: ComicCardItem[] = [];
  const regex = /<div class=["']animepost["']>([\s\S]*?)<\/div>\s*<\/div>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const cardHtml = match[1];
    const urlMatch = cardHtml.match(/href=["']https?:\/\/komikindo\.[a-z]+\/komik\/([^"'\/]+)\/?["']/i);
    if (!urlMatch) continue;
    const slug = urlMatch[1];

    const titleMatch = cardHtml.match(/<h3[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
                       cardHtml.match(/title=["']Komik ([^"']+)["']/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : slug;

    const imgMatch = cardHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    const thumbnail = imgMatch ? imgMatch[1] : '';

    const typeMatch = cardHtml.match(/class=["']typeflag\s+([^"']+)["']/i);
    const typeStr = typeMatch ? typeMatch[1].trim() : 'Unknown';
    const type: ComicType = ['Manga', 'Manhwa', 'Manhua'].includes(typeStr) ? (typeStr as ComicType) : 'Unknown';

    cards.push({
      title,
      slug,
      thumbnail,
      type,
      isColor: cardHtml.includes('warnalabel'),
      latestChapter: null
    });
  }

  const result = { query: safeQuery, page: safePage, data: cards };
  setInCache(cacheKey, result, 5 * 60 * 1000);
  return result;
}

/**
 * 6. Detail Komik & Daftar Lengkap Chapter
 */
export async function getComicDetail(comicSlug: string): Promise<ComicDetail> {
  const safeSlug = sanitizeSlug(comicSlug);
  if (!safeSlug) throw new Error('Invalid comic slug');

  const cacheKey = `comic_${safeSlug}`;
  const cached = getFromCache<ComicDetail>(cacheKey);
  if (cached) return cached;

  const path = `/komik/${safeSlug}/`;
  const html = await fetchHtml(path);

  const titleMatch = html.match(/<h1[^>]*class=["']entry-title["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                     html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : comicSlug;
  title = title.replace(/^Komik\s+/i, '');

  const thumbMatch = html.match(/<div class=["']thumb["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i) ||
                     html.match(/<img[^>]+itemprop=["']image["'][^>]*src=["']([^"']+)["']/i);
  const thumbnail = thumbMatch ? thumbMatch[1] : '';

  const metadata: Record<string, string> = {};
  const spanMatches = [...html.matchAll(/<span><b>([^<]+)<\/b>\s*:?\s*([^<]+)<\/span>/gi)];
  spanMatches.forEach(m => {
    const key = m[1].replace(/:/g, '').trim().toLowerCase();
    const val = m[2].trim();
    metadata[key] = val;
  });

  const synopsisMatch = html.match(/<div[^>]+class=["']entry-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  const synopsis = synopsisMatch ? synopsisMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  const genresRaw = [...html.matchAll(/href=["'](?:https?:\/\/komikindo\.[a-z]+)?\/genres\/([^"'\/]+)\/?["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map(g => ({ slug: g[1], name: g[2].replace(/<[^>]+>/g, '').trim() }));

  const genres: Genre[] = [];
  const seenGenres = new Set<string>();
  for (const g of genresRaw) {
    if (!seenGenres.has(g.slug) && g.name.length > 0) {
      seenGenres.add(g.slug);
      genres.push(g);
    }
  }

  const chapters = [];
  const chapterRegex = /<li[^>]*>[\s\S]*?<span class=["']lchx["']>[\s\S]*?<a\s+href=["']https?:\/\/komikindo\.[a-z]+\/([^"'\/]+)\/?["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/span>[\s\S]*?<span class=["']dt["']>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/gi;
  let cMatch;
  while ((cMatch = chapterRegex.exec(html)) !== null) {
    chapters.push({
      slug: cMatch[1],
      title: cMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      date: cMatch[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    });
  }

  const result: ComicDetail = {
    title,
    slug: comicSlug,
    thumbnail,
    metadata,
    synopsis,
    genres,
    totalChapters: chapters.length,
    chapters
  };

  setInCache(cacheKey, result, 10 * 60 * 1000); // 10 mins
  return result;
}

/**
 * 7. Halaman Baca Chapter (100% Bebas Iklan Judol & Popunder)
 */
export async function getChapterImages(chapterSlug: string): Promise<ChapterData> {
  const safeSlug = sanitizeSlug(chapterSlug);
  if (!safeSlug) throw new Error('Invalid chapter slug');

  const cacheKey = `chap_${safeSlug}`;
  const cached = getFromCache<ChapterData>(cacheKey);
  if (cached) return cached;

  const path = `/${safeSlug}/`;
  const html = await fetchHtml(path);

  const prevMatch = html.match(/<a[^>]+href=["']https?:\/\/komikindo\.[a-z]+\/([^"'\/]+)\/?["'][^>]*rel=["']prev["']/i) ||
                    html.match(/<div class=["']nextprev["']>[\s\S]*?<a href=["']https?:\/\/komikindo\.[a-z]+\/([^"'\/]+)\/?["'][^>]*class=["']ch-prev-btn["']/i);
  const nextMatch = html.match(/<a[^>]+href=["']https?:\/\/komikindo\.[a-z]+\/([^"'\/]+)\/?["'][^>]*rel=["']next["']/i) ||
                    html.match(/<div class=["']nextprev["']>[\s\S]*?<a href=["']https?:\/\/komikindo\.[a-z]+\/([^"'\/]+)\/?["'][^>]*class=["']ch-next-btn["']/i);
  const comicMatch = html.match(/<a[^>]+href=["']https?:\/\/komikindo\.[a-z]+\/komik\/([^"'\/]+)\/?["'][^>]*>/i);

  const prevChapter = prevMatch ? sanitizeSlug(prevMatch[1]) : null;
  const nextChapter = nextMatch ? sanitizeSlug(nextMatch[1]) : null;
  const comicSlug = comicMatch ? sanitizeSlug(comicMatch[1]) : null;

  let images: string[] = [];
  const chimgMatch = html.match(/<div[^>]+id=["'](chimg-[a-z0-9_-]+)["'][^>]*>([\s\S]*?)<\/div>/i);

  if (chimgMatch) {
    images = [...chimgMatch[2].matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  } else {
    images = [...html.matchAll(/src=["'](https?:\/\/[^"']+\/data\/[^"']+)["']/gi)].map(m => m[1]);
  }

  // Filter ketat: buang semua GIF blogger judol dan gambar favicon/logo
  const cleanImages = images
    .map(img => img.trim())
    .filter(img =>
      (img.startsWith('http://') || img.startsWith('https://')) &&
      !img.includes('blogger.googleusercontent.com') &&
      !img.includes('.gif') &&
      !img.includes('fav.png') &&
      !img.includes('komikindo') &&
      (img.includes('/data/') || img.includes('.jpeg') || img.includes('.jpg') || img.includes('.webp') || img.includes('.png'))
    );

  const result: ChapterData = {
    chapterSlug,
    comicSlug,
    prevChapter,
    nextChapter,
    totalImages: cleanImages.length,
    images: cleanImages
  };

  setInCache(cacheKey, result, 60 * 60 * 1000); // 1 hour cache
  return result;
}
