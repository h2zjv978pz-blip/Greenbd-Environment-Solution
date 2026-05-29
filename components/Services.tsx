'use client';

import {
  Globe,
  Leaf,
  Shield,
  BarChart3,
  Users,
  BookOpen,
  Cloud,
  Map,
  Recycle,
} from 'lucide-react';

const services = [
  {
    icon: Leaf,
    title: 'Environmental Impact Assessment',
    desc: 'Comprehensive EIA studies for infrastructure, industrial, and development projects following national and international standards.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Map,
    title: 'GIS & Remote Sensing',
    desc: 'Satellite imagery analysis, spatial data management, and geospatial mapping for environmental monitoring and planning.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Cloud,
    title: 'Climate Change Research',
    desc: 'Scenario modeling, vulnerability assessments, and adaptation planning grounded in IPCC-aligned methodologies.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Shield,
    title: 'Disaster Risk Reduction',
    desc: 'Multi-hazard risk profiling, early warning systems design, and community-based DRR strategies for flood, cyclone, and drought.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: BarChart3,
    title: 'Environmental Monitoring',
    desc: 'Real-time air, water, and soil quality monitoring networks with data dashboards for informed policy decisions.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: BookOpen,
    title: 'Environmental Research',
    desc: 'Applied and academic research on biodiversity, ecosystem services, land-use change, and environmental governance.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    desc: 'Citizen science programs, participatory mapping, and environmental education for grassroots sustainability action.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Globe,
    title: 'Climate Resilience Planning',
    desc: 'City-level and national climate action plans integrating nature-based solutions and adaptive infrastructure.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Recycle,
    title: 'Sustainability Consulting',
    desc: 'Corporate sustainability strategies, carbon footprint analysis, green certification support, and ESG reporting.',
    color: 'bg-lime-50 text-lime-600',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">What We Provide</p>
          <h2 className="section-title mb-4">Our Core Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Integrated environmental services designed to address Bangladesh's unique ecological challenges — from satellite-driven analysis to community-level action.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="card p-6 group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${svc.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors">
                  {svc.title}
                </h3>
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
