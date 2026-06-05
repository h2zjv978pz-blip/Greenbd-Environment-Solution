import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Online Meeting — Environmental Experts Bangladesh',
  description: 'Schedule an online meeting with Green BD Environmental Solutions experts. Book a video call, phone consultation or team meeting about EIA, GIS, Climate Change or Sustainability projects in Bangladesh.',
  keywords: [
    'book environmental consulting meeting Bangladesh',
    'schedule EIA consultation Bangladesh',
    'online meeting environmental consultant Dhaka',
    'Green BD meeting booking',
    'environmental expert online call Bangladesh',
  ],
  alternates: { canonical: '/contact/meeting' },
  openGraph: {
    title:       'Book Online Meeting | Green BD Environmental Solutions',
    description: 'Schedule a video call or phone consultation with our environmental experts — EIA, GIS, Climate Change and Sustainability services in Bangladesh.',
    type:        'website',
    url:         'https://greenbd23.com/contact/meeting',
  },
  twitter: {
    card:        'summary',
    title:       'Book Online Meeting | Green BD',
    description: 'Schedule a call with Green BD Environmental Solutions experts — EIA, GIS, Climate Change consulting in Bangladesh.',
  },
};

export default function MeetingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
