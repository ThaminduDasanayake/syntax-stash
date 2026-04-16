"use client";

import { Check, Copy, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import { promptTemplates } from "@/app/tools/prompt-enhancer/prompt-templates";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function PromptEnhancerPage() {
  const [input, setInput] = useState("");
  const [enhancedOutput, setEnhancedOutput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { copied, copy } = useCopyToClipboard();

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
              variant="outline"
              size="sm"
              onClick={() => handleTemplateClick(t.starter)}
              className="bg-muted/50! hover:bg-muted/80! rounded-full text-xs transition-all"
            >
              {t.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column — Workspace */}
        <div className="space-y-4">
          <Label>Your Prompt</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your rough prompt here, or pick a starter above..."
            rows={16}
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={handleEnhance}
              disabled={isEnhancing || !input.trim()}
              className="rounded-full px-5 font-semibold transition-all duration-200 disabled:opacity-50"
            >
              <Sparkles size={14} />
              {isEnhancing ? "Enhancing..." : "Enhance Prompt"}
            </Button>

            <Button
              variant="ghost"
              size="xs"
              disabled={!input}
              onClick={() => {
                setInput("");
                setEnhancedOutput("");
              }}
            >
              <Trash2 />
              Clear
            </Button>
          </div>
        </div>

        {/* Right Column — Output */}
        <div className="space-y-4">
          <Label>Enhanced Output</Label>
          <Textarea
            value={enhancedOutput}
            readOnly
            rows={16}
            placeholder={
              isEnhancing
                ? "✨ Enhancing your prompt..."
                : 'Write a prompt and click "Enhance Prompt" to see the improved version here.'
            }
            className={isEnhancing ? "animate-pulse" : ""}
          />
          <Button
            variant="ghost"
            onClick={() => copy(enhancedOutput)}
            disabled={isEnhancing || !enhancedOutput.trim()}
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Check />
                Copied!
              </span>
            ) : (
              <>
                <Copy />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
