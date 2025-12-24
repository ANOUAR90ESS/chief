import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to acknowledge we're using Turbopack
  // and silence the warning
  turbopack: {},
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLOUDFLARE_API_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL,
  },
};

export default nextConfig;
