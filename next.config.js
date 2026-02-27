/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',  // creates minimal deployable in .next/standalone
};
module.exports = nextConfig;