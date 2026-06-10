'use client';

import { Leaf, Facebook, Twitter, Linkedin, ArrowUp, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

// Real social URLs — update these when you have the actual accounts.
const socials = [
  { icon: Facebook, href: 'https://www.facebook.com/greenbdenvironmental',  label: 'Facebook', external: true },
  { icon: Twitter,  href: 'https://twitter.com/greenbd_env',                label: 'Twitter',  external: true },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/green-bd',      label: 'LinkedIn', external: true },
];

// Real internal hrefs, ordered to match the tr.links[column] arrays in translations.ts.
// Services (6), Company (6), Resources (6) — same order as the label arrays.
const FOOTER_HREFS = {
  Services: [
    '/#services',   // Environmental Impact Assessment
    '/#services',   // GIS & Remote Sensing
    '/#research',   // Climate Change Research
    '/#services',   // Disaster Risk Reduction
    '/#services',   // Environmental Monitoring
    '/#services',   // Sustainability Consulting
  ],
  Company: [
    '/#about',              // About Us
    '/#team',               // Our Team
    '/#projects',           // Projects
    '/#research',           // Research & Publications
    '/resources/blog',      // News & Events
    '/contact/consultation',// Careers
  ],
  Resources: [
    '/resources/blog',      // Knowledge Hub
    '/resources/downloads', // Open Data
    '/resources/downloads', // Policy Briefs
    '/resources/downloads', // Annual Reports
    '/resources/gallery',   // Media Gallery
    '/resources/blog',      // FAQs
  ],
} as const;

const COLUMN_KEYS = ['Services', 'Company', 'Resources'] as const;

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const { lang } = useLanguage();
  const tr = t[lang].footer;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const name      = settings?.companyName  || 'Green BD';
  const sub       = (lang === 'bn' && settings?.tagline_bn) ? settings.tagline_bn : (settings?.tagline || 'Environmental Solutions');
  const logo      = settings?.logo         || '';
  const footerTxt = (lang === 'bn' && settings?.footerText_bn) ? settings.footerText_bn : (settings?.footerText || 'Building climate resilience, advancing environmental research, and empowering communities across Bangladesh through science-led solutions since 2009.');
  const copyright = settings?.copyrightName || 'Green BD Environmental Solutions';

  return (
    <footer className="bg-gray-950 text-gray-300" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8 pt-8 md:pt-16 pb-6 md:pb-8">

        {/* ── Mobile: compact brand + socials row ── */}
        <div className="flex items-center justify-between mb-5 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {logo ? <img src={logo} alt={name} className="w-full h-full object-cover" /> : <Leaf className="w-5 h-5 text-white" />}
            </div>
            <div>
              <span className="block text-white font-bold font-heading text-sm leading-tight">{name}</span>
              <span className="block text-green-400 text-[9px] font-medium tracking-wide">{sub}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Mobile: description line ── */}
        <p className="text-gray-400 text-xs leading-relaxed mb-4 md:hidden line-clamp-2">{footerTxt}</p>

        {/* ── Mobile: link columns 2-col grid, desktop: full layout ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-0 md:gap-10 mb-5 md:mb-12">

          {/* Brand column — desktop only */}
          <div className="hidden md:block lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center overflow-hidden">
                {logo ? <img src={logo} alt={name} className="w-full h-full object-cover" /> : <Leaf className="w-6 h-6 text-white" />}
              </div>
              <div>
                <span className="block text-white font-bold font-heading leading-tight">{name}</span>
                <span className="block text-green-400 text-[10px] font-medium tracking-wide">{sub}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">{footerTxt}</p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — 2-col grid on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:contents gap-x-4 gap-y-4 md:gap-0 lg:gap-10">
            {COLUMN_KEYS.map((key) => (
              <div key={key} className="md:block">
                <h4 className="text-white font-semibold font-heading text-xs md:text-sm mb-2 md:mb-4 uppercase tracking-wider">{tr.columns[key]}</h4>
                <ul className="space-y-1 md:space-y-2">
                  {tr.links[key].map((link, i) => (
                    <li key={link}>
                      <Link href={FOOTER_HREFS[key][i]} className="text-gray-400 hover:text-green-400 text-xs md:text-sm transition-colors duration-200 block">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter — compact on mobile */}
        <div className="bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 mb-5 md:mb-10">
          <p className="text-white font-semibold text-sm md:text-base mb-1">{tr.newsletterTitle}</p>
          <p className="text-gray-400 text-xs md:text-sm mb-3 hidden sm:block">{tr.newsletterDesc}</p>
          <div className="flex gap-2">
            <input type="email" placeholder={tr.emailPlaceholder}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
            <button className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs md:text-sm px-4 py-2 rounded-xl transition-colors flex-shrink-0">
              {tr.subscribe}
            </button>
          </div>
        </div>

        {/* Live clock strip */}
        <FooterClock />

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} {copyright}. {tr.allRights}. | {tr.registeredIn}.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/contact/consultation" className="hover:text-gray-300 transition-colors">{tr.privacyPolicy}</Link>
            <Link href="/contact/consultation" className="hover:text-gray-300 transition-colors">{tr.terms}</Link>
            <a href="/sitemap.xml" className="hover:text-gray-300 transition-colors">{tr.sitemap}</a>
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

// ── Inline footer clock component ────────────────────────────────────────────
function FooterClock() {
  const [time, setTime]  = useState('');
  const [date, setDate]  = useState('');
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka', hour12: true,
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }).format(now));
      setDate(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka', weekday: 'long',
        month: 'long', day: 'numeric', year: 'numeric',
      }).format(now));
      setBlink(b => !b);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div className="border-t border-gray-800 py-4 mb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <Clock className="w-3.5 h-3.5 text-primary-500" />
        <span className="font-medium">Dhaka Office Time</span>
        <span className="text-primary-500 font-semibold text-[10px] bg-primary-500/10 px-2 py-0.5 rounded-full">BST · UTC+6</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs">{date}</span>
        <span className="font-mono font-bold text-white text-sm tracking-wide tabular-nums">{time}</span>
      </div>
    </div>
  );
}
