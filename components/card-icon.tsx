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
  favicon?: string;
}) {
  const isExternal =
    favicon &&
    (favicon.startsWith("http://") || favicon.startsWith("https://")) &&
    !favicon.startsWith("/api/proxy-image");

  const [useDirectFallback, setUseDirectFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // If the proxy fails (e.g. timeout or blocked host), fall back to direct URL
    if (isExternal && !useDirectFallback) {
      setUseDirectFallback(true);
    } else {
      setHasError(true);
    }
  };

  const handleLoad = () => {
    if (favicon) {
      loadedFavicons.add(favicon);
    }
  };

  if (!favicon || hasError) {
    return <div className={cn(className, "card-icon-box p-1")} />;
  }

  // Route external favicons through our caching proxy for fast SWR caching and CORS stability
  const currentSrc =
    isExternal && !useDirectFallback
      ? `/api/proxy-image?url=${encodeURIComponent(favicon)}`
      : favicon;

  return (
    <div className={cn(className, "card-icon-box p-1")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
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
