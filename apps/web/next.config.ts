import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cross-subdomain cookies are now handled by better-auth configuration
  // No rewrites needed - the auth client calls the API directly
    typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
