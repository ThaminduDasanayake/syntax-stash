"use client";

import { Braces } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildPydanticOutput,
  buildZodOutput,
  generateInterfaceFromObject,
} from "@/app/tools/json-to-schemas/helpers";
import { ParseResult, TabType } from "@/app/tools/json-to-schemas/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

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
  const [activeTab, setActiveTab] = useState<TabType>("ts");

  const result = useMemo<ParseResult>(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, ts: "", zod: "", pydantic: "" };

    try {
      const parsed = JSON.parse(trimmed);

      const tsCode =
        typeof parsed === "object" && parsed !== null
          ? generateInterfaceFromObject(parsed as Record<string, unknown>, "Root")
          : "export type Root = any;";

      return {
        ok: true,
        ts: tsCode,
        zod: buildZodOutput(parsed),
        pydantic: buildPydanticOutput(parsed),
      };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Invalid JSON format",
      };
    }
  }, [input]);

  function handleFormatJson() {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch {}
  }

  const currentOutput = result.ok ? result[activeTab] : "";

  return (
    <ToolLayout
      icon={Braces}
      title="JSON Schema"
      highlight="Generator"
      description="Convert JSON payloads into strict Zod schemas, TypeScript interfaces, and Pydantic models."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <TextAreaField
            label="JSON Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste any JSON payload, e.g. {"id": 1, "name": "Alice"}'
            rows={24}
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
          {!result.ok && <ErrorAlert message={result.error} />}
        </div>

        <div className="flex h-full flex-col">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabType)}
            className="flex w-full flex-col"
          >
            <div className="flex justify-between gap-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="ts"
                  className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! hover:bg-accent! hover:cursor-pointer data-active:border!"
                >
                  TypeScript
                </TabsTrigger>
                <TabsTrigger
                  value="zod"
                  className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! hover:bg-accent! hover:cursor-pointer data-active:border!"
                >
                  Zod
                </TabsTrigger>
                <TabsTrigger
                  value="pydantic"
                  className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! hover:bg-accent! hover:cursor-pointer data-active:border!"
                >
                  Pydantic
                </TabsTrigger>
              </TabsList>
              <CopyButton value={currentOutput} disabled={!result.ok || !currentOutput} />
            </div>

            <TabsContent value="ts" className="-mt-2">
              <TextAreaField
                label={" "}
                value={result.ok ? result.ts : ""}
                readOnly
                rows={24}
                placeholder="TypeScript interfaces will appear here..."
              />
            </TabsContent>

            <TabsContent value="zod" className="-mt-2">
              <TextAreaField
                label={" "}
                value={result.ok ? result.zod : ""}
                readOnly
                rows={24}
                placeholder="Zod schemas will appear here..."
              />
            </TabsContent>

            <TabsContent value="pydantic" className="-mt-2">
              <TextAreaField
                label={" "}
                value={result.ok ? result.pydantic : ""}
                readOnly
                rows={24}
                placeholder="Pydantic models will appear here..."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
}
