"use client";

import { BookmarksIcon, WrenchIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
import { resourceLinks } from "@/lib/resources-data";
import { internalTools } from "@/lib/tools-data";
import { CommandMenuProps, Tool } from "@/types";

export default function CommandMenu({ open, setOpenAction }: CommandMenuProps) {
  const router = useRouter();

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
    if (tool.url.startsWith("/")) {
      router.push(tool.url);
    } else {
      window.open(tool.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpenAction}>
      <Command>
        <CommandInput placeholder="Search tools and resources..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Inbuilt Tools">
            {internalTools.map((tool) => (
              <CommandItem
                key={tool.url}
                value={`${tool.title} ${tool.description}`}
                onSelect={() => handleSelect(tool)}
                className="gap-2"
              >
                <WrenchIcon weight="duotone" className="size-4.5!" />
                <div className="flex flex-col">
                  <span className="font-medium">{tool.title}</span>
                  <span className="text-muted-foreground text-xs">{tool.description}</span>
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
                className="gap-2"
              >
                <BookmarksIcon weight="duotone" className="size-4.5!" />
                <div className="flex flex-col">
                  <span className="font-medium">{tool.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {tool.category} · {tool.description}
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
