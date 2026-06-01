"use client";

import { useMemo, useState } from "react";

import { convertCssToTailwind } from "@/app/tools/css-to-tailwind/utils";
import { ToolLayout } from "@/components/tool-layout";
import { Badge } from "@/components/ui/badge";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

const EXAMPLE = `.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  margin-top: 16px;
  gap: 12px;
  background-color: #fff;
  border: 1px solid;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  width: 100%;
  max-width: 320px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 1;
  overflow: hidden;
  position: relative;
}`;

export default function CssToTailwindPage() {
  const [input, setInput] = useState(EXAMPLE);

  const { classes, unhandled } = useMemo(() => {
    if (!input.trim()) return { classes: [], unhandled: [] };
    return convertCssToTailwind(input);
  }, [input]);

  const classString = classes.join(" ");
  const tool = internalTools.find((t) => t.slug === "css-to-tailwind");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input */}
        <TextareaGroup
          label="CSS Input"
          value={input}
          containerClassName="flex-1 min-h-[300px]"
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste CSS rules here…\n\n.button {\n  font-size: 16px;\n  padding: 8px 16px;\n}`}
          action={<ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />}
        />

        {/* Output */}
        <div className="space-y-4">
          <TextareaGroup
            label="Tailwind Classes"
            value={classString}
            readOnly
            containerClassName="min-h-[140px]"
            placeholder="Tailwind classes will appear here…"
            action={<CopyButton iconOnly textToCopy={classString} disabled={!classString} />}
          />

          {/* Individual badges */}
          {classes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {classes.length} class{classes.length !== 1 ? "es" : ""}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {classes.map((c, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="cursor-pointer font-mono text-xs"
                    onClick={() => navigator.clipboard.writeText(c)}
                    title="Click to copy"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Unhandled declarations */}
          {unhandled.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {unhandled.length} unmapped (kept as-is reference)
              </p>
              <div className="bg-muted rounded-lg p-3 space-y-1">
                {unhandled.map((d, i) => (
                  <p key={i} className="font-mono text-xs text-orange-600 dark:text-orange-400">
                    {d}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {classes.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Mapped</p>
              <p className="text-lg font-semibold">{classes.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Unmapped</p>
              <p className="text-lg font-semibold">{unhandled.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Coverage</p>
              <p className="text-lg font-semibold">
                {classes.length + unhandled.length > 0
                  ? Math.round((classes.length / (classes.length + unhandled.length)) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
