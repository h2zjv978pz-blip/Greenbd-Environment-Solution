import { readData } from '@/lib/data';
import type { Project } from '@/lib/getData';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectDetailClient from '@/components/ProjectDetailClient';

const SITE = 'https://greenbd23.com';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const { projects } = readData<{ projects: Project[] }>('projects');
  const p = projects.find(pr => pr.id === Number(id));
  if (!p) return { title: 'Project Not Found' };

  const url   = `${SITE}/projects/${id}`;
  const image = p.image?.startsWith('http') ? p.image : p.image ? `${SITE}${p.image}` : `${SITE}/og-image.png`;
  const keywords = [
    p.title, p.category, p.location,
    'environmental project Bangladesh', 'Green BD project', 'EIA Bangladesh',
    `${p.category} Bangladesh`, `environmental consultancy ${p.location}`,
  ].filter(Boolean).join(', ');

  return {
    title: `${p.title} | Environmental Project | Green BD Bangladesh`,
    description: `${p.description.slice(0, 155)}${p.description.length > 155 ? '…' : ''}`,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${p.title} | Green BD Environmental Project`,
      description: p.description.slice(0, 200),
      url,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: p.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.title} | Green BD`,
      description: p.description.slice(0, 200),
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = readData<{ projects: Project[] }>('projects');
  const project = projects.find(p => p.id === Number(id));
  if (!project || project.hidden) notFound();

  const url   = `${SITE}/projects/${id}`;
  const image = project.image?.startsWith('http') ? project.image : project.image ? `${SITE}${project.image}` : `${SITE}/og-image.png`;

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/#projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: url },
    ],
  };
  const projectSchema = {
    '@context': 'https://schema.org', '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image,
    url,
    author: { '@type': 'Organization', name: 'Green BD Environmental Solutions', url: SITE },
    locationCreated: { '@type': 'Place', name: project.location + ', Bangladesh' },
    keywords: [project.category, project.location, 'environmental project Bangladesh'].join(', '),
    provider: { '@type': 'Organization', name: 'Green BD Environmental Solutions', url: SITE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <ProjectDetailClient project={project} />
    </>
  );
}
