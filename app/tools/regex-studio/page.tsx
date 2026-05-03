"use client";

import { BookOpenIcon, DownloadIcon, FlaskIcon } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";

import Diagram from "@/app/tools/regex-studio/components/diagram";
import { CATEGORY_COLORS, REGEX_CATEGORIES } from "@/app/tools/regex-studio/constants";
import { REGEX_PATTERNS } from "@/app/tools/regex-studio/data";
import { parseRegex } from "@/app/tools/regex-studio/helpers";
import { RegexResult } from "@/app/tools/regex-studio/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";

export default function RegexStudioPage() {
  const [activeTab, setActiveTab] = useState<string>("tester");

  const diagramRef = useRef<SVGSVGElement>(null);

  // Tester State
  const [pattern, setPattern] = useState("[a-z]+");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState(
    "Hello world 123\nThe quick brown fox jumps over the lazy dog.",
  );

  // Library State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const parsed = useMemo(() => parseRegex(pattern, flags), [pattern, flags]);

  // Logic
  const result = useMemo<RegexResult>(() => {
    if (!pattern) return { ok: true, matches: [] };

    try {
      const re = new RegExp(pattern, flags);

      if (flags.includes("g")) {
        const all = Array.from(testString.matchAll(re));
        return {
          ok: true,
          matches: all.map((m) => ({
            value: m[0],
            index: m.index ?? 0,
            groups: m.slice(1),
          })),
        };
      }

      const m = testString.match(re);
      if (!m) return { ok: true, matches: [] };
      return {
        ok: true,
        matches: [
          {
            value: m[0],
            index: m.index ?? 0,
            groups: m.slice(1),
          },
        ],
      };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Invalid regular expression",
      };
    }
  }, [pattern, flags, testString]);

  const filteredLibrary = useMemo(() => {
    const q = search.toLowerCase();
    return REGEX_PATTERNS.filter((entry) => {
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      const matchesSearch =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.pattern.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  function downloadSvg() {
    const svg = diagramRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regex-railroad.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  const getSvgString = () => {
    const svg = diagramRef.current;
    if (!svg) return "";
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  };

  function handleUsePattern(entry: (typeof REGEX_PATTERNS)[0]) {
    setPattern(entry.pattern);
    setFlags(entry.flags);
    // Preload the test string with both valid and invalid examples to demonstrate how it works
    const exampleText = `--- Valid Matches ---\n${entry.examples.match.join(
      "\n",
    )}\n\n--- Invalid Matches ---\n${entry.examples.noMatch.join("\n")}`;
    setTestString(exampleText);
    setActiveTab("tester");
    // Scroll to top so they see the tester
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleFlag(flag: string) {
    if (flags.includes(flag)) {
      setFlags((prev) => prev.replace(flag, ""));
    } else {
      setFlags((prev) => prev + flag);
    }
  }

  const tool = internalTools.find((t) => t.url === "/tools/regex-studio");

  return (
    <ToolLayout tool={tool}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <div className="flex w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tester" className="tab-trigger">
              <FlaskIcon weight="duotone" className="size-4.5" />
              Live Tester
            </TabsTrigger>
            <TabsTrigger value="library" className="tab-trigger">
              <BookOpenIcon weight="duotone" className="size-4.5" />
              Pattern Library
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tester" className="mt-0 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Regular Expression</Label>

              <div className="flex items-center gap-3">
                {/* Left Slash */}
                <span className="text-muted-foreground font-mono text-xl font-light">/</span>

                {/* Pattern Input */}
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="[a-z]+"
                  className="flex-1 font-mono text-sm"
                />

                {/* Right Slash */}
                <span className="text-muted-foreground font-mono text-xl font-light">/</span>

                {/* Flags Input */}
                <Input
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="g"
                  className="text-primary w-20 text-center font-mono text-sm"
                />
              </div>
            </div>

            {/* Interactive Flag Toggles */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "g", label: "Global" },
                { id: "i", label: "Case insensitive" },
                { id: "m", label: "Multiline" },
                { id: "s", label: "Dotall" },
              ].map((f) => {
                const isActive = flags.includes(f.id);
                return (
                  <Button
                    key={f.id}
                    size="sm"
                    className="gap-1.5 font-semibold"
                    onClick={() => toggleFlag(f.id)}
                    variant={isActive ? "default" : "outline"}
                  >
                    <span className="font-mono">{f.id}</span>
                    <span>{f.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {!result.ok && <ErrorAlert message={result.error} />}

          <TextAreaField
            label="Test String"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Paste text to test against..."
            rows={8}
            action={<ClearButton onClick={() => setTestString("")} disabled={!testString} />}
          />

          <div className="space-y-3 pt-4">
            <div className="flex items-baseline justify-between">
              <Label className="text-foreground">Matches</Label>
              {result.ok && (
                <span className="text-muted-foreground font-mono text-xs">
                  {result.matches.length} {result.matches.length === 1 ? "match" : "matches"}
                </span>
              )}
            </div>

            {result.ok && result.matches.length === 0 && (
              <p className="text-muted-foreground font-mono text-sm">No matches found.</p>
            )}

            {result.ok && result.matches.length > 0 && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {result.matches.map((m, i) => (
                  <Card key={i} size="sm" className="bg-background">
                    <CardContent className="space-y-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-muted-foreground font-mono text-xs">#{i + 1}</span>
                        <span className="text-muted-foreground font-mono text-xs">
                          index {m.index}
                        </span>
                      </div>
                      <p className="text-primary font-mono text-sm break-all">
                        {m.value || "\u00A0"}
                      </p>
                      {m.groups.length > 0 && (
                        <div className="border-border space-y-1 border-t pt-2">
                          {m.groups.map((g, gi) => (
                            <p
                              key={gi}
                              className="text-muted-foreground font-mono text-xs break-all"
                            >
                              <span className="text-foreground/60">group {gi + 1}:</span>{" "}
                              {g ?? "(undefined)"}
                            </p>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <CopyButton value={getSvgString} labelName="Copy SVG" disabled={!parsed.ok} />
            <Button variant="outline" onClick={downloadSvg} disabled={!parsed.ok}>
              <DownloadIcon weight="duotone" />
              Download .svg
            </Button>
          </div>

          {parsed.ok && (
            <div className="border-border bg-card overflow-auto rounded-xl border p-6">
              <Diagram ast={parsed.ast} svgRef={diagramRef} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="library" className="mt-0 space-y-6">
          <div className="space-y-3">
            <InputField
              label="Pattern"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patterns (e.g. email, UUID, date)…"
            />
            <div className="flex flex-wrap gap-2">
              {REGEX_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  variant={activeCategory === cat ? "default" : "outline"}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground text-xs">
            Showing <span className="text-foreground font-semibold">{filteredLibrary.length}</span>{" "}
            of {REGEX_PATTERNS.length} patterns
          </p>

          {filteredLibrary.length === 0 ? (
            <div className="text-muted-foreground border-border rounded-xl border border-dashed py-12 text-center text-sm">
              No patterns found for &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredLibrary.map((entry) => {
                return (
                  <Card key={entry.name} className="flex flex-col">
                    <CardContent className="flex flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-foreground leading-snug font-semibold">{entry.name}</p>
                          <span
                            className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                              CATEGORY_COLORS[entry.category]
                            }`}
                          >
                            {entry.category}
                          </span>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <CopyButton label={false} value={entry.pattern} className="px-2.5" />

                          <Button
                            variant="outline"
                            onClick={() => handleUsePattern(entry)}
                            title="Use in Tester"
                          >
                            <FlaskIcon weight="duotone" className="size-4.5" />
                          </Button>
                        </div>
                      </div>

                      <div
                        className="bg-muted/40 border-border cursor-pointer overflow-x-auto rounded-lg border px-3 py-2"
                        onClick={() => navigator.clipboard.writeText(entry.pattern)}
                        title="Click to copy"
                      >
                        <code className="text-primary font-mono text-xs break-all">
                          /{entry.pattern}/{entry.flags}
                        </code>
                      </div>

                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {entry.description}
                      </p>

                      <div className="border-border mt-auto space-y-1.5 border-t pt-3">
                        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                          Examples
                        </p>
                        <div className="space-y-1">
                          {entry.examples.match.map((ex) => (
                            <div key={ex} className="flex items-center gap-2">
                              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-500/70" />
                              <span className="font-mono text-xs break-all text-green-400">
                                {ex}
                              </span>
                            </div>
                          ))}
                          {entry.examples.noMatch.slice(0, 2).map((ex) => (
                            <div key={ex} className="flex items-center gap-2">
                              <span className="bg-destructive/80 mt-0.5 h-2 w-2 shrink-0 rounded-full" />
                              <span className="text-muted-foreground font-mono text-xs break-all">
                                {ex}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
