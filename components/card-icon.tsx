"use client";

import { GlobeIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { cn, isValidHttpUrl } from "@/lib/utils";

export type IconColorOption = "none" | "dark" | "white" | "invert";
export type IconSpacingOption = "padded" | "fill";
export type IconBgOption = "none" | "dark" | "black" | "light" | "white" | "invert" | string;

export function parseIconStyle(iconBg?: string | null): {
  color: IconColorOption;
  spacing: IconSpacingOption;
} {
  const normalized = (iconBg || "").toLowerCase().trim();
  const isWhite = normalized.includes("white") || normalized.includes("light");
  const isInvert = normalized.includes("invert");
  const isDark =
    normalized === "dark" ||
    normalized === "black" ||
    normalized.includes("dark") ||
    normalized.includes("black");

  let color: IconColorOption = "none";
  if (isWhite) {
    color = "white";
  } else if (isInvert) {
    color = "invert";
  } else if (isDark) {
    color = "dark";
  } else {
    color = "none";
  }

  return { color, spacing: "fill" };
}

export function serializeIconStyle(color: IconColorOption, _spacing?: IconSpacingOption): string {
  return color;
}

// In-memory set of favicons successfully loaded during the session
const loadedFavicons = new Set<string>();

export function CardIcon({
  alt,
  className = "",
  favicon,
  iconBg,
  iconClassName,
}: {
  alt: string;
  className?: string;
  favicon?: string | null;
  iconBg?: "none" | "dark" | "black" | "light" | "white" | "invert" | string | null;
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

  const { color } = parseIconStyle(iconBg);
  const isWhiteTile = color === "white" || iconClassName?.includes("bg-white");
  const isDarkTile = color === "dark" || iconClassName?.includes("bg-black");
  const isInverted = color === "invert" || iconClassName?.includes("invert");

  if (!cleanFavicon || !isValidUrl || state.error) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          className,
          "card-icon-box flex items-center justify-center overflow-hidden rounded-[22%] p-0 select-none",
          isWhiteTile && "bg-white! text-black!",
          isDarkTile && "bg-black! text-white!",
          className,
        )}
      >
        <GlobeIcon weight="light" className="size-full" />
      </div>
    );
  }

  // Route external favicons through our caching proxy for fast SWR caching and CORS stability
  const currentSrc =
    isExternal && !state.directFallback
      ? `/api/proxy-image?url=${encodeURIComponent(cleanFavicon)}`
      : cleanFavicon;

  return (
    <div
      suppressHydrationWarning
      style={{
        colorScheme: isWhiteTile ? "light" : "dark",
      }}
      className={cn(
        className,
        "card-icon-box flex items-center justify-center overflow-hidden rounded-[22%] p-0 text-black dark:text-white",
        isWhiteTile && "bg-white! text-black!",
        isDarkTile && "bg-black! text-white!",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentSrc}
        suppressHydrationWarning
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          colorScheme: isWhiteTile ? "light" : "dark",
        }}
        className={cn(
          "size-full object-contain text-inherit",
          isInverted && "brightness-125 invert",
          iconClassName,
        )}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
