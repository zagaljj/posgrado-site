/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/adminlanding',
        destination: '/adminlanding/index.html',
      },
      {
        source: '/adminlanding/',
        destination: '/adminlanding/index.html',
      },
    ];
  },
};

export default nextConfig;
