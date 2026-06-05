import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Environmental Consultation',
  description: 'Request an expert environmental consultation with Green BD Environmental Solutions in Dhaka, Bangladesh. We specialise in EIA, Climate Change, GIS, Disaster Risk Reduction and Sustainability Consulting.',
  keywords: [
    'environmental consultation Bangladesh',
    'EIA consultant Dhaka',
    'environmental consultant Bangladesh',
    'request EIA assessment Bangladesh',
    'Green BD consultation',
    'climate change consultancy Bangladesh',
    'environmental assessment Bangladesh',
  ],
  alternates: { canonical: '/contact/consultation' },
  openGraph: {
    title:       'Request Environmental Consultation | Green BD Environmental Solutions',
    description: 'Get expert environmental consulting — EIA, GIS, Climate Change, Disaster Risk Reduction and Sustainability services across Bangladesh.',
    type:        'website',
    url:         'https://greenbd23.com/contact/consultation',
  },
  twitter: {
    card:        'summary',
    title:       'Request Environmental Consultation | Green BD',
    description: 'Expert EIA, GIS & Climate Change consulting — request a consultation with Green BD Environmental Solutions in Bangladesh.',
  },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
