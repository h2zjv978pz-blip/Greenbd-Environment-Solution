'use client';

import * as Icons from 'lucide-react';
import type { Service } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

type IconName = keyof typeof Icons;

export default function Services({ services }: { services: Service[] }) {
  const { lang } = useLanguage();
  const tr = t[lang].services;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  return (
    <section id="services" className="py-20 bg-primary-50" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">{tr.subtitle}</p>
          <h2 className="section-title mb-4">{tr.title}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{tr.desc}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = (Icons[svc.icon as IconName] ?? Icons.Leaf) as React.ElementType;
            const title = (lang === 'bn' && svc.title_bn) ? svc.title_bn : svc.title;
            const desc  = (lang === 'bn' && svc.desc_bn)  ? svc.desc_bn  : svc.desc;
            return (
              <div key={svc.id} className="card p-6 group hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${svc.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
                <div className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
                <div className="mt-4 w-8 h-0.5 bg-primary-300 group-hover:w-16 group-hover:bg-primary-600 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
