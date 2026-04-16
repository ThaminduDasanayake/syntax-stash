"use client";

import { Braces, Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

import { generateInterfaceFromObject } from "@/app/tools/json-to-ts/generate-ts";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type ParseResult = { ok: true; data: unknown } | { ok: false; error: string };

export default function JsonToTsPage() {
  const [jsonInput, setJsonInput] = useState("");

  const parseResult = useMemo<ParseResult>(() => {
    if (!jsonInput.trim()) {
      return { ok: true, data: {} };
    }

    try {
      const parsed = JSON.parse(jsonInput);
      return { ok: true, data: parsed };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid JSON";
      return { ok: false, error: message };
    }
  }, [jsonInput]);

  const generatedCode = useMemo(() => {
    if (!parseResult.ok) return "";
    return generateInterfaceFromObject(
      typeof parseResult.data === "object" && parseResult.data !== null
        ? (parseResult.data as Record<string, unknown>)
        : {},
      "RootObject",
    );
  }, [parseResult]);

  function handleFormatJson() {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
    } catch {
      // Silently fail if JSON is invalid
    }
  }

  const { copied, copy } = useCopyToClipboard();

  return (
    <ToolLayout
      icon={Braces}
      title="JSON to TS"
      highlight="Generator"
      description="Convert JSON objects into TypeScript interfaces with full type inference."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-foreground text-sm font-medium">Input JSON</label>
            <Button variant="outline" size="sm" onClick={handleFormatJson} className="h-8 text-xs">
              Format JSON
            </Button>
          </div>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={'Paste your JSON here...\n\n{\n  "name": "John",\n  "age": 30\n}'}
            rows={20}
            className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
          />

          {!parseResult.ok && (
            <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm">
              <p className="font-mono text-xs">{parseResult.error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-foreground text-sm font-medium">TypeScript Interface</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(generatedCode)}
              disabled={!parseResult.ok || !generatedCode}
              className="h-8 gap-2 text-xs"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
            </Button>
          </div>

          <div className="bg-background border-border text-foreground focus-visible:ring-primary/30 overflow-hidden rounded-lg border font-mono text-sm focus-visible:ring-1">
            <div className="max-h-125 overflow-y-auto p-4">
              {parseResult.ok && generatedCode ? (
                <pre className="text-primary leading-relaxed wrap-break-word whitespace-pre-wrap">
                  {generatedCode}
                </pre>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {parseResult.ok ? "Paste JSON on the left to generate TypeScript interfaces" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
