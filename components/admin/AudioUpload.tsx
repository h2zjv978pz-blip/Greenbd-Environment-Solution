'use client';

import { useRef, useState } from 'react';
import { Upload, Music, X, Loader2, HardDrive } from 'lucide-react';

interface Props {
  value?: string;          // current stored URL
  onChange: (url: string | null, name?: string) => void;
}

export default function AudioUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (MP3, WAV, OGG, M4A…)');
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch('/api/upload/audio', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) onChange(data.url, data.name);
      else throw new Error(data.error ?? 'Upload failed');
    } catch (e) {
      alert(String(e));
    } finally {
      setUploading(false);
    }
  };

  const fileName = value ? decodeURIComponent(value.split('/').pop()?.replace(/^\d+-/, '') ?? '') : '';

  return (
    <div>
      <input ref={inputRef} type="file" accept="audio/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />

      {value ? (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <Music className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-emerald-700 truncate flex-1" title={fileName}>{fileName}</span>
          <button onClick={() => inputRef.current?.click()} title="Replace file"
            className="text-emerald-500 hover:text-emerald-700 transition-colors flex-shrink-0">
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onChange(null)} title="Remove file"
            className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 w-full border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-emerald-600 transition-all group">
          {uploading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <HardDrive className="w-4 h-4 group-hover:text-emerald-500" />}
          <span className="font-medium">{uploading ? 'Uploading…' : 'Upload from local drive (MP3, WAV, OGG…)'}</span>
        </button>
      )}
    </div>
  );
}
