/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Rewrite /diplomados/:slug to Landing Base
      {
        source: '/diplomados/:slug',
        destination: 'https://udi-landing-admin.vercel.app/:slug',
      },
      {
        source: '/diplomados/:slug/assets/:path*',
        destination: 'https://udi-landing-admin.vercel.app/:slug/assets/:path*',
      },
      // Rewrite direct slug e.g. /fullstack
      {
        source: '/fullstack',
        destination: 'https://udi-landing-admin.vercel.app/fullstack',
      },
      {
        source: '/fullstack/assets/:path*',
        destination: 'https://udi-landing-admin.vercel.app/fullstack/assets/:path*',
      },
    ];
  },
};

export default nextConfig;
