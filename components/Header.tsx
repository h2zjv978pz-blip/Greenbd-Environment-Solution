'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Leaf, ChevronDown, Newspaper, Scale, Download, Images, Search, ClipboardList, CalendarClock, Handshake, MessageSquare, Video } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const SearchModal = dynamic(() => import('@/components/SearchModal'), { ssr: false });
import type { SiteSettings } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

export default function Header({ settings }: { settings?: SiteSettings }) {
  const { lang, toggleLang } = useLanguage();
  const router = useRouter();
  const tr = t[lang];

  const name            = settings?.companyName        || 'Green BD';
  const sub             = (lang === 'bn' && settings?.tagline_bn) ? settings.tagline_bn : (settings?.tagline || 'Environmental Solutions');
  const logo            = settings?.logo               || '';
  const logoSz          = Number(settings?.logoSizePx)         || 40;
  const mobileSz        = Number(settings?.logoSizeMobilePx)   || 40;
  const showNameMobile  = settings?.showNameMobile  !== false;
  const showTagMobile   = settings?.showTaglineMobile !== false;
  const nameSz          = Number(settings?.nameSizePx)         || 16;
  const nameFont        = settings?.nameFont                   || 'Poppins';
  const nameBold        = settings?.nameBold !== false;
  const tagSz           = Number(settings?.taglineSizePx)      || 10;
  const tagFont         = settings?.taglineFont                || 'Inter';

  const [isMobile,      setIsMobile]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeLink,    setActiveLink]    = useState('#home');
  const [liveInfo,      setLiveInfo]      = useState({ time:'', date:'', temp:'' });
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [contactOpen,   setContactOpen]   = useState(false);
  const [mobileRes,     setMobileRes]     = useState(false);
  const [mobileContact, setMobileContact] = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const resRef     = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const contactLinks = [
    { href: '/contact/consultation', label: 'Request Consultation', icon: ClipboardList, desc: 'Tell us your project needs', color: 'text-emerald-600', bg: 'bg-emerald-100 group-hover:bg-emerald-600' },
    { href: '/contact/meeting',      label: 'Book Online Meeting',  icon: CalendarClock, desc: 'Schedule a call with our team', color: 'text-blue-600',    bg: 'bg-blue-100 group-hover:bg-blue-600'    },
    { href: '/contact/partner',      label: 'Partner With Us',      icon: Handshake,     desc: 'Explore collaboration opportunities', color: 'text-purple-600', bg: 'bg-purple-100 group-hover:bg-purple-600' },
    { href: '/#contact',             label: 'General Contact',      icon: MessageSquare, desc: 'Send us a message', color: 'text-gray-600', bg: 'bg-gray-100 group-hover:bg-gray-500' },
  ];

  const resourceLinks = [
    { href: '/resources/blog',      label: 'Blog / News',          icon: Newspaper, desc: 'Articles & latest news'       },
    { href: '/resources/laws',      label: 'Environmental Laws',   icon: Scale,     desc: 'Bangladesh legal framework'   },
    { href: '/resources/downloads', label: 'Downloads / Guides',  icon: Download,  desc: 'Reports, toolkits & manuals'  },
    { href: '/resources/gallery',   label: 'Images',               icon: Images,    desc: 'Photo gallery'                },
    { href: '/resources/video',     label: 'Videos',               icon: Video,     desc: 'Watch our video library'      },
  ];

  const navLinks = [
    { label: tr.nav.home,       href: '#home'        },
    { label: tr.nav.about,      href: '#about'       },
    { label: tr.nav.services,   href: '#services'    },
    { label: tr.nav.projects,   href: '#projects'    },
    { label: tr.nav.research,   href: '#research'    },
    { label: tr.nav.climateMap, href: '#climate-map' },
    { label: tr.nav.team,       href: '#team'        },
    { label: tr.nav.clients,    href: '#clients'     },
  ];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Live time + date (updates every second)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLiveInfo(prev => ({
        ...prev,
        time: new Intl.DateTimeFormat('en-US', { timeZone:'Asia/Dhaka', hour12:true, hour:'numeric', minute:'2-digit', second:'2-digit' }).format(now),
        date: new Intl.DateTimeFormat('en-US', { timeZone:'Asia/Dhaka', month:'short', day:'numeric', year:'numeric' }).format(now),
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Live temperature (refreshed every 15 min)
  useEffect(() => {
    const fetchTemp = () =>
      fetch('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current_weather=true&temperature_unit=celsius')
        .then(r => r.json())
        .then(d => {
          const t = d.current_weather?.temperature;
          const c = d.current_weather?.weathercode ?? 0;
          const wx = c === 0 ? '☀️' : c <= 3 ? '⛅' : c <= 55 ? '🌦' : '🌧';
          if (t != null) setLiveInfo(prev => ({ ...prev, temp: `${wx} ${t.toFixed(1)}°C` }));
        }).catch(() => {});
    fetchTemp();
    const id = setInterval(fetchTemp, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resRef.current     && !resRef.current.contains(e.target as Node))     setResourcesOpen(false);
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) setContactOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = (href: string) => {
    setActiveLink(href);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const headerH = window.innerWidth < 1024 ? 64 : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'
      }`}
      style={banglaFont}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo — links to homepage from any page */}
        <Link href="/" className="flex items-center gap-2 group" aria-label={`${name} — Home`}>
          {/* Logo — size controlled per device via admin settings */}
          {(() => { const sz = isMobile ? mobileSz : logoSz; return (
          <div
            className="bg-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-primary-700 transition-colors overflow-hidden flex-shrink-0"
            style={{ width: sz, height: sz, minWidth: sz }}
          >
            <img
              src={logo || '/favicon.svg'}
              alt={name}
              className="w-full h-full object-contain"
              onError={e => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = '/favicon.svg';
              }}
            />
          </div>
          ); })()}
          <div className="text-left">
            {(!isMobile || showNameMobile) && (
            <span
              className={`block leading-tight transition-colors ${scrolled ? 'text-primary-700' : 'text-white drop-shadow'}`}
              style={{ fontFamily: nameFont, fontSize: nameSz, fontWeight: nameBold ? 700 : 400 }}
            >
              {name}
            </span>
            )}
            {(!isMobile || showTagMobile) && (
            <span
              className={`block tracking-wide leading-tight transition-colors ${scrolled ? 'text-gray-500' : 'text-green-200'}`}
              style={{ fontFamily: tagFont, fontSize: tagSz }}
            >
              {sub}
            </span>
            )}
            {/* Live time · date · temperature — one line, left-aligned */}
            {liveInfo.time && (
              <span className={`flex items-center gap-1.5 mt-2 flex-wrap transition-colors ${scrolled ? 'text-gray-500' : 'text-green-200/80'}`}
                style={{ fontSize: 10, fontFamily: 'Inter, monospace', fontWeight: 500, lineHeight: 1.4 }}>
                <span className={scrolled ? 'text-primary-500' : 'text-green-300'}>{liveInfo.time} BST</span>
                <span className="opacity-40">·</span>
                <span>{liveInfo.date}</span>
                {liveInfo.temp && <>
                  <span className="opacity-40">·</span>
                  <span className={scrolled ? 'text-amber-500' : 'text-amber-300'}>{liveInfo.temp}</span>
                </>}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`nav-link text-sm font-medium transition-colors ${
                activeLink === link.href
                  ? 'text-primary-600'
                  : scrolled
                  ? 'text-gray-700 hover:text-primary-600'
                  : 'text-white hover:text-green-300'
              } ${activeLink === link.href ? 'active' : ''}`}
            >
              {link.label}
            </button>
          ))}

          {/* Resources Dropdown */}
          <div className="relative" ref={resRef}>
            <button
              onClick={() => setResourcesOpen(o => !o)}
              className={`flex items-center gap-1 nav-link text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-green-300'
              }`}
            >
              Resources
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50" style={{ width: 'min(288px, calc(100vw - 2rem))' }}>
                <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700">
                  <p className="text-white font-bold text-sm">Resources</p>
                  <p className="text-green-200 text-xs">Guides, laws & media</p>
                </div>
                {resourceLinks.map(r => {
                  const Icon = r.icon;
                  return (
                    <Link key={r.href} href={r.href} onClick={() => setResourcesOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors group border-b border-gray-50 last:border-0">
                      <div className="w-9 h-9 bg-primary-100 group-hover:bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-700">{r.label}</p>
                        <p className="text-xs text-gray-400">{r.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact Dropdown */}
          <div className="relative" ref={contactRef}>
            <button
              onClick={() => setContactOpen(o => !o)}
              className={`flex items-center gap-1 nav-link text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-green-300'
              }`}
            >
              {tr.nav.contact}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${contactOpen ? 'rotate-180' : ''}`} />
            </button>

            {contactOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50" style={{ width: 'min(300px, calc(100vw - 2rem))' }}>
                <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg,#052e16,#15803d)' }}>
                  <p className="text-white font-bold text-sm">Get In Touch</p>
                  <p className="text-green-200 text-xs">Choose how you&apos;d like to connect</p>
                </div>
                {contactLinks.map(c => {
                  const Icon = c.icon;
                  const isInternal = c.href.startsWith('/#');
                  const handleClick = () => {
                    setContactOpen(false);
                    if (isInternal) {
                      const hash = c.href.replace(/^\//, '');
                      if (window.location.pathname !== '/') { window.location.href = c.href; }
                      else { document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }); }
                    }
                  };
                  return isInternal ? (
                    <button key={c.href} onClick={handleClick}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0 text-left">
                      <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}>
                        <Icon className={`w-4 h-4 ${c.color} group-hover:text-white transition-colors`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                        <p className="text-xs text-gray-400">{c.desc}</p>
                      </div>
                    </button>
                  ) : (
                    <Link key={c.href} href={c.href} onClick={() => setContactOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0">
                      <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}>
                        <Icon className={`w-4 h-4 ${c.color} group-hover:text-white transition-colors`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                        <p className="text-xs text-gray-400">{c.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            title="Search (Ctrl+K)"
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all group ${
              scrolled
                ? 'border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 bg-gray-50 hover:bg-primary-50'
                : 'border-white/30 text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Search</span>
            <kbd className={`hidden xl:inline text-[9px] px-1.5 py-0.5 rounded font-mono border ${scrolled ? 'bg-white border-gray-200 text-gray-400' : 'bg-white/10 border-white/20 text-white/60'}`}>
              ⌘K
            </kbd>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            title={lang === 'en' ? 'Switch to Bangla' : 'Switch to English'}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              scrolled
                ? 'border-primary-300 text-primary-700 hover:bg-primary-50'
                : 'border-white/50 text-white hover:bg-white/10'
            }`}
          >
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>

          <button
            onClick={() => handleNav('#contact')}
            className="ml-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all hover:shadow-md"
          >
            {tr.getInTouch}
          </button>
        </nav>

        {/* Mobile: Search + Language Toggle + Hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <button onClick={() => setSearchOpen(true)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl ${scrolled ? 'text-gray-600' : 'text-white'}`} aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={toggleLang}
            className={`text-xs font-semibold px-3 py-2 rounded-full border transition-all min-h-[44px] ${
              scrolled ? 'border-primary-300 text-primary-700' : 'border-white/50 text-white'
            }`}
          >
            {lang === 'en' ? 'বাং' : 'EN'}
          </button>
          <button
            className={`w-11 h-11 flex items-center justify-center rounded-xl ${scrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl" style={banglaFont}>
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`text-left px-4 py-3.5 rounded-lg text-sm font-medium transition-colors min-h-[48px] ${
                  activeLink === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Resources */}
            <button
              onClick={() => setMobileRes(o => !o)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Resources</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileRes ? 'rotate-180' : ''}`} />
            </button>
            {mobileRes && (
              <div className="ml-4 space-y-1">
                {resourceLinks.map(r => {
                  const Icon = r.icon;
                  return (
                    <Link key={r.href} href={r.href} onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                      <Icon className="w-4 h-4 flex-shrink-0 text-primary-500" />
                      {r.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Mobile Contact */}
            <button
              onClick={() => setMobileContact(o => !o)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{tr.nav.contact}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileContact ? 'rotate-180' : ''}`} />
            </button>
            {mobileContact && (
              <div className="ml-4 space-y-1">
                {contactLinks.map(c => {
                  const Icon = c.icon;
                  const isInternal = c.href.startsWith('/#');
                  return isInternal ? (
                    <button key={c.href}
                      onClick={() => { setMenuOpen(false); const hash = c.href.replace(/^\//, ''); if (window.location.pathname !== '/') { window.location.href = c.href; } else { document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }); } }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 ${c.color}`} />{c.label}
                    </button>
                  ) : (
                    <Link key={c.href} href={c.href} onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 ${c.color}`} />{c.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => { setMenuOpen(false); router.push('/contact/consultation'); }}
              className="mt-2 bg-primary-600 text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {tr.getInTouch}
            </button>
          </nav>
        </div>
      )}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
