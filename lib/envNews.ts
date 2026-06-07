export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

const FEEDS = {
  bangladesh: 'https://news.google.com/rss/search?q=environment+OR+climate+Bangladesh&hl=en-BD&gl=BD&ceid=BD:en',
  world:      'https://news.google.com/rss/search?q=environment+OR+climate+change&hl=en-US&gl=US&ceid=US:en',
};

function extractTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!m) return '';
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#0?39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

async function fetchTop10(url: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 6 * 60 * 60 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]).slice(0, 10);
    return blocks
      .map(block => ({
        title:   decodeEntities(extractTag(block, 'title')),
        link:    extractTag(block, 'link'),
        source:  decodeEntities(extractTag(block, 'source')),
        pubDate: extractTag(block, 'pubDate'),
      }))
      .filter(item => item.title && item.link);
  } catch {
    return [];
  }
}

export async function getEnvironmentNews(): Promise<{ bangladesh: NewsItem[]; world: NewsItem[] }> {
  const [bangladesh, world] = await Promise.all([
    fetchTop10(FEEDS.bangladesh),
    fetchTop10(FEEDS.world),
  ]);
  return { bangladesh, world };
}
