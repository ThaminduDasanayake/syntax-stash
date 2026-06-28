"use client";

import { BookmarksIcon, WrenchIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";
import { CommandMenuProps, Tool } from "@/types";

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || query.trim() === "") return <>{text}</>;

  // Escape special regex characters to prevent runtime crashes if a user types strings like "/" or "["
  const escapedQuery = query.trim().replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

  // Tokenize the query into individual words to support multi-word, out-of-order highlighting
  const words = escapedQuery.split(/\s+/).filter(Boolean);
  if (words.length === 0) return <>{text}</>;

  const searchPattern = words.join("|");

  // Split on boundaries while retaining the original text fragments
  const parts = text.split(new RegExp(`(${searchPattern})`, "gi"));

  const queryWordsLower = words.map((w) => w.toLowerCase());

  return (
    <>
      {parts.map((part, i) =>
        queryWordsLower.includes(part.toLowerCase()) ? (
          /* The high-visibility flashing neon indicator */
          <span key={i} className="bg-primary/20 text-primary font-bold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function CommandMenu({ open, setOpenAction }: CommandMenuProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Register ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenAction(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpenAction]);

  function handleSelect(tool: Tool) {
    setOpenAction(false);
    if (tool.slug) {
      router.push(`/tools/${tool.slug}`);
    } else if (tool.url) {
      window.open(tool.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpenAction}>
      <Command
        filter={(value, search) => {
          if (!search) return 1;

          // Normalize and tokenize the search input into distinct words
          const searchWords = search.toLowerCase().trim().split(/\s+/);
          const itemTargetText = value.toLowerCase();

          // EVERY single typed word must be present as a continuous chunk somewhere in the item value
          const isMatch = searchWords.every((word) => itemTargetText.includes(word));

          return isMatch ? 1 : 0;
        }}
      >
        <CommandInput placeholder="> Search Registry..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Inbuilt Tools">
            {internalTools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={`${tool.title} ${tool.description}`}
                onSelect={() => handleSelect(tool)}
              >
                {/* Structural Level Indentation Logic */}
                {"isSubItem" in tool && tool.isSubItem ? (
                  <div className="border-muted-foreground/40 bg-background text-muted-foreground ml-4 flex h-8 w-8 shrink-0 items-center justify-center border border-dashed font-mono text-xs">
                    &gt;
                  </div>
                ) : (
                  <div className="border-border bg-background flex h-10 w-10 shrink-0 items-center justify-center border-2">
                    <WrenchIcon weight="bold" className="size-5!" />
                  </div>
                )}
                <div className="ml-1 flex min-w-0 flex-1 flex-col">
                  <span className="text-foreground mb-1 block text-sm font-bold tracking-tight uppercase">
                    <Highlight text={tool.title} query={search} />
                  </span>
                  <span className="text-muted-foreground/80 block font-mono text-xs leading-relaxed font-medium whitespace-normal">
                    <Highlight text={tool.description} query={search} />
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Resources">
            {resourceLinks.map((tool) => (
              <CommandItem
                key={tool.url}
                value={`${tool.title} ${tool.description} ${tool.category}`}
                onSelect={() => handleSelect(tool)}
              >
                {/* Structural Level Indentation Logic */}
                {"isSubItem" in tool && tool.isSubItem ? (
                  <div className="border-muted-foreground/40 bg-background text-muted-foreground ml-4 flex h-8 w-8 shrink-0 items-center justify-center border border-dashed font-mono text-xs">
                    &gt;
                  </div>
                ) : (
                  <div className="border-border bg-background flex h-10 w-10 shrink-0 items-center justify-center border-2">
                    <BookmarksIcon weight="bold" className="size-5!" />
                  </div>
                )}
                <div className="ml-1 flex min-w-0 flex-1 flex-col">
                  <span className="text-foreground mb-1 block text-sm font-bold tracking-tight uppercase">
                    <Highlight text={tool.title} query={search} />
                  </span>
                  <span className="text-muted-foreground/80 block font-mono text-xs leading-relaxed font-medium whitespace-normal">
                    <Highlight
                      text={`[ ${tool.category} ] // ${tool.description}`}
                      query={search}
                    />
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
