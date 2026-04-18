"use client";

import { Braces } from "lucide-react";
import { useMemo, useState } from "react";

import { generateInterfaceFromObject } from "@/app/tools/json-to-ts/generate-ts";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

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
    if (!jsonInput.trim() || !parseResult.ok) return "";

    return generateInterfaceFromObject(
      typeof parseResult.data === "object" && parseResult.data !== null
        ? (parseResult.data as Record<string, unknown>)
        : {},
      "RootObject",
    );
  }, [jsonInput, parseResult]);

  function handleFormatJson() {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
    } catch {
      // Silently fail if JSON is invalid
    }
  }

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
          <TextAreaField
            label="Input JSON"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={'Paste your JSON here...\n\n{\n  "name": "John",\n  "age": 30\n}'}
            rows={20}
            action={
              <div className="flex gap-2">
                <Button
                  onClick={handleFormatJson}
                  className="text-xs font-semibold"
                  disabled={!jsonInput || !parseResult.ok}
                >
                  Format JSON
                </Button>
                <ClearButton onClick={() => setJsonInput("")} disabled={!jsonInput} />
              </div>
            }
          />

          {!parseResult.ok && <ErrorAlert message={parseResult.error} />}
        </div>

        {/* Right Column: Output */}

        <TextAreaField
          label="TypeScript Interface"
          readOnly
          value={parseResult.ok && generatedCode ? generatedCode : ""}
          placeholder={
            parseResult.ok ? "Paste JSON on the left to generate TypeScript interfaces" : ""
          }
          rows={20}
          action={<CopyButton value={generatedCode} disabled={!parseResult.ok || !generatedCode} />}
        />
      </div>
    </ToolLayout>
  );
}
