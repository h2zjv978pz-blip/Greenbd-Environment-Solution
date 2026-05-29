'use client';

import * as Icons from 'lucide-react';
import type { Service } from '@/lib/getData';

type IconName = keyof typeof Icons;

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">What We Provide</p>
          <h2 className="section-title mb-4">Our Core Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Integrated environmental services designed to address Bangladesh's unique ecological challenges — from satellite-driven analysis to community-level action.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = (Icons[svc.icon as IconName] ?? Icons.Leaf) as React.ElementType;
            return (
              <div key={svc.id} className="card p-6 group hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${svc.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors">{svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
                <div className="mt-4 w-8 h-0.5 bg-primary-300 group-hover:w-16 group-hover:bg-primary-600 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
