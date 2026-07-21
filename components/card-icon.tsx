import { useState } from "react";

import { cn } from "@/lib/utils";

function getFavicon(toolUrl: string, explicitFavicon?: string) {
  try {
    const url = new URL(toolUrl);
    const domain = url.hostname;
    const origin = url.origin;

    const sources: string[] = [];

    if (explicitFavicon) sources.push(explicitFavicon);

    // Higher quality favicon sources first
    sources.push(`${origin}/apple-touch-icon.png`);
    sources.push(`${origin}/favicon.svg`);
    sources.push(`${origin}/favicon.png`);
    sources.push(`${origin}/favicon.ico`);

    // Google fallback
    sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    return sources;
  } catch {
    return explicitFavicon ? [explicitFavicon] : [];
  }
}

export function CardIcon({
  alt,
  className = "bg-background",
  explicitFavicon,
  url,
}: {
  url: string;
  alt: string;
  className?: string;
  explicitFavicon?: string;
}) {
  const sources = getFavicon(url, explicitFavicon);
  const [index, setIndex] = useState(0);

  const src = sources[index];

  if (!src) {
    return <div className={cn(className, "card-icon-box p-1")} />;
  }

  return (
    <div className={cn(className, "card-icon-box p-1")}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-contain"
        onError={() => {
          if (index < sources.length - 1) {
            setIndex(index + 1);
          }
        }}
      />
    </div>
  );
}
