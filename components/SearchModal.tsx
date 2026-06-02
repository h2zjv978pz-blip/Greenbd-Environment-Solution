'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Clock, Loader2, Command } from 'lucide-react';
import type { SearchResult } from '@/app/api/search/route';

const TYPE_COLORS: Record<string, string> = {
  Blog:     'bg-blue-100 text-blue-700',
  Project:  'bg-purple-100 text-purple-700',
  Service:  'bg-green-100 text-green-700',
  Research: 'bg-amber-100 text-amber-700',
  Team:     'bg-rose-100 text-rose-700',
  Law:      'bg-slate-100 text-slate-700',
  Download: 'bg-teal-100 text-teal-700',
  Page:     'bg-gray-100 text-gray-600',
};

const SUGGESTIONS = [
  'Climate resilience', 'Environmental Impact Assessment', 'Flood mapping',
  'Sundarbans', 'GIS analysis', 'Water quality', 'Biodiversity',
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const router    = useRouter();
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLDivElement>(null);

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(-1);
  const [recent,  setRecent]  = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches
  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem('greenbd_recent_searches') ?? '[]')); } catch { /**/ }
  }, []);

  // Auto-focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setFocused(-1);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch { setResults([]); }
    setLoading(false);
    setFocused(-1);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => doSearch(query), 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  const saveRecent = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 6);
    setRecent(updated);
    try { localStorage.setItem('greenbd_recent_searches', JSON.stringify(updated)); } catch { /**/ }
  };

  const navigate = (result: SearchResult) => {
    saveRecent(query);
    onClose();
    if (result.url.startsWith('/#') || result.url.startsWith('#')) {
      const hash = result.url.replace(/^\//, '');
      if (window.location.pathname !== '/') {
        router.push('/' + hash);
      } else {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(result.url);
    }
  };

  const handleSuggestion = (s: string) => { setQuery(s); inputRef.current?.focus(); };

  // Group results by type
  const groups: Record<string, SearchResult[]> = {};
  results.forEach(r => { (groups[r.type] ??= []).push(r); });
  const flatResults = results; // for keyboard nav

  // Keyboard navigation
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, flatResults.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, -1)); }
    if (e.key === 'Enter' && focused >= 0 && flatResults[focused]) navigate(flatResults[focused]);
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focused >= 0 && listRef.current) {
      const el = listRef.current.querySelector(`[data-idx="${focused}"]`) as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [focused]);

  if (!open) return null;

  const hasResults = results.length > 0;
  const showEmpty  = query.trim().length >= 2 && !loading && !hasResults;
  const showHome   = query.trim().length < 2;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[10vh]"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* ── Input bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          {loading
            ? <Loader2 className="w-5 h-5 text-primary-500 flex-shrink-0 animate-spin" />
            : <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search pages, projects, services, blog…"
            className="flex-1 text-gray-900 text-base placeholder-gray-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-md border border-gray-200 font-mono">
            ESC
          </kbd>
        </div>

        {/* ── Results / Home ────────────────────────────────────── */}
        <div ref={listRef} className="overflow-y-auto flex-1">

          {/* Home state: recent + suggestions */}
          {showHome && (
            <div className="p-5 space-y-5">
              {recent.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Recent Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map(r => (
                      <button key={r} onClick={() => handleSuggestion(r)}
                        className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-3 py-1.5 rounded-full transition-colors">
                        <Clock className="w-3 h-3 text-gray-400" />{r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Suggested Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => handleSuggestion(s)}
                      className="text-sm text-gray-600 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-3 py-1.5 rounded-full transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-50 pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['📁', 'Projects', '/#projects'],
                    ['⚙️', 'Services', '/#services'],
                    ['📰', 'Blog & News', '/resources/blog'],
                    ['⚖️', 'Environmental Laws', '/resources/laws'],
                    ['📥', 'Downloads', '/resources/downloads'],
                    ['🗺️', 'Climate Map', '/#climate-map'],
                  ].map(([icon, label, url]) => (
                    <button key={String(url)} onClick={() => { onClose(); router.push(String(url)); }}
                      className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl transition-colors text-left">
                      <span className="text-base">{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium text-gray-500">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Try different keywords or browse Quick Links above</p>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <div className="py-2">
              <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </div>
              {Object.entries(groups).map(([type, items]) => (
                <div key={type}>
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-y border-gray-100">
                    {type} ({items.length})
                  </div>
                  {items.map(item => {
                    const globalIdx = flatResults.indexOf(item);
                    const isActive  = focused === globalIdx;
                    return (
                      <button
                        key={`${item.type}-${item.title}-${item.url}`}
                        data-idx={globalIdx}
                        onClick={() => navigate(item)}
                        onMouseEnter={() => setFocused(globalIdx)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${isActive ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[item.type] ?? 'bg-gray-100 text-gray-500'}`}>
                              {item.type}
                            </span>
                            {item.category && (
                              <span className="text-[10px] text-gray-400">{item.category}</span>
                            )}
                          </div>
                          <p className={`font-semibold text-sm mt-0.5 truncate ${isActive ? 'text-primary-700' : 'text-gray-800'}`}>
                            {item.title}
                          </p>
                          {item.excerpt && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.excerpt}</p>
                          )}
                        </div>
                        <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-2 transition-opacity ${isActive ? 'opacity-100 text-primary-500' : 'opacity-0'}`} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px]">↵</kbd> Open</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px]">Esc</kbd> Close</span>
          </div>
          <div className="flex items-center gap-1 text-gray-300">
            <Command className="w-3 h-3" /><span>GreenBD Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
