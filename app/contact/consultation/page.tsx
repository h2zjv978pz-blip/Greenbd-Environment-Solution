'use client';

import { useState } from 'react';
import { ClipboardList, CheckCircle2, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const INQUIRY_TYPES = [
  'Environmental Impact Assessment (EIA)',
  'Climate Change & Adaptation',
  'GIS & Remote Sensing',
  'Disaster Risk Reduction',
  'Biodiversity & Ecosystem Services',
  'Water Resources Management',
  'Air & Noise Quality Assessment',
  'Sustainability Consulting',
  'Research Collaboration',
  'Other',
];

export default function ConsultationPage() {
  const [form, setForm] = useState({
    name: '', org: '', email: '', phone: '',
    inquiryType: '', description: '', preferredDate: '',
    preferredTime: 'morning', language: 'English',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-white -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-green-300 text-sm mb-6 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">Request Consultation</h1>
              <p className="text-green-200 text-sm mt-1">Tell us about your project — we&apos;ll get back within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Consultation Request Received!</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-2">
                Thank you, <strong>{form.name}</strong>. Our team will review your request and reach out
                within <strong>1 business day</strong> to confirm your consultation.
              </p>
              <p className="text-sm text-gray-400 mb-8">A confirmation has been sent to <strong>{form.email}</strong></p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setSubmitted(false)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Submit Another
                </button>
                <Link href="/" className="px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
              <p className="text-gray-500 mb-8">Fields marked <span className="text-red-500">*</span> are required.</p>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Personal info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name', required: true },
                      { label: 'Organisation / Institution', key: 'org', type: 'text', placeholder: 'Company or institution name', required: false },
                      { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com', required: true },
                      { label: 'Phone / WhatsApp', key: 'phone', type: 'tel', placeholder: '+880 1XXXXXXXXX', required: false },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                          {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type={f.type} value={(form as Record<string,string>)[f.key]} onChange={e => set(f.key, e.target.value)} required={f.required} placeholder={f.placeholder}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inquiry details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Consultation Details</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Type of Inquiry <span className="text-red-500">*</span>
                      </label>
                      <select value={form.inquiryType} onChange={e => set('inquiryType', e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 text-gray-700">
                        <option value="">Select inquiry type…</option>
                        {INQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Brief Description <span className="text-red-500">*</span>
                      </label>
                      <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={4}
                        placeholder="Describe your project, challenge, or the type of support you need. Include any relevant details such as location, timeline, or specific requirements."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 resize-none" />
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Scheduling Preferences</h3>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Preferred Date</label>
                      <input type="date" value={form.preferredDate} onChange={e => set('preferredDate', e.target.value)} min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Preferred Time</label>
                      <select value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50">
                        <option value="morning">Morning (9am–12pm)</option>
                        <option value="afternoon">Afternoon (12pm–5pm)</option>
                        <option value="evening">Evening (5pm–7pm)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Language</label>
                      <select value={form.language} onChange={e => set('language', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50">
                        <option>English</option>
                        <option>বাংলা (Bengali)</option>
                        <option>Both</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg disabled:opacity-70">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Submit Consultation Request</>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  By submitting, you agree to be contacted by Green BD Environmental Solutions regarding your inquiry.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
