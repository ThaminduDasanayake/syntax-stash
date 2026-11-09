"use client";

import { ArrowSquareOutIcon, CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, isValidHttpUrl } from "@/lib/utils";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface CandidateOption {
  label: string;
  type?: string;
  url: string;
}

export interface EditableCandidateInputProps {
  className?: string;
  containerClassName?: string;
  /** Corner radius in px: default 20 */
  corner?: number;
  disabled?: boolean;
  /** Component height in pixels. Default: 52 */
  height?: number;
  id?: string;
  label?: string;
  onChange: (value: string) => void;
  options?: CandidateOption[];
  placeholder?: string;
  prefix?: React.ReactNode;
  renderPreview?: (option: CandidateOption) => React.ReactNode;
  required?: boolean;
  suffix?: React.ReactNode;
  theme?: "light" | "dark";
  type?: string;
  value: string;
  width?: number;
}

export function EditableCandidateInput({
  id: propId,
  className,
  containerClassName,
  corner = 20,
  disabled = false,
  height: H = 52,
  label: customLabel,
  onChange,
  options = [],
  placeholder = "https://example.com",
  prefix,
  renderPreview,
  required = false,
  suffix,
  theme = "dark",
  type = "url",
  value,
  width: propWidth,
}: EditableCandidateInputProps) {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isDark = theme === "dark";

  const rawLabel = customLabel || placeholder || "Field";
  const displayLabel = required && !rawLabel.includes("*") ? `${rawLabel} *` : rawLabel;
  const generatedId = useId().replace(/:/g, "");
  const id = propId || `eci-${generatedId}`;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(() => propWidth || 0);

  useEffect(() => {
    if (propWidth) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      if (w > 0) {
        setMeasuredWidth(w);
      }
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) {
            setMeasuredWidth(w);
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [propWidth]);

  const W = Math.round(propWidth || measuredWidth || 280);
  const r = clamp(corner, 0, H / 2);
  const S = 0.78; // Lifted label scale factor
  const IN = 0.75; // Half-stroke inset to prevent SVG clipping

  // Measure rendered label width to calculate top notch
  const [lw, setLw] = useState(() => Math.max(36, displayLabel.length * 10));
  const labelNodeRef = useRef<HTMLLabelElement | null>(null);

  const labRef = useCallback((node: HTMLLabelElement | null) => {
    labelNodeRef.current = node;
    if (node) {
      const width = node.offsetWidth || node.scrollWidth;
      if (width > 0) {
        setLw(width);
      }
    }
  }, []);

  useEffect(() => {
    if (labelNodeRef.current) {
      const width = labelNodeRef.current.offsetWidth || labelNodeRef.current.scrollWidth;
      if (width > 0) {
        setLw(width);
      }
    }
  }, [displayLabel]);

  const cleanVal = (value || "").trim();
  const isValidUrl = Boolean(cleanVal) && (cleanVal.startsWith("/") || isValidHttpUrl(cleanVal));
  const hasOptions = options.length > 0;

  const focus = isFocused || open;
  const up = focus || cleanVal.length > 0;

  // Measure rendered width of trailing actions so input text padding never collides
  const trailingRef = useRef<HTMLDivElement | null>(null);
  const [trailingWidth, setTrailingWidth] = useState<number>(() =>
    hasOptions ? (cleanVal && isValidUrl ? 175 : 110) : cleanVal && isValidUrl ? 95 : 44,
  );

  useEffect(() => {
    const el = trailingRef.current;
    if (!el) return;

    const update = () => {
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      if (w > 0) {
        setTrailingWidth(Math.round(w));
      }
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [cleanVal, hasOptions, isValidUrl, suffix]);

  /* ── Notch Geometry ── */
  const lx = Math.max(12, r + 4);
  const x0 = Math.max(r, lx - 4);
  const x1 = Math.min(W - r, lx + lw * S + 6);
  const a = Math.max(0, r - IN);
  const R = Math.max(0, W - IN);
  const B = Math.max(0, H - IN);
  const mid = W / 2;

  // Gap segments
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
    : cleanVal.length > 0
      ? isDark
        ? "stroke-white/40"
        : "stroke-[#b5b5b6]"
      : isDark
        ? "stroke-white/20"
        : "stroke-[#18181b]/20";

  // Dynamic right padding calculation based on measured trailing actions
  const rightPadding = Math.max(44, trailingWidth + 24);
  const leftPadding = prefix ? lx + 32 : lx;

  return (
    <div ref={containerRef} className={cn("relative w-full pt-2 select-none", containerClassName)}>
      <div
        className="relative w-full cursor-text bg-transparent select-none"
        style={{ borderRadius: r, height: H }}
      >
        {/* SVG Outline with Dynamic Retractable Notch */}
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

        {/* Floating Label with Letter-by-Letter Hop Animation */}
        <label
          key={displayLabel}
          ref={labRef}
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute top-1/2 origin-left font-sans text-[16px] font-normal leading-none tracking-[-0.01em] whitespace-pre transition-[transform,color,left] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] select-none motion-reduce:duration-160",
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
            left: up ? lx : prefix ? lx + 32 : lx,
            transform: up
              ? `translateY(-50%) translateY(-${Math.round(H / 2)}px) scale(0.78)`
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

        {/* Optional Prefix Thumbnail / Favicon Icon */}
        {prefix && (
          <div
            className="pointer-events-none absolute top-1/2 z-10 flex shrink-0 -translate-y-1/2 items-center justify-center"
            style={{ left: lx }}
          >
            {prefix}
          </div>
        )}

        {/* Real Input Element */}
        <input
          id={id}
          type={type === "url" ? "text" : type}
          inputMode={type === "url" ? "url" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={focus ? placeholder : ""}
          disabled={disabled}
          title={value || placeholder || ""}
          className={cn(
            "absolute inset-0 h-full w-full rounded-[inherit] border-0 bg-transparent font-mono text-[16px] tracking-tight transition-[filter,opacity] duration-260 outline-none sm:text-sm",
            isDark
              ? "text-white placeholder:text-white/20"
              : "text-zinc-900 placeholder:text-zinc-400",
            className,
          )}
          style={{
            paddingLeft: leftPadding,
            paddingRight: rightPadding,
          }}
          autoCorrect="on"
          autoCapitalize="off"
          spellCheck={true}
        />

        {/* Trailing Actions Container */}
        <div
          ref={trailingRef}
          className="absolute top-1/2 z-10 flex shrink-0 -translate-y-1/2 items-center gap-1.5"
          style={{ right: Math.max(12, r - 6) }}
        >
          {cleanVal && isValidUrl && (
            <div className="flex items-center gap-1">
              <CopyButton
                textToCopy={cleanVal}
                iconOnly
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground size-6 rounded-md transition-colors hover:bg-white/5"
                title="Copy current URL"
              />
              {cleanVal.startsWith("http") && (
                <a
                  href={cleanVal}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  className="text-muted-foreground hover:text-foreground inline-flex size-6 items-center justify-center rounded-md transition-colors hover:bg-white/5"
                  title="Open asset in new tab"
                >
                  <ArrowSquareOutIcon weight="bold" className="size-3.5" />
                </a>
              )}
            </div>
          )}

          {hasOptions && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  className="text-muted-foreground hover:text-foreground h-7 gap-1 rounded-[10px] px-2 font-mono text-[10px] font-bold uppercase hover:bg-white/10"
                  title="Choose or inspect detected options"
                >
                  <span className="bg-primary/10 text-primary rounded-md px-1.5 py-0.5">
                    {options.length} {options.length === 1 ? "option" : "options"}
                  </span>
                  <CaretDownIcon className="size-3" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="border-border/80 w-[calc(100vw-2rem)] max-w-lg rounded-[20px] bg-[#18181b]/95 p-2.5 font-sans text-xs shadow-2xl shadow-black/70 backdrop-blur-xl sm:w-[480px]"
              >
                <div className="border-border/60 text-muted-foreground flex items-center justify-between border-b-[1.5px] px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <span>Detected Options ({options.length})</span>
                  <span className="text-[9px] font-normal lowercase opacity-70">
                    click to select or inspect
                  </span>
                </div>

                <div className="no-scrollbar mt-1 max-h-72 space-y-1.5 overflow-y-auto p-0.5">
                  {options.map((option, idx) => {
                    const isSelected = value?.trim() === option.url.trim();
                    const isOptHttp = option.url.startsWith("http");

                    return (
                      <div
                        key={`${option.url}-${idx}`}
                        className={cn(
                          "group/option flex w-full items-start gap-2.5 rounded-[14px] border-[1.5px] p-2.5 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-line bg-surface/40 hover:border-primary/50 hover:bg-surface/80",
                        )}
                      >
                        {/* Custom Preview thumbnail if provided */}
                        {renderPreview && (
                          <div
                            onClick={() => {
                              onChange(option.url);
                              setOpen(false);
                            }}
                            className="mt-0.5 shrink-0 cursor-pointer"
                          >
                            {renderPreview(option)}
                          </div>
                        )}

                        {/* Main clickable area */}
                        <div
                          onClick={() => {
                            onChange(option.url);
                            setOpen(false);
                          }}
                          className="min-w-0 flex-1 cursor-pointer space-y-1 select-none"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-foreground truncate text-[11px] font-bold">
                              {option.label}
                            </span>
                            {option.type && (
                              <span
                                className={cn(
                                  "shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {option.type}
                              </span>
                            )}
                          </div>

                          <span
                            title={option.url}
                            className="text-muted-foreground hover:text-foreground block font-mono text-[10px] leading-relaxed break-all"
                          >
                            {option.url}
                          </span>
                        </div>

                        {/* Action buttons (Copy, Open in Tab, Selected Check) */}
                        <div className="flex shrink-0 items-center gap-1 pt-0.5">
                          <CopyButton
                            textToCopy={option.url}
                            iconOnly
                            size="icon-xs"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted/60 size-6 rounded-md"
                            title="Copy candidate URL"
                          />

                          {isOptHttp && (
                            <a
                              href={option.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-foreground hover:bg-muted/60 inline-flex size-6 items-center justify-center rounded-md transition-colors"
                              title="Open image in new tab"
                            >
                              <ArrowSquareOutIcon weight="bold" className="size-3.5" />
                            </a>
                          )}

                          {isSelected && (
                            <div className="bg-primary text-primary-foreground ml-0.5 flex size-5 items-center justify-center rounded-full">
                              <CheckIcon className="size-3" weight="bold" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {suffix}
        </div>
      </div>
    </div>
  );
}
