/**
 * Edge-compatible JWT verification using Web Crypto (no Node.js APIs).
 * Used only by middleware.ts which runs in the Edge Runtime.
 */

function base64urlToBuffer(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, sigB64] = parts;

    const secret = process.env.JWT_SECRET || 'greenbd-fallback-secret';
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const sigBytes = base64urlToBuffer(sigB64);
    const signature = sigBytes.buffer.slice(sigBytes.byteOffset, sigBytes.byteOffset + sigBytes.byteLength) as ArrayBuffer;

    const valid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!valid) return false;

    // Check expiry
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlToBuffer(payloadB64)),
    );
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}
