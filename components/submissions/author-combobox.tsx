"use client";

import { CheckIcon, GlobeIcon, UserIcon, XIcon, XLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

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
  links?: AuthorLinks | null;
  name: string;
  slug: string;
}

interface AuthorComboboxProps {
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSelectAuthor?: (author: AuthorOption) => void;
  placeholder?: string;
  value: string;
}

// Global module cache to prevent duplicate requests across renders
let cachedAuthors: AuthorOption[] | null = null;
let fetchPromise: Promise<AuthorOption[]> | null = null;

async function fetchAuthorList(): Promise<AuthorOption[]> {
  if (cachedAuthors) return cachedAuthors;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch("/api/authors");
      if (!res.ok) throw new Error("Failed to load authors");
      const data = await res.json();
      cachedAuthors = data.authors || [];
      return cachedAuthors!;
    } catch {
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function AuthorCombobox({
  className,
  containerClassName,
  disabled = false,
  onChange,
  onSelectAuthor,
  placeholder = "e.g. Jane Doe",
  value,
}: AuthorComboboxProps) {
  const [authors, setAuthors] = useState<AuthorOption[]>(cachedAuthors || []);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let mounted = true;
    if (!cachedAuthors) {
      fetchAuthorList().then((list) => {
        if (mounted && list.length > 0) {
          setAuthors(list);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Filter authors based on search query
  const query = value.trim().toLowerCase();
  const filteredAuthors = useMemo(() => {
    if (!query) {
      // Return top 8 most popular creators if no query
      return authors.slice(0, 8);
    }
    return authors
      .filter((a) => a.name.toLowerCase().includes(query) || a.slug.includes(query))
      .slice(0, 8);
  }, [authors, query]);

  // Check if current typed value exactly matches an author in list
  const exactMatch = authors.some((a) => a.name.toLowerCase() === query);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (author: AuthorOption) => {
    onChange(author.name);
    setIsOpen(false);
    setHighlightedIndex(-1);

    if (onSelectAuthor) {
      onSelectAuthor(author);
    }

    const linkCount = author.links
      ? Object.values(author.links).filter(Boolean).length
      : 0;

    if (linkCount > 0) {
      setSelectedNotification(`Auto-filled ${linkCount} profile links for ${author.name}`);
      setTimeout(() => setSelectedNotification(null), 3500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    const totalItems = filteredAuthors.length + (!exactMatch && query ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredAuthors.length) {
        const item = filteredAuthors[highlightedIndex];
        if (item) handleSelect(item);
      } else if (highlightedIndex === filteredAuthors.length && !exactMatch && query) {
        // Selected "+ Use custom name"
        setIsOpen(false);
      } else if (filteredAuthors.length === 1 && filteredAuthors[0]) {
        handleSelect(filteredAuthors[0]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll("li");
      const target = items[highlightedIndex];
      if (target) {
        target.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className={cn("relative w-full", containerClassName)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (!disabled && (filteredAuthors.length > 0 || !exactMatch)) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "border-border bg-input/30 placeholder:text-muted-foreground focus-visible:border-primary/80 focus-visible:ring-primary/20 h-9 w-full rounded-none border-2 px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2",
            value ? "pr-8" : "",
            className,
          )}
        />

        {value && !disabled && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 p-0.5"
            tabIndex={-1}
            aria-label="Clear creator name"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      {/* Auto-fill notification badge */}
      {selectedNotification && (
        <p className="text-primary mt-1 flex items-center gap-1 font-mono text-[11px] transition-all">
          <CheckIcon className="size-3" weight="bold" /> {selectedNotification}
        </p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="border-border bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-none border-2 shadow-lg">
          <div className="border-border/60 text-muted-foreground bg-muted/40 border-b px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider uppercase">
            {query ? "Matching Creators" : "Suggested Creators"}
          </div>

          <ul ref={dropdownRef} className="max-h-48 overflow-y-auto py-1 font-mono text-xs">
            {filteredAuthors.map((author, index) => {
              const isSelected = author.name.toLowerCase() === query;
              const isHighlighted = index === highlightedIndex;
              const hasLinks =
                author.links && Object.values(author.links).some(Boolean);

              return (
                <li
                  key={author.slug}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(author)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 transition-colors",
                    isHighlighted ? "bg-primary text-primary-foreground" : "hover:bg-muted/60",
                    isSelected && !isHighlighted ? "text-primary font-semibold" : "",
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <UserIcon
                      className={cn(
                        "size-3.5 shrink-0",
                        isHighlighted ? "text-primary-foreground" : "text-muted-foreground",
                      )}
                    />
                    <span className="truncate">{author.name}</span>
                    {typeof author.count === "number" && author.count > 0 && (
                      <span
                        className={cn(
                          "rounded-none border px-1 py-0.2 text-[10px]",
                          isHighlighted
                            ? "border-primary-foreground/40 bg-primary-foreground/20 text-primary-foreground"
                            : "border-border bg-muted/40 text-muted-foreground",
                        )}
                      >
                        {author.count} {author.count === 1 ? "tool" : "tools"}
                      </span>
                    )}
                  </div>

                  {/* Social Profile Badges */}
                  {hasLinks && (
                    <div className="flex shrink-0 items-center gap-1 opacity-80">
                      {author.links?.website && (
                        <GlobeIcon
                          className={cn(
                            "size-3",
                            isHighlighted
                              ? "text-primary-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                      )}
                      {author.links?.twitter && (
                        <XLogoIcon
                          className={cn(
                            "size-3",
                            isHighlighted
                              ? "text-primary-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                      )}
                      {author.links?.github && (
                        <Image
                          src="/github.svg"
                          alt="GitHub"
                          width={12}
                          height={12}
                          className={cn(
                            "size-3",
                            isHighlighted
                              ? "brightness-0 invert"
                              : "opacity-60 dark:invert",
                          )}
                        />
                      )}
                    </div>
                  )}
                </li>
              );
            })}

            {/* If query has no exact match, offer "+ Use custom name" */}
            {!exactMatch && query && (
              <li
                onMouseEnter={() => setHighlightedIndex(filteredAuthors.length)}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "border-border/40 text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 border-t px-2.5 py-2 transition-colors",
                  highlightedIndex === filteredAuthors.length
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/60",
                )}
              >
                <span>+ Use &quot;<strong className="text-foreground">{value}</strong>&quot; as new creator</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
