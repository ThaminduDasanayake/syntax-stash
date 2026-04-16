"use client";

import { AlertTriangle, Regex } from "lucide-react";
import { useMemo, useState } from "react";

import { RegexResult } from "@/app/tools/regex-tester/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("[a-z]+");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState(
    "Hello world 123\nThe quick brown fox jumps over the lazy dog.",
  );

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

  return (
    <ToolLayout
      icon={Regex}
      title="Regex"
      highlight="Tester"
      description="Test JavaScript regular expressions with live match highlighting."
    >
      <div className="space-y-6">
        {/* Pattern + flags row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_140px]">
          <div className="space-y-2">
            <Label className="text-foreground">Pattern</Label>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 h-10 font-mono focus-visible:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Flags</Label>
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="g"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 h-10 font-mono focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Error */}
        {!result.ok && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p className="font-mono">{result.error}</p>
          </div>
        )}

        {/* Test string */}
        <div className="space-y-2">
          <Label className="text-foreground">Test String</Label>
          <Textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Paste text to test against..."
            rows={8}
            className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
          />
        </div>

        {/* Results */}
        <div className="space-y-3">
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                          <p key={gi} className="text-muted-foreground font-mono text-xs break-all">
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
      </div>
    </ToolLayout>
  );
}
