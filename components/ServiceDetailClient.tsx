'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, CalendarDays } from 'lucide-react';
import type { ServicePageContent } from '@/lib/servicesContent';

type IconName = keyof typeof Icons;

export default function ServiceDetailClient({ service }: { service: ServicePageContent }) {
  const Icon = (Icons[service.icon as IconName] ?? Icons.Leaf) as React.ElementType;

  return (
    <div>
      {/* Hero */}
      <div className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-white -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full border border-white translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link href="/#services" className="inline-flex items-center gap-2 text-green-300 text-sm mb-6 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-heading leading-tight">{service.title}</h1>
              <p className="text-green-200 text-sm md:text-base mt-1.5 max-w-2xl">{service.heroSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-heading mb-4">Overview</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-base">
                {service.overview.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>

            {/* Offerings */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-heading mb-5">What We Offer</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.offerings.map((o, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-gray-900 mb-1.5">{o.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{o.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-heading mb-5">Our Process</h2>
              <div className="space-y-4">
                {service.process.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-50 text-primary-600 font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why us */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-heading mb-5">Why Choose Green BD</h2>
              <ul className="space-y-3">
                {service.whyUs.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm md:text-base leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-24 space-y-4">
              <h3 className="font-bold text-gray-900 font-heading text-lg">Get Started</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Discuss your project requirements with our team and get a tailored proposal for {service.title.toLowerCase()}.
              </p>
              <Link href="/contact/consultation"
                className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                <ClipboardList className="w-4 h-4" /> Request Consultation
              </Link>
              <Link href="/contact/meeting"
                className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                <CalendarDays className="w-4 h-4" /> Schedule a Meeting
              </Link>
              <Link href="/#contact"
                className="flex items-center justify-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium text-sm pt-1">
                Or contact us directly <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
