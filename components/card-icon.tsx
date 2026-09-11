"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

// In-memory set of favicons successfully loaded during the session
const loadedFavicons = new Set<string>();

export function CardIcon({
  alt,
  className = "bg-background",
  favicon,
}: {
  alt: string;
  className?: string;
  favicon?: string | null;
}) {
  const cleanFavicon = favicon?.trim() || "";
  const isExternal =
    Boolean(cleanFavicon) &&
    (cleanFavicon.startsWith("http://") || cleanFavicon.startsWith("https://")) &&
    !cleanFavicon.startsWith("/api/proxy-image");

  const [state, setState] = useState<{ directFallback: boolean; error: boolean; url: string }>({
    directFallback: false,
    error: false,
    url: cleanFavicon,
  });

  if (state.url !== cleanFavicon) {
    setState({
      directFallback: false,
      error: false,
      url: cleanFavicon,
    });
  }

  const handleError = () => {
    // If the proxy fails (e.g. timeout or blocked host), fall back to direct URL
    if (isExternal && !state.directFallback) {
      setState((prev) => ({ ...prev, directFallback: true }));
    } else {
      setState((prev) => ({ ...prev, error: true }));
    }
  };

  const handleLoad = () => {
    if (cleanFavicon) {
      loadedFavicons.add(cleanFavicon);
    }
  };

  if (!cleanFavicon || state.error) {
    return <div className={cn(className, "card-icon-box p-1")} />;
  }

  // Route external favicons through our caching proxy for fast SWR caching and CORS stability
  const currentSrc =
    isExternal && !state.directFallback
      ? `/api/proxy-image?url=${encodeURIComponent(cleanFavicon)}`
      : cleanFavicon;

  return (
    <div className={cn(className, "card-icon-box p-1")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-contain"
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
