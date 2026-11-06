"use client";

import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function useFluidReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  return reduced;
}

export interface FluidSearchProps {
  /** Current search input value */
  value?: string;
  /** Default search value for uncontrolled usage */
  defaultValue?: string;
  /** Callback fired when search query changes */
  onChange?: (value: string) => void;
  /** Callback fired when search query is cleared */
  onClear?: () => void;
  /** Accessible input label. Default: 'Search' */
  label?: string;
  /** Placeholder text. Default: 'Search…' */
  placeholder?: string;
  /** Optional theme override: 'light' | 'dark' */
  theme?: "light" | "dark";
  /** Optional custom fill color override for the fluid pill & circle */
  fill?: string;
  /** Optional keyboard shortcut key (e.g. '/') */
  shortcut?: string;
  /** Class name applied to outer container */
  className?: string;
  /** Style applied to outer container */
  style?: React.CSSProperties;
  /** Disabled state */
  disabled?: boolean;
  /** AutoFocus */
  autoFocus?: boolean;
}

/**
 * FluidSearch
 *
 * Liquid metaball search disclosure where the input pill and close circle
 * fluidly separate on focus/input and seamlessly merge back on close/Escape.
 * Filter only the silhouette, never content.
 */
export const FluidSearch = forwardRef<HTMLInputElement, FluidSearchProps>(
  function FluidSearch(
    {
      autoFocus = false,
      className = "",
      defaultValue = "",
      disabled = false,
      fill,
      label = "Search",
      onChange,
      onClear,
      placeholder = "Search…",
      shortcut = "/",
      style,
      theme,
      value: controlledValue,
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleValueChange = (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    };

    const [focused, setFocused] = useState(false);
    const host = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const reduced = useFluidReducedMotion();
    const id = "search-" + useId().replace(/:/g, "");
    const [keyboard, setKeyboard] = useState(false);

    useEffect(() => {
      const key = (e: KeyboardEvent) => {
        if (e.key === "Tab") setKeyboard(true);

        if (shortcut && e.key === shortcut && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const active = document.activeElement;
          const isInputActive =
            active &&
            (active.tagName === "INPUT" ||
              active.tagName === "TEXTAREA" ||
              (active as HTMLElement).isContentEditable);

          if (!isInputActive) {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }
      };
      document.addEventListener("keydown", key);
      return () => document.removeEventListener("keydown", key);
    }, [shortcut]);

    const open = focused || Boolean(value);

    function close() {
      handleValueChange("");
      setFocused(false);
      onClear?.();
      host.current?.focus();
    }

    return (
      <div
        ref={host}
        tabIndex={-1}
        className={cn("seenry-fluid-search", open && "is-open", className)}
        data-reduced={reduced}
        data-keyboard={keyboard}
        data-theme={theme || undefined}
        style={{
          ...(fill ? ({ "--search-fill": fill } as React.CSSProperties) : {}),
          ...style,
        }}
        onPointerDownCapture={() => setKeyboard(false)}
        onFocusCapture={(e) => {
          if (e.target !== host.current) setFocused(true);
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            e.preventDefault();
            close();
          }
        }}
      >
        <svg aria-hidden="true" className="sfs-defs">
          <defs>
            <filter
              id={id}
              x="-20%"
              y="-100%"
              width="140%"
              height="300%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="5" />
              <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8.5" />
            </filter>
          </defs>
        </svg>
        <div
          className="sfs-shapes"
          aria-hidden="true"
          style={{
            filter: reduced
              ? "none"
              : `url(#${id}) drop-shadow(0 0 1px rgba(255, 255, 255, 0.18))`,
          }}
        >
          <div className="sfs-pill" />
          <div className="sfs-circle" />
        </div>
        <label className="sfs-field">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            ref={inputRef}
            aria-label={label}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            autoFocus={autoFocus}
            onChange={(e) => handleValueChange(e.target.value)}
          />
          {shortcut && !open && (
            <kbd className="sfs-kbd" aria-hidden="true">
              {shortcut}
            </kbd>
          )}
        </label>
        <button
          className="sfs-close"
          type="button"
          aria-label="Close search"
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          onClick={close}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    );
  },
);

export default FluidSearch;
