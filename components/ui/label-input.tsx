"use client";

import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type LabelInputTheme = "light" | "dark";

export interface LabelInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "width" | "height" | "prefix"
> {
  /** Field preset label: or any custom string */
  field?: string;
  /** Custom label override text */
  label?: string;
  /** Corner radius in px: at half the height (26px) it is a pill. Default: 20 */
  corner?: number;
  /** Component width in pixels. If omitted, automatically scales to 100% of container */
  width?: number;
  /** Component height in pixels. Default: 52 */
  height?: number;
  /** Showcase preview mode (disables mobile virtual keyboard popup). Default: false */
  showcase?: boolean;
  /** Visual color theme mode: "light" | "dark". Default: "dark" */
  theme?: LabelInputTheme;
  /** Optional leading element (e.g. icon or badge) */
  prefix?: React.ReactNode;
  /** Optional trailing element (e.g. checkmark icon or action) */
  suffix?: React.ReactNode;
  className?: string;
}

export function LabelInput({
  id: propId,
  autoCapitalize,
  autoComplete = "off",
  autoCorrect,
  className = "",
  corner = 20,
  defaultValue,
  field = "",
  height: H = 52,
  label: customLabel,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  prefix,
  required,
  showcase = false,
  spellCheck,
  style,
  suffix,
  theme = "dark",
  type: propType = "text",
  value: controlledValue,
  width: propWidth,
  ...restProps
}: LabelInputProps) {
  const isDark = theme === "dark";
  const secret = field === "Password" || propType === "password";
  const rawLabel = customLabel || field || placeholder || "Field";
  const displayLabel = required && !rawLabel.includes("*") ? `${rawLabel} *` : rawLabel;
  const generatedId = useId().replace(/:/g, "");
  const id = propId || `lbi-${generatedId}`;

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

  const [focus, setFocus] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue !== undefined ? String(defaultValue) : "",
  );
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? String(controlledValue) : internalValue;

  const [quiet] = useState(
    () =>
      showcase && typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Measure the rendered label width to calculate the exact top border notch
  const [lw, setLw] = useState(() => Math.max(32, displayLabel.length * 9));
  const labelNodeRef = useRef<HTMLLabelElement | null>(null);

  // Measure optional prefix width
  const prefixRef = useRef<HTMLDivElement | null>(null);
  const [prefixWidth, setPrefixWidth] = useState<number>(() => (prefix ? 20 : 0));

  useEffect(() => {
    if (!prefix) {
      setPrefixWidth(0);
      return;
    }
    const el = prefixRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      if (w > 0) setPrefixWidth(w);
    };
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) setPrefixWidth(w);
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [prefix]);

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

  // Adjust internal state if field preset changes during render
  const [prevField, setPrevField] = useState(field);
  if (field !== prevField) {
    setPrevField(field);
    if (!isControlled) {
      setInternalValue("");
    }
    setShow(false);
  }

  const up = focus || currentValue.length > 0;

  /* ── Notch Geometry ──────────────────────────────────────────
     The notch opens along the straight part of the top edge:
     lx = starting X position of the label text
     x0 = left notch edge (starts at least after the corner arc)
     x1 = right notch edge (accommodates the scaled label + padding)
  */
  const lx = Math.max(12, r + 4);
  const x0 = Math.max(r, lx - 4);
  const x1 = Math.min(W - r, lx + lw * S + 6);
  const a = Math.max(0, r - IN);
  const R = Math.max(0, W - IN);
  const B = Math.max(0, H - IN);
  const mid = W / 2;

  // The gap: two short segments from the middle outward
  const nm = (x0 + x1) / 2;
  const gapL = `M${nm},${IN} L${x0},${IN}`;
  const gapR = `M${nm},${IN} L${x1},${IN}`;

  // Right contour: from right notch edge, clockwise around corners to bottom center
  const rightPath =
    r > 0
      ? `M${x1},${IN} L${W - r},${IN} A${a},${a} 0 0 1 ${R},${r} L${R},${H - r} A${a},${a} 0 0 1 ${W - r},${B} L${mid},${B}`
      : `M${x1},${IN} L${R},${IN} L${R},${B} L${mid},${B}`;

  // Left contour: from left notch edge, counter-clockwise to bottom center
  const leftPath =
    r > 0
      ? `M${x0},${IN} ${x0 > r ? `L${r},${IN} ` : ""}A${a},${a} 0 0 0 ${IN},${r} L${IN},${H - r} A${a},${a} 0 0 0 ${r},${B} L${mid},${B}`
      : `M${x0},${IN} L${IN},${IN} L${IN},${B} L${mid},${B}`;

  const reveal = () => {
    setShow((s) => !s);
    setFlip((f) => f + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus(false);
    onBlur?.(e);
  };

  const ringStroke = focus
    ? "stroke-primary"
    : currentValue.length > 0
      ? isDark
        ? "stroke-white/40"
        : "stroke-[#b5b5b6]"
      : isDark
        ? "stroke-white/20"
        : "stroke-[#18181b]/20";

  return (
    <div ref={containerRef} className={cn("relative w-full pt-2 select-none", className)}>
      <div
        className="relative w-full cursor-text bg-transparent select-none"
        style={{ borderRadius: r, height: H, ...style }}
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

          {/* Left Gap Notch (Parts outward from center) */}
          <path
            d={gapL}
            fill="none"
            pathLength={1}
            strokeLinecap="butt"
            strokeWidth={focus ? 1.5 : 1}
            strokeDasharray="1 2"
            strokeDashoffset={up ? -1 : 0}
            className={cn(
              "transition-[stroke-dashoffset,stroke,stroke-width] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
              ringStroke,
            )}
          />

          {/* Right Gap Notch (Parts outward from center) */}
          <path
            d={gapR}
            fill="none"
            pathLength={1}
            strokeLinecap="butt"
            strokeWidth={focus ? 1.5 : 1}
            strokeDasharray="1 2"
            strokeDashoffset={up ? -1 : 0}
            className={cn(
              "transition-[stroke-dashoffset,stroke,stroke-width] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
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
            "absolute top-1/2 origin-left cursor-text font-sans text-xs font-bold tracking-tight whitespace-pre uppercase transition-[transform,color] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] select-none motion-reduce:duration-160",
            focus
              ? "text-primary font-bold"
              : up
                ? isDark
                  ? "text-white/70"
                  : "text-zinc-600"
                : isDark
                  ? "text-white/40"
                  : "text-zinc-400",
          )}
          style={{
            left: up ? lx : prefix ? lx + prefixWidth + 8 : lx,
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

        {/* Optional Leading Prefix (e.g. icon or badge) */}
        {prefix && (
          <div
            ref={prefixRef}
            className="pointer-events-none absolute top-1/2 z-10 flex shrink-0 -translate-y-1/2 items-center justify-center"
            style={{ left: lx }}
          >
            {prefix}
          </div>
        )}

        {/* Real Input Element */}
        <input
          ref={inputRef}
          id={id}
          required={required}
          className={cn(
            "absolute inset-0 h-full w-full rounded-[inherit] border-0 bg-transparent font-sans text-xs tracking-tight transition-[filter,opacity] duration-260 outline-none sm:text-sm",
            isDark
              ? "text-white placeholder:text-white/20"
              : "text-zinc-900 placeholder:text-zinc-400",
            flip > 0 ? "animate-[lbi-flip_260ms_ease-out]" : "",
          )}
          style={{
            paddingLeft: prefix ? lx + prefixWidth + 8 : lx,
            paddingRight: secret ? 44 : suffix ? 44 : lx,
            ...(showcase && secret && !show ? { WebkitTextSecurity: "disc" } : {}),
          }}
          type={
            showcase
              ? "text"
              : secret && !show
                ? "password"
                : secret
                  ? "text"
                  : propType === "url"
                    ? "text"
                    : propType || "text"
          }
          placeholder={focus ? placeholder : ""}
          name={showcase ? "search-preview" : restProps.name}
          data-1p-ignore={showcase || undefined}
          data-lpignore={showcase ? "true" : undefined}
          data-bwignore={showcase || undefined}
          data-form-type={showcase ? "other" : undefined}
          autoCorrect={autoCorrect ?? (secret ? "off" : "on")}
          autoCapitalize={autoCapitalize ?? (secret || propType === "url" ? "off" : "sentences")}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          spellCheck={spellCheck ?? (secret ? false : true)}
          inputMode={
            quiet ? "none" : restProps.inputMode || (propType === "url" ? "url" : undefined)
          }
          {...restProps}
        />

        {/* Suffix Element (e.g. Checkmark) */}
        {suffix && !secret && (
          <div className="pointer-events-auto absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center">
            {suffix}
          </div>
        )}

        {/* Password Eye Toggle */}
        {secret && (
          <button
            type="button"
            className={cn(
              "group absolute top-1/2 right-2.5 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-transparent p-0 transition-[color,transform] duration-160 active:scale-95",
              isDark ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900",
            )}
            onPointerDown={(e) => e.preventDefault()}
            onClick={reveal}
            aria-label={show ? "Hide password" : "Show password"}
          >
            <EyeIcon
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className={`transition-[opacity,transform,filter] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] [grid-area:1/1] ${
                show ? "scale-70 opacity-0 blur-[2px]" : "blur-0 scale-100 opacity-100"
              }`}
            />
            <EyeClosedIcon
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className={`transition-[opacity,transform,filter] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] [grid-area:1/1] ${
                show ? "blur-0 scale-100 opacity-100" : "scale-70 opacity-0 blur-[2px]"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
