import { ImageResponse } from "next/og";

import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
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
      description="Formatters, converters, regex testers, diff viewers, and generator studios running 100% in your browser."
      eyebrow="Syntax Stash"
      statsText={`${toolCount} Built-in Developer Utilities`}
      title="Browser Tools Studio"
    />,
    {
      ...size,
      fonts,
    },
  );
}
