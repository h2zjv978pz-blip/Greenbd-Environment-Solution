'use client';

import { Star, Quote } from 'lucide-react';

const clients = [
  { name: 'UNDP Bangladesh', abbr: 'UNDP', color: 'bg-blue-600' },
  { name: 'World Bank', abbr: 'WB', color: 'bg-blue-800' },
  { name: 'BRAC', abbr: 'BRAC', color: 'bg-red-600' },
  { name: 'DoE Bangladesh', abbr: 'DoE', color: 'bg-green-700' },
  { name: 'LGED', abbr: 'LGED', color: 'bg-orange-600' },
  { name: 'USAID', abbr: 'USAID', color: 'bg-blue-700' },
  { name: 'GIZ', abbr: 'GIZ', color: 'bg-green-600' },
  { name: 'ADB', abbr: 'ADB', color: 'bg-red-700' },
];

const testimonials = [
  {
    name: 'Md. Anwar Hossain',
    role: 'Director, Department of Environment, Bangladesh',
    text: 'Green BD\'s environmental assessment work on the Chattogram coastal zone was exceptional. Their integration of satellite data with field surveys delivered insights we could immediately act on for policy formulation.',
    rating: 5,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Country Representative, UNDP Bangladesh',
    text: 'Working with Green BD on our Climate Vulnerability Index project was transformative. Their team\'s scientific rigor combined with genuine community engagement produced outputs that truly reflect ground realities.',
    rating: 5,
  },
  {
    name: 'Prof. Dr. Kamal Uddin',
    role: 'Chairman, Bangladesh University of Engineering & Technology',
    text: 'Green BD\'s research collaboration with BUET has yielded some of the most robust flood-risk datasets in Bangladesh. Their GIS capabilities are world-class, and their dedication to open science is commendable.',
    rating: 5,
  },
];

export default function Clients() {
  return (
    <section id="clients" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Clients */}
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Trusted Partners</p>
          <h2 className="section-title mb-4">Our Valued Clients</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We partner with governments, international organizations, NGOs, and academic institutions to deliver impactful environmental outcomes.
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-20">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 ${client.color} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
              >
                {client.abbr}
              </div>
              <span className="text-gray-400 text-[10px] text-center leading-tight hidden md:block">
                {client.name}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">What They Say</p>
          <h2 className="section-title">Client Reviews</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-100" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
