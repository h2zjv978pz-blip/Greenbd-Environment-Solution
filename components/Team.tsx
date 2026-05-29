'use client';

import { Linkedin, Mail } from 'lucide-react';

const team = [
  {
    name: 'Dr. Rahman Al-Karim',
    role: 'Executive Director & Climate Scientist',
    expertise: 'Climate Modeling, IPCC Research',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Dr. Fatema Khanam',
    role: 'Head of GIS & Remote Sensing',
    expertise: 'Satellite Analysis, Spatial Planning',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },
  {
    name: 'Md. Shafiqul Islam',
    role: 'Disaster Risk Reduction Lead',
    expertise: 'Multi-hazard Analysis, Community DRR',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Nusrat Jahan',
    role: 'Environmental Research Specialist',
    expertise: 'Biodiversity, Ecosystem Services',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
  {
    name: 'Arif Hossain',
    role: 'Sustainability Consultant',
    expertise: 'ESG, Carbon Accounting, SDGs',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
  },
  {
    name: 'Tania Akter',
    role: 'Community Programs Manager',
    expertise: 'Participatory Methods, Citizen Science',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
];

export default function Team() {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Meet the Experts</p>
          <h2 className="section-title mb-4">Our Leadership Team</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A multidisciplinary team of environmental scientists, GIS experts, and sustainability leaders committed to a greener Bangladesh.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="card overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
                  <button className="w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-primary-600 text-sm font-medium mt-0.5">{member.role}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-gray-400 text-xs">{member.expertise}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
