"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { WrenchIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ToolCard from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { internalTools } from "@/lib/tools-data";
import { Tool } from "@/types";

interface ToolsCarouselProps {
  tools: Tool[];
  totalCount: number;
}

export function ToolsCarousel({ tools, totalCount }: ToolsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    // Scroll by the container width (or 1 full set of cards)
    const scrollAmount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -scrollAmount : scrollAmount,
    });
  };

  return (
    <section className="featured-section">
      <div className="section-inner">
        <div className="featured-head">
          <div>
            <div className="text-primary mb-2 flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
              <WrenchIcon weight="bold" className="size-4" />
              <span>Interactive Utilities</span>
            </div>
            <h2 className="section-title">
              {internalTools.length} TOOLS,
              <em className="font-serif tracking-normal lowercase italic"> ready to use</em>.
            </h2>
          </div>
          <p className="featured-sub">
            Each card carries a working demo or generator. Click for the full utility.
          </p>
        </div>
        <div className="featured-track-wrap">
          <div ref={scrollRef} className="featured-track">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
        <div className="featured-controls">
          <Button asChild size="sm" variant="default">
            <Link href="/tools" className="text-display-xs">
              BROWSE ALL {totalCount} TOOLS{" "}
              <ArrowRightIcon weight="bold" className="ml-2 size-3.5" />
            </Link>
          </Button>

          <div className="featured-arrows">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="border-border hover:border-ink disabled:hover:border-border size-10 border-2 transition-all disabled:opacity-30"
            >
              <ArrowLeftIcon weight="bold" className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="border-border hover:border-ink disabled:hover:border-border size-10 border-2 transition-all disabled:opacity-30"
            >
              <ArrowRightIcon weight="bold" className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
