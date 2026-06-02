import { readData } from '@/lib/data';
import type { Project } from '@/lib/getData';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectDetailClient from '@/components/ProjectDetailClient';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const { projects } = readData<{ projects: Project[] }>('projects');
  const p = projects.find(pr => pr.id === Number(id));
  return p
    ? { title: `${p.title} | Green BD Environmental Solutions`, description: p.description }
    : { title: 'Project Not Found' };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = readData<{ projects: Project[] }>('projects');
  const project = projects.find(p => p.id === Number(id));
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
