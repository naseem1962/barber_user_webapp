/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', pathname: '**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://barber-app-backend.vercel.app/api',
  },
};

module.exports = nextConfig;
