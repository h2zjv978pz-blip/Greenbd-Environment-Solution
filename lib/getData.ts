import { readData } from './data';

export const getHero    = () => readData<{ slides: HeroSlide[] }>('hero');
export const getProjects= () => readData<{ projects: Project[] }>('projects');
export const getServices= () => readData<{ services: Service[] }>('services');
export const getAbout   = () => readData<AboutData>('about');
export const getStats   = () => readData<{ stats: Stat[] }>('stats');
export const getTeam    = () => readData<{ members: TeamMember[] }>('team');
export const getClients = () => readData<{ clients: Client[]; testimonials: Testimonial[] }>('clients');
export const getResearch= () => readData<{ publications: Publication[] }>('research');
export const getContact = () => readData<ContactData>('contact');

// ── Types ────────────────────────────────────────────────────────────────
export interface HeroSlide {
  id: number; image: string; title: string; subtitle: string; desc: string;
}
export interface Project {
  id: number;
  title: string;
  category: string;
  clientName: string;
  location: string;
  projectTime: string;
  description: string;
  image: string;
  galleryImages: string[];
  additionalImages: string[];
}
export interface Service {
  id: number; icon: string; title: string; desc: string; color: string;
}
export interface AboutData {
  heading: string; para1: string; para2: string; image: string;
  yearsExperience: number; projectsCompleted: number; highlights: string[];
}
export interface Stat {
  id: number; value: number; suffix: string; label: string; desc: string;
}
export interface TeamMember {
  id: number; name: string; role: string; expertise: string; image: string;
}
export interface Client {
  id: number; name: string; abbr: string; color: string;
}
export interface Testimonial {
  id: number; name: string; role: string; text: string; rating: number;
}
export interface Publication {
  id: number; title: string; journal: string; year: string; tags: string[]; abstract: string;
}
export interface ContactData {
  address: string; phone: string; email: string; mapLabel: string;
  ctaTitle: string; ctaDesc: string; formTitle: string; formDesc: string; subjects: string[];
}
