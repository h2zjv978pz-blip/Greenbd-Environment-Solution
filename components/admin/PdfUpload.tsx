'use client';

import { useRef, useState } from 'react';
import { FileText, Upload, Link, X, Loader2, CheckCircle, ExternalLink } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

type Tab = 'upload' | 'url';

export default function PdfUpload({ value, onChange }: Props) {
  const [tab,       setTab]       = useState<Tab>('upload');
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [urlInput,  setUrlInput]  = useState(value.startsWith('http') ? value : '');
  const inputRef = useRef<HTMLInputElement>(null);

  const filename = value ? value.split('/').pop() ?? 'document.pdf' : '';
  const isLocal  = value.startsWith('/uploads/');

  const upload = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return; }
    if (file.size > 20 * 1024 * 1024)   { setError('PDF must be under 20 MB.'); return; }
    setUploading(true); setError('');
    const form = new FormData();
    form.append('file', file);
    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const applyUrl = () => {
    if (urlInput.trim()) onChange(urlInput.trim());
  };

  return (
    <div>
      {/* Current PDF indicator */}
      {value && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3">
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{filename}</p>
            <p className="text-xs text-gray-400">{isLocal ? '📁 Local upload' : '🔗 External URL'}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href={value} target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button onClick={() => { onChange(''); setUrlInput(''); }}
              className="w-7 h-7 bg-white border border-red-200 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-3">
        {(['upload', 'url'] as Tab[]).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'upload'
              ? <><Upload className="w-3.5 h-3.5" /> Upload PDF</>
              : <><Link  className="w-3.5 h-3.5" /> Paste URL</>}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div>
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              uploading ? 'border-gray-200 opacity-70 pointer-events-none' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
            }`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-primary-600">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Uploading PDF…</p>
              </div>
            ) : value && isLocal ? (
              <div className="flex flex-col items-center gap-2 text-green-600">
                <CheckCircle className="w-8 h-8" />
                <p className="text-sm font-medium">PDF uploaded — click to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <FileText className="w-8 h-8" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Drop PDF here or click to browse</p>
                  <p className="text-xs mt-0.5">PDF only — max 20 MB</p>
                </div>
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
            onChange={e => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = ''; }} />
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyUrl()}
            placeholder="https://example.com/paper.pdf"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
          <button type="button" onClick={applyUrl}
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex-shrink-0">
            Apply
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
