'use client';

import { CheckCircle2, Quote, Award, Star } from 'lucide-react';
import type { AboutData } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

export default function About({ data }: { data: AboutData }) {
  const { lang } = useLanguage();
  const tr = t[lang].about;
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const heading    = (lang === 'bn' && data.heading_bn)    ? data.heading_bn    : data.heading;
  const para1      = (lang === 'bn' && data.para1_bn)      ? data.para1_bn      : data.para1;
  const para2      = (lang === 'bn' && data.para2_bn)      ? data.para2_bn      : data.para2;
  const highlights = (lang === 'bn' && data.highlights_bn?.length) ? data.highlights_bn : data.highlights;

  const headWords = heading.split(' ');
  const headFirst = headWords.slice(0, 2).join(' ');
  const headRest  = headWords.slice(2).join(' ');

  return (
    <>
      {/* ── Main About ───────────────────────────────────────────────── */}
      <section id="about" className="py-8 md:py-20 bg-white" style={bf}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1 mt-8 sm:mt-10 lg:mt-0 hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {data.image && <img src={data.image} alt="Green BD team at work" className="w-full h-56 sm:h-80 lg:h-[480px] object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-transparent" />
              </div>
              {/* Badges — inset on mobile, outside on lg */}
              <div className="absolute bottom-3 right-3 sm:-bottom-6 sm:-right-6 bg-primary-600 text-white rounded-2xl p-3 sm:p-5 shadow-2xl">
                <p className="text-2xl sm:text-4xl font-bold font-heading">{data.yearsExperience}+</p>
                <p className="text-xs sm:text-sm font-medium text-green-200 mt-1 whitespace-pre-line">{tr.yearsLabel}</p>
              </div>
              <div className="absolute top-3 left-3 sm:-top-6 sm:-left-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-100">
                <p className="text-2xl sm:text-3xl font-bold text-primary-600 font-heading">{data.projectsCompleted}+</p>
                <p className="text-xs text-gray-500 mt-1">{tr.projectsLabel}</p>
              </div>
              <div className="absolute -z-10 top-8 -left-8 w-48 h-48 bg-primary-100 rounded-2xl hidden sm:block" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="section-subtitle mb-2 md:mb-3">{tr.subtitle}</p>
              <h2 className="text-2xl md:text-4xl font-bold font-heading text-gray-900 mb-4 md:mb-6">
                {headFirst}<span className="text-primary-600"> {headRest}</span>
              </h2>

              {/* Mobile stat badges — compact inline row */}
              <div className="flex gap-2 mb-3 md:hidden">
                <div className="flex-1 bg-primary-600 text-white rounded-xl p-2 shadow-sm text-center">
                  <p className="text-base font-bold font-heading leading-none">{data.yearsExperience || '15'}+</p>
                  <p className="text-[9px] font-medium text-green-200 mt-0.5 leading-tight">{tr.yearsLabel}</p>
                </div>
                <div className="flex-1 bg-white border border-primary-100 rounded-xl p-2 shadow-sm text-center">
                  <p className="text-base font-bold text-primary-600 font-heading leading-none">{data.projectsCompleted || '200'}+</p>
                  <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{tr.projectsLabel}</p>
                </div>
                <div className="flex-1 bg-primary-50 border border-primary-100 rounded-xl p-2 text-center">
                  <p className="text-base font-bold text-primary-700 font-heading leading-none">64</p>
                  <p className="text-[9px] text-primary-500 mt-0.5 leading-tight">Districts</p>
                </div>
              </div>

              {/* Both paragraphs — full text */}
              <div className="text-gray-600 text-sm leading-relaxed mb-3"
                dangerouslySetInnerHTML={{ __html: para1 }} />
              <div className="text-gray-600 text-sm leading-relaxed mb-5"
                dangerouslySetInnerHTML={{ __html: para2 }} />

              {/* All highlights */}
              <div className="bg-primary-50 rounded-2xl p-4 mb-5">
                <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-3">What We Offer</p>
                <ul className="space-y-2.5">
                  {highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <a href="#contact" onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary flex-1 justify-center text-sm py-3">
                  {tr.workWithUs}
                </a>
                <a href="#services" onClick={e => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-outline flex-1 justify-center text-sm py-3">
                  Our Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MD Message ───────────────────────────────────────────────── */}
      {data.mdMessage && (
        <section className="md-message-section py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)' }}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full border border-white" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full border border-white" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-2">Leadership</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-heading" style={bf}>
                Message from Managing Director
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {data.mdMessage.image && (
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={data.mdMessage.image}
                          alt={data.mdMessage.name}
                          className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-2xl ring-4 ring-white/20"
                        />
                        <div className="absolute -bottom-3 -right-3 bg-green-400 rounded-xl p-2">
                          <Star className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <Quote className="w-10 h-10 text-green-400 mb-4 mx-auto md:mx-0" />
                    <p className="text-white/90 text-lg leading-relaxed italic mb-6" style={bf}>
                      {lang === 'bn' && data.mdMessage.message_bn ? data.mdMessage.message_bn : data.mdMessage.message}
                    </p>
                    <div>
                      <p className="text-white font-bold text-xl font-heading" style={bf}>
                        {lang === 'bn' && data.mdMessage.name_bn ? data.mdMessage.name_bn : data.mdMessage.name}
                      </p>
                      <p className="text-green-300 text-sm mt-1" style={bf}>
                        {lang === 'bn' && data.mdMessage.title_bn ? data.mdMessage.title_bn : data.mdMessage.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose GreenBD ───────────────────────────────────────── */}
      {data.whyChoose && data.whyChoose.length > 0 && (
        <section className="py-20 bg-gray-50" style={bf}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-14">
              <p className="section-subtitle mb-3">Our Advantage</p>
              <h2 className="section-title mb-4">Why Choose GreenBD</h2>
              <p className="text-gray-500 max-w-2xl mx-auto" style={bf}>
                We combine scientific rigor, local expertise, and community-first values to deliver
                environmental solutions that create real, measurable impact.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.whyChoose.map(item => (
                <div key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors" style={bf}>
                    {lang === 'bn' && item.title_bn ? item.title_bn : item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={bf}>
                    {lang === 'bn' && item.desc_bn ? item.desc_bn : item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Our Experts ──────────────────────────────────────────────── */}
      {data.experts && data.experts.length > 0 && (
        <section className="py-20 bg-white" style={bf}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-14">
              <p className="section-subtitle mb-3">Meet the Team</p>
              <h2 className="section-title mb-4">Our Experts</h2>
              <p className="text-gray-500 max-w-2xl mx-auto" style={bf}>
                Our multidisciplinary team brings together leading scientists, engineers, and
                environmental specialists committed to Bangladesh's sustainable future.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.experts.map(expert => (
                <div key={expert.id}
                  className="group text-center bg-gray-50 rounded-2xl p-6 hover:bg-primary-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary-100">
                  <div className="relative inline-block mb-4">
                    <img
                      src={expert.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                      alt={expert.name}
                      className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-md group-hover:shadow-primary-200 group-hover:shadow-lg transition-shadow"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary-600 rounded-full p-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900 text-base mb-1 group-hover:text-primary-700 transition-colors" style={bf}>
                    {lang === 'bn' && expert.name_bn ? expert.name_bn : expert.name}
                  </h3>
                  <p className="text-primary-600 text-xs font-semibold mb-2" style={bf}>
                    {lang === 'bn' && expert.role_bn ? expert.role_bn : expert.role}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed" style={bf}>
                    {lang === 'bn' && expert.specialty_bn ? expert.specialty_bn : expert.specialty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Certifications & Partnerships ────────────────────────────── */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="py-16 bg-primary-950" style={bf}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-2">Trust & Compliance</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-heading" style={bf}>
                Certifications & Partnerships
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data.certifications.map(cert => (
                <a key={cert.id}
                  href={cert.url || '#'}
                  target={cert.url ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/40 rounded-2xl p-4 transition-all duration-300">
                  {cert.logo ? (
                    <img src={cert.logo} alt={cert.name} className="h-10 w-auto object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <Award className="w-6 h-6 text-green-400" />
                    </div>
                  )}
                  <p className="text-white/60 group-hover:text-white text-[10px] text-center leading-tight transition-colors" style={bf}>
                    {cert.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
