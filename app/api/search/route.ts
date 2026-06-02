import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';

export interface SearchResult {
  type: string;
  icon: string;
  title: string;
  excerpt: string;
  url: string;
  category?: string;
}

function match(text: string | undefined | null, q: string): boolean {
  return !!text && text.toLowerCase().includes(q);
}

function clip(text: string, q: string, len = 100): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text.slice(0, len) + (text.length > len ? '…' : '');
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + q.length + 70);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const q   = raw.toLowerCase();

  if (q.length < 2) return NextResponse.json({ results: [], total: 0, query: raw });

  const results: SearchResult[] = [];

  // ── Blog posts ───────────────────────────────────────────────────
  try {
    const { posts = [] } = readData<{ posts: { title:string; excerpt:string; content:string; category:string; author:string; tags:string[]; published:boolean; slug:string }[] }>('blog');
    posts.filter(p => p.published).forEach(p => {
      if (match(p.title, q) || match(p.excerpt, q) || match(p.content, q) || match(p.author, q) || p.tags?.some(t => match(t, q))) {
        results.push({ type:'Blog', icon:'📰', title: p.title, excerpt: clip(p.excerpt || p.content || '', q), url:`/resources/blog`, category: p.category });
      }
    });
  } catch { /* no blog data */ }

  // ── Projects ─────────────────────────────────────────────────────
  try {
    const { projects = [] } = readData<{ projects: { id:number; title:string; description:string; category:string; location:string; clientName:string }[] }>('projects');
    projects.forEach(p => {
      if (match(p.title, q) || match(p.description, q) || match(p.category, q) || match(p.location, q) || match(p.clientName, q)) {
        results.push({ type:'Project', icon:'📁', title: p.title, excerpt: clip(p.description || p.location || '', q), url:`/projects/${p.id}`, category: p.category });
      }
    });
  } catch { /* no project data */ }

  // ── Services ─────────────────────────────────────────────────────
  try {
    const { services = [] } = readData<{ services: { id:number; title:string; desc:string }[] }>('services');
    services.forEach(s => {
      if (match(s.title, q) || match(s.desc, q)) {
        results.push({ type:'Service', icon:'⚙️', title: s.title, excerpt: clip(s.desc || '', q), url:'/#services' });
      }
    });
  } catch { /* no service data */ }

  // ── Research ─────────────────────────────────────────────────────
  try {
    const { publications = [] } = readData<{ publications: { id:number; title:string; abstract:string; journal:string; authors:string; category:string }[] }>('research');
    publications.forEach(p => {
      if (match(p.title, q) || match(p.abstract, q) || match(p.authors, q) || match(p.journal, q)) {
        results.push({ type:'Research', icon:'🔬', title: p.title, excerpt: clip(p.abstract || p.authors || '', q), url:`/research/${p.id}`, category: p.category });
      }
    });
  } catch { /* no research data */ }

  // ── Team members ─────────────────────────────────────────────────
  try {
    const { members = [] } = readData<{ members: { name:string; role:string; expertise:string }[] }>('team');
    members.forEach(m => {
      if (match(m.name, q) || match(m.role, q) || match(m.expertise, q)) {
        results.push({ type:'Team', icon:'👤', title: m.name, excerpt: `${m.role}${m.expertise ? ' — ' + m.expertise : ''}`, url:'/#team' });
      }
    });
  } catch { /* no team data */ }

  // ── Environmental Laws ───────────────────────────────────────────
  try {
    const { laws = [] } = readData<{ laws: { title:string; description:string; category:string; year:number; tags:string[] }[] }>('laws');
    laws.forEach(l => {
      if (match(l.title, q) || match(l.description, q) || match(l.category, q) || l.tags?.some(t => match(t, q))) {
        results.push({ type:'Law', icon:'⚖️', title: l.title, excerpt: clip(l.description || '', q), url:'/resources/laws', category: l.category });
      }
    });
  } catch { /* no laws data */ }

  // ── Downloads ────────────────────────────────────────────────────
  try {
    const { downloads = [] } = readData<{ downloads: { title:string; description:string; category:string; fileType:string }[] }>('downloads');
    downloads.forEach(d => {
      if (match(d.title, q) || match(d.description, q) || match(d.category, q)) {
        results.push({ type:'Download', icon:'📥', title: d.title, excerpt: clip(d.description || '', q), url:'/resources/downloads', category: `${d.category} · ${d.fileType}` });
      }
    });
  } catch { /* no downloads data */ }

  // ── About highlights ─────────────────────────────────────────────
  try {
    const about = readData<{ heading:string; para1:string; para2:string; highlights:string[]; whyChoose?:{title:string; desc:string}[] }>('about');
    if (match(about.heading, q) || match(about.para1, q) || match(about.para2, q)) {
      results.push({ type:'Page', icon:'🏢', title:'About GreenBD', excerpt: clip(about.para1 || '', q), url:'/#about' });
    }
    about.highlights?.forEach(h => {
      if (match(h, q)) results.push({ type:'Page', icon:'✅', title: h, excerpt:'Key highlight — About section', url:'/#about' });
    });
    about.whyChoose?.forEach(w => {
      if (match(w.title, q) || match(w.desc, q)) {
        results.push({ type:'Page', icon:'⭐', title: w.title, excerpt: clip(w.desc || '', q), url:'/#about', category:'Why Choose GreenBD' });
      }
    });
  } catch { /* no about data */ }

  return NextResponse.json({ results: results.slice(0, 40), total: results.length, query: raw });
}
