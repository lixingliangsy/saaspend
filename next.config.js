/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => { config.resolve = config.resolve || {}; config.resolve.fallback = { ...(config.resolve.fallback || {}), fs: false, path: false }; return config },

  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
module.exports = nextConfig;
