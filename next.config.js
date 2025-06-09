/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    output: 'standalone',
    poweredByHeader: false,
    reactStrictMode: true,
  };
  
  module.exports = nextConfig;
  