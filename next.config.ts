import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/tienda',
        destination: '/productos',
        permanent: true,
      },
      {
        source: '/tienda/:path*',
        destination: '/productos',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
