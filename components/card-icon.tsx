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

  if (!favicon || hasError) {
    return <div className={cn(className, "card-icon-box p-1")} />;
  }

  return (
    <div className={cn(className, "card-icon-box p-1")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={favicon}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
