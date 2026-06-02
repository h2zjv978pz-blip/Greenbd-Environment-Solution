'use client';

import dynamic from 'next/dynamic';

const BangladeshClimateMap = dynamic(
  () => import('@/components/BangladeshClimateMap'),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: '100vh', background: 'linear-gradient(135deg,#0f4c3a,#1a6b52)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, border: '4px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', borderRadius: '50%',
                      animation: 'spin 0.9s linear infinite' }} />
        <p style={{ color: 'white', fontWeight: 600, fontSize: 15, opacity: 0.9 }}>
          Loading Bangladesh Climate Intelligence Dashboard…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default function ClimateMapSection() {
  return (
    <section id="climate-map" style={{ background: '#0f172a' }}>
      <BangladeshClimateMap />
    </section>
  );
}
