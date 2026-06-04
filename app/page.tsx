import {
  getHero, getProjects, getServices, getAbout,
  getStats, getTeam, getClients, getResearch, getContact, getSettings,
} from '@/lib/getData';
import { readData } from '@/lib/data';
import JsonLd from '@/components/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Green BD Environmental Solutions | EIA, GIS & Climate Consultancy Bangladesh',
  alternates: { canonical: 'https://greenbd23.com' },
};
import Header         from '@/components/Header';
import Hero           from '@/components/Hero';
import Projects       from '@/components/Projects';
import About          from '@/components/About';
import Services       from '@/components/Services';
import Stats          from '@/components/Stats';
import ClimateMapSection from '@/components/ClimateMapSection';
import Research       from '@/components/Research';
import Team           from '@/components/Team';
import Clients        from '@/components/Clients';
import ContactCTA     from '@/components/ContactCTA';
import Footer         from '@/components/Footer';

export const dynamic = 'force-dynamic';

interface MobileSettings {
  sections?:   Record<string, boolean>;
  typography?: { headingSize?:string; bodySize?:string; textAlign?:string; lineHeight?:string; buttonSize?:string; sectionSpacing?:string };
  layout?:     { projectColumns?:string; servicesColumns?:string };
}

// Helper: wraps a section in a div that is hidden on mobile if the admin toggled it off
function Section({ id, visible, children }: { id: string; visible: boolean; children: React.ReactNode }) {
  if (visible) return <>{children}</>;
  // Hidden on mobile (< 768px), always shown on md+
  return <div className="hidden md:block">{children}</div>;
}

export default function Home() {
  const hero     = getHero();
  const projects = getProjects();
  const services = getServices();
  const about    = getAbout();
  const stats    = getStats();
  const team     = getTeam();
  const clients  = getClients();
  const research = getResearch();
  const contact  = getContact();
  const settings = getSettings();

  // Mobile settings
  const ms  = readData<MobileSettings>('mobileSettings');
  const sec = ms.sections   ?? {};
  const ty  = ms.typography ?? {};
  const show = (key: string) => sec[key] !== false;

  // Map settings to CSS values
  const headingPx: Record<string,string> = { xs:'0.75rem',sm:'0.875rem',base:'1rem',xl:'1.25rem','2xl':'1.5rem','3xl':'1.875rem' };
  const bodyPx:    Record<string,string> = { xs:'0.6875rem',sm:'0.8125rem',base:'0.875rem',lg:'1rem' };
  const lhMap:     Record<string,string> = { tight:'1.3',normal:'1.6',relaxed:'1.8',loose:'2' };
  const spaceMap:  Record<string,string> = { compact:'3rem',normal:'5rem',spacious:'7rem' };
  const btnPad:    Record<string,string> = { sm:'0.4rem 1rem',base:'0.6rem 1.5rem',lg:'0.75rem 2rem',xl:'0.9rem 2.5rem' };

  // Sub-section visibility rules
  const mdMessageHidden = sec['mdMessage'] === false;

  const mobileCSS = `
@media (max-width: 767px) {
  ${mdMessageHidden ? '.md-message-section { display: none !important; }' : ''}
  :root {
    --m-heading: ${headingPx[ty.headingSize??'xl']    ?? '1.6rem'};
    --m-body:    ${bodyPx[ty.bodySize??'base']         ?? '0.875rem'};
    --m-lh:      ${lhMap[ty.lineHeight??'normal']      ?? '1.6'};
    --m-space:   ${spaceMap[ty.sectionSpacing??'normal']?? '5rem'};
    --m-align:   ${ty.textAlign ?? 'center'};
    --m-btn-pad: ${btnPad[ty.buttonSize??'lg']         ?? '0.75rem 2rem'};
  }
  section:not(#home) { padding-top: var(--m-space); padding-bottom: var(--m-space); }
  .hero-heading { font-size: var(--m-heading) !important; line-height: 1.25 !important; }
  .section-title { font-size: var(--m-heading) !important; text-align: var(--m-align) !important; }
  p, .text-gray-500, .text-gray-600 { font-size: var(--m-body); line-height: var(--m-lh); }
  #about p, #about h2, #about h3, #about span { text-align: left !important; }
  .btn-primary, .btn-outline { padding: var(--m-btn-pad) !important; }
  .text-center { text-align: var(--m-align) !important; }
}`;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'EnvironmentalOrganization'],
        '@id': 'https://greenbd23.com/#organization',
        name: 'Green BD Environmental Solutions',
        alternateName: ['Green BD', 'GreenBD', 'greenbd23', 'Green BD Environmental'],
        url: 'https://greenbd23.com',
        logo: { '@type': 'ImageObject', url: 'https://greenbd23.com/logo.png' },
        description: 'Leading environmental consultancy in Bangladesh specialising in EIA, GIS, Climate Change Research and Disaster Risk Reduction.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House 12, Road 5, Dhanmondi',
          addressLocality: 'Dhaka',
          addressRegion: 'Dhaka Division',
          postalCode: '1209',
          addressCountry: 'BD',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+880-1845160729',
          contactType: 'customer service',
          availableLanguage: ['English', 'Bengali'],
        },
        areaServed: { '@type': 'Country', name: 'Bangladesh' },
        foundingDate: '2009',
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 20 },
        sameAs: [
          'https://www.facebook.com/greenbd',
          'https://www.linkedin.com/company/greenbd',
        ],
        knowsAbout: [
          'Environmental Impact Assessment',
          'GIS Remote Sensing',
          'Climate Change Adaptation',
          'Disaster Risk Reduction',
          'Sustainability Consulting',
          'Bangladesh Environment',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://greenbd23.com/#website',
        url: 'https://greenbd23.com',
        name: 'Green BD Environmental Solutions',
        publisher: { '@id': 'https://greenbd23.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: 'https://greenbd23.com/?q={search_term_string}' },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://greenbd23.com/#webpage',
        url: 'https://greenbd23.com',
        name: 'Green BD Environmental Solutions | EIA, GIS & Climate Consultancy Bangladesh',
        isPartOf: { '@id': 'https://greenbd23.com/#website' },
        about: { '@id': 'https://greenbd23.com/#organization' },
        inLanguage: 'en-BD',
      },
    ],
  };

  return (
    <main>
      <JsonLd data={orgSchema} />
      {/* Mobile typography/spacing CSS variables */}
      <style dangerouslySetInnerHTML={{ __html: mobileCSS }} />
      <Header settings={settings} />
      <Section id="hero"       visible={show('hero')}      ><Hero        slides={hero.slides} /></Section>
      <Section id="about"      visible={show('about')}     ><About       data={about} /></Section>
      <Section id="services"   visible={show('services')}  ><Services    services={services.services} /></Section>
      <Section id="projects"   visible={show('projects')}  ><Projects    projects={projects.projects} /></Section>
      <Section id="stats"      visible={show('stats')}     ><Stats       stats={stats.stats} /></Section>
      <Section id="climateMap" visible={show('climateMap')}><ClimateMapSection /></Section>
      <Section id="research"   visible={show('research')}  ><Research    publications={research.publications} /></Section>
      <Section id="team"       visible={show('team')}      ><Team        members={team.members} /></Section>
      <Section id="clients"    visible={show('clients')}   ><Clients     clients={clients.clients} testimonials={clients.testimonials} /></Section>
      <Section id="contact"    visible={show('contact')}   ><ContactCTA  contact={contact} /></Section>
      <Footer settings={settings} />
    </main>
  );
}
