"use client";

import { Braces } from "lucide-react";
import { useMemo, useState } from "react";

import { JsonResult } from "@/app/tools/json-formatter/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";
import { cn } from "@/lib/utils";

type Mode = "format" | "minify";

export default function JsonFormatterPage() {
  const [input, setInput] = useState(
    '{\n  "name": "syntax-stash",\n  "version": 1,\n  "features": ["fast", "local", "focused"]\n}',
  );
  const [mode, setMode] = useState<Mode>("format");

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
        <TextAreaField
          label="Input JSON"
          containerClassName=""
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON here..."
          rows={22}
          action={
            <ClearButton
              onClick={() => {
                setInput("");
              }}
              disabled={!input}
            />
          }
        />

        <div className="space-y-4">
          <TextAreaField
            label={result.ok ? "Output" : <span className="text-destructive">Invalid JSON</span>}
            readOnly
            value={result.ok ? result.output : result.error}
            rows={22}
            className={cn(
              !result.ok &&
                "text-destructive border-destructive/50 focus-visible:ring-destructive/30",
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
        </div>
      </div>
    </ToolLayout>
  );
}
