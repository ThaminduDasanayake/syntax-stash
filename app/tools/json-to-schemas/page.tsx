"use client";

import { FileJson } from "lucide-react";
import { useMemo, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

// ---------------------------------------------------------------------------
// Zod generator
// ---------------------------------------------------------------------------

function toZodSchema(value: unknown, indent = 0, nameHint = "root"): string {
  const pad = "  ".repeat(indent);

  if (value === null) return "z.null()";
  if (typeof value === "boolean") return "z.boolean()";
  if (typeof value === "number")
    return Number.isInteger(value) ? "z.number().int()" : "z.number()";
  if (typeof value === "string") return "z.string()";

  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";
    const itemSchema = toZodSchema(value[0], indent, nameHint);
    return `z.array(${itemSchema})`;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return "z.object({})";

    const fields = keys
      .map((k) => {
        const fieldSchema = toZodSchema(obj[k], indent + 1, k);
        return `${"  ".repeat(indent + 1)}${k}: ${fieldSchema},`;
      })
      .join("\n");

    return `z.object({\n${fields}\n${pad}})`;
  }

  return "z.unknown()";
}

function buildZodOutput(parsed: unknown): string {
  const schema = toZodSchema(parsed, 0);
  return `import { z } from "zod";\n\nexport const rootSchema = ${schema};\n\nexport type Root = z.infer<typeof rootSchema>;`;
}

// ---------------------------------------------------------------------------
// Pydantic generator — collects nested classes, emits them top-down
// ---------------------------------------------------------------------------

type PydanticField = { name: string; type: string };
type PydanticClass = { name: string; fields: PydanticField[] };

function toPascalCase(s: string): string {
  return s
    .replace(/[_-](\w)/g, (_, c: string) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function inferPydanticType(
  value: unknown,
  fieldName: string,
  classes: PydanticClass[],
): string {
  if (value === null) return "Optional[Any]";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "float";
  if (typeof value === "string") return "str";

  if (Array.isArray(value)) {
    if (value.length === 0) return "List[Any]";
    const itemType = inferPydanticType(value[0], fieldName, classes);
    return `List[${itemType}]`;
  }

  if (typeof value === "object") {
    const className = toPascalCase(fieldName);
    const obj = value as Record<string, unknown>;
    const fields: PydanticField[] = Object.keys(obj).map((k) => ({
      name: k,
      type: inferPydanticType(obj[k], k, classes),
    }));
    // Avoid duplicate class names
    if (!classes.find((c) => c.name === className)) {
      classes.push({ name: className, fields });
    }
    return className;
  }

  return "Any";
}

function buildPydanticOutput(parsed: unknown): string {
  const classes: PydanticClass[] = [];
  inferPydanticType(parsed, "Root", classes);

  const header = `from __future__ import annotations\nfrom typing import Any, List, Optional\nfrom pydantic import BaseModel\n\n`;

  const classBlocks = classes
    .map((cls) => {
      const fields =
        cls.fields.length === 0
          ? "    pass"
          : cls.fields.map((f) => `    ${f.name}: ${f.type}`).join("\n");
      return `class ${cls.name}(BaseModel):\n${fields}`;
    })
    .join("\n\n");

  return header + classBlocks;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SAMPLE = JSON.stringify(
  {
    id: 1,
    username: "alice",
    email: "alice@example.com",
    isAdmin: false,
    score: 4.9,
    tags: ["typescript", "react"],
    address: {
      street: "123 Main St",
      city: "Anytown",
      zip: "12345",
    },
    posts: [
      {
        id: 101,
        title: "Hello World",
        published: true,
      },
    ],
  },
  null,
  2,
);

export default function JSONToSchemasPage() {
  const [input, setInput] = useState(SAMPLE);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { error: null, zod: "", pydantic: "" };

    try {
      const parsed = JSON.parse(trimmed);
      return {
        error: null,
        zod: buildZodOutput(parsed),
        pydantic: buildPydanticOutput(parsed),
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Invalid JSON",
        zod: "",
        pydantic: "",
      };
    }
  }, [input]);

  return (
    <ToolLayout
      icon={FileJson}
      title="JSON to"
      highlight="Schemas"
      description="Convert JSON payloads into strict Zod (TypeScript) and Pydantic (Python) validation schemas."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: input */}
        <div className="space-y-4">
          <TextAreaField
            label="JSON Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste any JSON payload, e.g. {"id": 1, "name": "Alice"}'
            rows={24}
            action={
              <ClearButton onClick={() => setInput("")} disabled={!input} />
            }
          />
          {result.error && <ErrorAlert message={result.error} />}
        </div>

        {/* Right: outputs */}
        <div className="flex flex-col gap-4">
          <TextAreaField
            label="TypeScript (Zod)"
            value={result.zod}
            readOnly
            rows={11}
            placeholder="Zod schema will appear here..."
            action={
              <CopyButton value={result.zod} disabled={!result.zod} />
            }
          />
          <TextAreaField
            label="Python (Pydantic)"
            value={result.pydantic}
            readOnly
            rows={11}
            placeholder="Pydantic model will appear here..."
            action={
              <CopyButton value={result.pydantic} disabled={!result.pydantic} />
            }
          />
        </div>
      </div>
    </ToolLayout>
  );
}
