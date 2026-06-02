import { readData } from '@/lib/data';
import type { Publication } from '@/lib/getData';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ResearchDetailClient from '@/components/ResearchDetailClient';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const { publications } = readData<{ publications: Publication[] }>('research');
  const p = publications.find(pub => pub.id === Number(id));
  return p
    ? { title: `${p.title} | Green BD Environmental Solutions`, description: p.abstract }
    : { title: 'Publication Not Found' };
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { publications } = readData<{ publications: Publication[] }>('research');
  const pub = publications.find(p => p.id === Number(id));
  if (!pub) notFound();
  return <ResearchDetailClient pub={pub} />;
}
