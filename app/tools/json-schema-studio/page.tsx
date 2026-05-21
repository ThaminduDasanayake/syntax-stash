"use client";

import { useMemo, useState } from "react";

import {
  buildJsonSchemaOutput,
  buildPydanticOutput,
  buildZodOutput,
  type GenerateOptions,
  generateTypeScript,
} from "@/app/tools/json-schema-studio/helpers";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SwitchField } from "@/components/ui/switch-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

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

  const tool = internalTools.find((t) => t.slug === "json-schema-studio");

  return (
    <ToolLayout tool={tool}>
      <div className="grid h-full min-h-0 grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input & Settings */}
        <div className="flex h-full min-h-0 flex-col space-y-6">
          <div className="flex min-h-0 flex-1 flex-col space-y-4">
            <TextareaGroup
              label="JSON Input"
              value={input}
              containerClassName="min-h-[450px]"
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste any JSON payload here..."
              action={
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleFormatJson}
                    className="text-xs font-semibold"
                    disabled={!input || !result.ok}
                  >
                    Format JSON
                  </Button>
                  <ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />
                </div>
              }
            />
            {!result.ok && (
              <ErrorAlert message={result.error || "An invalid JSON format was provided"} />
            )}
          </div>

          {/* Configuration Options */}
          <Card className="shrink-0">
            <CardHeader className="font-semibold">General</CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between gap-2">
                <InputField
                  label="Root Object Name"
                  value={rootName}
                  onChange={(e) => setRootName(e.target.value)}
                  containerClassName="w-fit"
                  placeholder="Root"
                />

                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground text-xs">TypeScript Options</Label>
                  <ButtonGroup className="grid grid-cols-2">
                    <Button
                      variant={decl === "interface" ? "default" : "outline"}
                      onClick={() => setDecl("interface")}
                      className="font-semibold"
                    >
                      interface
                    </Button>
                    <Button
                      variant={decl === "type" ? "default" : "outline"}
                      onClick={() => setDecl("type")}
                      className="font-semibold"
                    >
                      type
                    </Button>
                  </ButtonGroup>
                </div>
              </div>

              <SwitchField
                label="Export types"
                checked={exportTypes}
                onCheckedChange={setExportTypes}
              />
              <SwitchField
                label="Treat null as optional"
                checked={optionalNulls}
                onCheckedChange={setOptionalNulls}
              />

              <SwitchField
                label="Readonly fields"
                checked={readonly}
                onCheckedChange={setReadonly}
              />
            </CardContent>
          </Card>
        </div>

        {/* Output Tabs */}

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabType)}
          className="flex h-full min-h-0 w-full flex-col gap-3"
        >
          <div className="flex shrink-0 flex-col justify-between gap-3 sm:flex-row">
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
              <CopyButton textToCopy={currentOutput} disabled={!result.ok || !currentOutput} />
            </div>
          </div>

          <div className="border-border bg-muted/10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
            <TabsContent value="ts" className="m-0 h-full">
              <TextareaGroup
                label="TypeScript Interface"
                value={result.ok ? result.ts : ""}
                readOnly
                placeholder="TypeScript interfaces will appear here..."
              />
            </TabsContent>

            <TabsContent value="zod" className="m-0 h-full">
              <TextareaGroup
                label="Zod Schema"
                value={result.ok ? result.zod : ""}
                readOnly
                placeholder="Zod schemas will appear here..."
              />
            </TabsContent>

            <TabsContent value="pydantic" className="m-0 h-full">
              <TextareaGroup
                label="Pydantic Model"
                value={result.ok ? result.pydantic : ""}
                readOnly
                placeholder="Pydantic models will appear here..."
              />
            </TabsContent>

            <TabsContent value="jsonSchema" className="m-0 h-full">
              <TextareaGroup
                label="JSON Schema"
                value={result.ok ? result.jsonSchema : ""}
                readOnly
                placeholder="JSON Schema will appear here..."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
