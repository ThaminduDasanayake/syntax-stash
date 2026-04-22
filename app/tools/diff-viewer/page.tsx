"use client";

import { Check, Copy, FileDiff, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { computeDiff, formatUnifiedDiff, type DiffLine } from "@/app/tools/diff-viewer/helpers";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const PLACEHOLDER_ORIGINAL = `function greet(name) {
  console.log("Hello, " + name);
  return name;
}

const result = greet("world");
console.log(result);`;

const PLACEHOLDER_MODIFIED = `function greet(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}!\`);
  return { name, greeting };
}

const result = greet("world", "Hi");
console.log(result.name);`;

function DiffLineRow({ line, showOld, showNew }: { line: DiffLine; showOld: boolean; showNew: boolean }) {
  const bgClass =
    line.type === "added"
      ? "bg-green-500/10"
      : line.type === "removed"
        ? "bg-red-500/10"
        : "";
  const textClass =
    line.type === "added"
      ? "text-green-400"
      : line.type === "removed"
        ? "text-red-400"
        : "text-muted-foreground";
  const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";

  return (
    <div className={`flex min-w-0 font-mono text-xs leading-5 ${bgClass}`}>
      {showOld && (
        <span className="border-border text-muted-foreground w-10 shrink-0 select-none border-r px-2 text-right">
          {line.oldLineNum ?? ""}
        </span>
      )}
      {showNew && (
        <span className="border-border text-muted-foreground w-10 shrink-0 select-none border-r px-2 text-right">
          {line.newLineNum ?? ""}
        </span>
      )}
      <span className={`w-4 shrink-0 select-none px-1 ${textClass}`}>{prefix}</span>
      <span className={`min-w-0 flex-1 whitespace-pre-wrap break-all px-2 ${textClass}`}>
        {line.content}
      </span>
    </div>
  );
}

type SideLine = { line: DiffLine | null; key: string };

function buildSideColumns(lines: DiffLine[]): { left: SideLine[]; right: SideLine[] } {
  const left: SideLine[] = [];
  const right: SideLine[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.type === "unchanged") {
      left.push({ line, key: `u-${i}` });
      right.push({ line, key: `u-${i}` });
      i++;
    } else if (line.type === "removed") {
      // check if next line is added (a modification pair)
      const next = lines[i + 1];
      if (next?.type === "added") {
        left.push({ line, key: `r-${i}` });
        right.push({ line: next, key: `a-${i + 1}` });
        i += 2;
      } else {
        left.push({ line, key: `r-${i}` });
        right.push({ line: null, key: `empty-r-${i}` });
        i++;
      }
    } else {
      // added without a preceding removed
      left.push({ line: null, key: `empty-a-${i}` });
      right.push({ line, key: `a-${i}` });
      i++;
    }
  }

  return { left, right };
}

function SideBySideLineRow({ line, showOld, showNew }: { line: DiffLine | null; showOld: boolean; showNew: boolean }) {
  if (!line) {
    return <div className="bg-muted/30 min-h-[20px] w-full font-mono text-xs leading-5" />;
  }
  return <DiffLineRow line={line} showOld={showOld} showNew={showNew} />;
}

export default function DiffViewerPage() {
  const [original, setOriginal] = useState(PLACEHOLDER_ORIGINAL);
  const [modified, setModified] = useState(PLACEHOLDER_MODIFIED);
  const [viewMode, setViewMode] = useState<"unified" | "side-by-side">("unified");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const { copied, copy } = useCopyToClipboard();

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

  return (
    <ToolLayout
      icon={FileDiff}
      title="Diff"
      highlight="Viewer"
      description="Compare two text blocks and visualize additions, deletions, and unchanged lines."
    >
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Original</Label>
            <Textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={10}
              className="resize-y font-mono text-xs"
              placeholder="Paste original text here…"
            />
          </div>
          <div className="space-y-2">
            <Label>Modified</Label>
            <Textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              rows={10}
              className="resize-y font-mono text-xs"
              placeholder="Paste modified text here…"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList>
              <TabsTrigger value="unified">Unified</TabsTrigger>
              <TabsTrigger value="side-by-side">Side by side</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Switch
              id="ignore-ws"
              checked={ignoreWhitespace}
              onCheckedChange={setIgnoreWhitespace}
            />
            <Label htmlFor="ignore-ws" className="cursor-pointer text-sm">
              Ignore whitespace
            </Label>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {hasChanges && (
              <div className="text-muted-foreground flex gap-3 text-xs">
                <span className="text-green-400">+{stats.added}</span>
                <span className="text-red-400">−{stats.removed}</span>
                <span>{stats.unchanged} unchanged</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setOriginal(""); setModified(""); }}
              className="rounded-full"
            >
              <RotateCcw size={12} />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(diffText)}
              disabled={!hasChanges}
              className="rounded-full font-semibold"
            >
              {copied ? (
                <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></>
              ) : (
                <><Copy size={12} />Copy diff</>
              )}
            </Button>
          </div>
        </div>

        {/* Diff output */}
        {diffLines.length > 0 && (
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
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

            {hasChanges && viewMode === "side-by-side" && (
              <div className="grid grid-cols-2 overflow-x-auto">
                <div className="border-border border-r">
                  <div className="border-border bg-muted/30 border-b px-3 py-1.5">
                    <span className="text-muted-foreground font-mono text-xs font-semibold">
                      Original
                    </span>
                  </div>
                  {left.map((item) => (
                    <SideBySideLineRow
                      key={item.key}
                      line={item.line}
                      showOld
                      showNew={false}
                    />
                  ))}
                </div>
                <div>
                  <div className="border-border bg-muted/30 border-b px-3 py-1.5">
                    <span className="text-muted-foreground font-mono text-xs font-semibold">
                      Modified
                    </span>
                  </div>
                  {right.map((item) => (
                    <SideBySideLineRow
                      key={item.key}
                      line={item.line}
                      showOld={false}
                      showNew
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
