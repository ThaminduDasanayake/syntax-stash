"use client";

import { ArrowUpIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const isResourcesPage = pathname?.startsWith("/resources");

  useEffect(() => {
    if (!isResourcesPage) return;

    const toggleVisibility = () => {
      // Show button after scrolling past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    // Check initial scroll state
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [isResourcesPage]);

  if (!isResourcesPage) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  return (
    <div
      className={cn(
        "fixed right-5 bottom-5 z-40 transition-all duration-300 ease-out sm:right-8 sm:bottom-8",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="border-ink bg-background text-ink hover:border-ink hover:bg-primary hover:text-primary-foreground group size-10 rounded-none border-[1.5px] shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 sm:size-11"
          >
            <ArrowUpIcon
              weight="bold"
              className="size-4.5 transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p className="font-mono text-xs">Back to top</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
