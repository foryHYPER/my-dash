/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make environment variables available to both server and client
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Other Next.js configurations
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['uzthbqcqitljcymiohwe.supabase.co'],
  },
};

export default nextConfig; 