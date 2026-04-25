"use client";

import { Download, GitBranch, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";

import { MermaidPreview } from "@/app/tools/mermaid-editor/mermaid-preview";
import {
  DIAGRAM_LABELS,
  DIAGRAM_TEMPLATES,
  type DiagramType,
} from "@/app/tools/mermaid-editor/templates";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function MermaidEditorPage() {
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [code, setCode] = useState(DIAGRAM_TEMPLATES.flowchart);
  const [error, setError] = useState<string | null>(null);
  const [lastSvg, setLastSvg] = useState<string>("");

  const handleDiagramTypeChange = (type: string) => {
    const t = type as DiagramType;
    setDiagramType(t);
    setCode(DIAGRAM_TEMPLATES[t]);
    setError(null);
  };

  const handleRender = useCallback((svg: string) => setLastSvg(svg), []);
  const handleError = useCallback((err: string | null) => setError(err), []);

  function downloadSvg() {
    if (!lastSvg) return;
    const blob = new Blob([lastSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${diagramType}-diagram.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      icon={GitBranch}
      title="Mermaid"
      highlight="Live Editor"
      description="Write Mermaid diagrams with a live SVG preview. Supports flowcharts, sequence, ER, class, state, Gantt, and pie charts."
    >
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={diagramType} onValueChange={(v) => v && handleDiagramTypeChange(v)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(DIAGRAM_LABELS) as [DiagramType, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => { setCode(DIAGRAM_TEMPLATES[diagramType]); setError(null); }}
              className="rounded-full"
            >
              <RotateCcw size={12} />
              Reset
            </Button>
            <CopyButton value={code} />
            <Button
              variant="outline" size="sm"
              onClick={downloadSvg}
              disabled={!lastSvg}
              className="rounded-full"
            >
              <Download size={12} />
              SVG
            </Button>
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="grid h-[68vh] grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Editor */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Mermaid source
            </Label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 resize-none font-mono text-xs leading-relaxed"
              placeholder="Write mermaid diagram here…"
              spellCheck={false}
            />
            {error && (
              <p className="text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-xs">
                {error}
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Preview
            </Label>
            <div className="border-border bg-card flex-1 overflow-hidden rounded-xl border">
              <MermaidPreview code={code} onError={handleError} onRender={handleRender} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
