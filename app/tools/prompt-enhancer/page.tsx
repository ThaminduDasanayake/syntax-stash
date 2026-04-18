"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { promptTemplates } from "@/app/tools/prompt-enhancer/prompt-templates";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";

export default function PromptEnhancerPage() {
  const [input, setInput] = useState("");
  const [enhancedOutput, setEnhancedOutput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  function handleTemplateClick(starter: string) {
    setInput(starter);
    setEnhancedOutput("");
  }

  async function handleEnhance() {
    if (!input.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
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
      icon={Sparkles}
      title="Prompt"
      highlight="Enhancer"
      description="A freeform workspace for crafting, enhancing, and analyzing AI prompts."
    >
      {/* Template Chips */}
      <div className="mb-8 space-y-2">
        <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Quick Starters
        </Label>
        <div className="flex flex-wrap gap-2">
          {promptTemplates.map((t) => (
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
        {/* Left Column — Workspace */}
        <TextAreaField
          label="Your Prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your rough prompt here, or pick a starter above..."
          rows={16}
          action={
            <div className="flex gap-2">
              <Button
                onClick={handleEnhance}
                disabled={isEnhancing || !input.trim()}
                className="px-4 font-semibold"
              >
                <Sparkles />
                {isEnhancing ? "Enhancing..." : "Enhance"}
              </Button>
              <ClearButton
                onClick={() => {
                  setInput("");
                }}
                disabled={!input}
              />
            </div>
          }
        />

        {/* Right Column — Output */}
        <TextAreaField
          label="Formatted SQL"
          readOnly
          value={enhancedOutput}
          rows={16}
          placeholder={
            isEnhancing
              ? "✨ Enhancing your prompt..."
              : 'Write a prompt and click "Enhance Prompt" to see the improved version here.'
          }
          className={isEnhancing ? "animate-pulse" : ""}
          action={
            <CopyButton value={enhancedOutput} disabled={isEnhancing || !enhancedOutput.trim()} />
          }
        />
      </div>
    </ToolLayout>
  );
}
