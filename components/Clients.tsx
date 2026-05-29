'use client';

import { Star, Quote } from 'lucide-react';
import type { Client, Testimonial } from '@/lib/getData';

export default function Clients({ clients, testimonials }: { clients: Client[]; testimonials: Testimonial[] }) {
  return (
    <section id="clients" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Trusted Partners</p>
          <h2 className="section-title mb-4">Our Valued Clients</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We partner with governments, international organizations, NGOs, and academic institutions to deliver impactful environmental outcomes.</p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-20">
          {clients.map((client) => (
            <div key={client.id} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`w-16 h-16 ${client.color} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>{client.abbr}</div>
              <span className="text-gray-400 text-[10px] text-center leading-tight hidden md:block">{client.name}</span>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">What They Say</p>
          <h2 className="section-title">Client Reviews</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="card p-6 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-100" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
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
