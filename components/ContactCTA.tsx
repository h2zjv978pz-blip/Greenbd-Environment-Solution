'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import type { ContactData } from '@/lib/getData';

export default function ContactCTA({ contact }: { contact: ContactData }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: MapPin, label: 'Office Address', value: contact.address },
    { icon: Phone,  label: 'Phone',          value: contact.phone  },
    { icon: Mail,   label: 'Email',           value: contact.email  },
  ];

  return (
    <section id="contact" className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-16 p-10 md:p-16 text-center" style={{ background: 'linear-gradient(135deg,#052e16 0%,#15803d 60%,#16a34a 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <p className="text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">Ready to make an impact?</p>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">{contact.ctaTitle}</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">{contact.ctaDesc}</p>
            <a href="#contact-form" onClick={(e) => { e.preventDefault(); document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors shadow-lg hover:shadow-xl">
              Start a Conversation <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Form + info */}
        <div id="contact-form" className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <p className="section-subtitle mb-3">Get In Touch</p>
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">{contact.formTitle}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{contact.formDesc}</p>
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
                <p className="text-sm font-medium">{contact.mapLabel}</p>
                <p className="text-xs">Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="card p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-primary-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Your Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Dr. John Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Email Address</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@organization.org" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Subject / Service</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-gray-700">
                      <option value="">Select a service...</option>
                      {contact.subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us about your project or inquiry..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none" />
                  </div>
                  <button type="submit" className="w-full btn-primary justify-center py-4 text-base rounded-xl">
                    <Send className="w-4 h-4" />Send Message
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
