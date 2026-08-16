"use client";

import { CaretDownIcon, CheckIcon, FunnelIcon, TagIcon, XIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface TagOption {
  name: string;
  count: number;
}

interface TagFilterPopoverProps {
  availableTags: TagOption[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  matchMode: "any" | "all";
  onMatchModeChange: (mode: "any" | "all") => void;
  className?: string;
}

export function TagFilterPopover({
  availableTags,
  className,
  matchMode,
  onClearTags,
  onMatchModeChange,
  onToggleTag,
  selectedTags,
}: TagFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const hasSelected = selectedTags.length > 0;

  // Filter tags based on local search input
  const filteredTags = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return availableTags;
    return availableTags.filter((t) => t.name.toLowerCase().includes(query));
  }, [availableTags, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasSelected ? "default" : "outline"}
          size="sm"
          className={cn(
            "filter-tag-btn text-display-xs border-ink h-10 gap-2 rounded-none border-[1.5px] font-mono transition-all duration-200 hover:shadow-sm",
            hasSelected
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-ink bg-transparent",
            className,
          )}
          aria-label="Filter resources by tags"
        >
          <TagIcon weight={hasSelected ? "fill" : "bold"} className="shrink-0" />
          <span className="truncate">Tags</span>
          {hasSelected && (
            <span className="bg-primary-foreground text-primary rounded-full border px-1.25 font-mono text-[10px] font-bold tabular-nums">
              {selectedTags.length}
            </span>
          )}
          <CaretDownIcon
            weight="bold"
            className={cn(
              "shrink-0 opacity-70 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="border-ink bg-popover text-popover-foreground z-70 w-72 rounded-none border-[1.5px] p-0 shadow-2xl sm:w-80"
      >
        <div className="border-border bg-popover flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-1.5">
            <FunnelIcon weight="duotone" className="text-primary" />
            <span className="text-mono-xs font-bold tracking-wider uppercase">Filter by Tags</span>
          </div>

          {hasSelected && (
            <button
              type="button"
              onClick={onClearTags}
              className="text-ink-mute hover:text-destructive flex cursor-pointer items-center gap-1 transition-colors"
            >
              <XIcon weight="bold" />
              <span className="font-mono text-[11px] underline underline-offset-2">
                Clear ({selectedTags.length})
              </span>
            </button>
          )}
        </div>

        {/* Match Mode Toggle */}
        <div className="border-border bg-muted/60 flex items-center justify-between border-b px-3 py-1.5">
          <span className="text-muted-foreground font-mono text-[11px]">Match:</span>
          <div className="flex items-center gap-1">
            <Button
              size="xs"
              className={cn(
                matchMode === "any" && "hover:bg-foreground hover:text-background",
                "font-mono text-[10px] uppercase",
              )}
              variant={matchMode === "any" ? "default" : "outline"}
              onClick={() => onMatchModeChange("any")}
            >
              Any (OR)
            </Button>
            <Button
              size="xs"
              className={cn(
                matchMode === "all" && "hover:bg-foreground hover:text-background",
                "font-mono text-[10px] uppercase",
              )}
              variant={matchMode === "all" ? "default" : "outline"}
              onClick={() => onMatchModeChange("all")}
            >
              All (AND)
            </Button>
          </div>
        </div>

        <Command className="bg-popover rounded-none border-none">
          <CommandInput
            placeholder="Search tags..."
            value={search}
            onValueChange={setSearch}
            className="text-mono-xs h-9 border-none py-2"
          />

          <CommandList className="no-scrollbar max-h-60 overflow-y-auto p-1">
            {filteredTags.length === 0 ? (
              <CommandEmpty className="text-muted-foreground py-6 text-center font-mono text-xs">
                No tags found.
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredTags.map((tag) => {
                  const isChecked = selectedTags.includes(tag.name);
                  return (
                    <CommandItem
                      key={tag.name}
                      value={tag.name}
                      onSelect={() => onToggleTag(tag.name)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-none border-l-2 px-2.5 py-1.5 font-mono text-xs transition-colors",
                        isChecked
                          ? "border-primary bg-primary/10 text-foreground font-bold"
                          : "hover:bg-muted/60 text-foreground/80 border-transparent",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex size-3.5 items-center justify-center rounded-none border transition-colors",
                            isChecked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40 bg-background",
                          )}
                        >
                          {isChecked && <CheckIcon weight="bold" className="size-2.5" />}
                        </div>
                        <span>#{tag.name}</span>
                      </div>
                      <span className="text-muted-foreground ml-2 font-mono text-[10px] tabular-nums">
                        ({tag.count})
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
