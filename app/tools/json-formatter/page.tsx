"use client";

import { Braces, Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

import { JsonResult } from "@/app/tools/json-formatter/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

type Mode = "format" | "minify";

export default function JsonFormatterPage() {
  const [input, setInput] = useState(
    '{\n  "name": "syntax-stash",\n  "version": 1,\n  "features": ["fast", "local", "focused"]\n}',
  );
  const [mode, setMode] = useState<Mode>("format");
  const { copied, copy } = useCopyToClipboard();

  const result = useMemo<JsonResult>(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, output: "" };

    try {
      const parsed = JSON.parse(trimmed);
      if (mode === "format") {
        return { ok: true, output: JSON.stringify(parsed, null, 2) };
      }

      return { ok: true, output: JSON.stringify(parsed) };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  }, [input, mode]);

  const modes: { id: Mode; label: string }[] = [
    { id: "format", label: "Format" },
    { id: "minify", label: "Minify" },
  ];

  return (
    <ToolLayout
      icon={Braces}
      title="JSON"
      highlight="Formatter"
      description="Format, minify and validate JSON payloads instantly in your browser."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — input */}
        <div className="mt-3 space-y-6">
          <Label className="text-foreground">Input JSON</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            rows={22}
          />
        </div>

        {/* Right — output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label>
              {result.ok ? "Output" : <span className="text-destructive">Invalid JSON</span>}
            </Label>
            <div className="flex gap-2">
              {modes.map((m) => (
                <Button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  variant="outline"
                  className={cn(
                    "rounded-full px-4 text-xs font-semibold transition-colors",
                    mode === m.id
                      ? "border-ring/40! bg-primary/20! hover:bg-primary/30! text-primary!"
                      : "bg-input! text-muted-foreground",
                  )}
                >
                  {m.label}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(result.ok ? result.output : "")}
              disabled={!result.ok || !result.output}
              className="rounded-full px-5 font-semibold transition-all"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check />
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy />
                  Copy
                </span>
              )}
            </Button>
          </div>

          <Textarea
            readOnly
            value={result.ok ? result.output : result.error}
            rows={22}
            className={cn(
              !result.ok &&
                "text-destructive border-destructive/50 focus-visible:ring-destructive/30",
            )}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
