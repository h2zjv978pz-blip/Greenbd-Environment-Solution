import type { Metadata } from 'next';
import './globals.css';
import Providers      from './providers';
import AmbientPlayer  from '@/components/AmbientPlayer';
import SplashScreen   from '@/components/SplashScreen';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getContact } from '@/lib/getData';

const SITE_URL = 'https://greenbd23.com';
const SITE_NAME = 'Green BD Environmental Solutions';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ── Title template ────────────────────────────────────────────────────────
  title: {
    default: `${SITE_NAME} | Climate & Environmental Consultancy Bangladesh`,
    template: `%s | ${SITE_NAME}`,
  },

  // ── Description ───────────────────────────────────────────────────────────
  description:
    'Green BD Environmental Solutions is Bangladesh\'s leading environmental consultancy — specialising in Environmental Impact Assessment (EIA), Climate Change Research, GIS & Remote Sensing, Disaster Risk Reduction, and Sustainability Consulting across all 64 districts.',

  // ── Keywords ──────────────────────────────────────────────────────────────
  keywords: [
    'environmental consultancy Bangladesh',
    'EIA Bangladesh', 'Environmental Impact Assessment Dhaka',
    'GIS remote sensing Bangladesh',
    'climate change adaptation Bangladesh',
    'disaster risk reduction Bangladesh',
    'sustainability consulting Dhaka',
    'environmental research Bangladesh',
    'climate resilience Bangladesh',
    'Green BD', 'greenbd', 'greenbd23', 'greenbd23.com', 'Green BD Environmental',
    'environmental solutions Bangladesh',
    'IPCC AR6 Bangladesh',
    'flood risk assessment Bangladesh',
    'sea level rise Bangladesh coast',
  ],

  // ── Authors / publisher ───────────────────────────────────────────────────
  authors:   [{ name: SITE_NAME, url: SITE_URL }],
  creator:   SITE_NAME,
  publisher: SITE_NAME,

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: { canonical: '/' },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type:        'website',
    locale:      'en_BD',
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       `${SITE_NAME} | Climate & Environmental Consultancy`,
    description: 'Leading environmental consultancy in Bangladesh — EIA, GIS, Climate Change, Disaster Risk Reduction & Sustainability.',
    images: [{
      url:    '/og-image.png',
      width:  1200,
      height: 630,
      alt:    'Green BD Environmental Solutions',
    }],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       `${SITE_NAME} | Environmental Consultancy Bangladesh`,
    description: 'EIA, GIS, Climate Change & Sustainability Consulting across Bangladesh.',
    images:      ['/og-image.png'],
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':      -1,
    },
  },

  // ── Verification (add your codes when ready) ──────────────────────────────
  verification: {
    // google: 'your-google-search-console-code',
    // yandex: 'your-yandex-code',
  },

  // ── Geo / language ────────────────────────────────────────────────────────
  other: {
    'geo.region':       'BD',
    'geo.placename':    'Dhaka, Bangladesh',
    'geo.position':     '23.8103;90.4125',
    'ICBM':             '23.8103, 90.4125',
    'language':         'English',
    'revisit-after':    '7 days',
    'rating':           'general',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = getContact();
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Favicon sizes */}
        <link rel="icon"             href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <SplashScreen />
        <Providers>{children}</Providers>
        {contact.whatsapp && <WhatsAppButton number={contact.whatsapp} />}
        <AmbientPlayer />
      </body>
    </html>
  );
}
