import { ImageResponse } from 'next/og';

export const runtime     = 'edge';
export const alt         = 'Green BD Environmental Solutions — Climate & EIA Consultancy Bangladesh';
export const contentType = 'image/png';
export const size        = { width: 1200, height: 630 };

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '72px 80px',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 400, height: 400, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
      }} />
      <div style={{
        position: 'absolute', top: 60, right: 60,
        width: 220, height: 220, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
      }} />

      {/* Logo badge */}
      <div style={{
        background: '#16a34a',
        borderRadius: '20px',
        width: 100, height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        border: '3px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        <div style={{ color: 'white', fontSize: 56, fontWeight: 900, lineHeight: 1 }}>G</div>
      </div>

      {/* Company name */}
      <div style={{
        color: 'white', fontSize: 80, fontWeight: 900,
        lineHeight: 1, marginBottom: 12, letterSpacing: '-2px',
      }}>
        Green BD
      </div>

      {/* Tagline */}
      <div style={{
        color: '#86efac', fontSize: 38, fontWeight: 600, marginBottom: 28,
      }}>
        Environmental Solutions
      </div>

      {/* Description */}
      <div style={{
        color: '#bbf7d0', fontSize: 22, lineHeight: 1.5,
        maxWidth: 720, marginBottom: 44,
      }}>
        Leading environmental consultancy in Bangladesh — EIA, Climate Change Adaptation, GIS &amp; Remote Sensing, Disaster Risk Reduction.
      </div>

      {/* Services pills */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        {['EIA', 'Climate', 'GIS / RS', 'DRR', 'Sustainability'].map(s => (
          <div key={s} style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 100, padding: '8px 20px',
            color: '#d1fae5', fontSize: 16, fontWeight: 600,
            display: 'flex',
          }}>{s}</div>
        ))}
      </div>

      {/* Domain */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 100, padding: '10px 28px',
        color: '#4ade80', fontSize: 22, fontWeight: 700,
        display: 'flex',
      }}>
        greenbd23.com
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
