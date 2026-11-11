import type { NextConfig } from 'next';

const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

export default {
  poweredByHeader: false,
  typescript: { tsconfigPath: 'tsconfig.app.json' },
  headers: async () => [{ source: '/:path*', headers: SECURITY_HEADERS }],
} satisfies NextConfig;
