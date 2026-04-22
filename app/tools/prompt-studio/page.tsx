"use client";

import { Sparkles, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { injectVariables, minifyPrompt, parseVariables } from "@/app/tools/prompt-studio/helpers";
import { promptTemplates } from "@/app/tools/prompt-studio/prompt-templates";
import TokenBadge from "@/app/tools/prompt-studio/token-badge";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

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

Begin your response now.`;

export default function PromptStudioPage() {
  const [rawPrompt, setRawPrompt] = useState(PLACEHOLDER);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  // AI Enhancement State
  const [enhancedOutput, setEnhancedOutput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeTab, setActiveTab] = useState("injected");

  // Memos
  const variables = useMemo(() => parseVariables(rawPrompt), [rawPrompt]);
  const injectedOutput = useMemo(
    () => injectVariables(rawPrompt, varValues),
    [rawPrompt, varValues],
  );
  const minifiedOutput = useMemo(() => minifyPrompt(injectedOutput), [injectedOutput]);

  // Handlers
  function setVar(name: string, value: string) {
    setVarValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleClear() {
    setRawPrompt("");
    setVarValues({});
    setEnhancedOutput("");
  }

  function handleTemplateClick(starter: string) {
    setRawPrompt(starter);
    setVarValues({});
    setEnhancedOutput("");
    setActiveTab("injected");
  }

  async function handleEnhance() {
    if (!injectedOutput.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the fully injected prompt to the AI, not the raw one with {{brackets}}
        body: JSON.stringify({ prompt: injectedOutput }),
      });

      if (!res.ok) {
        setEnhancedOutput(`Error: Failed with status ${res.status}`);
        return;
      }

      const data = await res.json();
      if (data.text) {
        setEnhancedOutput(data.text);
      } else if (data.error) {
        setEnhancedOutput(`Error: ${data.error}`);
      }
    } catch {
      setEnhancedOutput("Error: Failed to connect to the enhancement API.");
    } finally {
      setIsEnhancing(false);
    }
  }

  return (
    <ToolLayout
      icon={WandSparkles}
      title="Prompt"
      highlight="Studio"
      description="Write, inject variables, minify, and enhance LLM prompts with real-time token tracking."
    >
      {/* Quick Starters */}
      <div className="mb-8 space-y-3">
        <Label className="text-xs font-semibold tracking-wider uppercase">Quick Starters</Label>
        <div className="flex flex-wrap gap-2">
          {promptTemplates?.map((t) => (
            <Button
              key={t.id}
              variant="secondary"
              size="sm"
              onClick={() => handleTemplateClick(t.starter)}
              className="px-4 font-semibold"
            >
              {t.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Draft & Variables */}
        <div className="space-y-4">
          <TextAreaField
            label="Draft Prompt"
            value={rawPrompt}
            onChange={(e) => {
              setRawPrompt(e.target.value);
              setEnhancedOutput(""); // Reset enhancement if draft changes
            }}
            rows={16}
            placeholder={`Write your prompt here.\nUse {{variable}} syntax for dynamic values.`}
            className="font-mono text-sm"
            action={
              <ClearButton
                onClick={handleClear}
                disabled={!rawPrompt && !Object.keys(varValues).length}
              />
            }
          />

          {variables.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-4">
                <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-wider uppercase">
                  Variable Injection · {variables.length} detected
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {variables.map((name) => (
                    <div key={name} className="space-y-1.5">
                      {/*<Label className="text-muted-foreground font-mono text-xs"></Label>*/}
                      <InputField
                        label={`{{${name}}}`}
                        value={varValues[name] ?? ""}
                        onChange={(e) => setVar(name, e.target.value)}
                        placeholder={name.replace(/_/g, " ")}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output Tabs */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="injected" className="tab-trigger">
                Injected
              </TabsTrigger>
              <TabsTrigger value="minified" className="tab-trigger">
                Minified
              </TabsTrigger>
              <TabsTrigger value="ai" className="tab-trigger">
                <Sparkles />
                AI Enhanced
              </TabsTrigger>
            </TabsList>

            {/* Injected */}
            <TabsContent value="injected" className="mt-0 space-y-3">
              <TextAreaField
                label={<TokenBadge text={injectedOutput} />}
                value={injectedOutput}
                readOnly
                rows={20}
                action={<CopyButton value={injectedOutput} disabled={!injectedOutput} />}
              />
            </TabsContent>

            {/* Minified */}
            <TabsContent value="minified" className="mt-0 space-y-3">
              <TextAreaField
                label={<TokenBadge text={minifiedOutput} />}
                value={minifiedOutput}
                readOnly
                rows={20}
                action={<CopyButton value={minifiedOutput} disabled={!minifiedOutput} />}
              />
            </TabsContent>

            {/* AI Enhanced */}
            <TabsContent value="ai" className="mt-0 space-y-3">
              <TextAreaField
                label={
                  <TokenBadge
                    text={enhancedOutput || injectedOutput}
                    label={enhancedOutput ? "Enhanced Tokens" : "Input Tokens"}
                  />
                }
                value={enhancedOutput}
                readOnly
                rows={20}
                className={isEnhancing ? "bg-muted/20 animate-pulse" : ""}
                placeholder={
                  isEnhancing
                    ? "✨ AI is rewriting and strengthening your prompt..."
                    : "Click the button below to generate a professionally enhanced version of your injected prompt."
                }
                action={<CopyButton value={enhancedOutput} disabled={!enhancedOutput} />}
              />
              <Button
                size="lg"
                className="w-full font-bold"
                onClick={handleEnhance}
                disabled={isEnhancing || !injectedOutput.trim()}
              >
                <Sparkles className="mr-2 size-5" />
                {isEnhancing
                  ? "Enhancing..."
                  : enhancedOutput
                    ? "Regenerate Enhancement"
                    : "Enhance with Gemini"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
}
