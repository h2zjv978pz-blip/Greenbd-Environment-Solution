'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-primary-50" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 p-6 sm:p-10 md:p-16 text-center" style={{ background: 'linear-gradient(135deg,#052e16 0%,#15803d 60%,#16a34a 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <p className="text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">{tr.readyLabel}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white mb-4">{ctaTitle}</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">{ctaDesc}</p>
            <a href="#contact-form" onClick={(e) => { e.preventDefault(); document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors shadow-lg hover:shadow-xl">
              {tr.startConvo} <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Form + info */}
        <div id="contact-form" className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <p className="section-subtitle mb-3">{tr.getInTouch}</p>
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">{formTitle}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{formDesc}</p>
            </div>
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-gray-800 text-sm font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden h-48 bg-primary-100 flex items-center justify-center mt-2">
              <div className="text-center text-primary-400">
                <MapPin className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm font-medium">{mapLabel}</p>
                <p className="text-xs">{tr.bangladeshLabel}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="card p-4 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-primary-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tr.successTitle}</h3>
                  <p className="text-gray-500">{tr.successDesc}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{tr.nameLabel}</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder={tr.namePlaceholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{tr.emailLabel}</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder={tr.emailPlaceholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{tr.subjectLabel}</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-gray-700">
                      <option value="">{tr.subjectDefault}</option>
                      {subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{tr.messageLabel}</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder={tr.messagePlaceholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none" />
                  </div>
                  <button type="submit" className="w-full btn-primary justify-center py-4 text-base rounded-xl">
                    <Send className="w-4 h-4" />{tr.sendBtn}
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
