'use client';

import { Linkedin, Mail } from 'lucide-react';
import type { TeamMember } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

export default function Team({ members }: { members: TeamMember[] }) {
  const { lang } = useLanguage();
  const tr = t[lang].team;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  return (
    <section id="team" className="py-20 bg-gray-50" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">{tr.subtitle}</p>
          <h2 className="section-title mb-4">{tr.title}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{tr.desc}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {members.map((member) => {
            const name      = (lang === 'bn' && member.name_bn)      ? member.name_bn      : member.name;
            const role      = (lang === 'bn' && member.role_bn)      ? member.role_bn      : member.role;
            const expertise = (lang === 'bn' && member.expertise_bn) ? member.expertise_bn : member.expertise;
            return (
              <div key={member.id} className="card overflow-hidden group">
                <div className="relative overflow-hidden bg-gray-100">
                  {member.image ? (
                    <img src={member.image} alt={name} className="w-full h-48 sm:h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-5xl font-bold text-primary-400 select-none">{name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
                    <button className="w-11 h-11 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-colors"><Linkedin className="w-4 h-4" /></button>
                    <button className="w-11 h-11 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-colors"><Mail className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-gray-900 text-lg">{name}</h3>
                  <p className="text-primary-600 text-sm font-medium mt-0.5">{role}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-gray-400 text-xs">{expertise}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
