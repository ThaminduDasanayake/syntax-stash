"use client";

import Fuse from "fuse.js";
import { ArrowLeft, Check, CodeXml, Copy, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LANG_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Snippet } from "@/types";

export default function CodeStashUI({ initialSnippets }: { initialSnippets: Snippet[] }) {
  const [activeId, setActiveId] = useState(initialSnippets[0]?.id);

  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [setupCopied, setSetupCopied] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const languages = useMemo(
    () => ["All", ...Array.from(new Set(initialSnippets.flatMap((s) => s.languages)))],
    [initialSnippets],
  );

  // 1. Setup Fuse.js for fuzzy searching
  const fuse = useMemo(
    () =>
      new Fuse(initialSnippets, {
        keys: ["title", "description", "languages"],
        threshold: 0.3,
      }),
    [initialSnippets],
  );

  // 2. Filter logic combining Fuse and Category tabs
  const filteredSnippets = useMemo(() => {
    let results = searchQuery ? fuse.search(searchQuery).map((res) => res.item) : initialSnippets;

    if (activeFilter !== "All") {
      results = results.filter((s) => s.languages.includes(activeFilter));
    }
    return results;
  }, [searchQuery, activeFilter, fuse, initialSnippets]);

  const activeSnippet = initialSnippets.find((s) => s.id === activeId);

  async function handleCopyCode(code: string, filename: string) {
    await navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  }

  async function handleCopyFilename(filename: string) {
    await navigator.clipboard.writeText(filename);
    setCopiedFile(`name-${filename}`);
    setTimeout(() => setCopiedFile(null), 2000);
  }

  // Removed the duplicate! This is the correct setup copy logic.
  async function handleCopySetup() {
    if (!activeSnippet?.setup) return;
    await navigator.clipboard.writeText(activeSnippet.setup);
    setSetupCopied(true);
    setTimeout(() => setSetupCopied(false), 2000);
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Back link */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <CodeXml className="text-primary" size={36} />
            Code <span className="text-primary">Stash</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            A curated library of developer snippets and configurations.
          </p>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Directory */}
          <div className="flex flex-col lg:col-span-1 lg:max-h-[70vh]">
            {/* Sticky header: search + filters */}
            <div className="sticky top-0 z-10 space-y-3 pb-3">
              {/* Search bar */}
              <div className="relative">
                <Search
                  size={15}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search snippets…"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 h-9 pl-9 text-sm focus-visible:ring-1"
                />
              </div>

              {/* Language filter pills */}
              <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={activeFilter === lang ? "default" : "outline"}
                    size="xs"
                    className={cn(
                      "shrink-0 font-mono text-[11px] transition-colors",
                      activeFilter === lang ? "" : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setActiveFilter(lang)}
                  >
                    {lang}
                  </Button>
                ))}
              </div>

              {/* Separator */}
              <div className="border-border border-t" />
            </div>

            {/* Scrollable snippet list */}
            <div className="flex-1 space-y-0.5 overflow-y-auto pr-2">
              {filteredSnippets.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  No snippets match your search.
                </p>
              ) : (
                filteredSnippets.map((snippet) => {
                  const isActive = snippet.id === activeId;
                  return (
                    <button
                      key={snippet.id}
                      type="button"
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
                        isActive
                          ? "bg-muted border-primary border-l-2"
                          : "hover:bg-muted/50 border-l-2 border-transparent",
                      )}
                      onClick={() => setActiveId(snippet.id)}
                    >
                      <span
                        className={cn(
                          "truncate text-sm font-medium",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {snippet.title}
                      </span>
                      <div className="flex shrink-0 gap-1.5">
                        {snippet.languages.map((lang) => (
                          <Badge
                            key={lang}
                            variant="outline"
                            className={cn(
                              "shrink-0 border px-1.5 py-0 font-mono text-[9px] tracking-wider",
                              LANG_COLORS[lang.toLowerCase()] ??
                                "bg-muted text-muted-foreground border-border",
                            )}
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Code Viewer */}
          <div className="lg:col-span-2">
            {activeSnippet ? (
              <div className="relative">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {activeSnippet.description}
                </p>

                {activeSnippet.instructions && activeSnippet.instructions.length > 0 && (
                  <div className="mb-6 rounded-lg border border-sky-500/20 bg-sky-500/10 p-4">
                    <h4 className="mb-2.5 flex items-center gap-2 text-[11px] font-bold tracking-wider text-sky-400 uppercase">
                      Instructions
                    </h4>
                    <ul className="list-inside list-disc space-y-1.5 text-sm text-sky-200/80">
                      {activeSnippet.instructions.map((instruction, idx) => (
                        <li key={idx} className="leading-snug">
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSnippet.setup && (
                  <div className="mb-6 flex items-center justify-between rounded-lg border border-white/5 bg-black/40 px-4 py-2.5">
                    <code className="font-mono text-[13px] text-emerald-400/90">
                      <span className="text-muted-foreground/50 mr-3 select-none">$</span>
                      {activeSnippet.setup}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                      onClick={handleCopySetup}
                      title="Copy setup command"
                    >
                      {setupCopied ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </Button>
                  </div>
                )}

                <div className="space-y-6">
                  {activeSnippet.files.map((file) => (
                    <div
                      key={file.filename}
                      className="border-border overflow-hidden rounded-xl border bg-[#1e1e1e] shadow-2xl"
                    >
                      {/* Title bar */}
                      <div className="flex items-center justify-between border-b border-white/5 bg-[#1e1e1e] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="mr-2 flex gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-red-500/60" />
                            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                            <span className="h-3 w-3 rounded-full bg-green-500/60" />
                          </div>

                          {/* Hoverable Filename Button */}
                          <Button
                            variant="ghost"
                            onClick={() => handleCopyFilename(file.filename)}
                            className="group flex h-6 items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2 py-0 font-mono text-[11px] text-white/50 transition-all hover:bg-white/10 hover:text-white/80"
                            title="Copy filename"
                          >
                            <span>{file.filename}</span>
                            {copiedFile === `name-${file.filename}` ? (
                              <Check size={10} className="text-emerald-400" />
                            ) : (
                              <Copy
                                size={10}
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            )}
                          </Button>
                        </div>

                        {/* Copy Code Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground h-7"
                          onClick={() => handleCopyCode(file.code, file.filename)}
                        >
                          {copiedFile === file.filename ? (
                            <>
                              <Check size={14} className="mr-1.5 text-emerald-400" />
                              <span className="text-xs text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} className="mr-1.5" />
                              <span className="text-xs">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>

                      <div
                        className="overflow-x-auto p-4 text-sm [&>pre]:m-0! [&>pre]:bg-transparent! [&>pre]:p-0!"
                        dangerouslySetInnerHTML={{ __html: file.html }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
                Select a snippet to view its code.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
