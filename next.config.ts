import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Rewrites for local development with subdomains
  async rewrites() {
    return {
      beforeFiles: [
        // event.localhost:3000 -> /event/* (exclude static paths)
        {
          source: '/:path((?!_next|api|favicon|logos|images).*)',
          has: [{ type: 'host', value: 'event.localhost' }],
          destination: '/event/:path',
        },
        // donasi.localhost:3000 -> /donasi/* (exclude static paths)
        {
          source: '/:path((?!_next|api|favicon|logos|images).*)',
          has: [{ type: 'host', value: 'donasi.localhost' }],
          destination: '/donasi/:path',
        },
      ],
    };
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
