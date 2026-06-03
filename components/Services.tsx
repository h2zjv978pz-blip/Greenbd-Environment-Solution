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
    <section id="services" className="py-10 md:py-20 bg-primary-50" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header — compact on mobile */}
        <div className="text-center mb-6 md:mb-14">
          <p className="section-subtitle mb-2 md:mb-3">{tr.subtitle}</p>
          <h2 className="text-2xl md:text-4xl font-bold font-heading text-gray-900 mb-2 md:mb-4">{tr.title}</h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto hidden sm:block">{tr.desc}</p>
        </div>

        {/* Grid: 2-col compact on mobile, 2-col sm, 3-col lg */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {services.map((svc) => {
            const Icon = (Icons[svc.icon as IconName] ?? Icons.Leaf) as React.ElementType;
            const title = (lang === 'bn' && svc.title_bn) ? svc.title_bn : svc.title;
            const desc  = (lang === 'bn' && svc.desc_bn)  ? svc.desc_bn  : svc.desc;
            return (
              <div key={svc.id} className="card p-3 sm:p-5 lg:p-6 group hover:-translate-y-1 transition-transform duration-300">
                {/* Icon — smaller on mobile */}
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 sm:mb-4 ${svc.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                {/* Title */}
                <h3 className="font-heading font-semibold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors leading-tight">
                  {title}
                </h3>
                {/* Description — hidden on mobile for compactness */}
                <div className="hidden sm:block text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
                {/* Accent bar */}
                <div className="mt-2 sm:mt-4 w-6 h-0.5 bg-primary-300 group-hover:w-12 group-hover:bg-primary-600 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
