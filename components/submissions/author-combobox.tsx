"use client";

import { UserIcon } from "@phosphor-icons/react";
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { cn, parseAuthors, slugifyAuthor } from "@/lib/utils";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface AuthorLinks {
  blog?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
}

export interface AuthorOption {
  count?: number;
  id?: string;
  links?: AuthorLinks | null;
  name: string;
  slug: string;
}

export interface AuthorComboboxProps {
  allowCustom?: boolean;
  className?: string;
  containerClassName?: string;
  corner?: number;
  disabled?: boolean;
  height?: number;
  label?: string;
  maxAuthors?: number;
  onChange: (value: string) => void;
  onRequestCreateAuthor?: (authorName: string) => void;
  onSelectAuthor?: (author: AuthorOption) => void;
  placeholder?: string;
  required?: boolean;
  suffix?: React.ReactNode;
  theme?: "light" | "dark";
  value: string | string[] | null | undefined;
}

// Global module cache to prevent duplicate requests across renders
let cachedAuthors: AuthorOption[] | null = null;
let fetchPromise: Promise<AuthorOption[]> | null = null;

// Cross-tab synchronization channel
let authorsChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    authorsChannel = new BroadcastChannel("syntax-stash-authors");
  } catch {
    // Fallback if BroadcastChannel is not permitted in sandbox
  }
}

export function invalidateAuthorCache() {
  cachedAuthors = null;
  fetchPromise = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("syntax-stash-authors-updated"));
  }
  try {
    authorsChannel?.postMessage({ type: "AUTHORS_INVALIDATE" });
  } catch {
    // Ignore cross-tab messaging failure
  }
}

export function registerNewAuthorLocally(newAuthor: AuthorOption) {
  if (!cachedAuthors) {
    cachedAuthors = [newAuthor];
  } else if (
    !cachedAuthors.some(
      (a) => a.slug === newAuthor.slug || a.name.toLowerCase() === newAuthor.name.toLowerCase(),
    )
  ) {
    cachedAuthors = [...cachedAuthors, newAuthor].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }
  fetchPromise = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("syntax-stash-authors-updated"));
  }
}

export async function fetchAuthorList(forceRefresh = false): Promise<AuthorOption[]> {
  if (!forceRefresh && cachedAuthors) return cachedAuthors;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch("/api/authors", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load authors");
      const data = await res.json();
      const list: AuthorOption[] = data.authors || [];
      cachedAuthors = list.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
      return cachedAuthors!;
    } catch {
      return cachedAuthors || [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function AuthorCombobox({
  className,
  containerClassName,
  corner = 20,
  disabled = false,
  height: propH = 52,
  label: customLabel = "Creator Attribution",
  maxAuthors = 10,
  onChange,
  onSelectAuthor,
  placeholder = "Search creators in catalog...",
  required = false,
  suffix,
  theme = "dark",
  value,
}: AuthorComboboxProps) {
  const isDark = theme === "dark";
  const rawLabel = customLabel || "Creator Attribution";
  const displayLabel = required && !rawLabel.includes("*") ? `${rawLabel} *` : rawLabel;
  const generatedId = useId().replace(/:/g, "");
  const id = `acb-${generatedId}`;

  const [authors, setAuthors] = useState<AuthorOption[]>(() => {
    if (!cachedAuthors) return [];
    return [...cachedAuthors].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  });

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const anchor = useComboboxAnchor();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chipsWrapperRef = useRef<HTMLDivElement | null>(null);
  const trailingRef = useRef<HTMLDivElement | null>(null);

  const [measuredWidth, setMeasuredWidth] = useState<number>(320);
  const [measuredHeight, setMeasuredHeight] = useState<number>(propH);
  const [trailingWidth, setTrailingWidth] = useState<number>(() => (suffix ? 40 : 0));

  // Dynamic width & height measurement
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      if (w > 0) setMeasuredWidth(w);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) setMeasuredWidth(w);
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  // Measure chips wrapper height for wrapping chips
  useEffect(() => {
    const el = chipsWrapperRef.current;
    if (!el) return;

    const updateHeight = () => {
      const h = Math.max(propH, el.scrollHeight, el.offsetHeight);
      setMeasuredHeight(h);
    };

    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const h = Math.max(propH, entry.contentRect.height);
          setMeasuredHeight(h);
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [propH, value]);

  // Measure trailing width
  useEffect(() => {
    if (!suffix) {
      setTrailingWidth(0);
      return;
    }
    const el = trailingRef.current;
    if (!el) return;

    const updateTrailing = () => {
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      if (w > 0) setTrailingWidth(w);
    };

    updateTrailing();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) setTrailingWidth(w);
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [suffix]);

  // Label width measurement for notch calculation
  const [lw, setLw] = useState(() => Math.max(36, displayLabel.length * 9));
  const labelNodeRef = useRef<HTMLLabelElement | null>(null);

  const labRef = useCallback((node: HTMLLabelElement | null) => {
    labelNodeRef.current = node;
    if (node) {
      const width = node.offsetWidth || node.scrollWidth;
      if (width > 0) setLw(width);
    }
  }, []);

  useEffect(() => {
    if (labelNodeRef.current) {
      const width = labelNodeRef.current.offsetWidth || labelNodeRef.current.scrollWidth;
      if (width > 0) setLw(width);
    }
  }, [displayLabel]);

  // Sync author list
  useEffect(() => {
    let mounted = true;

    const syncAuthors = (force = false) => {
      fetchAuthorList(force).then((list) => {
        if (mounted && list.length > 0) {
          const sorted = [...list].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
          );
          setAuthors(sorted);
        }
      });
    };

    // 1. Initial Load
    syncAuthors();

    // 2. Window event listener when an author is created or edited
    const handleLocalUpdate = () => {
      if (cachedAuthors && cachedAuthors.length > 0) {
        setAuthors([...cachedAuthors]);
      } else {
        syncAuthors(true);
      }
    };
    window.addEventListener("syntax-stash-authors-updated", handleLocalUpdate);

    // 3. Cross-tab real-time listener
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "AUTHORS_INVALIDATE") {
        syncAuthors(true);
      }
    };
    authorsChannel?.addEventListener("message", handleBroadcast);

    return () => {
      mounted = false;
      window.removeEventListener("syntax-stash-authors-updated", handleLocalUpdate);
      authorsChannel?.removeEventListener("message", handleBroadcast);
    };
  }, []);

  const selectedValues = useMemo(() => {
    return parseAuthors(value);
  }, [value]);

  const authorNames = useMemo(() => {
    return authors.map((a) => a.name);
  }, [authors]);

  const authorMap = useMemo(() => {
    const map = new Map<string, AuthorOption>();
    for (const a of authors) {
      map.set(a.name, a);
    }
    return map;
  }, [authors]);

  const handleValueChange = (newValues: string[]) => {
    setSearchInput("");
    const next = newValues.slice(0, maxAuthors);
    onChange(next.join(", "));

    if (onSelectAuthor && next.length > 0) {
      const latestAdded = next.find((n) => !selectedValues.includes(n)) || next[next.length - 1];
      if (latestAdded) {
        const found = authors.find(
          (a) =>
            a.name.toLowerCase() === latestAdded.toLowerCase() ||
            a.slug === slugifyAuthor(latestAdded),
        );
        if (found) {
          onSelectAuthor(found);
        }
      }
    }
  };

  const hasValue = selectedValues.length > 0 || searchInput.trim().length > 0;
  const focus = isFocused || isOpen;
  const up = focus || hasValue;

  const W = Math.round(measuredWidth || 280);
  const H = Math.round(measuredHeight || propH);
  const r = clamp(corner, 0, Math.min(W / 2, propH / 2));
  const S = 0.78; // Lifted label scale factor
  const IN = 0.75; // Half-stroke inset to prevent SVG clipping

  /* ── Notch Geometry ── */
  const lx = Math.max(16, r + 4);
  const x0 = Math.max(r, lx - 4);
  const x1 = Math.min(W - r, lx + lw * S + 6);
  const a = Math.max(0, r - IN);
  const R = Math.max(0, W - IN);
  const B = Math.max(0, H - IN);
  const mid = W / 2;

  // The gap: two short segments from middle outward
  const nm = (x0 + x1) / 2;
  const gapL = `M${nm},${IN} L${x0},${IN}`;
  const gapR = `M${nm},${IN} L${x1},${IN}`;

  // Right contour
  const rightPath =
    r > 0
      ? `M${x1},${IN} L${W - r},${IN} A${a},${a} 0 0 1 ${R},${r} L${R},${H - r} A${a},${a} 0 0 1 ${W - r},${B} L${mid},${B}`
      : `M${x1},${IN} L${R},${IN} L${R},${B} L${mid},${B}`;

  // Left contour
  const leftPath =
    r > 0
      ? `M${x0},${IN} ${x0 > r ? `L${r},${IN} ` : ""}A${a},${a} 0 0 0 ${IN},${r} L${IN},${H - r} A${a},${a} 0 0 0 ${r},${B} L${mid},${B}`
      : `M${x0},${IN} L${IN},${IN} L${IN},${B} L${mid},${B}`;

  const ringStroke = focus
    ? "stroke-primary"
    : hasValue
      ? isDark
        ? "stroke-white/40"
        : "stroke-[#b5b5b6]"
      : isDark
        ? "stroke-white/20"
        : "stroke-[#18181b]/20";

  return (
    <div ref={containerRef} className={cn("relative w-full pt-2 select-none", containerClassName)}>
      <Combobox
        multiple
        autoHighlight
        disabled={disabled}
        items={authorNames}
        value={selectedValues}
        onValueChange={handleValueChange}
        inputValue={searchInput}
        onInputValueChange={setSearchInput}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div
          ref={chipsWrapperRef}
          className="relative w-full cursor-text bg-transparent"
          style={{ borderRadius: r, minHeight: propH }}
          onClick={() => {
            const input = containerRef.current?.querySelector("input");
            input?.focus();
          }}
        >
          {/* SVG Outline with Dynamic Retractable Top Notch */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            aria-hidden="true"
          >
            {/* Right Perimeter Outline */}
            <path
              d={rightPath}
              fill="none"
              strokeLinecap="butt"
              strokeWidth={focus ? 1.5 : 1}
              className={cn(
                "transition-[stroke,stroke-width] duration-220 ease-out motion-reduce:duration-160",
                ringStroke,
              )}
            />

            {/* Left Perimeter Outline */}
            <path
              d={leftPath}
              fill="none"
              strokeLinecap="butt"
              strokeWidth={focus ? 1.5 : 1}
              className={cn(
                "transition-[stroke,stroke-width] duration-220 ease-out motion-reduce:duration-160",
                ringStroke,
              )}
            />

            {/* Left Gap Notch */}
            <path
              d={gapL}
              fill="none"
              pathLength={1}
              strokeLinecap="butt"
              strokeWidth={focus ? 1.5 : 1}
              strokeDasharray="1 2"
              strokeDashoffset={up ? -1 : 0}
              className={cn(
                "transition-[stroke-dashoffset,stroke,stroke-width] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
                ringStroke,
              )}
            />

            {/* Right Gap Notch */}
            <path
              d={gapR}
              fill="none"
              pathLength={1}
              strokeLinecap="butt"
              strokeWidth={focus ? 1.5 : 1}
              strokeDasharray="1 2"
              strokeDashoffset={up ? -1 : 0}
              className={cn(
                "transition-[stroke-dashoffset,stroke,stroke-width] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
                ringStroke,
              )}
            />
          </svg>

          {/* Floating Label with Letter Hop Animation */}
          <label
            key={displayLabel}
            ref={labRef}
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute top-1/2 origin-left font-sans text-[16px] font-normal leading-none tracking-[-0.01em] whitespace-pre transition-[transform,color] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] select-none motion-reduce:duration-160",
              focus
                ? isDark
                  ? "text-white"
                  : "text-zinc-900"
                : up
                  ? isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                  : isDark
                    ? "text-zinc-500"
                    : "text-zinc-400",
            )}
            style={{
              left: lx,
              transform: up
                ? `translateY(-50%) translateY(-${Math.round(propH / 2)}px) scale(0.78)`
                : "translateY(-50%)",
            }}
          >
            {[...displayLabel].map((ch, i) => {
              const isAsterisk = ch === "*";
              return (
                <span
                  key={i}
                  className={cn(
                    "inline-block motion-reduce:animate-none",
                    isAsterisk ? "text-destructive ml-0.5 font-bold" : "",
                    focus ? "animate-[lbi-hop_460ms_cubic-bezier(0.3,0.7,0.3,1)_both]" : "",
                  )}
                  style={{ animationDelay: `${i * 24}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </label>

          {/* Transparent Combobox Chips Container */}
          <ComboboxChips
            ref={anchor}
            className={cn(
              "flex w-full flex-wrap items-center gap-1.5 border-0 bg-transparent py-2 font-sans text-xs shadow-none ring-0 transition-colors outline-none focus-within:border-0 focus-within:ring-0",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
            style={{
              minHeight: propH,
              paddingLeft: lx,
              paddingRight: (trailingWidth || 0) + 14,
            }}
          >
            <ComboboxValue>
              {(values: string[]) => (
                <React.Fragment>
                  {values.map((authorName: string) => (
                    <ComboboxChip
                      key={authorName}
                      className="text-foreground h-7 gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-sans text-xs font-medium transition-colors hover:bg-white/15"
                    >
                      <UserIcon className="size-3 text-zinc-400" />
                      <span>{authorName}</span>
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    id={id}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={up && values.length === 0 ? placeholder : ""}
                    spellCheck={true}
                    autoCorrect="on"
                    className="text-foreground h-7 min-w-28 flex-1 border-0 bg-transparent font-sans text-xs outline-none placeholder:text-zinc-500"
                  />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>

          {/* Suffix / Action Container */}
          {suffix && (
            <div
              ref={trailingRef}
              className="pointer-events-auto absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center gap-2"
            >
              {suffix}
            </div>
          )}
        </div>

        {/* Dropdown Options Popup */}
        <ComboboxContent
          anchor={anchor}
          align="start"
          sideOffset={6}
          className="text-popover-foreground z-50 rounded-[20px] border border-white/15 bg-[#121214]/95 p-1.5 font-sans text-xs shadow-2xl backdrop-blur-md"
        >
          <ComboboxEmpty className="text-muted-foreground py-3 text-center font-sans text-xs">
            No creators found.
          </ComboboxEmpty>
          <ComboboxList className="no-scrollbar max-h-60 overflow-y-auto p-1 font-sans text-xs">
            {(item: string) => {
              const authorObj = authorMap.get(item);
              return (
                <ComboboxItem
                  key={item}
                  value={item}
                  className="cursor-pointer gap-2 rounded-[14px] py-2 pr-8 pl-3 font-sans text-xs transition-colors hover:bg-white/10"
                >
                  <UserIcon className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="flex-1 truncate">{item}</span>
                  {authorObj?.count !== undefined && authorObj.count > 0 && (
                    <span className="text-muted-foreground text-[10px] tabular-nums">
                      ({authorObj.count})
                    </span>
                  )}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
