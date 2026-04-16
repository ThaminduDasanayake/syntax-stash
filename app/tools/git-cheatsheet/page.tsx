"use client";

import { GitBranch } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";

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
        !q ||
        cmd.command.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q);
      return matchesCategory && matchesDanger && matchesSearch;
    });
  }, [search, activeCategory, activeDanger]);

  function copyCmd(cmd: string) {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  }

  return (
    <ToolLayout
      icon={GitBranch}
      title="Git Command"
      highlight="Cheatsheet"
      description="A searchable reference of ~70 git commands, organised by intent with danger-level indicators. Click any command to copy it."
      maxWidth="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Search */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search commands or descriptions (e.g. stash, undo, rebase)…"
          className="h-11"
        />

        {/* Category filter */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Category</p>
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
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Danger Level</p>
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
          Showing <span className="text-foreground font-semibold">{filtered.length}</span> of {GIT_COMMANDS.length} commands
        </p>

        {/* Table */}
        <div className="border-border overflow-hidden rounded-xl border">
          <div className="border-border bg-muted/50 grid grid-cols-[2fr_3fr_auto] border-b px-4 py-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Command</span>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Description</span>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Level</span>
          </div>

          <div className="divide-border divide-y">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground p-8 text-center text-sm">
                No commands found for &ldquo;{search}&rdquo;
              </div>
            ) : (
              filtered.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => copyCmd(cmd.command)}
                  className="hover:bg-muted/30 grid w-full grid-cols-[2fr_3fr_auto] items-start gap-4 px-4 py-3 text-left transition-colors"
                >
                  <span
                    className={`font-mono text-sm font-semibold transition-colors ${
                      copiedCmd === cmd.command ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {copiedCmd === cmd.command ? "Copied!" : cmd.command}
                  </span>
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {cmd.description}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${DANGER_STYLES[cmd.danger]}`}
                  >
                    {DANGER_LABELS[cmd.danger]}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          Click any row to copy the command. <span className="text-yellow-400">Caution</span> commands rewrite history.{" "}
          <span className="text-red-400">Destructive</span> commands may permanently discard work.
        </p>
      </div>
    </ToolLayout>
  );
}
