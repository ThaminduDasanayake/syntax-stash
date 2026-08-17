import type { NextConfig } from "next";

const lastUpdateDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
}).format(new Date());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LAST_UPDATE: lastUpdateDate,
  },
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
