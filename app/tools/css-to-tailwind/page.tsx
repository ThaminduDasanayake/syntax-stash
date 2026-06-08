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

  const totalDeclarations = classes.length + unhandled.length;
  const coveragePercent =
    totalDeclarations > 0 ? Math.round((classes.length / totalDeclarations) * 100) : 0;

  return (
    <ToolLayout tool={tool}>
      <div className="flex w-full min-w-0 flex-col gap-8">
        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="w-full min-w-0">
            <TextareaGroup
              label="CSS Input"
              value={input}
              containerClassName="flex-1 min-h-[500px]"
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste CSS rules here…\n\n.button {\n  font-size: 16px;\n  padding: 8px 16px;\n}`}
              action={<ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />}
            />
          </div>

          <div className="flex w-full min-w-0 flex-col gap-6">
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
              <div className="flex min-w-0 flex-col gap-3">
                <p className="text-muted-foreground font-mono text-[11px] font-bold tracking-widest uppercase">
                  {"//"} {classes.length} class{classes.length !== 1 ? "es" : ""}
                </p>
                <div className="custom-scrollbar flex max-h-35 min-w-0 flex-wrap gap-2 overflow-y-auto pr-2">
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
              <div className="flex min-w-0 flex-col gap-3">
                <p className="text-destructive font-mono text-[11px] font-bold tracking-widest uppercase">
                  {"//"} {unhandled.length} UNMAPPED DECLARATIONS
                </p>
                <div className="border-destructive/20 bg-destructive/5 custom-scrollbar text-destructive max-h-25 space-y-1 overflow-y-auto border-2 p-3 font-mono text-xs">
                  {unhandled.map((d, i) => (
                    <p key={i}>&gt; {d}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {classes.length > 0 && (
          <div className="border-border w-full min-w-0 border-t-2 border-dashed pt-8">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Statistic Card: Mapped Items */}
              <div className="border-border bg-blueprint-card flex flex-col gap-1.5 border-2 p-4 shadow-sm">
                <span className="text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase">
                  {"//"} MAPPED
                </span>
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight">
                  {classes.length}
                </span>
              </div>

              {/* Statistic Card: Unmapped Items */}
              <div className="border-border bg-blueprint-card flex flex-col gap-1.5 border-2 p-4 shadow-sm">
                <span className="text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase">
                  {"//"} UNMAPPED
                </span>
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight">
                  {unhandled.length}
                </span>
              </div>

              {/* Statistic Card: System Yield Coverage */}
              <div className="border-border bg-blueprint-card flex flex-col gap-1.5 border-2 p-4 shadow-sm">
                <span className="text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase">
                  {"//"} COVERAGE YIELD
                </span>
                <span className="text-primary font-mono text-2xl font-bold tracking-tight">
                  {coveragePercent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
