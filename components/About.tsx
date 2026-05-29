'use client';

import { CheckCircle2 } from 'lucide-react';

const highlights = [
  'ISO-certified environmental assessment methodologies',
  'Partnerships with UN agencies and global research bodies',
  'Indigenous knowledge integration in all projects',
  'Open-source GIS tools for citizen scientists',
  'Nationally recognized climate vulnerability frameworks',
  'Community-led data collection and monitoring networks',
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                alt="Green BD team at work"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-transparent" />
            </div>

            {/* Floating card - experience */}
            <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white rounded-2xl p-5 shadow-2xl">
              <p className="text-4xl font-bold font-heading">15+</p>
              <p className="text-sm font-medium text-green-200 mt-1">Years of<br/>Environmental Excellence</p>
            </div>

            {/* Floating badge - projects */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <p className="text-3xl font-bold text-primary-600 font-heading">200+</p>
              <p className="text-xs text-gray-500 mt-1">Projects Completed</p>
            </div>

            {/* Green accent block */}
            <div className="absolute -z-10 top-8 -left-8 w-48 h-48 bg-primary-100 rounded-2xl" />
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <p className="section-subtitle mb-3">About Green BD</p>
            <h2 className="section-title mb-6">
              Pioneering Environmental
              <span className="text-primary-600"> Solutions</span> in Bangladesh
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Green BD Environmental Solutions is a premier environmental consultancy dedicated to building a sustainable and climate-resilient Bangladesh. Founded on the principles of scientific rigor, community inclusion, and innovative technology, we bridge the gap between cutting-edge environmental research and real-world action.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              From the Sundarbans mangroves to the urban heat islands of Dhaka, our multidisciplinary team of ecologists, GIS specialists, climate scientists, and community advocates deliver holistic solutions to Bangladesh's most pressing environmental challenges.
            </p>

            <ul className="space-y-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary"
            >
              Work With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
