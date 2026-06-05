import { readData } from '@/lib/data';
import { notFound }  from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';

const BASE = 'https://greenbd23.com';

interface Post {
  id: number; title: string; slug: string; category: string;
  author: string; date: string; excerpt: string; content: string;
  image: string; tags: string[]; published: boolean;
  metaDescription: string; targetKeyword: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { posts = [] } = readData<{ posts: Post[] }>('blog');
  const post = posts.find(p => p.slug === slug && p.published);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: [post.targetKeyword, ...post.tags, 'Bangladesh', 'Green BD', 'greenbd23', 'environmental consultancy'],
    alternates: { canonical: `/resources/blog/${post.slug}` },
    openGraph: {
      type:          'article',
      title:         post.title,
      description:   post.metaDescription || post.excerpt,
      url:           `${BASE}/resources/blog/${post.slug}`,
      publishedTime: post.date,
      authors:       [post.author],
      section:       post.category,
      tags:          post.tags,
      images:        post.image
        ? [{ url: post.image, alt: post.title }]
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.metaDescription || post.excerpt,
      images:      [post.image || '/og-image.png'],
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  'Climate':       'bg-blue-100  text-blue-700',
  'EIA':           'bg-green-100 text-green-700',
  'GIS/RS':        'bg-purple-100 text-purple-700',
  'Disaster Risk': 'bg-red-100   text-red-700',
  'Sustainability':'bg-emerald-100 text-emerald-700',
  'Research':      'bg-amber-100 text-amber-700',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts = [] } = readData<{ posts: Post[] }>('blog');
  const post = posts.find(p => p.slug === slug && p.published);
  if (!post) notFound();

  const readTime = Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200));

  const articleSchema = {
    "@context":  "https://schema.org",
    "@type":     "Article",
    "headline":  post.title,
    "description": post.metaDescription || post.excerpt,
    "image":     post.image || `${BASE}/og-image.png`,
    "author":    { "@type": "Organization", "name": "Green BD Environmental Solutions", "url": BASE },
    "publisher": {
      "@type": "Organization",
      "name":  "Green BD Environmental Solutions",
      "logo":  { "@type": "ImageObject", "url": `${BASE}/favicon.svg` }
    },
    "datePublished":  post.date,
    "dateModified":   post.date,
    "keywords":       [post.targetKeyword, ...post.tags].join(', '),
    "articleSection": post.category,
    "url":            `${BASE}/resources/blog/${post.slug}`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE}/resources/blog/${post.slug}` },
    "inLanguage":     "en-BD",
    "about":          { "@type": "Thing", "name": post.targetKeyword }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",      "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "Blog",      "item": `${BASE}/resources/blog` },
      { "@type": "ListItem", "position": 3, "name": post.title,  "item": `${BASE}/resources/blog/${post.slug}` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-3xl mx-auto px-4 lg:px-0 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/"                  className="hover:text-gray-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/resources/blog"    className="hover:text-gray-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Category */}
        <div className="mb-4">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {post.category}
          </span>
        </div>

        {/* Title — single H1 */}
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</time>
          </span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{readTime} min read</span>
        </div>

        {/* Feature image */}
        {post.image && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={post.image} alt={post.title} width={800} height={400} className="w-full h-64 md:h-80 object-cover" loading="lazy" />
          </div>
        )}

        {/* Lead excerpt */}
        <p className="text-lg text-gray-600 leading-relaxed mb-8 p-5 bg-green-50 border-l-4 border-green-500 rounded-r-xl font-medium">
          {post.excerpt}
        </p>

        {/* Article body (HTML content) */}
        <div
          className="prose prose-lg prose-green max-w-none
            prose-headings:font-heading prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-gray-800
            prose-a:text-green-700 prose-a:font-semibold hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
          {post.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full">
              <Tag className="w-3 h-3" />{tag}
            </span>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-green-900 to-green-700 rounded-2xl text-white">
          <div className="flex-1">
            <p className="font-bold text-lg mb-1">Need expert environmental consulting?</p>
            <p className="text-green-200 text-sm">Green BD Environmental Solutions provides EIA, GIS, Climate Change and Sustainability services across Bangladesh.</p>
          </div>
          <Link href="/contact/consultation"
            className="shrink-0 bg-white text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm whitespace-nowrap">
            Request Consultation
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link href="/resources/blog" className="inline-flex items-center gap-2 text-green-700 text-sm font-semibold hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </article>
    </>
  );
}
