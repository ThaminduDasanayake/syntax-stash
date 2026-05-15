"use client";

import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { internalTools } from "@/lib/tools-data";

import { DANGER_LEVELS, DangerLevel, GIT_CATEGORIES, GIT_COMMANDS } from "./data";

const DANGER_STYLES: Record<DangerLevel, string> = {
  safe: "border-green-500/30 bg-green-500/10 text-green-400",
  caution: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  destructive: "border-red-500/30 bg-red-500/10 text-red-400",
};

const DANGER_LABELS: Record<DangerLevel, string> = {
  safe: "Safe",
  caution: "Caution",
  destructive: "Destructive",
};

export default function GitCheatsheetPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeDanger, setActiveDanger] = useState<string>("All");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GIT_COMMANDS.filter((cmd) => {
      const matchesCategory = activeCategory === "All" || cmd.category === activeCategory;
      const matchesDanger = activeDanger === "All" || cmd.danger === activeDanger;
      const matchesSearch =
        !q || cmd.command.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q);
      return matchesCategory && matchesDanger && matchesSearch;
    });
  }, [search, activeCategory, activeDanger]);

  function copyCmd(cmd: string) {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  }

  const tool = internalTools.find((t) => t.slug === "git-cheatsheet");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Search */}
        <SearchInput
          placeholder="Search commands or descriptions (e.g. stash, undo, rebase)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category filter */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {GIT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Danger filter */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Danger Level
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveDanger("All")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                activeDanger === "All"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              All
            </button>
            {DANGER_LEVELS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDanger(d)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  activeDanger === d
                    ? DANGER_STYLES[d]
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {DANGER_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-muted-foreground text-xs">
          Showing <span className="text-foreground font-semibold">{filtered.length}</span> of{" "}
          {GIT_COMMANDS.length} commands
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Command</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground py-8 text-center text-sm whitespace-normal">
                  No commands found for &ldquo;{search}&rdquo;
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cmd, i) => (
                <TableRow key={i} onClick={() => copyCmd(cmd.command)} className="cursor-pointer">
                  <TableCell className="font-mono text-sm font-semibold">
                    <span className={copiedCmd === cmd.command ? "text-primary" : "text-foreground"}>
                      {copiedCmd === cmd.command ? "Copied!" : cmd.command}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-normal text-sm leading-relaxed">
                    {cmd.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-full ${DANGER_STYLES[cmd.danger]}`}>
                      {DANGER_LABELS[cmd.danger]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <p className="text-muted-foreground text-xs">
          Click any row to copy the command. <span className="text-yellow-400">Caution</span>{" "}
          commands rewrite history. <span className="text-red-400">Destructive</span> commands may
          permanently discard work.
        </p>
      </div>
    </ToolLayout>
  );
}
