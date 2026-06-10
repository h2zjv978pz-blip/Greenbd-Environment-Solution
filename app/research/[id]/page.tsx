import { readData } from '@/lib/data';
import type { Publication } from '@/lib/getData';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ResearchDetailClient from '@/components/ResearchDetailClient';

const SITE = 'https://greenbd23.com';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const { publications } = readData<{ publications: Publication[] }>('research');
  const p = publications.find(pub => pub.id === Number(id));
  if (!p) return { title: 'Publication Not Found' };

  const url     = `${SITE}/research/${id}`;
  const desc    = (p.abstract || '').slice(0, 155);
  const keywords = [p.title, p.journal, ...(p.tags || []),
    'environmental research Bangladesh', 'climate change research', 'Green BD publication',
  ].filter(Boolean).join(', ');

  return {
    title: `${p.title} | Research | Green BD Environmental Solutions`,
    description: desc + (p.abstract.length > 155 ? '…' : ''),
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${p.title} | Green BD Research`,
      description: p.abstract.slice(0, 200),
      url,
      type: 'article',
      publishedTime: p.year ? `${p.year}-01-01` : undefined,
      tags: p.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.title} | Green BD Research`,
      description: p.abstract.slice(0, 200),
    },
  };
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { publications } = readData<{ publications: Publication[] }>('research');
  const pub = publications.find(p => p.id === Number(id));
  if (!pub) notFound();

  const url = `${SITE}/research/${id}`;

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Research', item: `${SITE}/#research` },
      { '@type': 'ListItem', position: 3, name: pub.title,  item: url },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'ScholarlyArticle',
    headline: pub.title,
    abstract: pub.abstract,
    keywords: (pub.tags || []).join(', '),
    about: [...(pub.tags || []), 'Bangladesh'],
    datePublished: pub.year ? `${pub.year}-01-01` : undefined,
    isPartOf: pub.journal ? { '@type': 'Periodical', name: pub.journal } : undefined,
    author: { '@type': 'Organization', name: 'Green BD Environmental Solutions', url: SITE },
    publisher: { '@id': `${SITE}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ResearchDetailClient pub={pub} />
    </>
  );
}
