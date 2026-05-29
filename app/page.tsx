import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import Research from '@/components/Research';
import Team from '@/components/Team';
import Clients from '@/components/Clients';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Projects />
      <About />
      <Services />
      <Stats />
      <Research />
      <Team />
      <Clients />
      <ContactCTA />
      <Footer />
    </main>
  );
}
