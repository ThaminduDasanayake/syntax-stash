"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { WrenchIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ToolCard from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { internalTools } from "@/lib/tools-data";
import { InternalTool } from "@/types";

interface ToolsCarouselProps {
  tools: InternalTool[];
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

    const ro = new ResizeObserver(() => {
      checkScroll();
    });
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      ro.disconnect();
    };
  }, [tools]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    // Step by card width (280px) + gap (16px) = 296px
    const cardStep = 280 + 16;
    const currentIndex = Math.round(el.scrollLeft / cardStep);
    const targetIndex = direction === "left" ? Math.max(0, currentIndex - 1) : currentIndex + 1;
    const targetScrollLeft = targetIndex * cardStep;

    el.scrollTo({
      behavior: "smooth",
      left: targetScrollLeft,
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
            <ButtonGroup>
              <Button
                variant="secondary"
                className="h-10 w-10 border-[1.5px]"
                size="icon"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
              >
                <ArrowLeftIcon weight="bold" />
              </Button>
              <Button
                variant="secondary"
                className="h-10 w-10 border-[1.5px]"
                size="icon"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
              >
                <ArrowRightIcon weight="bold" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
