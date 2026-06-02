'use client';

import { useState } from 'react';
import { Languages, Loader2, CheckCircle2 } from 'lucide-react';

export interface TranslateField {
  text: string;
  onResult: (translated: string) => void;
  stripHtml?: boolean;
}

interface Props {
  fields: TranslateField[];
  label?: string;
}

export default function AutoTranslateButton({ fields, label = 'Auto Translate to Bangla' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleTranslate = async () => {
    const nonEmpty = fields.filter(f => f.text?.trim());
    if (!nonEmpty.length) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: fields.map(f => f.text),
          from: 'en',
          to: 'bn',
          stripHtmlTags: fields.some(f => f.stripHtml),
        }),
      });

      const { translations, error } = await res.json();
      if (error) throw new Error(error);

      translations.forEach((translated: string, i: number) => {
        if (translated) fields[i].onResult(translated);
      });

      setStatus('done');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('idle');
      alert('Auto-translation failed. Please check your internet connection and try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={status === 'loading'}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg disabled:opacity-60 transition-all"
      style={{ backgroundColor: status === 'done' ? '#00d97e' : '#5741a8' }}
    >
      {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {status === 'done'    && <CheckCircle2 className="w-3.5 h-3.5" />}
      {status === 'idle'    && <Languages className="w-3.5 h-3.5" />}
      {status === 'loading' ? 'অনুবাদ হচ্ছে…' : status === 'done' ? 'অনুবাদ সম্পন্ন!' : label}
    </button>
  );
}
