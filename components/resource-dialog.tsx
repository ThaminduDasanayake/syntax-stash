"use client";

import {
  ArrowSquareOutIcon,
  BookmarkSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  StarIcon,
  XIcon,
} from "@phosphor-icons/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { AuthorSocialLinks } from "@/components/author-social-links";
import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CopyButton } from "@/components/ui/copy-button";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSession } from "@/lib/auth-client";
import { formatStarCount, getGitHubStars } from "@/lib/github";
import {
  cn,
  getCategoryTheme,
  parseAuthors,
  parseOgImageStyle,
  slugifyAuthor,
  THEME_CONFIG,
} from "@/lib/utils";
import { Resource } from "@/types";

export interface ResourceDialogProps {
  allResources?: Resource[];
  onTagClickAction?: (tag: string) => void;
  originRect?: DOMRect | null;
  resource: Resource;
}

export function ResourceDialog({
  allResources,
  onTagClickAction,
  originRect,
  resource,
}: ResourceDialogProps) {
  const [activeTool, setActiveTool] = useState(resource);
  const [fetchedResources, setFetchedResources] = useState<Resource[]>([]);

  useEffect(() => {
    if (!allResources || allResources.length === 0) {
      fetch("/api/resources")
        .then((res) => res.json())
        .then((data) => {
          if (data.resources && Array.isArray(data.resources)) {
            setFetchedResources(data.resources);
          }
        })
        .catch(() => {});
    }
  }, [allResources]);

  const resourcePool = allResources && allResources.length > 0 ? allResources : fetchedResources;
  const currentOg = activeTool.ogImage?.trim() || "";
  const [ogState, setOgState] = useState<{ directFallback: boolean; error: boolean; url: string }>({
    directFallback: false,
    error: false,
    url: currentOg,
  });

  if (ogState.url !== currentOg) {
    setOgState({
      directFallback: false,
      error: false,
      url: currentOg,
    });
  }

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const gitHubStars = getGitHubStars(activeTool.github);
  const formattedStars = gitHubStars !== null ? formatStarCount(gitHubStars) : null;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const titleAnchorRef = useRef<HTMLDivElement>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement>(null);
  const mobileCategoryRef = useRef<HTMLSpanElement>(null);
  const coordsRef = useRef({
    restingX: 20,
    restingY: 122,
    stickDist: 104.5,
    targetScale: 0.5,
    targetX: 32,
    targetY: 16,
  });
  const { data: session } = useSession();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(activeTool);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [savePopTick, setSavePopTick] = useState(0);

  const measureCoords = useCallback(() => {
    if (titleAnchorRef.current && dialogContentRef.current) {
      const dialogRect = dialogContentRef.current.getBoundingClientRect();
      const anchorRect = titleAnchorRef.current.getBoundingClientRect();
      if (anchorRect.top > 0) {
        const restingY = anchorRect.top - dialogRect.top;
        const restingX = anchorRect.left - dialogRect.left;
        const targetY = 16;
        const targetX = 32;
        const stickDist = Math.max(1, restingY - targetY);
        const targetScale = 0.5;
        coordsRef.current = { restingX, restingY, stickDist, targetScale, targetX, targetY };
        return coordsRef.current;
      }
    }
    return coordsRef.current;
  }, []);

  const resetMobileHeader = useCallback(() => {
    const coords = measureCoords();
    if (mobileTitleRef.current) {
      gsap.killTweensOf(mobileTitleRef.current);
      gsap.set(mobileTitleRef.current, {
        scale: 1,
        transformOrigin: "left top",
        x: 0,
        y: 0,
      });
      mobileTitleRef.current.style.top = `${coords.restingY}px`;
      mobileTitleRef.current.style.left = `${coords.restingX}px`;
      mobileTitleRef.current.style.width = "calc(100% - 40px)";
      mobileTitleRef.current.style.whiteSpace = "normal";
      mobileTitleRef.current.style.overflow = "visible";
      mobileTitleRef.current.style.textOverflow = "clip";
    }
    if (mobileCategoryRef.current) {
      gsap.killTweensOf(mobileCategoryRef.current);
      gsap.set(mobileCategoryRef.current, { opacity: 1, y: 0 });
    }
  }, [measureCoords]);

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    const el = dialogContentRef.current;
    if (!el || !originRect) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    hasAnimatedRef.current = true;

    const dialogRect = el.getBoundingClientRect();
    if (!dialogRect.width || !dialogRect.height) return;

    const cardCenterX = originRect.left + originRect.width / 2;
    const cardCenterY = originRect.top + originRect.height / 2;
    const dialogCenterX = dialogRect.left + dialogRect.width / 2;
    const dialogCenterY = dialogRect.top + dialogRect.height / 2;

    const deltaX = cardCenterX - dialogCenterX;
    const deltaY = cardCenterY - dialogCenterY;
    const scaleX = Math.max(0.1, originRect.width / dialogRect.width);
    const scaleY = Math.max(0.1, originRect.height / dialogRect.height);

    const tween = gsap.fromTo(
      el,
      {
        borderRadius: "16px",
        opacity: 0.85,
        scaleX,
        scaleY,
        transformOrigin: "center center",
        x: deltaX,
        xPercent: -50,
        y: deltaY,
        yPercent: -50,
      },
      {
        borderRadius: "24px",
        clearProps: "transform,borderRadius,opacity",
        duration: 0.38,
        ease: "power3.out",
        onComplete: () => {
          resetMobileHeader();
        },
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        x: 0,
        xPercent: -50,
        y: 0,
        yPercent: -50,
      },
    );

    return () => {
      tween.kill();
    };
  }, [originRect, resetMobileHeader]);

  useEffect(() => {
    const timer = setTimeout(() => {
      resetMobileHeader();
    }, 20);
    return () => clearTimeout(timer);
  }, [activeTool, resetMobileHeader]);

  const handleSelectTool = useCallback(
    (res: Resource) => {
      setActiveTool(res);
      resetMobileHeader();
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      if (rightContentRef.current) {
        rightContentRef.current.scrollTop = 0;
      }
      setTimeout(() => {
        resetMobileHeader();
      }, 20);
    },
    [resetMobileHeader],
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const { restingX, restingY, stickDist, targetScale, targetX, targetY } = coordsRef.current;

    // 1. Give it a wider runway (e.g. 0.35 instead of 0.7)
    const startScroll = stickDist * 0.35;
    const rawProgress = Math.min(
      1,
      Math.max(0, (scrollTop - startScroll) / (stickDist - startScroll)),
    );

    // 2. Smoothstep easing for a luxurious, natural feel
    const morphProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

    if (mobileTitleRef.current) {
      let currentY: number;
      if (scrollTop <= 0 && titleAnchorRef.current && dialogContentRef.current) {
        const dialogRect = dialogContentRef.current.getBoundingClientRect();
        const anchorRect = titleAnchorRef.current.getBoundingClientRect();
        currentY = anchorRect.top - dialogRect.top - restingY;
      } else {
        currentY = scrollTop < stickDist ? -scrollTop : targetY - restingY;
      }
      const currentX = (targetX - restingX) * morphProgress;
      const currentScale = 1 - (1 - targetScale) * morphProgress;

      gsap.set(mobileTitleRef.current, {
        scale: currentScale,
        transformOrigin: "left top",
        x: currentX,
        y: currentY,
      });

      if (morphProgress >= 0.98) {
        mobileTitleRef.current.style.width = `calc((100% - 110px) / ${targetScale})`;
        mobileTitleRef.current.style.whiteSpace = "nowrap";
        mobileTitleRef.current.style.overflow = "hidden";
        mobileTitleRef.current.style.textOverflow = "ellipsis";
      } else {
        mobileTitleRef.current.style.width = "calc(100% - 40px)";
        mobileTitleRef.current.style.whiteSpace = "normal";
        mobileTitleRef.current.style.overflow = "visible";
        mobileTitleRef.current.style.textOverflow = "clip";
      }
    }

    if (mobileCategoryRef.current) {
      gsap.set(mobileCategoryRef.current, {
        opacity: Math.max(0, 1 - morphProgress * 1.8),
        y: -14 * morphProgress,
      });
    }
  };

  const currentIndex = useMemo(() => {
    return resourcePool.findIndex(
      (r) =>
        (activeTool.id && r.id === activeTool.id) ||
        (activeTool.url && r.url === activeTool.url) ||
        r.title === activeTool.title,
    );
  }, [activeTool, resourcePool]);

  const handleNext = useCallback(() => {
    if (currentIndex === -1 || resourcePool.length === 0) return;
    const nextIndex = (currentIndex + 1) % resourcePool.length;
    handleSelectTool(resourcePool[nextIndex]);
  }, [currentIndex, handleSelectTool, resourcePool]);

  const handlePrev = useCallback(() => {
    if (currentIndex === -1 || resourcePool.length === 0) return;
    const prevIndex = (currentIndex - 1 + resourcePool.length) % resourcePool.length;
    handleSelectTool(resourcePool[prevIndex]);
  }, [currentIndex, handleSelectTool, resourcePool]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (authModalOpen) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [authModalOpen, handleNext, handlePrev]);

  const activeTheme = getCategoryTheme(activeTool.category);
  const activeThemeStyles = THEME_CONFIG[activeTheme];

  const authorResources = useMemo(() => {
    if (!activeTool.author) return [];
    const currentAuthors = parseAuthors(activeTool.author);
    if (currentAuthors.length === 0) return [];

    return resourcePool
      .filter((r) => {
        if (r.title === activeTool.title || !r.author) return false;
        const rAuthors = parseAuthors(r.author);
        return currentAuthors.some((ca) =>
          rAuthors.some(
            (ra) =>
              ra.toLowerCase() === ca.toLowerCase() || slugifyAuthor(ra) === slugifyAuthor(ca),
          ),
        );
      })
      .sort((a, b) => {
        const aSameCat = a.category === activeTool.category ? 0 : 1;
        const bSameCat = b.category === activeTool.category ? 0 : 1;
        return aSameCat - bSameCat;
      });
  }, [activeTool, resourcePool]);

  const parsedAuthors = useMemo(() => parseAuthors(activeTool.author), [activeTool.author]);
  const visibleAuthorResources = useMemo(() => authorResources.slice(0, 6), [authorResources]);
  const hiddenAuthorCount = authorResources.length - visibleAuthorResources.length;
  const singleAuthorHref =
    parsedAuthors.length === 1 ? `/authors/${slugifyAuthor(parsedAuthors[0])}` : null;

  const relatedResources = useMemo(() => {
    const activeTags = activeTool.tags || [];
    const scoredResources = resourcePool
      .filter(
        (r) => r.title !== activeTool.title && !authorResources.some((ar) => ar.title === r.title),
      )
      .map((r) => {
        const resourceTags = r.tags || [];
        const intersection = resourceTags.filter((tag) => activeTags.includes(tag));
        // Add a slight boost if they share the same category
        const categoryBoost = r.category === activeTool.category ? 0.5 : 0;
        return {
          resource: r,
          score: intersection.length + categoryBoost,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.resource);

    if (scoredResources.length === 0) {
      return resourcePool
        .filter(
          (r) =>
            r.category === activeTool.category &&
            r.title !== activeTool.title &&
            !authorResources.some((ar) => ar.title === r.title),
        )
        .slice(0, 3);
    }

    return scoredResources;
  }, [activeTool, authorResources, resourcePool]);

  const footerContent = (
    <>
      <div className="modal-launch flex items-center gap-1.5 sm:gap-2">
        <Button asChild size="default" className="flex-1 px-4">
          <a
            href={activeTool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mono-2xs sm:text-mono-xs w-full"
          >
            Open resource <ArrowSquareOutIcon weight="bold" />
          </a>
        </Button>
        {activeTool.github && (
          <Button
            asChild
            variant="secondary"
            size="default"
            className="group shrink-0 px-3.5 sm:px-4"
          >
            <a
              href={activeTool.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono-2xs sm:text-mono-xs inline-flex items-center gap-1.5"
              aria-label="GitHub repository"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={16}
                height={16}
                className="size-4 shrink-0 transition-transform group-hover:scale-105"
              />
              <span className="hidden sm:inline">GitHub</span>
              {formattedStars && (
                <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 transition-colors">
                  <StarIcon weight="fill" className="text-star size-3.5 shrink-0" />
                  <span>{formattedStars}</span>
                </span>
              )}
            </a>
          </Button>
        )}
        <Button
          variant="secondary"
          size="default"
          onMouseEnter={() => setIsSaveHovered(true)}
          onMouseLeave={() => setIsSaveHovered(false)}
          onClick={() => {
            if (!session) {
              setAuthModalOpen(true);
              return;
            }
            if (!bookmarked) {
              setSavePopTick((t) => t + 1);
            }
            toggleBookmark(activeTool);
          }}
          aria-label={bookmarked ? "Saved" : "Save"}
          className={cn(
            "group/save text-mono-2xs sm:text-mono-xs shrink-0 px-3.5 transition-[transform,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4",
            bookmarked
              ? "border-primary/40 bg-primary/15 text-primary hover:border-primary/70 hover:bg-primary/25 hover:text-primary"
              : "hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
          )}
        >
          <span
            key={savePopTick}
            className={cn(
              "inline-flex items-center justify-center transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/save:scale-110 motion-reduce:transition-none motion-reduce:group-hover/save:scale-100",
              savePopTick > 0 &&
                bookmarked &&
                "animate-[bookmark-pop_360ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none",
            )}
          >
            <BookmarkSimpleIcon
              weight={bookmarked ? "fill" : isSaveHovered ? "duotone" : "bold"}
              className="size-4"
            />
          </span>
          <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
        </Button>
      </div>

      <div className="modal-nav-row">
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 tabular-nums">
          {currentIndex !== -1 && resourcePool.length > 0 && (
            <span>
              {currentIndex + 1} / {resourcePool.length}
            </span>
          )}
          <span className="hidden text-zinc-600 sm:inline">← →</span>
        </div>
        <ButtonGroup>
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePrev}
            aria-label="Previous resource"
          >
            <CaretLeftIcon />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleNext} aria-label="Next resource">
            <CaretRightIcon />
          </Button>
        </ButtonGroup>
      </div>
    </>
  );

  return (
    <DialogContent
      ref={dialogContentRef}
      disableDefaultAnimation={Boolean(originRect)}
      showCloseButton={false}
      className="modal-panel bg-background fixed! top-1/2! left-1/2! flex! -translate-x-1/2! -translate-y-1/2! flex-col! gap-0! overflow-hidden! p-0!"
    >
      {/* Desktop Close Button */}
      <div className="modal-top-actions hidden md:flex">
        <DialogClose asChild>
          <Button variant="secondary" size="icon">
            <XIcon weight="bold" />
          </Button>
        </DialogClose>
      </div>

      {/* Mobile Fixed Top Bar */}
      <div className="text-foreground z-30 flex h-12 shrink-0 items-center justify-between border-b-[1.5px] border-white/8 bg-[#18181b] px-4 md:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-2 pr-3">
          <span className="bg-primary size-2 shrink-0 rounded-full" />

          <div className="relative h-5 min-w-0 flex-1">
            {/* Category label */}
            <span
              ref={mobileCategoryRef}
              className="text-mono-2xs text-muted-foreground pointer-events-none absolute inset-0 flex items-center truncate font-bold tracking-wider uppercase"
            >
              {activeTool.category}
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <DialogClose asChild>
          <Button variant="secondary" size="icon" className="size-8 shrink-0">
            <XIcon weight="bold" />
          </Button>
        </DialogClose>
      </div>

      {/* The Single Mobile Morphing Title Element */}
      <h2
        ref={mobileTitleRef}
        className="font-display text-foreground pointer-events-none absolute z-30 block font-extrabold tracking-tight uppercase [-webkit-font-smoothing:antialiased] will-change-transform select-none backface-hidden md:hidden"
        style={{
          fontSize: "clamp(30px, 2.5vw, 40px)",
          left: "20px",
          lineHeight: 1,
          top: "122px",
          transformOrigin: "left top",
          width: "calc(100% - 40px)",
        }}
      >
        {activeTool.title}
      </h2>

      <DialogDescription className="sr-only">
        Details and documentation for {activeTool.title} — categorized under {activeTool.category}.
      </DialogDescription>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="modal-body flex min-h-0 flex-1 [scrollbar-color:var(--line-2)_transparent] flex-col overflow-y-auto overscroll-none md:grid md:grid-cols-[340px_1fr] md:overflow-hidden md:overscroll-contain [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track:hover]:bg-transparent"
      >
        {/* Left Side */}
        <div className="modal-left text-foreground relative flex shrink-0 flex-col border-b-[1.5px] border-white/8 bg-[#141416] px-5 pt-3 pb-6 md:overflow-y-auto md:border-r md:border-b-0 md:px-7 md:py-8">
          {/* Desktop Category Header */}
          <div className="modal-cat-label hidden md:flex">
            <div className="flex min-w-0 items-center gap-2">
              <span className="bg-primary size-2 shrink-0 rounded-full" />
              <Link
                href={`/resources/${activeTool.category}`}
                className="modal-cat-name text-muted-foreground hover:text-foreground truncate font-mono text-xs font-semibold"
              >
                {activeTool.category}
              </Link>
            </div>

            {/* Desktop Icon in header */}
            <div className="hidden md:block">
              <CardIcon
                key={`desktop-${activeTool.url}`}
                alt={activeTool.title}
                className={activeTool.className}
                favicon={activeTool.favicon}
                iconBg={activeTool.iconBg || undefined}
                iconClassName={activeTool.className}
              />
            </div>
          </div>

          {/* Mobile Icon above Title */}
          <div className="mb-3.5 block md:hidden">
            <CardIcon
              key={`mobile-${activeTool.url}`}
              alt={activeTool.title}
              className={activeTool.className}
              favicon={activeTool.favicon}
              iconBg={activeTool.iconBg || undefined}
              iconClassName={activeTool.className}
            />
          </div>

          {/* Desktop Title */}
          <DialogTitle className="modal-title text-foreground hidden md:block">
            {activeTool.title}
          </DialogTitle>

          {/* Mobile Spacer (same dimensions as headline, invisible) */}
          <div
            ref={titleAnchorRef}
            className="modal-title pointer-events-none opacity-0 select-none md:hidden"
            aria-hidden="true"
          >
            {activeTool.title}
          </div>
          {/* Mobile Accessibility Title */}
          <DialogTitle className="sr-only md:hidden">{activeTool.title}</DialogTitle>

          {activeTool.subtitle && (
            <p className="modal-subtitle text-muted-foreground">{activeTool.subtitle}</p>
          )}
          <p className="modal-description text-foreground/90 border-t border-white/8">
            {activeTool.description}
          </p>

          {activeTool.author &&
            (() => {
              const authorList: string[] = parseAuthors(activeTool.author);

              if (authorList.length === 0) return null;

              return (
                <div className="mt-auto flex flex-col gap-2.5 pt-4 md:pt-6">
                  <p className="modal-author text-muted-foreground mt-0! flex flex-wrap items-center gap-1 pt-0!">
                    {authorList.map((authorName, index) => (
                      <span key={authorName} className="inline-flex items-center">
                        {index > 0 && <span className="mr-1 opacity-60">&</span>}
                        <Link
                          href={`/authors/${slugifyAuthor(authorName)}`}
                          className="modal-author-link text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {authorName}
                        </Link>
                      </span>
                    ))}
                  </p>
                  {authorList.length === 1 && activeTool.authorLinks && (
                    <AuthorSocialLinks links={activeTool.authorLinks} size="sm" variant="subtle" />
                  )}
                </div>
              );
            })()}
        </div>

        {/* Right Side */}
        <div className="modal-right bg-background flex flex-col md:overflow-hidden">
          <div
            ref={rightContentRef}
            className="modal-content [scrollbar-color:var(--line-2)_transparent] px-5 pt-5 pb-6 md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain md:px-8 md:pt-14 md:pb-5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track:hover]:bg-transparent"
          >
            {(() => {
              if (!currentOg || ogState.error) return null;

              const isExternalOg =
                (currentOg.startsWith("http://") || currentOg.startsWith("https://")) &&
                !currentOg.startsWith("/api/proxy-image");

              const handleOgError = () => {
                if (isExternalOg && !ogState.directFallback) {
                  setOgState((prev) => ({ ...prev, directFallback: true }));
                } else {
                  setOgState((prev) => ({ ...prev, error: true }));
                }
              };

              const currentOgSrc =
                isExternalOg && !ogState.directFallback
                  ? `/api/proxy-image?url=${encodeURIComponent(currentOg)}`
                  : currentOg;

              const { bg, fit } = parseOgImageStyle(activeTool.ogImageBg);
              const hasCustomBg = bg !== "none";
              const isContain = fit === "contain" || hasCustomBg;

              return (
                <div
                  className={cn(
                    "mb-5.5 overflow-hidden rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
                    hasCustomBg
                      ? bg === "white"
                        ? "bg-white"
                        : bg === "dark"
                          ? "bg-[#09090b]"
                          : bg === "zinc"
                            ? "bg-zinc-900"
                            : "bg-[#18181b]"
                      : "bg-[#18181b]",
                  )}
                  style={
                    hasCustomBg && (bg.startsWith("#") || bg.startsWith("rgb"))
                      ? { backgroundColor: bg }
                      : undefined
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={currentOgSrc}
                    src={currentOgSrc}
                    alt={activeTool.title}
                    className={cn(
                      "w-full",
                      isContain ? "max-h-72 object-contain" : "h-auto object-cover",
                    )}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={handleOgError}
                  />
                </div>
              );
            })()}

            <div className="mb-5.5 flex flex-col items-start">
              <span className={cn("text-display-2xs mb-2.5 block", activeThemeStyles.label)}>
                Resource URL
              </span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={activeTool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs break-all underline decoration-current/40 underline-offset-2 transition-all duration-150 ease-out hover:decoration-current"
                >
                  {activeTool.url}
                </a>
                <CopyButton
                  textToCopy={activeTool.url || ""}
                  iconOnly
                  size="icon-xs"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Copy Resource URL"
                />
              </div>
            </div>

            {activeTool.github && (
              <div className="mb-5.5 flex flex-col items-start">
                <div className="mb-2.5 flex w-full items-center gap-4">
                  <span className={cn("text-display-2xs", activeThemeStyles.label)}>GitHub</span>
                  {formattedStars && (
                    <span
                      className="text-muted-foreground inline-flex items-center gap-1 font-mono text-xs leading-none uppercase tabular-nums"
                      title={`${gitHubStars?.toLocaleString()} GitHub stars`}
                    >
                      <StarIcon weight="fill" className="text-star size-3.5 shrink-0" />
                      <span className="leading-none">{formattedStars}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={activeTool.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs break-all underline decoration-current/40 underline-offset-2 transition-all duration-150 ease-out hover:decoration-current"
                  >
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={16}
                      height={16}
                      className="size-4"
                    />
                    {activeTool.github}
                  </a>
                  <CopyButton
                    textToCopy={activeTool.github}
                    iconOnly
                    size="icon-xs"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground shrink-0"
                    aria-label="Copy GitHub URL"
                  />
                </div>
              </div>
            )}

            {activeTool.tags && activeTool.tags.length > 0 && (
              <div className="mb-5.5">
                <span className={cn("text-display-2xs mb-2.5 block", activeThemeStyles.label)}>
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...activeTool.tags]
                    .sort((a, b) => a.localeCompare(b))
                    .map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="xs"
                        onClick={() => onTagClickAction?.(tag)}
                        className="text-mono-xs border-brand-purple/25 bg-brand-purple/5 text-foreground hover:border-brand-purple/50 hover:bg-brand-purple/15 h-7 rounded-full border-[1.5px] px-3 py-1 font-semibold transition-all duration-150 hover:-translate-y-0.5"
                        title={`Filter by #${tag}`}
                      >
                        <span className="text-brand-purple mr-1 font-bold">#</span>
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Author Resources Section */}
            {authorResources.length > 0 && activeTool.author && (
              <div className="mb-5.5">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span className={cn("text-display-2xs block", activeThemeStyles.label)}>
                    More by {parsedAuthors.join(" & ")}
                  </span>
                  {singleAuthorHref ? (
                    <Link
                      href={singleAuthorHref}
                      className="text-muted-foreground hover:text-primary shrink-0 font-mono text-[11px] font-semibold transition-colors hover:underline"
                    >
                      View all ({authorResources.length + 1}) →
                    </Link>
                  ) : null}
                </div>
                <div className="modal-related-chips">
                  {visibleAuthorResources.map((res) => (
                    <button
                      key={res.url || res.title}
                      onClick={() => handleSelectTool(res)}
                      className="modal-related-chip group"
                    >
                      <span className="modal-chip-dot" />
                      <span className="truncate">{res.title}</span>
                    </button>
                  ))}
                  {hiddenAuthorCount > 0 && singleAuthorHref && (
                    <Link
                      href={singleAuthorHref}
                      className="modal-related-chip hover:text-primary text-zinc-400"
                    >
                      <span>+{hiddenAuthorCount} more →</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Related Section */}
            {relatedResources.length > 0 && (
              <div>
                <span className={cn("text-display-2xs mb-2.5 block", activeThemeStyles.label)}>
                  Related
                </span>
                <div className="modal-related-chips">
                  {relatedResources.map((res) => (
                    <button
                      key={res.url || res.title}
                      onClick={() => handleSelectTool(res)}
                      className="modal-related-chip group"
                    >
                      <span className="modal-chip-dot" />
                      <span className="truncate">{res.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Footer inside right column */}
          <div className="hidden md:flex md:shrink-0 md:flex-col">{footerContent}</div>
        </div>
      </div>

      {/* Mobile Docked Footer at bottom of modal */}
      <div className="z-20 flex shrink-0 flex-col border-t-[1.5px] border-white/8 bg-[#141416] md:hidden">
        {footerContent}
      </div>

      {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
    </DialogContent>
  );
}
