import type { Metadata } from 'next';
import './globals.css';

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
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
