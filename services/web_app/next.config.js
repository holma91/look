/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.vercel.store',
      },
      {
        protocol: 'https',
        hostname: 'softgoat.centracdn.net',
      },
    ],
  },
};

module.exports = nextConfig;
