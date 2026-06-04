/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Standalone output — bundles everything needed for any deployment ───────
  // postbuild.js copies data/ and public/ into .next/standalone/ automatically
  output: 'standalone',

  // ── Include data/ in every serverless function bundle ──────────────────────
  // Moved from experimental in Next.js 15.5
  outputFileTracingIncludes: {
    '/**': ['./data/**'],
  },

  // ── Fix workspace root detection when multiple lockfiles exist ────────────
  outputFileTracingRoot: require('path').join(__dirname),

  // ── Image domains ──────────────────────────────────────────────────────────
  images: {
    unoptimized: true,           // allow <img> tags with uploaded paths
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'i.ytimg.com' },        // YouTube thumbnails
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i3.ytimg.com' },
      { protocol: 'https', hostname: '**.google.com' },       // Google Maps/Earth tiles
      { protocol: 'https', hostname: '**.googleapis.com' },
      { protocol: 'https', hostname: '**.openstreetmap.org' },
      { protocol: 'https', hostname: '**.basemaps.cartocdn.com' },
    ],
  },

  // ── Dashboard URL alias (/dashboard → /admin) ─────────────────────────────
  async redirects() {
    return [
      { source: '/dashboard',          destination: '/admin',          permanent: false },
      { source: '/dashboard/:path*',   destination: '/admin/:path*',   permanent: false },
    ];
  },

  // ── API CORS headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
