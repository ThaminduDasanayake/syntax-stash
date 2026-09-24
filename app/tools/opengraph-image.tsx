import { ImageResponse } from "next/og";

import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { siteConfig } from "@/lib/site-config";
import { internalTools } from "@/lib/tools-data";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image() {
  const [fonts] = await Promise.all([getOgFonts()]);
  const toolCount = internalTools.length;

  return new ImageResponse(
    <OgTemplate
      badgeText={`${siteConfig.url.replace(/^https?:\/\//, "")}/tools`}
      description="Formatters, converters, regex testers, diff viewers, and generator studios running 100% in your browser."
      stat1={{
        color: "#e8a52b",
        label: "BUILT-IN UTILITIES",
        subtext: "Interactive Browser Tools",
        value: toolCount,
      }}
      stat2={{
        color: "#a855f7",
        label: "CLIENT-SIDE",
        subtext: "Zero Server Calls & Private",
        value: "100%",
      }}
      stat3={{
        color: "#10b981",
        label: "FREE & OPEN",
        subtext: "No Limits or Accounts",
        value: "100%",
      }}
      title="Browser-Native Developer Utilities"
    />,
    {
      ...size,
      fonts,
    },
  );
}
