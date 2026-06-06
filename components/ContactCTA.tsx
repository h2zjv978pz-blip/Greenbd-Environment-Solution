'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle, Globe } from 'lucide-react';
import type { ContactData } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

export default function ContactCTA({ contact }: { contact: ContactData }) {
  const { lang } = useLanguage();
  const tr = t[lang].contact;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const ctaTitle  = (lang === 'bn' && contact.ctaTitle_bn)  ? contact.ctaTitle_bn  : contact.ctaTitle;
  const ctaDesc   = (lang === 'bn' && contact.ctaDesc_bn)   ? contact.ctaDesc_bn   : contact.ctaDesc;
  const formTitle = (lang === 'bn' && contact.formTitle_bn) ? contact.formTitle_bn : contact.formTitle;
  const formDesc  = (lang === 'bn' && contact.formDesc_bn)  ? contact.formDesc_bn  : contact.formDesc;
  const mapLabel  = (lang === 'bn' && contact.mapLabel_bn)  ? contact.mapLabel_bn  : contact.mapLabel;
  const subjects  = (lang === 'bn' && contact.subjects_bn)  ? contact.subjects_bn  : contact.subjects;

  const contactInfo = [
    { icon: MapPin, label: tr.addressLabel, value: contact.address },
    { icon: Phone,  label: tr.phoneLabel,   value: contact.phone   },
    { icon: Mail,   label: tr.emailInfoLabel, value: contact.email  },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-6 md:py-20 bg-primary-50" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── CTA Banner — horizontal layout on mobile ── */}
        <div className="relative rounded-2xl overflow-hidden mb-5 md:mb-12"
          style={{ background: 'linear-gradient(135deg,#052e16 0%,#15803d 60%,#16a34a 100%)' }}>
          {/* Mobile: horizontal row */}
          <div className="flex md:hidden items-center justify-between gap-3 px-4 py-4">
            <div className="min-w-0">
              <p className="text-green-300 font-bold text-[10px] uppercase tracking-widest mb-1">{tr.readyLabel}</p>
              <h2 className="text-sm font-bold text-white leading-tight line-clamp-2">{ctaTitle}</h2>
            </div>
            <a href="#contact-form"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex-shrink-0 flex items-center gap-1.5 bg-white text-primary-700 font-bold px-3.5 py-2 rounded-xl text-xs whitespace-nowrap">
              {tr.startConvo} <Send className="w-3 h-3" />
            </a>
          </div>
          {/* Desktop: centered */}
          <div className="hidden md:block p-10 md:p-16 text-center relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <p className="text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">{tr.readyLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">{ctaTitle}</h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">{ctaDesc}</p>
              <a href="#contact-form"
                onClick={(e) => { e.preventDefault(); document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors shadow-lg">
                {tr.startConvo} <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Form + Info ── */}
        <div id="contact-form" className="grid lg:grid-cols-5 gap-5 lg:gap-10">

          {/* Info column */}
          <div className="lg:col-span-2 flex flex-col gap-3 md:gap-6">
            {/* Title — compact on mobile */}
            <div>
              <p className="section-subtitle mb-1 md:mb-3">{tr.getInTouch}</p>
              <h3 className="text-lg md:text-2xl font-bold font-heading text-gray-900 mb-1 md:mb-4">{formTitle}</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed hidden sm:block">{formDesc}</p>
            </div>

            {/* Contact info — horizontal chips on mobile */}
            <div className="flex flex-col sm:flex-col gap-2 md:gap-4">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium leading-none">{label}</p>
                    <p className="text-gray-800 text-xs md:text-sm font-medium mt-0.5 truncate">{value}</p>
                  </div>
                </div>
              ))}

              {/* Partner websites */}
              {[
                { label: 'Archcell BD', href: 'https://www.archcellbd.com/' },
                { label: 'Metta BD',    href: 'https://mettabd.org/'        },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Globe className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium leading-none">Partner Website</p>
                    <p className="text-primary-600 group-hover:text-primary-700 text-xs md:text-sm font-medium mt-0.5 truncate transition-colors">{label}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map — hidden on mobile */}
            <div className="hidden md:flex rounded-2xl overflow-hidden h-48 bg-primary-100 items-center justify-center mt-2">
              <div className="text-center text-primary-400">
                <MapPin className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm font-medium">{mapLabel}</p>
                <p className="text-xs">{tr.bangladeshLabel}</p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <div className="card p-3 sm:p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="w-12 h-12 text-primary-500 mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{tr.successTitle}</h3>
                  <p className="text-gray-500 text-sm">{tr.successDesc}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
                  {/* Name + Email side by side on mobile too */}
                  <div className="grid grid-cols-2 gap-2 md:gap-5">
                    <div>
                      <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1 md:mb-2">{tr.nameLabel}</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        placeholder={tr.namePlaceholder}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm focus:outline-none focus:border-primary-400 transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1 md:mb-2">{tr.emailLabel}</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required
                        placeholder={tr.emailPlaceholder}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm focus:outline-none focus:border-primary-400 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1 md:mb-2">{tr.subjectLabel}</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm focus:outline-none focus:border-primary-400 transition-all text-gray-700">
                      <option value="">{tr.subjectDefault}</option>
                      {subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1 md:mb-2">{tr.messageLabel}</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required
                      rows={3}
                      placeholder={tr.messagePlaceholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm focus:outline-none focus:border-primary-400 transition-all resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full btn-primary justify-center py-2.5 md:py-4 text-sm md:text-base rounded-xl">
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />{tr.sendBtn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
