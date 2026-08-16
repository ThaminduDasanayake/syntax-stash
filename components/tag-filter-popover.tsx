"use client";

import { CheckIcon, FunnelIcon, TagIcon, XIcon } from "@phosphor-icons/react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface TagOption {
  count: number;
  name: string;
}

interface TagFilterPopoverProps {
  availableTags: TagOption[];
  className?: string;
  matchMode: "any" | "all";
  onClearTags: () => void;
  onMatchModeChange: (mode: "any" | "all") => void;
  onToggleTag: (tag: string) => void;
  selectedTags: string[];
}

function TagFilterContent({
  availableTags,
  matchMode,
  onClearTags,
  onMatchModeChange,
  onToggleTag,
  selectedTags,
}: Omit<TagFilterPopoverProps, "className">) {
  const [search, setSearch] = useState("");
  const hasSelected = selectedTags.length > 0;

  const filteredTags = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return availableTags;
    return availableTags.filter((t) => t.name.toLowerCase().includes(query));
  }, [availableTags, search]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-border bg-popover flex items-center justify-between border-b px-4 py-3 sm:px-3 sm:py-2">
        <div className="flex items-center gap-2">
          <FunnelIcon weight="bold" className="text-primary size-4" />
          <span className="text-mono-xs font-bold uppercase tracking-wider">Filter by Tags</span>
        </div>

        {hasSelected && (
          <button
            type="button"
            onClick={onClearTags}
            className="text-ink-mute hover:text-destructive flex cursor-pointer items-center gap-1 font-mono text-xs underline underline-offset-2 transition-colors sm:text-[11px]"
          >
            <XIcon weight="bold" className="size-3.5" />
            <span>Clear ({selectedTags.length})</span>
          </button>
        )}
      </div>

      {/* Match Mode Toggle */}
      <div className="border-border bg-muted/60 flex items-center justify-between border-b px-4 py-2 sm:px-3 sm:py-1.5">
        <span className="text-muted-foreground font-mono text-xs sm:text-[11px]">Match:</span>
        <div className="flex items-center gap-1.5 sm:gap-1">
          <button
            type="button"
            onClick={() => onMatchModeChange("any")}
            className={cn(
              "cursor-pointer rounded-none border px-2.5 py-1 font-mono text-xs uppercase transition-colors sm:px-2 sm:py-0.5 sm:text-[10px]",
              matchMode === "any"
                ? "border-primary bg-primary text-primary-foreground font-bold"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            Any (OR)
          </button>
          <button
            type="button"
            onClick={() => onMatchModeChange("all")}
            className={cn(
              "cursor-pointer rounded-none border px-2.5 py-1 font-mono text-xs uppercase transition-colors sm:px-2 sm:py-0.5 sm:text-[10px]",
              matchMode === "all"
                ? "border-primary bg-primary text-primary-foreground font-bold"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            All (AND)
          </button>
        </div>
      </div>

      {/* Tag Search & List */}
      <Command className="bg-popover rounded-none border-none">
        <CommandInput
          placeholder="Search tags..."
          value={search}
          onValueChange={setSearch}
          className="text-mono-xs h-10 border-none py-2.5 sm:h-9 sm:py-2"
        />

        <CommandList className="no-scrollbar max-h-72 overflow-y-auto p-1 sm:max-h-60">
          {filteredTags.length === 0 ? (
            <CommandEmpty className="text-muted-foreground py-8 text-center font-mono text-xs">
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
                      "flex cursor-pointer items-center justify-between rounded-none border-l-2 px-3 py-2.5 font-mono text-xs transition-colors sm:px-2.5 sm:py-1.5",
                      isChecked
                        ? "border-primary bg-primary/10 text-foreground font-bold"
                        : "hover:bg-muted/60 border-transparent text-foreground/80",
                    )}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-2">
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-none border transition-colors sm:size-3.5",
                          isChecked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40 bg-background",
                        )}
                      >
                        {isChecked && <CheckIcon weight="bold" className="size-3 sm:size-2.5" />}
                      </div>
                      <span>#{tag.name}</span>
                    </div>
                    <span className="text-muted-foreground ml-2 font-mono text-xs tabular-nums sm:text-[10px]">
                      ({tag.count})
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
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
  const isMobile = useIsMobile();
  const hasSelected = selectedTags.length > 0;

  // Floating trigger button
  const triggerButton = (
    <div className={cn("fixed right-5 bottom-17 z-40 sm:right-8 sm:bottom-21", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={hasSelected ? "default" : "outline"}
            size="icon-lg"
            aria-label="Filter by tags"
            className="border-ink bg-background text-ink hover:border-ink hover:bg-primary hover:text-primary-foreground group relative size-10 rounded-none border-[1.5px] shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 sm:size-11"
          >
            <TagIcon
              weight={hasSelected ? "fill" : "bold"}
              className="size-4.5 transition-transform duration-200 group-hover:scale-110"
            />
            {hasSelected && (
              <span className="border-background bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border font-mono text-[10px] font-bold shadow-xs">
                {selectedTags.length}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p className="font-mono text-xs">
            {hasSelected ? `Tags (${selectedTags.length} active)` : "Filter by tags"}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="border-ink bg-popover z-70 max-h-[85vh] rounded-t-none border-t-[1.5px] p-0 shadow-2xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Filter Resources by Tags</SheetTitle>
            <SheetDescription>Select tags to filter resources list</SheetDescription>
          </SheetHeader>
          <TagFilterContent
            availableTags={availableTags}
            matchMode={matchMode}
            onClearTags={onClearTags}
            onMatchModeChange={onMatchModeChange}
            onToggleTag={onToggleTag}
            selectedTags={selectedTags}
          />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Upward Popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="border-ink bg-popover text-popover-foreground z-70 w-80 rounded-none border-[1.5px] p-0 shadow-2xl"
      >
        <TagFilterContent
          availableTags={availableTags}
          matchMode={matchMode}
          onClearTags={onClearTags}
          onMatchModeChange={onMatchModeChange}
          onToggleTag={onToggleTag}
          selectedTags={selectedTags}
        />
      </PopoverContent>
    </Popover>
  );
}
