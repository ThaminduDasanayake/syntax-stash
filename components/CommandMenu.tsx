"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wrench, BookMarked } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { internalTools, resourceLinks } from "@/lib/data";
import type { Tool } from "@/lib/data";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CommandMenu({ open, setOpen }: Props) {
  const router = useRouter();

  // Register ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpen]);

  function handleSelect(tool: Tool) {
    setOpen(false);
    if (tool.url.startsWith("/")) {
      router.push(tool.url);
    } else {
      window.open(tool.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
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
              <Wrench size={14} className="text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{tool.title}</span>
                <span className="text-xs text-muted-foreground">{tool.description}</span>
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
              <BookMarked size={14} className="text-muted-foreground shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{tool.title}</span>
                <span className="text-xs text-muted-foreground">{tool.category} · {tool.description}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
