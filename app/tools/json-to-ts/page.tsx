"use client";

import { Braces, Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { cn } from "@/lib/utils";

function generateTypeScript(obj: unknown, name: string = "RootObject", indent: number = 0): string {
  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);

  if (obj === null) {
    return `${pad}${name}: null;`;
  }

  const type = typeof obj;

  // Primitive types
  if (type === "string") {
    return `${pad}${name}: string;`;
  }
  if (type === "number") {
    return `${pad}${name}: number;`;
  }
  if (type === "boolean") {
    return `${pad}${name}: boolean;`;
  }

  // Arrays
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return `${pad}${name}: any[];`;
    }

    // Determine the type of array elements
    const firstElement = obj[0];
    if (typeof firstElement === "object" && firstElement !== null && !Array.isArray(firstElement)) {
      // Array of objects - generate interface for the object
      const objectInterface = generateInterfaceFromObject(firstElement, `${name}Item`, indent);
      return `${pad}${name}: ${name}Item[];`;
    }

    const elementType = Array.isArray(firstElement)
      ? "any[]"
      : typeof firstElement === "object"
        ? "object"
        : typeof firstElement;

    return `${pad}${name}: ${elementType}[];`;
  }

  // Objects
  if (type === "object") {
    return generateInterfaceFromObject(obj as Record<string, unknown>, name, indent);
  }

  return `${pad}${name}: any;`;
}

function generateInterfaceFromObject(
  obj: Record<string, unknown>,
  name: string,
  indent: number = 0,
): string {
  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);

  const lines: string[] = [];
  lines.push(`${pad}interface ${name} {`);

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `"${key}"`;

    if (value === null) {
      lines.push(`${innerPad}${safeKey}: null;`);
    } else if (typeof value === "string") {
      lines.push(`${innerPad}${safeKey}: string;`);
    } else if (typeof value === "number") {
      lines.push(`${innerPad}${safeKey}: number;`);
    } else if (typeof value === "boolean") {
      lines.push(`${innerPad}${safeKey}: boolean;`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${innerPad}${safeKey}: any[];`);
      } else {
        const firstElement = value[0];
        if (typeof firstElement === "object" && firstElement !== null && !Array.isArray(firstElement)) {
          const itemName = key.charAt(0).toUpperCase() + key.slice(1);
          const nestedInterface = generateInterfaceFromObject(
            firstElement as Record<string, unknown>,
            itemName,
            indent + 1,
          );
          const nestedLines = nestedInterface.split("\n");
          lines.push(...nestedLines);
          lines.push(`${innerPad}${safeKey}: ${itemName}[];`);
        } else {
          const elementType = Array.isArray(firstElement)
            ? "any[]"
            : typeof firstElement === "object"
              ? "any"
              : typeof firstElement;
          lines.push(`${innerPad}${safeKey}: ${elementType}[];`);
        }
      }
    } else if (typeof value === "object") {
      const objectName = key.charAt(0).toUpperCase() + key.slice(1);
      const nestedInterface = generateInterfaceFromObject(
        value as Record<string, unknown>,
        objectName,
        indent + 1,
      );
      const nestedLines = nestedInterface.split("\n");
      lines.push(...nestedLines);
      lines.push(`${innerPad}${safeKey}: ${objectName};`);
    } else {
      lines.push(`${innerPad}${safeKey}: any;`);
    }
  }

  lines.push(`${pad}}`);
  return lines.join("\n");
}

type ParseResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string };

export default function JsonToTsPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

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

  async function handleCopyCode() {
    await navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  return (
    <ToolLayout
      icon={Braces}
      title="JSON to TS"
      highlight="Generator"
      description="Convert JSON objects into TypeScript interfaces with full type inference."
      maxWidth="max-w-7xl"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-foreground text-sm font-medium">Input JSON</label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFormatJson}
              className="text-xs h-8"
            >
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
              onClick={handleCopyCode}
              disabled={!parseResult.ok || !generatedCode}
              className="text-xs h-8 gap-2"
            >
              {copiedCode ? (
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
            <div className="overflow-y-auto max-h-[500px] p-4">
              {parseResult.ok && generatedCode ? (
                <pre className="whitespace-pre-wrap break-words leading-relaxed text-primary">
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
