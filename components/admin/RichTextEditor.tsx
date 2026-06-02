'use client';

import { useRef, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Eraser,
} from 'lucide-react';

const FONTS = [
  { label: 'Inter',           value: 'Inter, sans-serif'          },
  { label: 'Poppins',         value: 'Poppins, sans-serif'        },
  { label: 'Georgia',         value: 'Georgia, serif'             },
  { label: 'Arial',           value: 'Arial, sans-serif'          },
  { label: 'Helvetica',       value: 'Helvetica, sans-serif'      },
  { label: 'Times New Roman', value: 'Times New Roman, serif'     },
  { label: 'Courier New',     value: 'Courier New, monospace'     },
];

// Maps to HTML font sizes 1–7 (browser defaults)
const SIZES = [
  { label: '10px', value: '1' },
  { label: '12px', value: '2' },
  { label: '14px', value: '3' },
  { label: '18px', value: '4' },
  { label: '24px', value: '5' },
  { label: '32px', value: '6' },
  { label: '48px', value: '7' },
];

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const BTN = 'w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors flex-shrink-0';
const SEP = <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content…',
  minHeight   = 100,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSaved = useRef('');

  // Sync controlled value → DOM only when it changed externally (e.g. switching items)
  useEffect(() => {
    if (!editorRef.current) return;
    if (value !== lastSaved.current) {
      editorRef.current.innerHTML = value ?? '';
      lastSaved.current = value ?? '';
    }
  }, [value]);

  const emit = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastSaved.current = html;
    onChange(html);
  }, [onChange]);

  // Use onMouseDown + preventDefault so the editor never loses focus/selection when clicking toolbar
  const exec = (cmd: string, val?: string) => {
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    emit();
  };

  const tbBtn = (title: string, cmd: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button type="button" title={title}
      onMouseDown={e => { e.preventDefault(); exec(cmd); }}
      className={BTN}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50">

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-100">

        {tbBtn('Bold',          'bold',         Bold)}
        {tbBtn('Italic',        'italic',       Italic)}
        {tbBtn('Underline',     'underline',    Underline)}
        {tbBtn('Strikethrough', 'strikeThrough',Strikethrough)}

        {SEP}

        {tbBtn('Align Left',   'justifyLeft',   AlignLeft)}
        {tbBtn('Align Center', 'justifyCenter', AlignCenter)}
        {tbBtn('Align Right',  'justifyRight',  AlignRight)}
        {tbBtn('Justify',      'justifyFull',   AlignJustify)}

        {SEP}

        {/* Font family */}
        <select
          defaultValue=""
          onMouseDown={e => e.stopPropagation()}
          onChange={e => { if (e.target.value) { exec('fontName', e.target.value); e.target.value = ''; } }}
          title="Font Family"
          className="h-[26px] text-xs border border-gray-200 rounded-md px-1.5 bg-white focus:outline-none focus:border-emerald-400 cursor-pointer max-w-[80px]"
        >
          <option value="" disabled>Font</option>
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        {/* Font size */}
        <select
          defaultValue=""
          onMouseDown={e => e.stopPropagation()}
          onChange={e => { if (e.target.value) { exec('fontSize', e.target.value); e.target.value = ''; } }}
          title="Font Size"
          className="h-[26px] w-[66px] text-xs border border-gray-200 rounded-md px-1.5 bg-white focus:outline-none focus:border-emerald-400 cursor-pointer"
        >
          <option value="" disabled>Size</option>
          {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {SEP}

        {/* Text color — label wraps hidden color input so clicking the "A" opens the picker */}
        <label className={`${BTN} cursor-pointer relative overflow-hidden`} title="Text Color">
          <span className="text-xs font-bold leading-none">A</span>
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onInput={e => exec('foreColor', (e.target as HTMLInputElement).value)}
          />
        </label>

        {/* Highlight color */}
        <label className={`${BTN} cursor-pointer relative overflow-hidden`} title="Highlight Color">
          <span className="text-[10px] font-bold leading-none px-0.5 bg-yellow-300 rounded">H</span>
          <input
            type="color"
            defaultValue="#fef08a"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onInput={e => exec('hiliteColor', (e.target as HTMLInputElement).value)}
          />
        </label>

        {SEP}

        {/* Clear formatting */}
        {tbBtn('Clear Formatting', 'removeFormat', Eraser)}
      </div>

      {/* ── Content editable area ────────────────────────────────────────── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={() => setTimeout(emit, 0)}
        data-placeholder={placeholder}
        style={{ minHeight, padding: '10px 14px', outline: 'none', lineHeight: 1.65, fontSize: 14 }}
        className="text-gray-800 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:pointer-events-none"
      />
    </div>
  );
}
