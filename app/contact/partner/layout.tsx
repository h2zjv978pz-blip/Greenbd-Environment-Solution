import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner With Us — Environmental Collaboration Bangladesh',
  description: 'Partner with Green BD Environmental Solutions for research collaboration, NGO programmes, academic partnerships, government advisory, or corporate sustainability projects in Bangladesh.',
  keywords: [
    'environmental partnership Bangladesh',
    'research collaboration Bangladesh environment',
    'NGO environmental partnership Bangladesh',
    'sustainability partnership Dhaka',
    'Green BD partner',
    'corporate CSR environment Bangladesh',
    'academic environmental research Bangladesh',
  ],
  alternates: { canonical: '/contact/partner' },
  openGraph: {
    title:       'Partner With Us | Green BD Environmental Solutions',
    description: 'Join Green BD in building a sustainable Bangladesh — research, NGO, government, academic and corporate sustainability partnerships.',
    type:        'website',
    url:         'https://greenbd23.com/contact/partner',
  },
  twitter: {
    card:        'summary',
    title:       'Partner With Green BD | Environmental Solutions Bangladesh',
    description: 'Collaborate with Green BD Environmental Solutions on research, NGO, academic, policy and corporate sustainability programmes in Bangladesh.',
  },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
