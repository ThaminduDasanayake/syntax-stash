"use client";

/**
 * SelectBar (Glass Bar)
 *
 * A refined physical frosted glass selector and navigation dock with
 * two-phase mercury stretch dilation and overshoot landing kinematics.
 */

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ── Elastic motion tuning (two-phase mercury dilation with overshoot landing) ── */
const rate = (speed: number) => 1.6 - (speed / 100) * 1.2;

const overshoot = (bounce: number, tuned: number) =>
  Number((1 + (bounce / 100) * (tuned - 1) * 2).toFixed(3));

const curve = (bounce: number, tuned: number, x1 = 0.28, x2 = 0.36) =>
  `cubic-bezier(${x1}, ${overshoot(bounce, tuned)}, ${x2}, 1)`;

const settle = (bounce: number) => ({
  move: curve(bounce, 1.28, 0.28, 0.36),
  size: curve(bounce, 1.34, 0.24, 0.38),
});

type Ind = { p: number; s: number };

export interface SelectBarItem<T extends string = string> {
  key: T;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  darkOutline?: string;
  title?: string;
  showLabel?: boolean;
}

export interface SelectBarProps<T extends string = string> {
  items: SelectBarItem<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: "xs" | "sm" | "default";
  dilate?: number;
  bounce?: number;
  speed?: number;
  hug?: number;
  className?: string;
  ariaLabel?: string;
  // Backward compatibility props
  variant?: "glass" | "swatches" | "pill";
  axis?: "row" | "column";
  corner?: number;
}

export function SelectBar<T extends string = string>({
  ariaLabel = "Navigation",
  bounce = 50,
  className = "",
  defaultValue,
  dilate = 100,
  hug,
  items,
  onChange,
  size = "sm",
  speed = 50,
  value,
}: SelectBarProps<T>) {
  const initialKey = value ?? defaultValue ?? items[0]?.key;
  const [active, setActive] = useState<T>(initialKey);

  const trackRef = useRef<HTMLElement | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<Ind | null>(null);
  const [phase, setPhase] = useState<"idle" | "stretch" | "settle">("idle");
  const indRef = useRef<Ind | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const hasSwatches = items.some((item) => Boolean(item.color));
  const defaultHug = hasSwatches ? 3 : size === "xs" ? 3 : size === "sm" ? 4 : 6;
  const actualHug = hug !== undefined ? hug : defaultHug;

  const measure = useCallback((k: string): Ind | null => {
    const el = refs.current[k];
    if (!el) return null;
    return { p: el.offsetLeft, s: el.offsetWidth };
  }, []);

  const activeRef = useRef<T>(initialKey);
  const prevValueRef = useRef<T | undefined>(value);

  // Exact 2-phase elastic stretch and settle glide
  const select = useCallback(
    (k: T) => {
      if (k === activeRef.current) return;
      activeRef.current = k;
      prevValueRef.current = k;
      const to = measure(k);
      const from = indRef.current;
      setActive(k);

      if (!to) return;
      window.clearTimeout(timer.current);

      if (!from) {
        indRef.current = to;
        setPhase("settle");
        setInd(to);
        return;
      }

      /* Leading edge dilates across the union of slots */
      const start = Math.min(from.p, to.p);
      const end = Math.max(from.p + from.s, to.p + to.s);
      const grow = dilate / 100;

      setPhase("stretch");
      setInd({
        p: to.p + (start - to.p) * grow,
        s: to.s + (end - start - to.s) * grow,
      });

      /* Trailing edge catches up and overshoots on landing */
      timer.current = window.setTimeout(
        () => {
          indRef.current = to;
          setPhase("settle");
          setInd(to);
        },
        150 * rate(speed),
      );
    },
    [dilate, measure, speed],
  );

  // Controlled sync from props.value
  useEffect(() => {
    if (value !== undefined && value !== activeRef.current) {
      select(value);
    }
  }, [select, value]);

  // Initial mount measurement & ResizeObserver
  useIsomorphicLayoutEffect(() => {
    const settleInd = () => {
      const next = measure(activeRef.current);
      if (!next) return;
      indRef.current = next;
      setPhase("idle");
      setInd(next);
    };
    settleInd();

    const ro = new ResizeObserver(settleInd);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [items, measure]);

  const curveStyles = settle(bounce);

  const transitionString =
    phase === "stretch"
      ? `transform ${Math.round(190 * rate(speed))}ms cubic-bezier(0.32, 0.72, 0.24, 1), width ${Math.round(
          190 * rate(speed),
        )}ms cubic-bezier(0.32, 0.72, 0.24, 1)`
      : phase === "settle"
        ? `transform ${Math.round(420 * rate(speed))}ms ${curveStyles.move}, width ${Math.round(
            420 * rate(speed),
          )}ms ${curveStyles.size}`
        : "none";

  const indStyle: React.CSSProperties = ind
    ? {
        height: `calc(100% - ${actualHug * 2}px)`,
        top: `${actualHug}px`,
        transform: `translate3d(${ind.p}px, 0, 0)`,
        transition: transitionString,
        width: `${ind.s}px`,
      }
    : { opacity: 0 };

  return (
    <nav
      ref={trackRef as React.RefObject<HTMLElement>}
      className={`no-scrollbar relative isolate inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-white/10 bg-[#252525] text-white shadow-none select-none ${className}`}
      style={{ padding: `${actualHug}px` }}
      aria-label={ariaLabel}
    >
      {/* Two-phase mercury indicator wash */}
      <span
        className="pointer-events-none absolute left-0 z-1 rounded-full border border-white/10 bg-[#3d3d3d] shadow-[0_2px_8px_rgba(0,0,0,0.3)] will-change-[transform,width]"
        style={indStyle}
        aria-hidden="true"
      />

      {items.map((item) => {
        const isSelected = active === item.key;
        const isSwatch = Boolean(item.color);
        const isIconOnly = Boolean(item.icon && (!item.label || item.showLabel === false));
        const slotTitle = item.title || (typeof item.label === "string" ? item.label : item.key);

        const dim = size === "xs" ? 26 : size === "default" ? 36 : 30;
        const padH = size === "xs" ? 11 : size === "default" ? 16 : 13;

        const slotStyle: React.CSSProperties =
          isSwatch || isIconOnly
            ? {
                flexShrink: 0,
                height: `${dim}px`,
                minWidth: `${dim}px`,
                padding: 0,
                width: `${dim}px`,
              }
            : {
                flexShrink: 0,
                height: `${dim}px`,
                minWidth: `${dim}px`,
                padding: `0 ${padH}px`,
                whiteSpace: "nowrap",
                width: "auto",
              };

        return (
          <button
            key={item.key}
            ref={(el) => {
              refs.current[item.key] = el;
            }}
            type="button"
            className={`relative z-2 flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent leading-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              isSelected || isSwatch
                ? "font-medium text-white opacity-100"
                : "text-[#9a9a9a] opacity-100 hover:text-white"
            }`}
            data-active={isSelected}
            data-swatch={isSwatch}
            aria-label={slotTitle}
            title={slotTitle}
            aria-current={isSelected ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              select(item.key);
              onChange?.(item.key);
            }}
            style={slotStyle}
          >
            {item.color ? (
              <span
                className={`block rounded-full border transition-transform duration-150 ${
                  isSelected ? "scale-110" : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: item.color,
                  borderColor: item.darkOutline || item.color,
                  height: size === "xs" ? "12px" : size === "default" ? "16px" : "14px",
                  width: size === "xs" ? "12px" : size === "default" ? "16px" : "14px",
                }}
              />
            ) : isIconOnly ? (
              <span className="flex items-center justify-center text-current">{item.icon}</span>
            ) : (
              <span
                className={`inline-flex items-center justify-center gap-1.5 ${
                  size === "xs"
                    ? "text-[11.5px] font-medium"
                    : size === "default"
                      ? "text-[13px] font-medium"
                      : "text-xs font-medium"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                {item.icon && (
                  <span className="inline-flex shrink-0 items-center justify-center">
                    {item.icon}
                  </span>
                )}
                {item.label && <span className="shrink-0">{item.label}</span>}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
