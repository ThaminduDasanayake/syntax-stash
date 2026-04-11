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
    <div className="hacker-grid min-h-screen">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 text-sm"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-3">
            Prompt <span className="text-orange-500">Enhancer</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg">
            Dynamic templates to generate high-quality AI prompts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column — Selection & Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Template</Label>
              <Select value={selectedId} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-full h-10 bg-[#0C0C0C] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C0C] border-white/10">
                  {promptTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-zinc-300 focus:bg-white/5 focus:text-white">
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-zinc-600 text-xs">{template.description}</p>
            </div>

            {template.variables.map((v) => (
              <div key={v} className="space-y-2">
                <Label className="text-zinc-300">{v}</Label>
                {v === "Code" ? (
                  <Textarea
                    value={values[v] || ""}
                    onChange={(e) => handleVarChange(v, e.target.value)}
                    placeholder={`Enter ${v.toLowerCase()}...`}
                    rows={6}
                    className="bg-[#0C0C0C] border-white/10 text-white placeholder:text-zinc-600 focus-visible:border-orange-500/30 focus-visible:ring-0 focus-visible:shadow-[0_0_20px_rgba(249,115,22,0.08)]"
                  />
                ) : (
                  <Input
                    value={values[v] || ""}
                    onChange={(e) => handleVarChange(v, e.target.value)}
                    placeholder={`Enter ${v.toLowerCase()}...`}
                    className="h-10 bg-[#0C0C0C] border-white/10 text-white placeholder:text-zinc-600 focus-visible:border-orange-500/30 focus-visible:ring-0 focus-visible:shadow-[0_0_20px_rgba(249,115,22,0.08)]"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Column — Output */}
          <div className="space-y-4">
            <Label className="text-zinc-300">Generated Prompt</Label>
            <Textarea
              readOnly
              value={displayOutput}
              rows={14}
              className="bg-[#0C0C0C] border-white/10 text-zinc-200 font-mono text-sm leading-relaxed resize-none focus-visible:ring-0 focus-visible:border-white/10"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="rounded-full px-6 py-2 border border-orange-500/30 bg-orange-500/10 text-orange-400 font-semibold hover:bg-orange-500/20 transition-all duration-200 disabled:opacity-50"
              >
                <Sparkles size={16} className="mr-2" />
                {isEnhancing ? "Enhancing..." : "Enhance with AI"}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={isEnhancing}
                className="rounded-full px-6 py-2 bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50"
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
