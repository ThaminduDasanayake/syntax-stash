import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  images: {
    remotePatterns: [
      { hostname: "logo.clearbit.com", protocol: "https" },
      { hostname: "unavatar.io", protocol: "https" },
      { hostname: "www.google.com", protocol: "https" },
    ],
  },
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
