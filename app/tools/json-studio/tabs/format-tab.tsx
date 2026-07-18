"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { cn } from "@/lib/utils";

type Mode = "format" | "minify";

type FormatResult = { ok: true; output: string } | { ok: false; error: string };

export function FormatTab({ input }: { input: string }) {
  const [mode, setMode] = useState<Mode>("format");

  const result = useMemo<FormatResult>(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, output: "" };
    try {
      const parsed = JSON.parse(trimmed);
      return {
        ok: true,
        output: mode === "format" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed),
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid JSON", ok: false };
    }
  }, [input, mode]);

  const modes: { id: Mode; label: string }[] = [
    { id: "format", label: "Format" },
    { id: "minify", label: "Minify" },
  ];

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <TextareaGroup
        label={result.ok ? "Output" : <span className="text-destructive">Invalid JSON</span>}
        value={result.ok ? result.output : result.error}
        readOnly
        className={cn(
          !result.ok && "text-destructive border-destructive/50 focus-visible:ring-destructive/30",
        )}
        containerClassName="h-full flex-1 min-h-0"
        action={
          <>
            <div className="flex gap-2">
              {modes.map((m) => (
                <Button
                  key={m.id}
                  size="sm"
                  onClick={() => setMode(m.id)}
                  variant={mode === m.id ? "default" : "outline"}
                  className="px-4 text-xs font-semibold transition-colors"
                >
                  {m.label}
                </Button>
              ))}
            </div>
            <CopyButton
              iconOnly
              textToCopy={result.ok ? result.output : ""}
              disabled={!result.ok || !result.output}
            />
          </>
        }
      />
    </div>
  );
}
