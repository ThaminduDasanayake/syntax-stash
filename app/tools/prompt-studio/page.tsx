"use client";

import { Sparkles, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

// ---------------------------------------------------------------------------
// Default placeholder
// ---------------------------------------------------------------------------

const PLACEHOLDER = `You are an expert {{role}} with deep knowledge of {{domain}}.

## Task
Your task is to help {{user_name}} accomplish the following:
{{task_description}}

## Constraints
- Skill level of the audience: **{{skill_level}}**
- Response format: **{{output_format}}**
- Language: **{{language}}**

## Guidelines
- Be **clear** and **concise**
- Provide concrete examples where helpful
- Avoid unnecessary jargon unless the skill level warrants it

Begin your response now.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseVariables(text: string): string[] {
  const seen = new Set<string>();
  return [...text.matchAll(/\{\{(\w+)\}\}/g)]
    .map((m) => m[1])
    .filter((name) => (seen.has(name) ? false : (seen.add(name), true)));
}

function injectVariables(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, name) => vars[name] || match);
}

function minifyPrompt(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/\*([\s\S]+?)\*/g, "$1")
    .replace(/__([\s\S]+?)__/g, "$1")
    .replace(/_([\s\S]+?)_/g, "$1")
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, "").trim())
    .replace(/`(.+?)`/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\s*>\s*/gm, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Token badge
// ---------------------------------------------------------------------------

function TokenBadge({ text }: { text: string }) {
  const count = Math.ceil(text.length / 4);
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">Est. tokens</span>
      <Badge variant="secondary" className="font-mono text-[11px]">
        ~{count.toLocaleString()}
      </Badge>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PromptStudioPage() {
  const [rawPrompt, setRawPrompt] = useState(PLACEHOLDER);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  const variables = useMemo(() => parseVariables(rawPrompt), [rawPrompt]);

  const injectedOutput = useMemo(
    () => injectVariables(rawPrompt, varValues),
    [rawPrompt, varValues],
  );

  const minifiedOutput = useMemo(() => minifyPrompt(injectedOutput), [injectedOutput]);

  function setVar(name: string, value: string) {
    setVarValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleClear() {
    setRawPrompt("");
    setVarValues({});
  }

  return (
    <ToolLayout
      icon={WandSparkles}
      title="Prompt"
      highlight="Studio"
      description="Write, inject, minify, and enhance LLM prompts with real-time token tracking."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Left — draft prompt + variable inputs                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          <TextAreaField
            label="Draft Prompt"
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            rows={16}
            placeholder={`Write your prompt here.\nUse {{variable}} syntax for dynamic values.`}
            className="font-mono text-sm"
            action={<ClearButton onClick={handleClear} disabled={!rawPrompt && !Object.keys(varValues).length} />}
          />

          {variables.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-4">
                <p className="text-muted-foreground font-mono text-[11px] font-semibold uppercase tracking-wider">
                  Variable Injection · {variables.length} detected
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {variables.map((name) => (
                    <div key={name} className="space-y-1.5">
                      <Label className="text-muted-foreground font-mono text-xs">
                        {`{{${name}}}`}
                      </Label>
                      <Input
                        value={varValues[name] ?? ""}
                        onChange={(e) => setVar(name, e.target.value)}
                        placeholder={name.replace(/_/g, " ")}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right — tabbed output                                             */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <Tabs defaultValue="injected" className="flex flex-col gap-4">
            <TabsList>
              <TabsTrigger value="injected">Injected Output</TabsTrigger>
              <TabsTrigger value="minified">Minified Output</TabsTrigger>
              <TabsTrigger value="ai" aria-disabled>
                <Sparkles size={13} />
                AI Enhanced
              </TabsTrigger>
            </TabsList>

            {/* Injected */}
            <TabsContent value="injected" className="space-y-3">
              <div className="flex items-center justify-between">
                <TokenBadge text={injectedOutput} />
                <CopyButton value={injectedOutput} disabled={!injectedOutput} />
              </div>
              <TextAreaField
                value={injectedOutput}
                readOnly
                rows={20}
                className="font-mono text-sm"
              />
            </TabsContent>

            {/* Minified */}
            <TabsContent value="minified" className="space-y-3">
              <div className="flex items-center justify-between">
                <TokenBadge text={minifiedOutput} />
                <CopyButton value={minifiedOutput} disabled={!minifiedOutput} />
              </div>
              <TextAreaField
                value={minifiedOutput}
                readOnly
                rows={20}
                className="font-mono text-sm"
              />
            </TabsContent>

            {/* AI Enhanced — placeholder */}
            <TabsContent value="ai">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                <Sparkles size={28} className="text-muted-foreground mb-3" />
                <p className="text-sm font-medium">AI Enhancement coming soon</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  This tab will call the Gemini API to rewrite and strengthen your prompt.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
}
