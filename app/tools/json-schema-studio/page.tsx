"use client";

import { Braces } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildJsonSchemaOutput,
  buildPydanticOutput,
  buildZodOutput,
  type GenerateOptions,
  generateTypeScript,
} from "@/app/tools/json-schema-studio/helpers";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field.tsx";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

type TabType = "ts" | "zod" | "pydantic" | "jsonSchema";

const SAMPLE = JSON.stringify(
  {
    id: "user_42",
    name: "Ada Lovelace",
    email: "ada@example.com",
    isActive: true,
    tags: ["admin", "early-adopter"],
    profile: {
      bio: "Mathematician",
      avatarUrl: null,
      joinedAt: "1815-12-10T00:00:00Z",
    },
    posts: [
      {
        id: 1,
        title: "Notes on the Analytical Engine",
        publishedAt: "1843-08-01",
      },
      {
        id: 2,
        title: "Translations and commentary",
        publishedAt: null,
      },
    ],
  },
  null,
  2,
);

export default function JsonSchemaStudioPage() {
  const [input, setInput] = useState(SAMPLE);
  const [activeTab, setActiveTab] = useState<TabType>("ts");

  const [rootName, setRootName] = useState("Root");
  const [decl, setDecl] = useState<"interface" | "type">("interface");
  const [exportTypes, setExportTypes] = useState(true);
  const [readonly, setReadonly] = useState(false);
  const [optionalNulls, setOptionalNulls] = useState(true);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { ok: true, ts: "", zod: "", pydantic: "", jsonSchema: "" };
    }

    try {
      const parsed = JSON.parse(trimmed);

      const tsOpts: GenerateOptions = {
        rootName: rootName || "Root",
        useType: decl === "type",
        exportTypes,
        readonly,
        optionalNulls,
      };
      return {
        ok: true,
        ts: generateTypeScript(parsed, tsOpts),
        zod: buildZodOutput(parsed),
        pydantic: buildPydanticOutput(parsed),
        jsonSchema: buildJsonSchemaOutput(parsed, rootName),
      };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Invalid JSON format",
      };
    }
  }, [input, rootName, decl, exportTypes, readonly, optionalNulls]);

  function handleFormatJson() {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch {}
  }

  const currentOutput = (result.ok ? result[activeTab] : "") || "";
  return (
    <ToolLayout
      icon={Braces}
      title="JSON Schema"
      highlight="Studio"
      description="Convert JSON payloads into strict TypeScript interfaces, Zod schemas, Pydantic models, and generic JSON Schemas."
    >
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Input & Settings */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-4">
            <TextAreaField
              label="JSON Input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste any JSON payload here..."
              rows={16}
              className="font-mono text-xs"
              spellCheck={false}
              action={
                <div className="flex gap-2">
                  <Button
                    onClick={handleFormatJson}
                    className="text-xs font-semibold"
                    disabled={!input || !result.ok}
                  >
                    Format JSON
                  </Button>
                  <ClearButton onClick={() => setInput("")} disabled={!input} />
                </div>
              }
            />
            {!result.ok && (
              <ErrorAlert message={result.error || "An invalid JSON format was provided"} />
            )}
          </div>

          {/* Configuration Options */}
          <Card>
            <CardHeader className="font-semibold">General</CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between gap-2">
                <InputField
                  label="Root Object Name"
                  labelClassName="text-muted-foreground text-xs"
                  value={rootName}
                  onChange={(e) => setRootName(e.target.value)}
                  className="font-mono text-sm"
                  placeholder="Root"
                />

                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground text-xs">TypeScript Options</Label>
                  <Tabs value={decl} onValueChange={(v) => setDecl(v as "interface" | "type")}>
                    <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                      <TabsTrigger value="interface" className="tab-trigger">
                        interface
                      </TabsTrigger>
                      <TabsTrigger value="type" className="tab-trigger">
                        type
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch id="export" checked={exportTypes} onCheckedChange={setExportTypes} />
                <Label htmlFor="export" className="cursor-pointer text-xs">
                  Export types
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="optional-nulls"
                  checked={optionalNulls}
                  onCheckedChange={setOptionalNulls}
                />
                <Label htmlFor="optional-nulls" className="cursor-pointer text-xs">
                  Treat null as optional
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="readonly" checked={readonly} onCheckedChange={setReadonly} />
                <Label htmlFor="readonly" className="cursor-pointer text-xs">
                  Readonly fields
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Tabs */}

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabType)}
          className="flex h-full w-full flex-col"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <TabsList className="grid w-full grid-cols-4 sm:w-auto">
              <TabsTrigger value="ts" className="tab-trigger">
                TS
              </TabsTrigger>
              <TabsTrigger value="zod" className="tab-trigger">
                Zod
              </TabsTrigger>
              <TabsTrigger value="pydantic" className="tab-trigger">
                Pydantic
              </TabsTrigger>
              <TabsTrigger value="jsonSchema" className="tab-trigger">
                Schema
              </TabsTrigger>
            </TabsList>
            <div className="flex justify-end">
              <CopyButton value={currentOutput} disabled={!result.ok || !currentOutput} />
            </div>
          </div>

          <div className="border-border bg-muted/10 flex-1 rounded-md border">
            <TabsContent value="ts" className="m-0 h-full">
              <TextAreaField
                value={result.ok ? result.ts : ""}
                readOnly
                rows={28}
                className="h-full resize-none text-xs"
                placeholder="TypeScript interfaces will appear here..."
              />
            </TabsContent>

            <TabsContent value="zod" className="m-0 h-full">
              <TextAreaField
                value={result.ok ? result.zod : ""}
                readOnly
                rows={28}
                className="h-full resize-none text-xs"
                placeholder="Zod schemas will appear here..."
              />
            </TabsContent>

            <TabsContent value="pydantic" className="m-0 h-full">
              <TextAreaField
                value={result.ok ? result.pydantic : ""}
                readOnly
                rows={28}
                className="h-full resize-none text-xs"
                placeholder="Pydantic models will appear here..."
              />
            </TabsContent>

            <TabsContent value="jsonSchema" className="m-0 h-full">
              <TextAreaField
                value={result.ok ? result.jsonSchema : ""}
                readOnly
                rows={28}
                className="h-full resize-none text-xs"
                placeholder="JSON Schema will appear here..."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
