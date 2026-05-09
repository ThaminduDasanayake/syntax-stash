"use client";

import { useEffect, useState, useTransition } from "react";

import { OptimizeResponse } from "@/app/tools/svg-optimizer/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";

import { optimizeSvg } from "./actions";

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="currentColor"/>

    <g transform="translate(32 32) scale(3) translate(-12 -12)"
       stroke="#c4e456"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round">
        <path d="M17 5L10 9L17 13M7 11L14 15L7 19"/>
    </g>
</svg>`;

export default function SvgOptimizerPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<OptimizeResponse | null>(null);
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

  const hasResult = result && "svg" in result && result.svg;
  const savedPct =
    hasResult && result.originalSize > 0
      ? ((1 - result.optimizedSize / result.originalSize) * 100).toFixed(1)
      : null;

  const tool = internalTools.find((t) => t.url === "/tools/svg-optimizer");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TextAreaField
          label="Input SVG"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLACEHOLDER}
          className="h-120 resize-none text-xs"
          action={<ClearButton onClick={() => setInput("")} disabled={!input} />}
        />

        <div className="flex flex-col gap-2">
          {result && "error" in result ? (
            <ErrorAlert
              message={result.error || "An unknown error occurred during optimization."}
            />
          ) : (
            <TextAreaField
              label={
                <>
                  Optimized SVG
                  {isPending && (
                    <span className="text-muted-foreground ml-2 font-mono text-[10px] normal-case">
                      optimizing…
                    </span>
                  )}
                </>
              }
              value={hasResult ? result.svg : ""}
              readOnly
              placeholder="Optimized SVG will appear here..."
              className="h-120 resize-none text-xs"
              action={<CopyButton value={hasResult ? result.svg : ""} disabled={!hasResult} />}
            />
          )}

          {hasResult && savedPct !== null && (
            <span className="text-muted-foreground shrink-0 font-mono text-xs">
              {(result.originalSize / 1024).toFixed(2)} KB →{" "}
              {(result.optimizedSize / 1024).toFixed(2)} KB{" "}
              <span className="text-primary font-semibold">({savedPct}% saved)</span>
            </span>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
