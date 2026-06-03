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
    <section id="services" className="py-4 md:py-20 bg-primary-50" style={banglaFont}>
      <div className="container mx-auto px-3 lg:px-8">

        {/* Header */}
        <div className="text-center mb-3 md:mb-14">
          <p className="section-subtitle mb-1 md:mb-3 text-xs md:text-sm">{tr.subtitle}</p>
          <h2 className="text-base md:text-4xl font-bold font-heading text-gray-900 mb-1 md:mb-4">{tr.title}</h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto hidden md:block">{tr.desc}</p>
        </div>

        {/* Grid — 3 cols on mobile (icon + short title only), full cards on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-5 lg:gap-6">
          {services.map((svc) => {
            const Icon = (Icons[svc.icon as IconName] ?? Icons.Leaf) as React.ElementType;
            const title = (lang === 'bn' && svc.title_bn) ? svc.title_bn : svc.title;
            const desc  = (lang === 'bn' && svc.desc_bn)  ? svc.desc_bn  : svc.desc;
            return (
              <div key={svc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm group
                hover:-translate-y-1 transition-transform duration-300
                p-2 sm:p-5 lg:p-6
                flex flex-col items-center sm:items-start gap-1 sm:gap-0 text-center sm:text-left">

                {/* Icon */}
                <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mb-1 sm:mb-4 ${svc.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-gray-900 text-[10px] leading-tight sm:text-base lg:text-lg sm:mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {title}
                </h3>

                {/* Description + accent — desktop only */}
                <div className="hidden sm:block text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
                <div className="hidden sm:block mt-4 w-6 h-0.5 bg-primary-300 group-hover:w-12 group-hover:bg-primary-600 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
