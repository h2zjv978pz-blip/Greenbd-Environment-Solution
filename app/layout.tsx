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
    default: `Green BD Environmental Solutions | greenbd23 | Climate & EIA Consultancy Bangladesh`,
    template: `%s | Green BD Environmental Solutions | greenbd23`,
  },

  // ── Description ───────────────────────────────────────────────────────────
  description:
    'Green BD Environmental Solutions (greenbd23.com) — leading environmental consultant in Dhaka, Bangladesh. Specialising in Environmental Impact Assessment (EIA), Environmental Management Plans, Climate Change Consultancy, GIS & Remote Sensing, Disaster Risk Reduction, Flood Vulnerability Mapping, River Erosion Monitoring, and Sustainability Consulting across Bangladesh.',

  // ── Keywords ──────────────────────────────────────────────────────────────
  keywords: [
    // ── Brand ──────────────────────────────────────────────────────────────
    'Green BD', 'greenbd', 'greenbd23', 'greenbd23.com',
    'Green BD Environmental Solutions', 'Green BD Environmental consultancy',

    // ── Core services ──────────────────────────────────────────────────────
    'Environmental consultant in Dhaka',
    'Environmental consultancy Bangladesh',
    'Environmental Impact Assessment Bangladesh',
    'EIA Bangladesh', 'EIA Dhaka',
    'Environmental Management Plan Bangladesh',
    'Sustainability consulting Bangladesh',
    'Green development consultancy Bangladesh',
    'Environmental research Bangladesh',

    // ── Climate & GIS ──────────────────────────────────────────────────────
    'Climate change consultancy Bangladesh',
    'Climate resilience planning Bangladesh',
    'GIS and remote sensing services Bangladesh',
    'GIS remote sensing Bangladesh',
    'climate change adaptation Bangladesh',

    // ── Disaster & Risk ────────────────────────────────────────────────────
    'Disaster risk reduction Bangladesh',
    'Flood vulnerability mapping Bangladesh',
    'River erosion monitoring Bangladesh',
    'flood risk assessment Bangladesh',
    'sea level rise Bangladesh coast',

    // ── Technical ──────────────────────────────────────────────────────────
    'IPCC AR6 Bangladesh',
    'environmental solutions Bangladesh',
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

  // ── Verification ──────────────────────────────────────────────────────────
  verification: {
    google: 'BDNj1pyLaK6p_NcZR2LaCw4IpFxGrO9fPW25h8FThjc',
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
        {/* Favicon — SVG primary, fallbacks for older browsers */}
        <link rel="icon"             href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon"             href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color"     content="#16a34a" />
        {/* ── Structured Data (JSON-LD) ────────────────────────────────── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
            "@id": `${SITE_URL}/#organization`,
            "name": "Green BD Environmental Solutions",
            "alternateName": ["greenbd23", "Green BD", "greenbd23.com", "GreenBD"],
            "url": SITE_URL,
            "logo": { "@type": "ImageObject", "url": `${SITE_URL}/favicon.svg`, "width": 100, "height": 100 },
            "image": `${SITE_URL}/og-image.png`,
            "description": "Leading environmental consultancy in Bangladesh specialising in Environmental Impact Assessment (EIA), Climate Change Adaptation, GIS & Remote Sensing, Disaster Risk Reduction, and Sustainability Consulting.",
            "telephone": "+8801711034941",
            "email": "info@greenbd-env.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "House 12, Road 5, Dhanmondi",
              "addressLocality": "Dhaka",
              "postalCode": "1209",
              "addressCountry": "BD"
            },
            "geo": { "@type": "GeoCoordinates", "latitude": 23.8103, "longitude": 90.4125 },
            "areaServed": { "@type": "Country", "name": "Bangladesh" },
            "priceRange": "$$",
            "knowsAbout": [
              "Environmental Impact Assessment Bangladesh",
              "Climate Change Adaptation",
              "GIS and Remote Sensing",
              "Disaster Risk Reduction Bangladesh",
              "Environmental Management Plans",
              "Flood Vulnerability Mapping Bangladesh",
              "River Erosion Monitoring",
              "Sustainability Consulting Bangladesh",
              "Environmental Compliance Bangladesh",
              "Sea Level Rise Bangladesh",
              "Green Development Bangladesh"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Environmental Consulting Services Bangladesh",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Environmental Impact Assessment (EIA)", "areaServed": "Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Climate Change Consultancy Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GIS & Remote Sensing Services Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Disaster Risk Reduction Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sustainability Consulting Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Environmental Management Plans Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flood Vulnerability Mapping Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "River Erosion Monitoring Bangladesh" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Climate Resilience Planning Bangladesh" } }
              ]
            }
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            "url": SITE_URL,
            "name": "Green BD Environmental Solutions",
            "alternateName": "greenbd23",
            "description": "Leading environmental consultancy in Bangladesh — EIA, GIS, Climate Change, Disaster Risk Reduction & Sustainability.",
            "publisher": { "@id": `${SITE_URL}/#organization` },
            "inLanguage": ["en-BD", "bn"],
            "potentialAction": {
              "@type": "SearchAction",
              "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/?s={search_term_string}` },
              "query-input": "required name=search_term_string"
            }
          }
        ]
      })}} />
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
