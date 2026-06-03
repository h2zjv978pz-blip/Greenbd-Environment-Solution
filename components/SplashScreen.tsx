'use client';

import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

export default function SplashScreen() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in');

  useEffect(() => {
    if (sessionStorage.getItem('splashShown')) { setPhase('done'); return; }

    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('out'),  5000);  // fade starts at 5s
    const t3 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('splashShown', '1');
    }, 6000);  // done at 6s (5s + 1s fade)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0a1f12',
      opacity: phase === 'out' ? 0 : 1,
      transition: phase === 'out' ? 'opacity 1s ease-in-out' : 'none',
      pointerEvents: phase === 'out' ? 'none' : 'all',
    }}>

      {/* Logo icon — like ChatGPT style */}
      <div style={{
        width: 100, height: 100,
        borderRadius: 28,
        background: 'linear-gradient(145deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 48px rgba(0,0,0,0.5)',
        animation: 'iconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        marginBottom: 20,
      }}>
        <Leaf style={{
          width: 52, height: 52, color: 'white',
          animation: 'leafRotate 1.2s ease-out 0.3s both',
        }} />
      </div>

      {/* App name */}
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700, fontSize: 26,
        color: 'white', letterSpacing: '-0.3px',
        animation: 'fadeUp 0.5s ease-out 0.6s both',
      }}>
        Green BD
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400, fontSize: 12,
        color: 'rgba(134,239,172,0.7)',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        marginTop: 5,
        animation: 'fadeUp 0.5s ease-out 0.8s both',
      }}>
        Environmental Solutions
      </div>

      {/* Subtle glow ring behind logo */}
      <div style={{
        position: 'absolute',
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
        animation: 'glowPulse 2.5s ease-in-out infinite',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) translateY(-70px)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes iconPop {
          from { opacity:0; transform: scale(0.4); }
          to   { opacity:1; transform: scale(1);   }
        }
        @keyframes leafRotate {
          from { transform: rotate(-20deg) scale(0.8); opacity:0.5; }
          to   { transform: rotate(0deg)  scale(1);   opacity:1;   }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0);    }
        }
        @keyframes glowPulse {
          0%, 100% { opacity:0.6; transform: translate(-50%,-50%) translateY(-70px) scale(1);   }
          50%       { opacity:1;   transform: translate(-50%,-50%) translateY(-70px) scale(1.3); }
        }
      `}</style>
    </div>
  );
}
