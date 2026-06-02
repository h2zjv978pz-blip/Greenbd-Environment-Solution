'use client';

import { useState } from 'react';
import { CalendarClock, CheckCircle2, Video, Phone, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MEETING_TYPES = [
  { id: 'video', icon: Video,  label: 'Video Call',     desc: 'Google Meet / Zoom' },
  { id: 'phone', icon: Phone,  label: 'Phone Call',     desc: 'Direct call' },
  { id: 'team',  icon: Users,  label: 'Team Meeting',   desc: 'Multiple stakeholders' },
];

const TOPICS = [
  'Project Scoping & Feasibility',
  'Environmental Impact Assessment',
  'GIS & Mapping Services',
  'Research Partnership',
  'Training & Capacity Building',
  'Policy Advisory',
  'Grant / Funding Collaboration',
  'Technical Consultation',
  'Other',
];

const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

export default function MeetingPage() {
  const [form, setForm] = useState({
    name: '', email: '', org: '',
    meetingType: 'video', topic: '', details: '',
    date: '', time: '', duration: '30',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#1e40af 50%,#1d4ed8 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-white -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-300 text-sm mb-6 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <CalendarClock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">Book Online Meeting</h1>
              <p className="text-blue-200 text-sm mt-1">Schedule a call with our experts at your convenience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Meeting Booking Confirmed!</h2>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 max-w-sm mx-auto mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-gray-600">Date:</span> <span className="text-gray-800">{form.date}</span></p>
                  <p><span className="font-semibold text-gray-600">Time:</span> <span className="text-gray-800">{form.time} BST</span></p>
                  <p><span className="font-semibold text-gray-600">Duration:</span> <span className="text-gray-800">{form.duration} min</span></p>
                  <p><span className="font-semibold text-gray-600">Type:</span> <span className="text-gray-800">{MEETING_TYPES.find(m => m.id === form.meetingType)?.label}</span></p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-8">
                A calendar invite will be sent to <strong>{form.email}</strong>. Our team will send the meeting link 30 minutes before.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setSubmitted(false)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Book Another</button>
                <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Back to Home</Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-7">

                {/* Meeting type selector */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Meeting Format</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {MEETING_TYPES.map(m => {
                      const Icon = m.icon;
                      return (
                        <button type="button" key={m.id} onClick={() => set('meetingType', m.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${form.meetingType === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.meetingType === m.id ? 'bg-blue-500' : 'bg-gray-100'}`}>
                            <Icon className={`w-5 h-5 ${form.meetingType === m.id ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <p className={`text-xs font-bold ${form.meetingType === m.id ? 'text-blue-700' : 'text-gray-600'}`}>{m.label}</p>
                          <p className="text-[10px] text-gray-400">{m.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Date & Time</h3>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Preferred Date <span className="text-red-500">*</span></label>
                      <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required min={minDateStr}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Preferred Time <span className="text-red-500">*</span></label>
                      <select value={form.time} onChange={e => set('time', e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-700">
                        <option value="">Select time…</option>
                        {TIMES.map(t => <option key={t} value={t}>{t} BST</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Duration</label>
                      <select value={form.duration} onChange={e => set('duration', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50">
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Your info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Your Details</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name', req: true },
                      { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com', req: true },
                      { label: 'Organisation', key: 'org', type: 'text', placeholder: 'Optional', req: false },
                    ].map(f => (
                      <div key={f.key} className={f.key === 'org' ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                          {f.label}{f.req && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type={f.type} value={(form as Record<string,string>)[f.key]} onChange={e => set(f.key, e.target.value)} required={f.req} placeholder={f.placeholder}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Meeting Topic <span className="text-red-500">*</span>
                      </label>
                      <select value={form.topic} onChange={e => set('topic', e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-700">
                        <option value="">Select a topic…</option>
                        {TOPICS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Additional Notes</label>
                      <textarea value={form.details} onChange={e => set('details', e.target.value)} rows={3} placeholder="Anything specific you'd like to discuss or prepare for the meeting…"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg disabled:opacity-70">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking…</>
                  ) : (
                    <><CalendarClock className="w-4 h-4" /> Confirm Meeting Booking</>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
