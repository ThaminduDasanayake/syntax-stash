"use client";

import { DownloadIcon } from "@phosphor-icons/react";
import { useCallback, useState } from "react";

import { MermaidPreview } from "@/app/tools/mermaid-editor/mermaid-preview";
import {
  DIAGRAM_LABELS,
  DIAGRAM_TEMPLATES,
  type DiagramType,
} from "@/app/tools/mermaid-editor/templates";
import { ToolLayout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { developmentTools } from "@/lib/tools-data";

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

  const tool = developmentTools.find((t) => t.url === "/tools/mermaid-editor");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-3">
        {/* Toolbar */}
        <SelectField
          value={diagramType}
          onValueChange={(v) => v && handleDiagramTypeChange(v)}
          options={(Object.entries(DIAGRAM_LABELS) as [DiagramType, string][]).map(
            ([key, label]) => ({
              value: key,
              label: label,
            }),
          )}
          triggerClassName="max-w-xs"
        />

        {/* Editor + Preview */}
        <div className="flex flex-col gap-4">
          {/* Editor */}
          <div className="flex flex-col gap-1.5">
            <TextAreaField
              label="Mermaid source"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="resize-none"
              placeholder="Write mermaid diagram here…"
              rows={20}
              spellCheck={false}
              action={
                <div className="flex gap-2">
                  <ClearButton
                    onClick={() => {
                      setCode(DIAGRAM_TEMPLATES[diagramType]);
                      setError(null);
                    }}
                  />
                  <CopyButton value={code} />
                </div>
              }
            />
            {error && (
              <p className="text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-xs">
                {error}
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label>Preview</Label>
              <Button variant="outline" onClick={downloadSvg} disabled={!lastSvg}>
                <DownloadIcon weight="duotone" />
                Download .svg
              </Button>
            </div>
            <div className="border-border bg-card flex-1 overflow-hidden rounded-xl border">
              <MermaidPreview code={code} onError={handleError} onRender={handleRender} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
