'use client';

import { Leaf, Facebook, Twitter, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import type { SiteSettings } from '@/lib/getData';

const footerLinks = {
  Services: [
    'Environmental Impact Assessment',
    'GIS & Remote Sensing',
    'Climate Change Research',
    'Disaster Risk Reduction',
    'Environmental Monitoring',
    'Sustainability Consulting',
  ],
  Company: ['About Us', 'Our Team', 'Projects', 'Research & Publications', 'News & Events', 'Careers'],
  Resources: ['Knowledge Hub', 'Open Data', 'Policy Briefs', 'Annual Reports', 'Media Gallery', 'FAQs'],
};

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const name      = settings?.companyName  || 'Green BD';
  const sub       = settings?.tagline      || 'Environmental Solutions';
  const logo      = settings?.logo         || '';
  const footerTxt = settings?.footerText   || 'Building climate resilience, advancing environmental research, and empowering communities across Bangladesh through science-led solutions since 2009.';
  const copyright = settings?.copyrightName|| 'Green BD Environmental Solutions';
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center overflow-hidden">
                {logo
                  ? <img src={logo} alt={name} className="w-full h-full object-cover" />
                  : <Leaf className="w-6 h-6 text-white" />}
              </div>
              <div>
                <span className="block text-white font-bold font-heading leading-tight">{name}</span>
                <span className="block text-green-400 text-[10px] font-medium tracking-wide">{sub}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">{footerTxt}</p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold font-heading text-sm mb-4">{heading}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold font-heading">Stay Updated on Environmental Developments</p>
            <p className="text-gray-400 text-sm">Subscribe to our newsletter for research updates, project news, and climate insights.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <button className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} {copyright}. All rights reserved. | Registered in Bangladesh.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Sitemap</a>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 rounded-lg bg-primary-600 hover:bg-primary-500 flex items-center justify-center text-white transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
