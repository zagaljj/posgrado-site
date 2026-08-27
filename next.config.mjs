/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/adminlanding',
        destination: '/adminlanding.html',
      },
    ];
  },
};

export default nextConfig;
