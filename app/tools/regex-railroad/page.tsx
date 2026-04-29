"use client";

import { Download, Regex } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { type RootNode } from "regjsparser";

import { parseRegex } from "@/app/tools/regex-railroad/parser";
import { RailroadDiagram } from "@/app/tools/regex-railroad/railroad";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "" },
  { label: "Groups + quantifier", pattern: "^(foo|bar)+\\d{2,4}$", flags: "" },
  { label: "Word boundary", pattern: "\\b[A-Z][a-z]+\\b", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?", flags: "i" },
];

export default function RegexRailroadPage() {
  const [pattern, setPattern] = useState("^(foo|bar)+\\d{2,4}$");
  const [flags, setFlags] = useState("");
  const diagramRef = useRef<SVGSVGElement>(null);

  const parsed = useMemo(() => parseRegex(pattern, flags), [pattern, flags]);

  function downloadSvg() {
    const svg = diagramRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regex-railroad.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copySvg() {
    const svg = diagramRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    navigator.clipboard.writeText(serializer.serializeToString(svg));
  }

  return (
    <ToolLayout
      icon={Regex}
      title="Regex"
      highlight="Railroad"
      description="Visualize a regular expression as a railroad diagram to understand its structure at a glance."
    >
      <div className="space-y-6">
        {/* Pattern input */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-1 items-center gap-0">
            <span className="border-border bg-muted text-muted-foreground rounded-l-lg border border-r-0 px-3 py-2 font-mono text-sm">
              /
            </span>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="rounded-none border-x-0 font-mono text-sm"
              placeholder="regex pattern…"
              spellCheck={false}
            />
            <span className="border-border bg-muted text-muted-foreground border border-l-0 px-3 py-2 font-mono text-sm">
              /
            </span>
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="ml-1 w-16 rounded-lg font-mono text-sm"
              placeholder="gi"
              maxLength={6}
              spellCheck={false}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={copySvg} disabled={!parsed.ok}>
              Copy SVG
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={downloadSvg} disabled={!parsed.ok}>
              <Download size={12} />
              SVG
            </Button>
          </div>
        </div>

        {/* Examples */}
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-muted-foreground text-xs">Examples:</Label>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setPattern(ex.pattern); setFlags(ex.flags); }}
              className="border-border bg-card hover:bg-muted rounded-full border px-3 py-1 font-mono text-xs transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {!parsed.ok && pattern && (
          <p className="text-destructive bg-destructive/10 rounded-lg px-4 py-2 text-sm">
            {parsed.error}
          </p>
        )}

        {/* Diagram */}
        {parsed.ok && (
          <div className="border-border bg-card overflow-auto rounded-xl border p-6">
            <div className="text-muted-foreground mb-4 font-mono text-xs">
              /{pattern}/{flags}
            </div>
            <DiagramWithRef ast={parsed.ast} svgRef={diagramRef} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function DiagramWithRef({
  ast,
  svgRef,
}: {
  ast: RootNode;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  return (
    <div ref={(div) => {
      if (div) {
        const svg = div.querySelector("svg");
        if (svg && svgRef) (svgRef as React.MutableRefObject<SVGSVGElement | null>).current = svg as SVGSVGElement;
      }
    }}>
      <RailroadDiagram ast={ast} />
    </div>
  );
}
