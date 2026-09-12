"use client";

import { useState } from "react";

import { cn, isValidHttpUrl } from "@/lib/utils";

// In-memory set of favicons successfully loaded during the session
const loadedFavicons = new Set<string>();

export function CardIcon({
  alt,
  className = "bg-background",
  favicon,
  iconBg,
  iconClassName,
}: {
  alt: string;
  className?: string;
  favicon?: string | null;
  iconBg?: "dark" | "light" | "invert" | string | null;
  iconClassName?: string;
}) {
  const cleanFavicon = favicon?.trim() || "";
  const isValidUrl =
    cleanFavicon.startsWith("/") ||
    cleanFavicon.startsWith("data:") ||
    isValidHttpUrl(cleanFavicon);

  const isExternal =
    Boolean(cleanFavicon) &&
    isValidUrl &&
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

  const isWhiteTile = iconBg === "light" || iconClassName?.includes("bg-white");
  const isInverted = iconBg === "invert" || iconClassName?.includes("invert");

  if (!cleanFavicon || state.error) {
    return (
      <div
        className={cn(
          className,
          "card-icon-box overflow-hidden rounded-[30%] p-0.5",
          isWhiteTile && "border-white/80! bg-white! text-black!",
        )}
      />
    );
  }

  // Route external favicons through our caching proxy for fast SWR caching and CORS stability
  const currentSrc =
    isExternal && !state.directFallback
      ? `/api/proxy-image?url=${encodeURIComponent(cleanFavicon)}`
      : cleanFavicon;

  return (
    <div
      className={cn(
        className,
        "card-icon-box overflow-hidden rounded-[30%] p-0.5",
        isWhiteTile && "border-white/80! bg-white! text-black!",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={cn(
          "h-full w-full rounded-[25%] object-contain",
          isInverted && "brightness-125 invert",
        )}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
