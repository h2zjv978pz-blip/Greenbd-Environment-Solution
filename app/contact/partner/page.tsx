'use client';

import { useState } from 'react';
import { Handshake, CheckCircle2, Send, ArrowLeft, Globe, BookOpen, Users, Banknote, Leaf, FlaskConical } from 'lucide-react';
import Link from 'next/link';

const PARTNERSHIP_TYPES = [
  { id: 'research',    icon: FlaskConical, label: 'Research Collaboration', desc: 'Joint studies & publications' },
  { id: 'ngo',        icon: Users,        label: 'NGO / Civil Society',    desc: 'Community programmes' },
  { id: 'government', icon: Globe,        label: 'Government / Policy',    desc: 'Policy & institutional' },
  { id: 'academic',   icon: BookOpen,     label: 'Academic / University',  desc: 'Education & training' },
  { id: 'funding',    icon: Banknote,     label: 'Funding / Donor',        desc: 'Grants & financing' },
  { id: 'corporate',  icon: Leaf,         label: 'Corporate / CSR',        desc: 'Sustainability projects' },
];

export default function PartnerPage() {
  const [form, setForm] = useState({
    orgName: '', contactPerson: '', role: '', email: '', phone: '', website: '',
    partnerTypes: [] as string[],
    description: '', goals: '', timeline: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const toggleType = (id: string) => setForm(f => ({
    ...f,
    partnerTypes: f.partnerTypes.includes(id)
      ? f.partnerTypes.filter(t => t !== id)
      : [...f.partnerTypes, id],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.partnerTypes.length === 0) { alert('Please select at least one partnership type.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg,#3b0764 0%,#581c87 50%,#7e22ce 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-white -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-300 text-sm mb-6 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <Handshake className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">Partner With Us</h1>
              <p className="text-purple-200 text-sm mt-1">Join us in building a sustainable Bangladesh together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why partner callout */}
      <div className="bg-purple-50 border-b border-purple-100">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            {[
              ['🌍', '15+ Years', 'of environmental expertise in Bangladesh'],
              ['🤝', '50+ Partners', 'from UN agencies to local NGOs'],
              ['📊', '200+ Projects', 'delivered with measurable impact'],
            ].map(([ic, val, desc]) => (
              <div key={val}>
                <div className="text-2xl mb-1">{ic}</div>
                <p className="font-bold text-purple-800 text-lg">{val}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Partnership Inquiry Received!</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-2">
                Thank you, <strong>{form.orgName}</strong>. Our partnerships team will review your inquiry
                and reach out within <strong>2 business days</strong>.
              </p>
              <p className="text-sm text-gray-400 mb-8">We&apos;ll contact <strong>{form.contactPerson}</strong> at <strong>{form.email}</strong></p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setSubmitted(false)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Submit Another
                </button>
                <Link href="/" className="px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-7">

                {/* Organisation */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Organisation Details</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Organisation Name', key: 'orgName', type: 'text', placeholder: 'Full legal name', req: true },
                      { label: 'Website', key: 'website', type: 'url', placeholder: 'https://your-org.org', req: false },
                      { label: 'Contact Person', key: 'contactPerson', type: 'text', placeholder: 'Full name', req: true },
                      { label: 'Role / Designation', key: 'role', type: 'text', placeholder: 'e.g. Director of Programmes', req: false },
                      { label: 'Email Address', key: 'email', type: 'email', placeholder: 'contact@org.com', req: true },
                      { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+880 1XXXXXXXXX', req: false },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                          {f.label}{f.req && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type={f.type} value={(form as unknown as Record<string,string>)[f.key]} onChange={e => set(f.key, e.target.value)} required={f.req} placeholder={f.placeholder}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partnership type */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1 pb-2 border-b border-gray-100">Partnership Type</h3>
                  <p className="text-xs text-gray-400 mb-4">Select all that apply <span className="text-red-500">*</span></p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PARTNERSHIP_TYPES.map(pt => {
                      const Icon = pt.icon;
                      const active = form.partnerTypes.includes(pt.id);
                      return (
                        <button type="button" key={pt.id} onClick={() => toggleType(pt.id)}
                          className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all ${active ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-purple-500' : 'bg-gray-100'}`}>
                            <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <p className={`text-xs font-bold leading-tight ${active ? 'text-purple-700' : 'text-gray-700'}`}>{pt.label}</p>
                          <p className="text-[10px] text-gray-400">{pt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Partnership Proposal</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Brief Description of Proposed Partnership <span className="text-red-500">*</span>
                      </label>
                      <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={4}
                        placeholder="Describe the proposed collaboration, your organisation's mandate, and how you envision working with Green BD…"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 resize-none" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Key Goals / Expected Outcomes</label>
                        <textarea value={form.goals} onChange={e => set('goals', e.target.value)} rows={3} placeholder="What do you hope to achieve?"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Proposed Timeline</label>
                        <textarea value={form.timeline} onChange={e => set('timeline', e.target.value)} rows={3} placeholder="e.g. 6 months, Jan–Dec 2026, ongoing…"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 resize-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg disabled:opacity-70">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Submit Partnership Inquiry</>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  All submissions are reviewed by our Partnerships Team. We aim to respond within 2 business days.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
