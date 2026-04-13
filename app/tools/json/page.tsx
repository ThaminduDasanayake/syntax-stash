"use client";

import { AlertTriangle,ArrowLeft, Braces } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Mode = "format" | "minify" | "typescript";

function toTsType(value: unknown, indent: number): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    return `${toTsType(value[0], indent)}[]`;
  }
  const t = typeof value;
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "Record<string, unknown>";
    const pad = "  ".repeat(indent + 1);
    const closePad = "  ".repeat(indent);
    const needsQuote = (k: string) => !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
    const lines = entries.map(([k, v]) => {
      const key = needsQuote(k) ? JSON.stringify(k) : k;
      return `${pad}${key}: ${toTsType(v, indent + 1)};`;
    });
    return `{\n${lines.join("\n")}\n${closePad}}`;
  }
  return "unknown";
}

function generateInterface(parsed: unknown): string {
  const body = toTsType(parsed, 0);
  if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
    return `interface GeneratedType ${body}`;
  }
  return `type GeneratedType = ${body};`;
}

type Result = { ok: true; output: string } | { ok: false; error: string };

export default function JsonTransformerPage() {
  const [input, setInput] = useState(
    '{\n  "name": "syntax-stash",\n  "version": 1,\n  "features": ["fast", "local", "focused"]\n}',
  );
  const [mode, setMode] = useState<Mode>("format");

  const result = useMemo<Result>(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, output: "" };

    try {
      const parsed = JSON.parse(trimmed);
      if (mode === "format") {
        return { ok: true, output: JSON.stringify(parsed, null, 2) };
      }
      if (mode === "minify") {
        return { ok: true, output: JSON.stringify(parsed) };
      }
      return { ok: true, output: generateInterface(parsed) };
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
    { id: "typescript", label: "TypeScript" },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <Braces className="text-primary" size={36} />
            JSON <span className="text-primary">Transformer</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Format, minify, and auto-generate TypeScript interfaces from any JSON payload.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — input */}
          <div className="space-y-4">
            <Label className="text-foreground">Input JSON</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JSON here..."
              rows={22}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
            />
            {result.ok === false && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p className="font-mono">{result.error}</p>
              </div>
            )}
          </div>

          {/* Right — output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-foreground">Output</Label>
              <div className="flex gap-2">
                {modes.map((m) => (
                  <Button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    variant="outline"
                    className={cn(
                      "h-8 rounded-full px-4 text-xs font-semibold transition-colors",
                      mode === m.id
                        ? "border-primary/40 bg-primary/15 text-primary hover:bg-primary/20"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              readOnly
              value={result.ok ? result.output : ""}
              rows={22}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
