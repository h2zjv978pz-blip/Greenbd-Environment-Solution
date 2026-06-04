import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://greenbd23.com/sitemap.xml',
    host:    'https://greenbd23.com',
  };
}
