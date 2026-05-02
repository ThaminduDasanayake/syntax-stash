"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";
import { cn } from "@/lib/utils";

type Mode = "format" | "minify";

type FormatResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

export function FormatTab({ input }: { input: string }) {
  const [mode, setMode] = useState<Mode>("format");

  const result = useMemo<FormatResult>(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, output: "" };
    try {
      const parsed = JSON.parse(trimmed);
      return { ok: true, output: mode === "format" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed) };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input, mode]);

  const modes: { id: Mode; label: string }[] = [
    { id: "format", label: "Format" },
    { id: "minify", label: "Minify" },
  ];

  return (
    <TextAreaField
      label={result.ok ? "Output" : <span className="text-destructive">Invalid JSON</span>}
      readOnly
      value={result.ok ? result.output : result.error}
      rows={22}
      className={cn(
        !result.ok && "text-destructive border-destructive/50 focus-visible:ring-destructive/30",
      )}
      action={
        <>
          <div className="flex gap-2">
            {modes.map((m) => (
              <Button
                key={m.id}
                onClick={() => setMode(m.id)}
                variant={mode === m.id ? "default" : "outline"}
                className="px-4 text-xs font-semibold transition-colors"
              >
                {m.label}
              </Button>
            ))}
          </div>
          <CopyButton
            value={result.ok ? result.output : ""}
            disabled={!result.ok || !result.output}
          />
        </>
      }
    />
  );
}
