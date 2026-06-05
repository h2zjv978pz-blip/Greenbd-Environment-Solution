import { ImageResponse } from 'next/og';

export const runtime     = 'edge';
export const size        = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#16a34a',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ color: 'white', fontSize: 20, fontWeight: 900, lineHeight: 1 }}>G</div>
    </div>,
    { width: 32, height: 32 }
  );
}
