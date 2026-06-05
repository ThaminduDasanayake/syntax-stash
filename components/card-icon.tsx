import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

function getFavicon(toolUrl: string, explicitFavicon?: string) {
  try {
    const url = new URL(toolUrl);
    const domain = url.hostname;
    const origin = url.origin;

    const sources: string[] = [];
    if (explicitFavicon) sources.push(explicitFavicon);

    sources.push(`${origin}/favicon.ico`);
    sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    return sources;
  } catch {
    return explicitFavicon ? [explicitFavicon] : [];
  }
}

export function CardIcon({
  url,
  alt,
  className = "",
  explicitFavicon,
}: {
  url: string;
  alt: string;
  className?: string;
  explicitFavicon?: string;
}) {
  const sources = getFavicon(url, explicitFavicon);
  const [index, setIndex] = useState(0);

  return (
    <div className="border-border bg-background relative flex h-12 w-12 shrink-0 items-center justify-center rounded-none border-2 p-1">
      <Image
        src={sources[index]}
        alt={alt}
        width={24}
        height={24}
        unoptimized
        className={cn("h-full w-full object-contain", className)}
        onError={() => {
          if (index < sources.length - 1) {
            setIndex(index + 1);
          }
        }}
      />
    </div>
  );
}
