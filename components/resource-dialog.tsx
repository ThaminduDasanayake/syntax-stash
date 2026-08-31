"use client";

import {
  ArrowSquareOutIcon,
  BookmarkSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  XIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CopyButton } from "@/components/ui/copy-button";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSession } from "@/lib/auth-client";
import { resourceLinks } from "@/lib/resource-data";
import { cn, getCategoryTheme, THEME_CONFIG } from "@/lib/utils";
import { Resource } from "@/types";

export interface ResourceDialogProps {
  onTagClickAction?: (tag: string) => void;
  resource: Resource;
}

export function ResourceDialog({ onTagClickAction, resource }: ResourceDialogProps) {
  const [activeTool, setActiveTool] = useState(resource);
  const [ogError, setOgError] = useState(false);
  const [isRetryingOgProxy, setIsRetryingOgProxy] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrolledPastTitle, setScrolledPastTitle] = useState(false);
  const { data: session } = useSession();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(activeTool);

  const handleSelectTool = (res: Resource) => {
    setOgError(false);
    setIsRetryingOgProxy(false);
    setScrolledPastTitle(false);
    setActiveTool(res);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 100) {
      if (!scrolledPastTitle) setScrolledPastTitle(true);
    } else {
      if (scrolledPastTitle) setScrolledPastTitle(false);
    }
  };

  const currentIndex = useMemo(() => {
    return resourceLinks.findIndex((r) => r.title === activeTool.title);
  }, [activeTool]);

  const handleNext = () => {
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % resourceLinks.length;
    handleSelectTool(resourceLinks[nextIndex]);
  };

  const handlePrev = () => {
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + resourceLinks.length) % resourceLinks.length;
    handleSelectTool(resourceLinks[prevIndex]);
  };

  const activeTheme = getCategoryTheme(activeTool.category);
  const activeThemeStyles = THEME_CONFIG[activeTheme];
  const colorClasses = activeThemeStyles.bg;

  const authorResources = useMemo(() => {
    if (!activeTool.author) return [];
    return resourceLinks.filter(
      (r) => r.author === activeTool.author && r.title !== activeTool.title,
    );
  }, [activeTool]);

  const relatedResources = useMemo(() => {
    const activeTags = activeTool.tags || [];
    const scoredResources = resourceLinks
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
      return resourceLinks
        .filter(
          (r) =>
            r.category === activeTool.category &&
            r.title !== activeTool.title &&
            !authorResources.some((ar) => ar.title === r.title),
        )
        .slice(0, 3);
    }

    return scoredResources;
  }, [activeTool, authorResources]);

  const footerContent = (
    <>
      <div className="modal-launch flex items-center gap-1.5 sm:gap-2">
        <Button asChild size="sm" className="flex-1 px-2.5 sm:px-4">
          <a
            href={activeTool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mono-2xs sm:text-mono-xs w-full border-[1.5px]"
          >
            Open resource <ArrowSquareOutIcon weight="bold" />
          </a>
        </Button>
        {activeTool.gitHubLink && (
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="group shrink-0 border-[1.5px] px-2.5 sm:px-4"
          >
            <a
              href={activeTool.gitHubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono-2xs sm:text-mono-xs inline-flex items-center gap-1.5"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={18}
                height={18}
                className="size-4 transition-all group-hover:invert sm:size-4.5"
              />
              GitHub
            </a>
          </Button>
        )}
        <Button
          variant={bookmarked ? "default" : "secondary"}
          size="sm"
          onClick={() => {
            if (!session) {
              setAuthModalOpen(true);
              return;
            }
            toggleBookmark(activeTool);
          }}
          className="text-mono-2xs sm:text-mono-xs shrink-0 border-[1.5px] px-2.5 sm:px-4"
        >
          <BookmarkSimpleIcon weight={bookmarked ? "fill" : "bold"} className="size-4" />
          {bookmarked ? "Saved" : "Save"}
        </Button>
      </div>

      <div className="modal-nav-row">
        <ButtonGroup>
          <Button variant="secondary" size="icon" onClick={handlePrev}>
            <CaretLeftIcon />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleNext}>
            <CaretRightIcon />
          </Button>
        </ButtonGroup>
      </div>
    </>
  );

  return (
    <DialogContent showCloseButton={false} className="modal-panel flex! flex-col! gap-0! p-0!">
      {/* Desktop Close Button */}
      <div className="modal-top-actions hidden md:flex">
        <DialogClose asChild>
          <Button variant="secondary" size="icon" className="border-[1.5px]">
            <XIcon weight="bold" />
          </Button>
        </DialogClose>
      </div>

      {/* Mobile Fixed Top Bar with Theme Color & Scroll Transition */}
      <div
        className={cn(
          "z-30 flex shrink-0 items-center justify-between px-4 py-2.5 transition-colors duration-200 md:hidden",
          colorClasses,
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 pr-3">
          <span
            className={cn(
              "modal-cat-dot shrink-0",
              colorClasses.includes("bg-c-blue") ? "bg-background" : "bg-foreground",
            )}
          />

          {/* Smooth vertical transition between Category and Title */}
          <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
            <span
              className={cn(
                "text-mono-2xs absolute inset-0 flex items-center truncate font-bold tracking-wider uppercase transition-all duration-250 ease-out",
                scrolledPastTitle
                  ? "pointer-events-none -translate-y-full opacity-0"
                  : "translate-y-0 opacity-90",
              )}
            >
              {activeTool.category}
            </span>

            <span
              className={cn(
                "font-display absolute inset-0 flex items-center truncate text-xs font-bold tracking-tight uppercase transition-all duration-250 ease-out",
                scrolledPastTitle
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-full opacity-0",
              )}
            >
              {activeTool.title}
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <DialogClose asChild>
          <Button variant="secondary" size="icon" className="size-8 shrink-0 border-[1.5px]">
            <XIcon weight="bold" />
          </Button>
        </DialogClose>
      </div>

      <DialogDescription className="sr-only">
        Details and documentation for {activeTool.title} — categorized under {activeTool.category}.
      </DialogDescription>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="modal-body flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-color:var(--line-2)_transparent] md:grid md:grid-cols-[340px_1fr] md:overflow-hidden md:[scrollbar-color:var(--line-2)_var(--bg-2)] [&::-webkit-scrollbar-track]:bg-transparent md:[&::-webkit-scrollbar-track]:bg-(--bg-2) [&::-webkit-scrollbar-track:hover]:bg-transparent md:[&::-webkit-scrollbar-track:hover]:bg-(--bg-2)"
      >
        {/* Left Side */}
        <div
          className={cn(
            "modal-left flex shrink-0 flex-col border-b-2 px-5 pt-5 pb-6 md:overflow-y-auto md:border-r-2 md:border-b-0 md:px-7 md:py-8",
            colorClasses,
          )}
        >
          {/* Desktop Category and Icon Header */}
          <div className="modal-cat-label hidden md:flex">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "modal-cat-dot",
                  colorClasses.includes("bg-c-blue") ? "bg-background" : "bg-foreground",
                )}
              ></span>
              <Link
                href={`/resources/${activeTool.category}`}
                className="modal-cat-name modal-cat-link truncate"
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
            />
          </div>

          <DialogTitle className="modal-title">{activeTool.title}</DialogTitle>

          {activeTool.subtitle && <p className="modal-subtitle">{activeTool.subtitle}</p>}
          <p className="modal-description">{activeTool.description}</p>

          {activeTool.author && (
            <p className="modal-author">
              <a
                href={activeTool.authorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-author-link"
              >
                {activeTool.author}
              </a>
            </p>
          )}
        </div>

        {/* Right Side */}
        <div className="modal-right flex flex-col md:overflow-hidden">
          <div className="modal-content px-5 pt-5 pb-6 md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain md:px-8 md:pt-20 md:pb-5">
            {(() => {
              const handleOgError = () => {
                if (
                  activeTool.ogImage &&
                  (activeTool.ogImage.startsWith("http://") ||
                    activeTool.ogImage.startsWith("https://")) &&
                  !activeTool.ogImage.startsWith("/api/proxy-image") &&
                  !isRetryingOgProxy
                ) {
                  setIsRetryingOgProxy(true);
                } else {
                  setOgError(true);
                }
              };

              const currentOgSrc =
                isRetryingOgProxy && activeTool.ogImage
                  ? `/api/proxy-image?url=${encodeURIComponent(activeTool.ogImage)}`
                  : activeTool.ogImage;

              if (!currentOgSrc || ogError) return null;

              return (
                <div className="mb-5.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentOgSrc}
                    alt={activeTool.title}
                    className="h-auto w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={handleOgError}
                  />
                </div>
              );
            })()}

            <div className="modal-link">
              <span className={cn("modal-heading", activeThemeStyles.label)}>Resource URL</span>
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

            {activeTool.gitHubLink && (
              <div className="modal-link">
                <span className={cn("modal-heading", activeThemeStyles.label)}>GitHub</span>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={activeTool.gitHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs break-all underline decoration-current/40 underline-offset-2 transition-all duration-150 ease-out hover:decoration-current"
                  >
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={18}
                      height={18}
                      className="size-4.5"
                    />
                    {activeTool.gitHubLink}
                  </a>
                  <CopyButton
                    textToCopy={activeTool.gitHubLink}
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
              <div className="modal-sections">
                <div className="flex flex-wrap gap-1.5">
                  {activeTool.tags.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="xs"
                      onClick={() => onTagClickAction?.(tag)}
                      className={cn(
                        "text-mono-xs h-6 rounded-none border-[1.5px] px-2 py-0 font-bold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs",
                        activeThemeStyles.label,
                        activeThemeStyles.border,
                        activeThemeStyles.soft,
                      )}
                      title={`Filter by #${tag}`}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Author Resources Section */}
            {authorResources.length > 0 && (
              <div className="mb-5.5">
                <span className={cn("modal-heading", activeThemeStyles.label)}>
                  More by {activeTool.author}
                </span>
                <div className="modal-related-chips">
                  {authorResources.map((res) => {
                    const styles = THEME_CONFIG[getCategoryTheme(res.category)];
                    return (
                      <button
                        key={res.title}
                        onClick={() => handleSelectTool(res)}
                        className={cn("modal-related-chip group", styles.chip)}
                      >
                        <span className={cn("modal-chip-dot", styles.dot)} />
                        {res.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Section */}
            {relatedResources.length > 0 && (
              <div>
                <span className={cn("modal-heading", activeThemeStyles.label)}>Related</span>
                <div className="modal-related-chips">
                  {relatedResources.map((res) => {
                    const styles = THEME_CONFIG[getCategoryTheme(res.category)];
                    return (
                      <button
                        key={res.url || res.title}
                        onClick={() => handleSelectTool(res)}
                        className={cn("modal-related-chip group", styles.chip)}
                      >
                        <span className={cn("modal-chip-dot", styles.dot)} />
                        {res.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Footer inside right column */}
          <div className="hidden md:flex md:shrink-0 md:flex-col">{footerContent}</div>
        </div>
      </div>

      {/* Mobile Docked Footer at bottom of modal */}
      <div className="bg-paper z-20 flex shrink-0 flex-col border-t md:hidden">{footerContent}</div>

      {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
    </DialogContent>
  );
}
