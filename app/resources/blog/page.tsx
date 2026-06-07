export const metadata = {
  title: 'Environmental Blog & News — Bangladesh',
  description: 'Environmental research articles, EIA guides, climate change insights, GIS/remote sensing updates and sustainability news from Green BD Environmental Solutions Bangladesh.',
  keywords: [
    'environmental blog Bangladesh',
    'EIA guide Bangladesh',
    'climate change articles Bangladesh',
    'GIS remote sensing blog',
    'environmental consultancy news Bangladesh',
    'sustainability articles Bangladesh',
    'Green BD blog',
    'greenbd23 news',
  ],
  alternates: { canonical: '/resources/blog' },
  openGraph: {
    title:       'Environmental Blog & News | Green BD Environmental Solutions',
    description: 'Expert insights on EIA, climate change, GIS, disaster risk reduction and sustainability in Bangladesh.',
    type:        'website',
    url:         'https://greenbd23.com/resources/blog',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Green BD Blog' }],
  },
};

import { readData } from '@/lib/data';
import { getEnvironmentNews, type NewsItem } from '@/lib/envNews';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowRight, Rss } from 'lucide-react';

interface Post {
  id: number; title: string; slug: string; category: string;
  author: string; date: string; excerpt: string;
  image: string; tags: string[]; published: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Climate':      'bg-blue-100 text-blue-700',
  'GIS/RS':       'bg-purple-100 text-purple-700',
  'Disaster Risk':'bg-red-100 text-red-700',
  'Sustainability':'bg-green-100 text-green-700',
  'Research':     'bg-amber-100 text-amber-700',
};

export const dynamic = 'force-dynamic';

function NewsFeedCard({ flag, title, items }: { flag: string; title: string; items: NewsItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="font-heading font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
        <span className="text-xl leading-none">{flag}</span> {title}
      </h2>
      <ol className="space-y-3.5">
        {items.map((item, i) => (
          <li key={item.link} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div className="min-w-0">
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-gray-800 hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                {item.title}
              </a>
              {item.source && <p className="text-xs text-gray-400 mt-0.5 truncate">{item.source}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function BlogPage() {
  const { posts = [] } = readData<{ posts: Post[] }>('blog');
  const published = posts.filter(p => p.published);
  const { bangladesh, world } = await getEnvironmentNews();

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="section-subtitle mb-2">Knowledge Hub</p>
        <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">Blog & News</h1>
        <p className="text-gray-500 max-w-2xl">
          Latest insights, research findings, and news from Bangladesh&apos;s environmental frontlines —
          written by our team of scientists and field experts.
        </p>
      </div>

      {/* Live environmental news feeds */}
      {(bangladesh.length > 0 || world.length > 0) && (
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-2">
            <Rss className="w-5 h-5 text-primary-600" />
            <h2 className="text-2xl font-bold font-heading text-gray-900">Live Environmental News</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <NewsFeedCard flag="🇧🇩" title="Top 10 — Bangladesh" items={bangladesh} />
            <NewsFeedCard flag="🌍" title="Top 10 — Around the World" items={world} />
          </div>
        </div>
      )}

      {published.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg font-medium">No posts published yet.</p>
          <p className="text-sm mt-1">Check back soon for news and insights.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {published.map(post => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Link href={`/resources/blog/${post.slug}`} className="block">
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} width={400} height={192} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <Link href={`/resources/blog/${post.slug}`}>
                  <h2 className="font-heading font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-4">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.slice(0,3).map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
                <Link href={`/resources/blog/${post.slug}`} className="mt-4 flex items-center gap-1.5 text-primary-600 text-sm font-semibold hover:gap-2.5 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
