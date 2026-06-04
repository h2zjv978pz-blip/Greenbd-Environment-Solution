import { MetadataRoute } from 'next';
import { readData } from '@/lib/data';

const BASE = 'https://greenbd23.com';

interface Project     { id: number }
interface Publication { id: number }

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const statics: MetadataRoute.Sitemap = [
    { url: BASE,                         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/#about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/#services`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/#projects`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/#research`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/#climate-map`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/#team`,              lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/#contact`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact/consultation`,lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact/meeting`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact/partner`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/blog`,     lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/resources/laws`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/resources/downloads`,lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/resources/gallery`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${BASE}/resources/video`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
  ];

  // Dynamic project pages
  let projectUrls: MetadataRoute.Sitemap = [];
  try {
    const { projects = [] } = readData<{ projects: Project[] }>('projects');
    projectUrls = projects.map(p => ({
      url: `${BASE}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch { /* graceful skip */ }

  // Dynamic research pages
  let researchUrls: MetadataRoute.Sitemap = [];
  try {
    const { publications = [] } = readData<{ publications: Publication[] }>('research');
    researchUrls = publications.map(p => ({
      url: `${BASE}/research/${p.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch { /* graceful skip */ }

  return [...statics, ...projectUrls, ...researchUrls];
}
