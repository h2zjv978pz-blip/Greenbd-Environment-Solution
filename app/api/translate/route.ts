import { NextRequest, NextResponse } from 'next/server';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function translateOne(text: string, from: string, to: string): Promise<string> {
  if (!text?.trim()) return '';
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
  const res  = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Translation request failed: ${res.status}`);
  const data = await res.json();
  // data[0] is an array of [translated_chunk, original_chunk, ...]
  return (data[0] as [string][]).map(chunk => chunk[0]).join('');
}

export async function POST(req: NextRequest) {
  try {
    const { texts, from = 'en', to = 'bn', stripHtmlTags = false } = await req.json() as {
      texts: string[];
      from?: string;
      to?: string;
      stripHtmlTags?: boolean;
    };

    if (!Array.isArray(texts)) {
      return NextResponse.json({ error: 'texts must be an array' }, { status: 400 });
    }

    const translations = await Promise.all(
      texts.map(text => translateOne(stripHtmlTags ? stripHtml(text) : text, from, to))
    );

    return NextResponse.json({ translations });
  } catch (err) {
    console.error('[translate]', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
