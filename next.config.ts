import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thirdeyesite.b-cdn.net",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
