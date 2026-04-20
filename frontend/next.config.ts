import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker standalone 模式
  output: 'standalone',

  typedRoutes: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
