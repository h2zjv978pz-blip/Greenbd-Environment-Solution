import type { Metadata } from 'next';
import {
  getHero, getProjects, getServices, getAbout,
  getStats, getTeam, getClients, getResearch, getContact, getSettings,
} from '@/lib/getData';
import { readData } from '@/lib/data';
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

const SITE = 'https://greenbd23.com';

export const metadata: Metadata = {
  title: 'Green BD Environmental Solutions | EIA, Climate & GIS Consultancy Bangladesh',
  description: 'Leading environmental consultancy in Dhaka, Bangladesh. Expert Environmental Impact Assessment (EIA), GIS & Remote Sensing, Climate Change Consultancy, Disaster Risk Reduction, and Sustainability Consulting since 2009. Request a free consultation today.',
  alternates: { canonical: SITE + '/' },
  openGraph: {
    title: 'Green BD Environmental Solutions | EIA, Climate & GIS Consultancy Bangladesh',
    description: 'Expert EIA, GIS & Remote Sensing, Climate Change Consultancy, and Disaster Risk Reduction services across Bangladesh since 2009.',
    url: SITE + '/',
    type: 'website',
  },
};

interface MobileSettings {
  sections?:   Record<string, boolean>;
  typography?: { headingSize?:string; bodySize?:string; textAlign?:string; lineHeight?:string; buttonSize?:string; sectionSpacing?:string };
  layout?:     { projectColumns?:string; servicesColumns?:string };
}

// Helper: wraps a section in a div that is hidden on mobile if the admin toggled it off
function Section({ visible, children }: { id?: string; visible: boolean; children: React.ReactNode }) {
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

  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What environmental consulting services does Green BD offer in Bangladesh?',
        acceptedAnswer: { '@type': 'Answer', text: 'Green BD Environmental Solutions provides Environmental Impact Assessment (EIA), GIS & Remote Sensing, Climate Change Research, Disaster Risk Reduction, Environmental Monitoring, and Sustainability Consulting across Bangladesh.' } },
      { '@type': 'Question', name: 'How do I get an EIA (Environmental Impact Assessment) done in Bangladesh?',
        acceptedAnswer: { '@type': 'Answer', text: 'Contact Green BD Environmental Solutions in Dhaka. With 15+ years of experience we conduct EIAs for government, industrial, and infrastructure projects nationwide. Book a free consultation online at greenbd23.com.' } },
      { '@type': 'Question', name: 'Where is Green BD Environmental Solutions located?',
        acceptedAnswer: { '@type': 'Answer', text: 'Green BD is headquartered in Dhaka, Bangladesh and delivers projects across the whole country, with deep expertise in climate-sensitive regions including coastal, haor, and riverine areas.' } },
      { '@type': 'Question', name: 'Does Green BD provide GIS mapping and remote sensing services?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. We provide GIS mapping, satellite image analysis, remote sensing, flood vulnerability mapping, land-use mapping, and river erosion monitoring throughout Bangladesh.' } },
      { '@type': 'Question', name: 'What climate change adaptation services are available in Bangladesh?',
        acceptedAnswer: { '@type': 'Answer', text: 'Green BD offers Climate Change Adaptation and Mitigation planning, disaster risk reduction, sea-level rise analysis, vulnerability assessments, and climate resilience planning for organisations and communities across Bangladesh.' } },
    ],
  };

  const serviceListSchema = services.services.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'Environmental Consulting Services — Green BD Bangladesh',
    itemListElement: services.services.map((svc, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Service', name: svc.title, description: svc.desc,
        provider: { '@type': 'Organization', name: 'Green BD Environmental Solutions', url: SITE } },
    })),
  } : null;

  return (
    <main>
      {/* Mobile typography/spacing CSS variables */}
      <style dangerouslySetInnerHTML={{ __html: mobileCSS }} />
      {/* ── Rich-snippet schemas (FAQ + Service list) ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {serviceListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }} />}
      <Header settings={settings} />
      <Section id="hero"       visible={show('hero')}      ><Hero        slides={hero.slides} /></Section>
      <Section id="about"      visible={show('about')}     ><About       data={about} /></Section>
      <Section id="services"   visible={show('services')}  ><Services    services={services.services} /></Section>
      <Section id="projects"   visible={show('projects')}  ><Projects    projects={projects.projects.filter(p => !p.hidden)} /></Section>
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
