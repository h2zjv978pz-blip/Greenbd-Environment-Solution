import { readData } from './data';

export const getHero    = () => readData<{ slides: HeroSlide[] }>('hero');
export const getProjects= () => readData<{ projects: Project[] }>('projects');
export const getServices= () => readData<{ services: Service[] }>('services');
export const getAbout   = () => readData<AboutData>('about');
export const getStats   = () => readData<{ stats: Stat[] }>('stats');
export const getTeam    = () => readData<{ members: TeamMember[] }>('team');
export const getClients = () => readData<{ clients: Client[]; testimonials: Testimonial[] }>('clients');
export const getResearch= () => readData<{ publications: Publication[] }>('research');
export const getContact  = () => readData<ContactData>('contact');
export const getSettings = () => readData<SiteSettings>('settings');

// ── Types ────────────────────────────────────────────────────────────────
export interface HeroSlide {
  id: number; image: string;
  title: string; subtitle: string; desc: string;
  title_bn?: string; subtitle_bn?: string; desc_bn?: string;
}
export interface Project {
  id: number;
  title: string; title_bn?: string;
  category: string;
  clientName: string;
  location: string; location_bn?: string;
  projectTime: string;
  description: string; description_bn?: string;
  image: string;
  galleryImages: string[];
  additionalImages: string[];
}
export interface Service {
  id: number; icon: string; color: string;
  title: string; title_bn?: string;
  desc: string; desc_bn?: string;
}
export interface AboutMDMessage {
  name: string; name_bn?: string;
  title: string; title_bn?: string;
  message: string; message_bn?: string;
  image: string;
}
export interface AboutExpert {
  id: number;
  name: string; name_bn?: string;
  role: string; role_bn?: string;
  specialty: string; specialty_bn?: string;
  image: string;
}
export interface AboutWhyChoose {
  id: number; icon: string;
  title: string; title_bn?: string;
  desc: string; desc_bn?: string;
}
export interface AboutCertification {
  id: number; name: string; logo: string; url?: string;
}
export interface AboutData {
  heading: string; heading_bn?: string;
  para1: string; para1_bn?: string;
  para2: string; para2_bn?: string;
  image: string;
  yearsExperience: number; projectsCompleted: number;
  highlights: string[]; highlights_bn?: string[];
  mdMessage?: AboutMDMessage;
  experts?: AboutExpert[];
  whyChoose?: AboutWhyChoose[];
  certifications?: AboutCertification[];
}
export interface Stat {
  id: number; value: number; suffix: string;
  label: string; label_bn?: string;
  desc: string; desc_bn?: string;
}
export interface TeamMember {
  id: number; image: string;
  name: string; name_bn?: string;
  role: string; role_bn?: string;
  expertise: string; expertise_bn?: string;
}
export interface Client {
  id: number; name: string; abbr: string; color: string;
}
export interface Testimonial {
  id: number; rating: number;
  name: string; name_bn?: string;
  role: string; role_bn?: string;
  text: string; text_bn?: string;
}
export interface Publication {
  id: number; year: string; tags: string[]; pdfFile: string; content: string;
  title: string; title_bn?: string;
  journal: string; journal_bn?: string;
  abstract: string; abstract_bn?: string;
}
export interface ContactData {
  address: string; phone: string; email: string;
  mapLabel: string; mapLabel_bn?: string;
  ctaTitle: string; ctaTitle_bn?: string;
  ctaDesc: string; ctaDesc_bn?: string;
  formTitle: string; formTitle_bn?: string;
  formDesc: string; formDesc_bn?: string;
  subjects: string[]; subjects_bn?: string[];
}
export interface SiteSettings {
  companyName: string;
  tagline: string; tagline_bn?: string;
  logo: string;
  favicon: string;
  footerText: string; footerText_bn?: string;
  copyrightName: string;
  nameFont: string;
  nameSizePx: string;
  nameBold: boolean;
  taglineFont: string;
  taglineSizePx: string;
  logoSizePx: string;
}
