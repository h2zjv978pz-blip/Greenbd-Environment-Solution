'use client';

import { useEffect } from 'react';

// Records exactly one visit per browser session (sessionStorage-deduped),
// mirroring the splashShown pattern in SplashScreen.tsx.
export default function VisitTracker() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return;

    try {
      if (sessionStorage.getItem('visitRecorded')) return;
      sessionStorage.setItem('visitRecorded', '1');
    } catch {
      // sessionStorage unavailable — still record, just without dedup
    }
    fetch('/api/visits', { method: 'POST' }).catch(() => {});
  }, []);

  return null;
}
