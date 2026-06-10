import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SERVICE_PAGES, getServicePageBySlug } from '@/lib/servicesContent';
import ServiceDetailClient from '@/components/ServiceDetailClient';

const SITE = 'https://greenbd23.com';

export function generateStaticParams() {
  return SERVICE_PAGES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePageBySlug(slug);
  if (!service) return { title: 'Service Not Found' };

  const url = `${SITE}/services/${slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
      type: 'website',
      images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServicePageBySlug(slug);
  if (!service) notFound();

  const url = `${SITE}/services/${slug}`;

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/#services` },
      { '@type': 'ListItem', position: 3, name: service.title, item: url },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    serviceType: service.title,
    areaServed: { '@type': 'Country', name: 'Bangladesh' },
    provider: { '@id': `${SITE}/#organization` },
    url,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title} Services`,
      itemListElement: service.offerings.map(o => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: o.title, description: o.desc },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ServiceDetailClient service={service} />
    </>
  );
}
