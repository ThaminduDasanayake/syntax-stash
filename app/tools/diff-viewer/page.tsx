"use client";

import { useMemo, useState } from "react";

import { PLACEHOLDER_MODIFIED, PLACEHOLDER_ORIGINAL } from "@/app/tools/diff-viewer/data";
import { DiffLineRow } from "@/app/tools/diff-viewer/diff-line-row";
import {
  buildSideColumns,
  computeDiff,
  type DiffLine,
  formatUnifiedDiff,
} from "@/app/tools/diff-viewer/helpers";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { SwitchField } from "@/components/ui/switch-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

function SideBySideLineRow({
  line,
  showOld,
  showNew,
}: {
  line: DiffLine | null;
  showOld: boolean;
  showNew: boolean;
}) {
  if (!line) {
    return <div className="bg-muted/30 min-h-5 w-full font-mono text-xs leading-5" />;
  }
  return <DiffLineRow line={line} showOld={showOld} showNew={showNew} />;
}

export default function DiffViewerPage() {
  const [original, setOriginal] = useState(PLACEHOLDER_ORIGINAL);
  const [modified, setModified] = useState(PLACEHOLDER_MODIFIED);
  const [viewMode, setViewMode] = useState<"unified" | "side-by-side">("unified");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const { diffLines, diffText, stats } = useMemo(() => {
    const lines = computeDiff(original, modified, ignoreWhitespace);
    const text = formatUnifiedDiff(lines);
    const added = lines.filter((l) => l.type === "added").length;
    const removed = lines.filter((l) => l.type === "removed").length;
    const unchanged = lines.filter((l) => l.type === "unchanged").length;
    return { diffLines: lines, diffText: text, stats: { added, removed, unchanged } };
  }, [original, modified, ignoreWhitespace]);

  const { left, right } = useMemo(
    () => (viewMode === "side-by-side" ? buildSideColumns(diffLines) : { left: [], right: [] }),
    [diffLines, viewMode],
  );

  const hasChanges = stats.added > 0 || stats.removed > 0;

  const tool = internalTools.find((t) => t.slug === "diff-viewer");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TextareaGroup
            containerClassName="min-h-[450px]"
            label="Original"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            action={
              <ClearButton
                size="sm"
                onClick={() => {
                  setOriginal("");
                }}
                disabled={!hasChanges}
              />
            }
          />

          <TextareaGroup
            containerClassName="min-h-[450px]"
            label="Modified"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            action={
              <ClearButton
                size="sm"
                onClick={() => {
                  setModified("");
                }}
                disabled={!hasChanges}
              />
            }
          />
        </div>

        {/* Controls */}

        {/* Diff output */}
        {diffLines.length > 0 && (
          <Card className="gap-0 pb-0">
            <CardHeader className="flex flex-wrap items-center gap-3 border-b">
              <ButtonGroup className="grid grid-cols-2">
                <Button
                  size="sm"
                  variant={viewMode === "unified" ? "default" : "outline"}
                  onClick={() => setViewMode("unified")}
                  className="font-semibold"
                >
                  Unified
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "side-by-side" ? "default" : "outline"}
                  onClick={() => setViewMode("side-by-side")}
                  className="font-semibold"
                >
                  Side by side
                </Button>
              </ButtonGroup>

              <SwitchField
                label="Ignore whitespace"
                checked={ignoreWhitespace}
                onCheckedChange={setIgnoreWhitespace}
              />

              <div className="ml-auto flex items-center gap-2">
                {hasChanges && (
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-400">+{stats.added}</span>
                    <span className="text-red-400">−{stats.removed}</span>
                    <span>{stats.unchanged} unchanged</span>
                  </div>
                )}
                <CopyButton size="sm" textToCopy={diffText} disabled={!hasChanges} />
              </div>
            </CardHeader>
            {!hasChanges && (
              <div className="text-muted-foreground p-4 text-center text-sm">
                Files are identical.
              </div>
            )}

            {hasChanges && viewMode === "unified" && (
              <div className="overflow-x-auto">
                {diffLines.map((line, idx) => (
                  <DiffLineRow key={idx} line={line} showOld showNew />
                ))}
              </div>
            )}

            <CardContent className="p-0">
              {hasChanges && viewMode === "side-by-side" && (
                <div className="grid grid-cols-2 overflow-x-auto">
                  <div className="border-border border-r">
                    <div className="border-border bg-muted/30 border-b px-3 py-1.5">
                      <span className="text-muted-foreground font-mono text-xs font-semibold">
                        Original
                      </span>
                    </div>
                    {left.map((item) => (
                      <SideBySideLineRow key={item.key} line={item.line} showOld showNew={false} />
                    ))}
                  </div>
                  <div>
                    <div className="border-border bg-muted/30 border-b px-3 py-1.5">
                      <span className="text-muted-foreground font-mono text-xs font-semibold">
                        Modified
                      </span>
                    </div>
                    {right.map((item) => (
                      <SideBySideLineRow key={item.key} line={item.line} showOld={false} showNew />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
