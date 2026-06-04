export const metadata = { title: 'Photo Gallery', description: 'Visual documentation of environmental projects, field surveys and community programmes across Bangladesh.', alternates: { canonical: 'https://greenbd23.com/resources/gallery' } };

import { readData } from '@/lib/data';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

interface Album {
  id: number; title: string; category: string;
  coverImage: string; description: string; images: string[];
}

export default function GalleryPage() {
  const { albums = [] } = readData<{ albums: Album[] }>('gallery');
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="mb-12">
        <p className="section-subtitle mb-2">Visual Stories</p>
        <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">Image Gallery</h1>
        <p className="text-gray-500 max-w-2xl">
          A visual journey through our field work, community programs, and environmental monitoring
          operations across Bangladesh.
        </p>
      </div>
      <GalleryClient albums={albums} />
    </div>
  );
}
