import { readData } from '@/lib/data';
import { Download, FileText, FileArchive, Calendar, HardDrive } from 'lucide-react';

interface DownloadItem {
  id: number; title: string; category: string;
  fileUrl: string; fileType: string; fileSize: string;
  description: string; date: string; downloadCount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Reports':   'bg-blue-100 text-blue-700',
  'Guides':    'bg-green-100 text-green-700',
  'Technical': 'bg-purple-100 text-purple-700',
  'Policy':    'bg-amber-100 text-amber-700',
  'Data':      'bg-rose-100 text-rose-700',
};

const FILE_ICONS: Record<string, React.ReactNode> = {
  'PDF': <FileText className="w-8 h-8 text-red-500" />,
  'ZIP': <FileArchive className="w-8 h-8 text-yellow-500" />,
};

export const dynamic = 'force-dynamic';

export default function DownloadsPage() {
  const { downloads = [] } = readData<{ downloads: DownloadItem[] }>('downloads');

  const categories = ['All', ...new Set(downloads.map(d => d.category))];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="section-subtitle mb-2">Free Resources</p>
        <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">Downloads & Guides</h1>
        <p className="text-gray-500 max-w-2xl">
          Free reports, guides, toolkits, and technical manuals from Green BD Environmental Solutions —
          supporting evidence-based environmental practice across Bangladesh.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <span key={cat} className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-default transition-colors
            ${cat === 'All' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {cat}
          </span>
        ))}
      </div>

      {downloads.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Download className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No downloads available yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map(item => (
            <div key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                  {FILE_ICONS[item.fileType] ?? <FileText className="w-8 h-8 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {item.category}
                  </span>
                  <h2 className="font-heading font-bold text-gray-900 text-base leading-snug mt-1.5 line-clamp-2">
                    {item.title}
                  </h2>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{item.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(item.date).toLocaleDateString('en-GB', { month:'short', year:'numeric' })}</span>
                <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" />{item.fileSize}</span>
                <span className="font-medium text-gray-500">{item.fileType}</span>
              </div>
              {item.fileUrl ? (
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" download
                  className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  <Download className="w-4 h-4" /> Download {item.fileType}
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-400 text-sm font-semibold py-2.5 rounded-xl cursor-not-allowed">
                  <Download className="w-4 h-4" /> Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
