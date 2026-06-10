/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Standalone output — bundles everything needed for any deployment ───────
  // postbuild.js copies data/ and public/ into .next/standalone/ automatically
  output: 'standalone',

  // ── Performance & security ────────────────────────────────────────────────
  poweredByHeader: false,   // remove X-Powered-By: Next.js header
  compress: true,           // enable Gzip / Brotli on all responses

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

  // ── Headers: caching, security, CORS ─────────────────────────────────────
  async headers() {
    return [
      // ── Static Next.js bundles — content-hashed, cache 1 year ────────────
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // ── Admin dashboard — never cache (CDN caching here can serve stale
      //    or raw RSC payloads instead of the rendered HTML page) ─────────
      {
        source: '/admin/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
      // ── Uploaded images/audio served via /api/uploads ─────────────────────
      {
        source: '/api/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, must-revalidate' }],
      },
      // ── Public static files ───────────────────────────────────────────────
      {
        source: '/:path*.(ico|png|jpg|jpeg|webp|svg|woff2|woff)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }],
      },
      // ── Security headers (help Core Web Vitals & SEO trust signals) ───────
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      // ── API CORS ──────────────────────────────────────────────────────────
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
