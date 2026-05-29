import { readData } from '@/lib/data';
import type { Project } from '@/lib/getData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, User, Tag } from 'lucide-react';
import type { Metadata } from 'next';

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

  const gallery = (project.galleryImages ?? []).filter(Boolean);
  const additional = (project.additionalImages ?? []).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px] bg-gray-900 overflow-hidden">
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-16">
          <span className="inline-block bg-primary-600 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            {project.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight max-w-3xl">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left — main content */}
          <div className="lg:col-span-2">
            {project.description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">Project Overview</h2>
                <div
                  className="prose prose-gray max-w-none text-gray-600 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 font-heading mb-5">Gallery</h2>
                <div className="grid grid-cols-2 gap-3">
                  {gallery.map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional images */}
            {additional.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 font-heading mb-5">Field Images</h2>
                <div className="grid grid-cols-2 gap-3">
                  {additional.map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img src={img} alt={`Field ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — sidebar info card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-900 font-heading text-lg mb-5 pb-4 border-b border-gray-200">
                Project Details
              </h3>
              <ul className="space-y-4">
                {project.clientName && (
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-primary-600" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Client</p>
                      <p className="text-gray-800 text-sm font-semibold mt-0.5">{project.clientName}</p>
                    </div>
                  </li>
                )}
                {project.location && (
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary-600" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
                      <p className="text-gray-800 text-sm font-semibold mt-0.5">{project.location}</p>
                    </div>
                  </li>
                )}
                {project.projectTime && (
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-primary-600" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Year</p>
                      <p className="text-gray-800 text-sm font-semibold mt-0.5">{project.projectTime}</p>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Tag className="w-4 h-4 text-primary-600" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Category</p>
                    <span className="inline-block mt-1 text-xs font-semibold bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-5 border-t border-gray-200">
                <Link
                  href="/#contact"
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Inquire About This Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
