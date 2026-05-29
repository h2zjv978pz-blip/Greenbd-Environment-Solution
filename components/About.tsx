'use client';

import { CheckCircle2 } from 'lucide-react';
import type { AboutData } from '@/lib/getData';

export default function About({ data }: { data: AboutData }) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={data.image} alt="Green BD team at work" className="w-full h-[480px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white rounded-2xl p-5 shadow-2xl">
              <p className="text-4xl font-bold font-heading">{data.yearsExperience}+</p>
              <p className="text-sm font-medium text-green-200 mt-1">Years of<br/>Environmental Excellence</p>
            </div>
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <p className="text-3xl font-bold text-primary-600 font-heading">{data.projectsCompleted}+</p>
              <p className="text-xs text-gray-500 mt-1">Projects Completed</p>
            </div>
            <div className="absolute -z-10 top-8 -left-8 w-48 h-48 bg-primary-100 rounded-2xl" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="section-subtitle mb-3">About Green BD</p>
            <h2 className="section-title mb-6">{data.heading.split(' ').slice(0,2).join(' ')}<span className="text-primary-600"> {data.heading.split(' ').slice(2).join(' ')}</span></h2>
            <p className="text-gray-600 leading-relaxed mb-5">{data.para1}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{data.para2}</p>
            <ul className="space-y-3 mb-10">
              {data.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary">Work With Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}
