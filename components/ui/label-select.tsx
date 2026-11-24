"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { Select as SelectPrimitive } from "radix-ui";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type LabelSelectTheme = "light" | "dark";

export interface LabelSelectOption {
  label: string;
  value: string;
  [key: string]: unknown;
}

export interface LabelSelectProps {
  align?: "center" | "start" | "end";
  children?: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  contentClassName?: string;
  /** Corner radius in px: at half the height (26px) it is a pill. Default: 20 */
  corner?: number;
  defaultValue?: string;
  disabled?: boolean;
  field?: string;
  /** Component height in pixels. Default: 52 */
  height?: number;
  id?: string;
  itemClassName?: string;
  label?: string;
  name?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  options?: LabelSelectOption[];
  placeholder?: string;
  required?: boolean;
  suffix?: React.ReactNode;
  /** Visual color theme mode: "light" | "dark". Default: "dark" */
  theme?: LabelSelectTheme;
  triggerClassName?: string;
  value?: string;
  viewportClassName?: string;
  /** Component width in pixels. If omitted, automatically scales to 100% of container */
  width?: number;
}

export function LabelSelect({
  id: propId,
  align,
  children,
  className = "",
  columns = 1,
  contentClassName,
  corner = 20,
  defaultValue,
  disabled = false,
  field = "",
  height: H = 52,
  itemClassName,
  label: customLabel,
  name,
  onOpenChange,
  onValueChange,
  options,
  placeholder = "Select...",
  required = false,
  suffix,
  theme = "dark",
  triggerClassName,
  value,
  viewportClassName,
  width: propWidth,
}: LabelSelectProps) {
  const isDark = theme === "dark";
  const rawLabel = customLabel || field || placeholder || "Select";
  const displayLabel = required && !rawLabel.includes("*") ? `${rawLabel} *` : rawLabel;
  const generatedId = useId().replace(/:/g, "");
  const id = propId || `lbs-${generatedId}`;

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
  const S = 0.8; // Lifted label scale factor
  const IN = 0.75; // Half-stroke inset to prevent SVG clipping

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Measure label width to calculate top border notch
  const [lw, setLw] = useState(() => Math.max(30, displayLabel.length * 8.5));
  const labelNodeRef = useRef<HTMLSpanElement | null>(null);

  const labRef = useCallback((node: HTMLSpanElement | null) => {
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

  const hasValue = Boolean(value && String(value).trim().length > 0);
  const focus = isOpen || isFocused;
  const up = focus || hasValue;

  /* ── Notch Geometry ── */
  const lx = Math.max(12, r + 4);
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

  const isMultiColumn = columns > 1;
  const resolvedAlign = align || (isMultiColumn ? "start" : "center");
  const resolvedContentClassName = isMultiColumn
    ? cn(
        "z-70 w-[calc(100vw-2rem)] max-w-3xl rounded-2xl border-[1.5px] border-white/12 bg-[#0e0e11]/98 p-2 font-mono text-xs shadow-[0_24px_60px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl lg:max-w-4xl",
        contentClassName,
      )
    : contentClassName;

  const resolvedViewportClassName = isMultiColumn
    ? cn(
        "grid gap-1.5 p-1",
        columns === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : columns === 4
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        viewportClassName,
      )
    : viewportClassName;

  return (
    <div ref={containerRef} className={cn("relative w-full pt-2 select-none", className)}>
      <SelectPrimitive.Root
        value={value || undefined}
        defaultValue={defaultValue}
        onValueChange={(val) => {
          onValueChange?.(val);
        }}
        open={isOpen}
        onOpenChange={(next) => {
          setIsOpen(next);
          onOpenChange?.(next);
        }}
        disabled={disabled}
        name={name}
      >
        <div
          className="relative w-full cursor-pointer bg-transparent select-none"
          style={{ borderRadius: r, height: H }}
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

          {/* Floating Label with Letter-by-Letter Hop Animation */}
          <span
            key={displayLabel}
            ref={labRef}
            className={cn(
              "pointer-events-none absolute top-1/2 origin-left font-sans text-sm leading-none font-normal tracking-tight whitespace-pre transition-[transform,color] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] select-none motion-reduce:duration-160",
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
                ? `translateY(-50%) translateY(-${Math.round(H / 2)}px) scale(0.8)`
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
                    isAsterisk ? "text-destructive/80 ml-1 text-xs font-normal" : "",
                    focus ? "animate-[lbi-hop_460ms_cubic-bezier(0.3,0.7,0.3,1)_both]" : "",
                  )}
                  style={{ animationDelay: `${i * 24}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>

          {/* Radix Trigger Element */}
          <SelectPrimitive.Trigger
            id={id}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "relative flex h-full w-full items-center justify-between rounded-[inherit] border-0 bg-transparent font-sans text-[16px] tracking-tight transition-[filter,opacity] duration-260 outline-none select-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
              isDark
                ? "text-white data-placeholder:text-white/30"
                : "text-zinc-900 data-placeholder:text-zinc-400",
              triggerClassName,
            )}
            style={{
              paddingLeft: lx,
              paddingRight: Math.max(14, r - 4),
            }}
          >
            <div className="flex flex-1 items-center overflow-hidden">
              <span
                className={cn(
                  "truncate transition-opacity duration-200",
                  !up && "opacity-0 select-none",
                )}
              >
                <SelectPrimitive.Value placeholder={placeholder} />
              </span>
            </div>

            <div className="ml-2 flex shrink-0 items-center gap-2">
              {suffix}
              <SelectPrimitive.Icon asChild>
                <CaretDownIcon
                  weight="bold"
                  className={cn(
                    "pointer-events-none size-4 shrink-0 transition-transform duration-200",
                    isOpen ? "text-primary rotate-180" : "text-muted-foreground",
                  )}
                />
              </SelectPrimitive.Icon>
            </div>
          </SelectPrimitive.Trigger>
        </div>

        <SelectContent
          align={resolvedAlign}
          className={resolvedContentClassName}
          viewportClassName={resolvedViewportClassName}
        >
          {options
            ? options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "font-sans text-xs sm:text-sm",
                    isMultiColumn &&
                      "hover:border-accent/30 rounded-xl border border-white/5 bg-[#141417] p-2.5 hover:bg-[#1b1b22]",
                    itemClassName,
                  )}
                >
                  <span>{opt.label}</span>
                </SelectItem>
              ))
            : children}
        </SelectContent>
      </SelectPrimitive.Root>
    </div>
  );
}
