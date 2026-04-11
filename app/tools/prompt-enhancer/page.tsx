"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { promptTemplates } from "@/lib/prompt-templates";

export default function PromptEnhancerPage() {
  const [selectedId, setSelectedId] = useState(promptTemplates[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedOutput, setEnhancedOutput] = useState<string | null>(null);

  const template = promptTemplates.find((t) => t.id === selectedId)!;

  const output = useMemo(() => {
    let result = template.template;
    for (const v of template.variables) {
      result = result.replaceAll(`[${v}]`, values[v] || `[${v}]`);
    }
    return result;
  }, [template, values]);

  const displayOutput = enhancedOutput ?? output;

  function handleTemplateChange(id: string | null) {
    if (!id) return;
    setSelectedId(id);
    setValues({});
    setEnhancedOutput(null);
  }

  function handleVarChange(variable: string, value: string) {
    setValues((prev) => ({ ...prev, [variable]: value }));
  }

  async function handleEnhance() {
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: displayOutput }),
      });
      const data = await res.json();
      if (data.text) {
        setEnhancedOutput(data.text);
      }
    } finally {
      setIsEnhancing(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(displayOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 text-sm"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-3">
            Prompt <span className="text-primary">Enhancer</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Dynamic templates to generate high-quality AI prompts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column — Selection & Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground">Template</Label>
              <Select value={selectedId} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-full h-10 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border text-foreground">
                  {promptTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-muted-foreground focus:bg-accent focus:text-foreground">
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">{template.description}</p>
            </div>

            {template.variables.map((v) => (
              <div key={v} className="space-y-2">
                <Label className="text-foreground">{v}</Label>
                {v === "Code" ? (
                  <Textarea
                    value={values[v] || ""}
                    onChange={(e) => handleVarChange(v, e.target.value)}
                    placeholder={`Enter ${v.toLowerCase()}...`}
                    rows={6}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                ) : (
                  <Input
                    value={values[v] || ""}
                    onChange={(e) => handleVarChange(v, e.target.value)}
                    placeholder={`Enter ${v.toLowerCase()}...`}
                    className="h-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Column — Output */}
          <div className="space-y-4">
            <Label className="text-foreground">Generated Prompt</Label>
            <Textarea
              readOnly
              value={displayOutput}
              rows={14}
              className="bg-background border-border text-foreground font-mono text-sm leading-relaxed resize-none focus-visible:ring-1 focus-visible:ring-primary/30"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="rounded-full px-6 py-2 border-primary/30 bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all duration-200 disabled:opacity-50"
              >
                <Sparkles size={16} className="mr-2" />
                {isEnhancing ? "Enhancing..." : "Enhance with AI"}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={isEnhancing}
                className="rounded-full px-6 py-2 bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
