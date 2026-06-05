import { readData } from '@/lib/data';
import VideoClient from './VideoClient';

export const dynamic = 'force-dynamic'; // always read fresh from disk

interface Video {
  id: number; title: string; category: string; description: string;
  youtubeUrl: string; thumbnail: string; duration: string;
  date: string; featured: boolean; published: boolean;
}

export const metadata = {
  title: 'Environmental Video Library',
  description: 'Watch Green BD Environmental Solutions videos on climate change adaptation, EIA, GIS, disaster risk reduction, river erosion and sustainable development in Bangladesh.',
  keywords: [
    'environmental videos Bangladesh',
    'climate change Bangladesh video',
    'EIA documentary Bangladesh',
    'GIS remote sensing video Bangladesh',
    'Green BD media',
    'environmental education Bangladesh',
  ],
  alternates: { canonical: '/resources/video' },
  openGraph: {
    title:       'Environmental Video Library | Green BD Environmental Solutions',
    description: 'Educational videos on environmental consulting, climate change adaptation, EIA and sustainability in Bangladesh.',
    type:        'website',
    url:         'https://greenbd23.com/resources/video',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Green BD Video Library' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Environmental Video Library | Green BD',
    description: 'Watch videos on EIA, climate change, GIS and sustainability in Bangladesh from Green BD Environmental Solutions.',
    images:      ['/og-image.png'],
  },
};

export default function VideoPage() {
  const data = readData<{ videos: Video[] }>('videos');
  const published = (data.videos ?? []).filter(v => v.published);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg,#052e16 0%,#14532d 60%,#166534 100%)' }}
        className="py-16 text-center">
        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Green BD Media</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">Video Library</h1>
        <p className="text-green-200 max-w-xl mx-auto text-sm leading-relaxed px-4">
          Watch our environmental research insights, field work highlights, and educational content.
        </p>
        <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-xs">
          <span>🎬 {published.length} Videos</span>
          <span>•</span>
          <span>📂 {Array.from(new Set(published.map(v => v.category))).length} Categories</span>
        </div>
      </div>

      <VideoClient videos={published} />
    </div>
  );
}
