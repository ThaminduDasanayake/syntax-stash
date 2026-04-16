"use client";

import { Check, Copy, FileImage } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { OptimizeResponse } from "@/app/tools/svg-optimizer/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { optimizeSvg } from "./actions";

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Example bloated SVG -->
  <g id="layer1" style="display:inline">
    <rect x="10.000" y="10.000" width="80.000" height="80.000" fill="#f97316" stroke="none" stroke-width="0"/>
    <circle cx="50.000" cy="50.000" r="30.000" fill="white" opacity="1.0"/>
  </g>
</svg>`;

export default function SvgOptimizerPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Debounce optimization calls so we don't spam the server action while typing
  useEffect(() => {
    if (!input.trim()) {
      setTimeout(() => setResult(null), 0);
      return;
    }
    const id = setTimeout(() => {
      startTransition(async () => {
        const res = await optimizeSvg(input);
        setResult(res);
      });
    }, 400);
    return () => clearTimeout(id);
  }, [input]);

  function handleCopy() {
    if (result && "svg" in result && result.svg) {
      navigator.clipboard.writeText(result.svg).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  const textareaClass =
    "h-72 resize-none bg-background border-border text-foreground font-mono text-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30";

  const hasResult = result && "svg" in result && result.svg;
  const savedPct =
    hasResult && result.originalSize > 0
      ? ((1 - result.optimizedSize / result.originalSize) * 100).toFixed(1)
      : null;

  return (
    <ToolLayout
      icon={FileImage}
      title="SVG"
      highlight="Optimizer"
      description="Minify and clean bloated SVG markup using SVGO with multipass optimization."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — input */}
        <div className="space-y-2">
          <Label className="text-foreground">Input SVG</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            className={textareaClass}
          />
        </div>

        {/* Right — output */}
        <div className="space-y-2">
          <div className="flex min-h-6 items-center justify-between">
            <Label className="text-foreground">
              Optimized SVG
              {isPending && (
                <span className="text-muted-foreground ml-2 font-mono text-[10px] normal-case">
                  optimizing…
                </span>
              )}
            </Label>
            {hasResult && savedPct !== null && (
              <span className="text-muted-foreground font-mono text-xs">
                {(result.originalSize / 1024).toFixed(2)} KB →{" "}
                {(result.optimizedSize / 1024).toFixed(2)} KB{" "}
                <span className="text-primary font-semibold">({savedPct}% saved)</span>
              </span>
            )}
          </div>

          {result && "error" in result ? (
            <div className="border-destructive/50 bg-destructive/10 flex h-72 items-center justify-center rounded-md border">
              <p className="text-destructive px-4 text-center font-mono text-sm">{result.error}</p>
            </div>
          ) : (
            <Textarea
              value={hasResult ? result.svg : ""}
              readOnly
              placeholder="Optimized SVG will appear here..."
              className={textareaClass}
            />
          )}

          <Button
            onClick={handleCopy}
            disabled={!hasResult}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy SVG"}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
