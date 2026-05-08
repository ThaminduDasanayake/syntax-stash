import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "unavatar.io" },
    ],
  },
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default withSentryConfig(nextConfig, {
  org: "Thamindu",
  project: "syntax-stash",
  sentryUrl: "https://app.glitchtip.com",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
