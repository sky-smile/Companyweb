import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker standalone 模式
  output: 'standalone',

  typedRoutes: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },

  // 开发环境：将 /uploads 请求代理到后端 API 服务器
  // 生产环境由 Nginx 直接处理，此 rewrite 不会触发
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
    const backendOrigin = apiBase.replace(/\/api$/, '');
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
