import {
  getHero, getProjects, getServices, getAbout,
  getStats, getTeam, getClients, getResearch, getContact, getSettings,
} from '@/lib/getData';
import Header      from '@/components/Header';
import Hero        from '@/components/Hero';
import Projects    from '@/components/Projects';
import About       from '@/components/About';
import Services    from '@/components/Services';
import Stats       from '@/components/Stats';
import Research    from '@/components/Research';
import Team        from '@/components/Team';
import Clients     from '@/components/Clients';
import ContactCTA  from '@/components/ContactCTA';
import Footer      from '@/components/Footer';

export const dynamic = 'force-dynamic'; // always re-reads JSON files

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

  return (
    <main>
      <Header settings={settings} />
      <Hero        slides={hero.slides} />
      <Projects    projects={projects.projects} />
      <About       data={about} />
      <Services    services={services.services} />
      <Stats       stats={stats.stats} />
      <Research    publications={research.publications} />
      <Team        members={team.members} />
      <Clients     clients={clients.clients} testimonials={clients.testimonials} />
      <ContactCTA  contact={contact} />
      <Footer settings={settings} />
    </main>
  );
}
