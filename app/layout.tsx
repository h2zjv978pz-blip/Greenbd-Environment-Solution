import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import AmbientPlayer   from '@/components/AmbientPlayer';
import SplashScreen    from '@/components/SplashScreen';
import WhatsAppButton  from '@/components/WhatsAppButton';
import { getContact }  from '@/lib/getData';

export const metadata: Metadata = {
  title: 'Green BD Environmental Solutions | Environment & Climate Resilience Bangladesh',
  description:
    'Green BD Environmental Solutions is a leading environmental consultancy in Bangladesh specializing in climate change, GIS/remote sensing, environmental research, disaster risk reduction, and citizen-focused sustainability solutions.',
  keywords:
    'environmental solutions Bangladesh, climate change consultancy, GIS remote sensing Bangladesh, disaster risk reduction, sustainability, environmental research, climate resilience',
  authors: [{ name: 'Green BD Environmental Solutions' }],
  openGraph: {
    title: 'Green BD Environmental Solutions',
    description:
      'Leading environmental consultancy in Bangladesh — climate, GIS, sustainability & resilience.',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = getContact();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
