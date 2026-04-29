"use client";

import { FileType2 } from "lucide-react";
import { useMemo, useState } from "react";

import { generateTypeScript, type GenerateOptions } from "@/app/tools/json-to-typescript/helpers";
import { ToolLayout } from "@/components/layout/tool-layout";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const PLACEHOLDER = `{
  "id": "user_42",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "isActive": true,
  "tags": ["admin", "early-adopter"],
  "profile": {
    "bio": "Mathematician",
    "avatarUrl": null,
    "joinedAt": "1815-12-10T00:00:00Z"
  },
  "posts": [
    {
      "id": 1,
      "title": "Notes on the Analytical Engine",
      "publishedAt": "1843-08-01"
    },
    {
      "id": 2,
      "title": "Translations and commentary",
      "publishedAt": null
    }
  ]
}`;

export default function JsonToTypeScriptPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [rootName, setRootName] = useState("Root");
  const [decl, setDecl] = useState<"interface" | "type">("interface");
  const [exportTypes, setExportTypes] = useState(true);
  const [readonly, setReadonly] = useState(false);
  const [optionalNulls, setOptionalNulls] = useState(true);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      const parsed = JSON.parse(input);
      const opts: GenerateOptions = {
        rootName: rootName || "Root",
        useType: decl === "type",
        exportTypes,
        readonly,
        optionalNulls,
      };
      return { output: generateTypeScript(parsed, opts), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input, rootName, decl, exportTypes, readonly, optionalNulls]);

  return (
    <ToolLayout
      icon={FileType2}
      title="JSON to TypeScript"
      highlight="Interface"
      description="Paste any JSON payload and generate clean TypeScript interfaces with optional fields, unions, and nested types inferred."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>JSON input</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={20}
              className="resize-y font-mono text-xs"
              placeholder="Paste a JSON response…"
              spellCheck={false}
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated TypeScript</Label>
              <CopyButton value={output} disabled={!output} />
            </div>
            <Textarea
              readOnly
              value={output}
              rows={20}
              className="resize-y font-mono text-xs"
              placeholder="TypeScript interfaces will appear here…"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="root-name">Root name</Label>
            <Input
              id="root-name"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="font-mono text-sm"
              placeholder="Root"
            />
          </div>

          <div className="space-y-2">
            <Label>Declaration</Label>
            <Tabs value={decl} onValueChange={(v) => setDecl(v as typeof decl)}>
              <TabsList>
                <TabsTrigger value="interface">interface</TabsTrigger>
                <TabsTrigger value="type">type</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            <div className="flex items-center gap-2">
              <Switch id="export" checked={exportTypes} onCheckedChange={setExportTypes} />
              <Label htmlFor="export" className="cursor-pointer text-sm">Export types</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="readonly" checked={readonly} onCheckedChange={setReadonly} />
              <Label htmlFor="readonly" className="cursor-pointer text-sm">Readonly fields</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="optional-nulls" checked={optionalNulls} onCheckedChange={setOptionalNulls} />
              <Label htmlFor="optional-nulls" className="cursor-pointer text-sm">Treat null as optional</Label>
            </div>
          </div>
        </div>

        <div className="border-border bg-muted/30 rounded-xl border p-4 text-xs">
          <p className="text-foreground mb-2 font-semibold">Notes</p>
          <ul className="text-muted-foreground space-y-1">
            <li>• When the root is an array of objects, fields present in some but not all items are marked optional.</li>
            <li>• Mixed array types become unions — e.g. <code className="bg-card px-1 rounded">(string | number)[]</code>.</li>
            <li>• Nested objects get their own named interfaces with PascalCase derived from the field name.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
