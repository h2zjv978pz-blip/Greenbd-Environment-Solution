import { readData } from '@/lib/data';
import type { Publication } from '@/lib/getData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Tag, Download, FileText, Mail } from 'lucide-react';
import type { Metadata } from 'next';

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

const tagColors: Record<string, string> = {
  Climate: 'bg-sky-100 text-sky-700', 'GIS/RS': 'bg-blue-100 text-blue-700',
  DRR: 'bg-red-100 text-red-700', 'Remote Sensing': 'bg-indigo-100 text-indigo-700',
  Coastal: 'bg-cyan-100 text-cyan-700', Urban: 'bg-purple-100 text-purple-700',
  Community: 'bg-orange-100 text-orange-700', Mangrove: 'bg-green-100 text-green-700',
  Wetlands: 'bg-teal-100 text-teal-700', Livelihoods: 'bg-yellow-100 text-yellow-700',
  'Heat Island': 'bg-rose-100 text-rose-700', Carbon: 'bg-emerald-100 text-emerald-700',
};

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { publications } = readData<{ publications: Publication[] }>('research');
  const pub = publications.find(p => p.id === Number(id));
  if (!pub) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-16 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/#research"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-white/20 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Research
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {pub.tags.map(tag => (
              <span key={tag} className="text-xs font-semibold bg-white/15 text-white px-3 py-1 rounded-full border border-white/20">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-heading text-white leading-snug">
            {pub.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">Abstract</h2>
            <p className="text-gray-600 leading-relaxed text-base">{pub.abstract}</p>

            {/* Full content body — if admin has added it */}
            {pub.content && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 font-heading mb-5">Full Paper</h2>
                <div
                  className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base
                    prose-headings:font-heading prose-headings:text-gray-900
                    prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: pub.content }}
                />
              </div>
            )}

            {/* PDF download */}
            {pub.pdfFile ? (
              <div className="mt-10 p-6 bg-primary-50 border border-primary-100 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Full Paper Available</p>
                    <p className="text-sm text-gray-500 mt-0.5">Click to read or download the complete paper as PDF</p>
                  </div>
                  <a
                    href={pub.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                  >
                    <Download className="w-4 h-4" /> Read Full Paper
                  </a>
                </div>
              </div>
            ) : !pub.content && (
              <div className="mt-10 p-6 bg-primary-50 border border-primary-100 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Full Paper Available on Request</p>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      The full paper is not publicly accessible yet. Contact our research team to request a copy of this publication.
                    </p>
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm"
                    >
                      <Mail className="w-4 h-4" /> Contact Us to Request
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-8 space-y-5">
              <h3 className="font-bold text-gray-900 font-heading pb-4 border-b border-gray-200">
                Publication Info
              </h3>

              <div className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Journal</p>
                  <p className="text-gray-800 text-sm font-semibold mt-0.5">{pub.journal}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Year</p>
                  <p className="text-gray-800 text-sm font-semibold mt-0.5">{pub.year}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pub.tags.map(tag => (
                      <span key={tag} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {pub.pdfFile && (
                  <a
                    href={pub.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors w-full"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                )}
                <Link
                  href="/#contact"
                  className="flex items-center justify-center gap-2 border border-primary-200 text-primary-600 hover:bg-primary-50 font-semibold text-sm py-3 rounded-xl transition-colors w-full"
                >
                  Request a Copy
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
