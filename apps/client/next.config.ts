import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost'
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1'
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos'
            },
            {
                protocol: 'https',
                hostname: 'example.com'
            }
        ]
    },
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        typedRoutes: true
    }
};

export default nextConfig;
