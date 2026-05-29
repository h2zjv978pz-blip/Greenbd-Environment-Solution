import { readData } from '@/lib/data';
import type { Project } from '@/lib/getData';
import ProjectForm from '@/components/admin/ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = readData<{ projects: Project[] }>('projects');
  const project = projects.find(p => p.id === Number(id));
  if (!project) notFound();
  return <ProjectForm mode="edit" initial={project} />;
}
