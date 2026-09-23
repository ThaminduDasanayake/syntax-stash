"use client";

import { useState } from "react";

import { cn, isValidHttpUrl } from "@/lib/utils";

export type IconColorOption = "dark" | "light" | "invert";
export type IconSpacingOption = "padded" | "fill";
export type IconBgOption = "dark" | "light" | "invert" | "fill" | string;

export function parseIconStyle(iconBg?: string | null): {
  color: IconColorOption;
  spacing: IconSpacingOption;
} {
  const normalized = (iconBg || "").toLowerCase().trim();
  const isLight = normalized.includes("light") || normalized.includes("white");
  const isInvert = normalized.includes("invert");
  const isFill = normalized.includes("fill") || normalized.includes("full");

  const color: IconColorOption = isLight ? "light" : isInvert ? "invert" : "dark";
  const spacing: IconSpacingOption = isFill ? "fill" : "padded";

  return { color, spacing };
}

export function serializeIconStyle(color: IconColorOption, spacing: IconSpacingOption): string {
  if (spacing === "fill") {
    return color === "dark" ? "fill" : `${color} fill`;
  }
  return color;
}

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

  const { color, spacing } = parseIconStyle(iconBg);
  const isWhiteTile = color === "light" || iconClassName?.includes("bg-white");
  const isInverted = color === "invert" || iconClassName?.includes("invert");
  const isFill =
    spacing === "fill" ||
    Boolean(iconClassName?.includes("fill") || iconClassName?.includes("object-cover"));

  if (!cleanFavicon || state.error) {
    return (
      <div
        className={cn(
          className,
          "card-icon-box flex items-center justify-center overflow-hidden rounded-[22%]",
          isFill ? "p-0" : "p-0.75",
          isWhiteTile && "bg-white! text-black!",
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
      style={{
        colorScheme: isWhiteTile ? "light" : "dark",
      }}
      className={cn(
        className,
        "card-icon-box flex items-center justify-center overflow-hidden rounded-[22%] text-black dark:text-white",
        isFill ? "p-0" : "p-0.5",
        isWhiteTile && "bg-white! text-black!",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{
          colorScheme: isWhiteTile ? "light" : "dark",
        }}
        className={cn(
          "size-full text-inherit",
          isFill ? "object-cover" : "object-contain",
          isInverted && "brightness-125 invert",
          iconClassName,
        )}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
