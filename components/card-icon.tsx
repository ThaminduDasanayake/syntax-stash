import { useState } from "react";

import { cn } from "@/lib/utils";

export function CardIcon({
  alt,
  className = "bg-background",
  favicon,
}: {
  alt: string;
  className?: string;
  favicon?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isRetryingWithProxy, setIsRetryingWithProxy] = useState(false);

  const handleError = () => {
    if (
      favicon &&
      (favicon.startsWith("http://") || favicon.startsWith("https://")) &&
      !favicon.startsWith("/api/proxy-image") &&
      !isRetryingWithProxy
    ) {
      setIsRetryingWithProxy(true);
    } else {
      setHasError(true);
    }
  };

  if (!favicon || hasError) {
    return <div className={cn(className, "card-icon-box p-1")} />;
  }

  const currentSrc = isRetryingWithProxy
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
      />
    </div>
  );
}
