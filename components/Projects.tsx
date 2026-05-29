'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const categories = ['All', 'Climate', 'GIS/RS', 'Research', 'Disaster Risk', 'Sustainability', 'Community'];

const projects = [
  { id: 1, title: 'Coastal Flood Vulnerability Mapping', category: 'Disaster Risk', image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80', location: 'Cox\'s Bazar, Bangladesh' },
  { id: 2, title: 'Urban Green Space Analysis', category: 'GIS/RS', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', location: 'Dhaka, Bangladesh' },
  { id: 3, title: 'Sundarbans Mangrove Monitoring', category: 'Research', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80', location: 'Khulna, Bangladesh' },
  { id: 4, title: 'Climate Resilient Agriculture', category: 'Climate', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', location: 'Rajshahi, Bangladesh' },
  { id: 5, title: 'River Erosion Hotspot Detection', category: 'GIS/RS', image: 'https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?w=600&q=80', location: 'Jamuna, Bangladesh' },
  { id: 6, title: 'Community Solar Micro-Grid', category: 'Sustainability', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80', location: 'Sylhet, Bangladesh' },
  { id: 7, title: 'Air Quality Monitoring Network', category: 'Research', image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=80', location: 'Dhaka, Bangladesh' },
  { id: 8, title: 'Cyclone Shelter Siting Study', category: 'Disaster Risk', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80', location: 'Barisal, Bangladesh' },
  { id: 9, title: 'Wetland Conservation Plan', category: 'Sustainability', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80', location: 'Haor Region, Bangladesh' },
  { id: 10, title: 'Urban Heat Island Mapping', category: 'Climate', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&q=80', location: 'Chittagong, Bangladesh' },
  { id: 11, title: 'Community Eco-Education Program', category: 'Community', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80', location: 'National, Bangladesh' },
  { id: 12, title: 'Land Use Change Detection', category: 'GIS/RS', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80', location: 'Multiple Districts' },
  { id: 13, title: 'Groundwater Salinity Assessment', category: 'Research', image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80', location: 'Southwest Bangladesh' },
  { id: 14, title: 'Clean Cooking Initiative', category: 'Community', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80', location: 'Rural Bangladesh' },
  { id: 15, title: 'Biodiversity Corridor Mapping', category: 'GIS/RS', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', location: 'Hill Tracts, Bangladesh' },
];

export default function Projects() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">Our Portfolio</p>
          <h2 className="section-title mb-4">Latest Projects & Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our environmental initiatives across climate resilience, GIS mapping, research, and community empowerment throughout Bangladesh.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="project-card relative overflow-hidden rounded-xl cursor-pointer group aspect-square"
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="project-overlay absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/40 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className="text-green-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  {project.category}
                </span>
                <p className="text-white text-xs font-semibold leading-tight mb-1">{project.title}</p>
                <p className="text-white/60 text-[10px]">{project.location}</p>
                <ExternalLink className="w-3.5 h-3.5 text-green-300 mt-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-outline">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
}
