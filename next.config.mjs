/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/landing-pdf/*': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
};

export default nextConfig;
