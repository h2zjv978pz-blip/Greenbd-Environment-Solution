'use client';

import { useRef, useState, DragEvent } from 'react';
import { Upload, Link, X, ImageIcon, Loader2, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

type Tab = 'upload' | 'url';

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [tab, setTab] = useState<Tab>('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState(value.startsWith('/') || value === '' ? '' : value);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const applyUrl = () => {
    if (urlInput.trim()) onChange(urlInput.trim());
  };

  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          <img
            src={value}
            alt="preview"
            className="w-full h-44 object-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <button
            onClick={() => { onChange(''); setUrlInput(''); }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full truncate max-w-[80%]">
            {value.startsWith('/uploads/') ? '📁 Local upload' : '🔗 External URL'}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-3">
        {(['upload', 'url'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'upload' ? <><Upload className="w-3.5 h-3.5" /> Upload from Computer</> : <><Link className="w-3.5 h-3.5" /> Paste Image URL</>}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all select-none ${
              dragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
            } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-primary-600">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Uploading…</p>
              </div>
            ) : value && !error ? (
              <div className="flex flex-col items-center gap-2 text-green-600">
                <CheckCircle className="w-8 h-8" />
                <p className="text-sm font-medium">Image uploaded — click to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <ImageIcon className="w-8 h-8" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Drop image here or click to browse</p>
                  <p className="text-xs mt-0.5">JPG, PNG, WEBP, GIF — max 5 MB</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex-shrink-0"
          >
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
