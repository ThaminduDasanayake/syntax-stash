"use client";

import { ShuffleIcon } from "@phosphor-icons/react";
import { useCallback, useState } from "react";

import { CURVES, FONTS, LOOK, THEMES } from "@/app/tools/mermaid-editor/data";
import { MermaidPreview } from "@/app/tools/mermaid-editor/mermaid-preview";
import {
  DIAGRAM_LABELS,
  DIAGRAM_TEMPLATES,
  type DiagramType,
} from "@/app/tools/mermaid-editor/templates";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { ColorField } from "@/components/ui/color-field";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { StepperField } from "@/components/ui/stepper-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

export default function MermaidEditorPage() {
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [code, setCode] = useState(DIAGRAM_TEMPLATES.flowchart);
  const [error, setError] = useState<string | null>(null);
  const [lastSvg, setLastSvg] = useState<string>("");
  const [theme, setTheme] = useState<string>("default");
  const [look, setLook] = useState<string>("classic");
  const [fontFamily, setFontFamily] = useState<string>("sans-serif");
  const [handDrawnSeed, setHandDrawnSeed] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(16);
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [primaryColor, setPrimaryColor] = useState<string>("#ececff");
  const [fontColor, setFontColor] = useState<string>("#1f2937");
  const [curve, setCurve] = useState<string>("basis");

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

  function downloadPng() {
    if (!lastSvg) return;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(lastSvg, "image/svg+xml");
    const svgEl = svgDoc.documentElement;

    const viewBox = svgEl.getAttribute("viewBox");
    let svgW = 800;
    let svgH = 600;
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/).map(Number);
      if (parts.length === 4) {
        svgW = parts[2];
        svgH = parts[3];
      }
    }

    svgEl.setAttribute("width", String(svgW));
    svgEl.setAttribute("height", String(svgH));

    const serialized = new XMLSerializer().serializeToString(svgDoc);
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;

    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = svgW * scale;
      canvas.height = svgH * scale;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, svgW, svgH);
        ctx.drawImage(img, 0, 0, svgW, svgH);

        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${diagramType}-diagram.png`;
        a.click();
      }
    };
    img.src = svgUrl;
  }

  const tool = internalTools.find((t) => t.slug === "mermaid-editor");

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
        <div className="flex flex-col gap-6">
          {/* Editor */}
          <div className="flex flex-col gap-1.5">
            <TextareaGroup
              autoGrow
              label="Mermaid source"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write mermaid diagram here..."
              action={
                <div className="flex gap-2">
                  <ClearButton
                    size="sm"
                    onClick={() => {
                      setCode("");
                      setError(null);
                    }}
                  />
                  <CopyButton size="sm" textToCopy={code} disabled={!code} />
                </div>
              }
            />
            {error && <ErrorAlert message={error} />}
          </div>

          <div className="grid grid-cols-6 items-center gap-4">
            <SelectField
              label="Theme"
              value={theme}
              onValueChange={(v) => {
                if (!v) return;
                setTheme(v);
                if (v !== "base") {
                  setBackgroundColor("#ffffff");
                  setPrimaryColor("#ececff");
                  setFontColor("#1f2937");
                }
              }}
              options={THEMES}
              triggerClassName="max-w-xs"
            />
            <SelectField
              label="Style"
              value={look}
              onValueChange={(v) => v && setLook(v)}
              options={LOOK}
              triggerClassName="max-w-xs"
            />

            <SelectField
              label="Font Family"
              value={fontFamily}
              onValueChange={(v) => v && setFontFamily(v)}
              options={FONTS}
            />

            <StepperField
              label="Font Size (px)"
              min={10}
              max={24}
              value={fontSize}
              onValueChange={(val) => setFontSize(Math.max(10, Math.min(24, Number(val))))}
            />

            <SelectField
              label="Edge Curve"
              value={curve}
              onValueChange={(v) => v && setCurve(v)}
              options={CURVES}
            />

            {look === "handDrawn" && (
              <div className="space-y-2">
                <Label>Hand Drawn Seed</Label>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setHandDrawnSeed(Math.floor(Math.random() * 100000))}
                >
                  Shuffle Canvas <ShuffleIcon />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ColorField
              label="Background Color (Base Theme)"
              value={backgroundColor}
              onValueChange={setBackgroundColor}
              disabled={theme != "base"}
            />

            <ColorField
              label="Node Color (Base Theme)"
              value={primaryColor}
              onValueChange={setPrimaryColor}
              disabled={theme != "base"}
            />

            <ColorField
              label="Font Color (Base Theme)"
              value={fontColor}
              onValueChange={setFontColor}
              disabled={theme != "base"}
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label>Preview</Label>
              <div className="flex gap-2">
                <DownloadButton label="SVG" onClick={downloadSvg} disabled={!lastSvg} />
                <DownloadButton label="PNG" onClick={downloadPng} disabled={!lastSvg} />
              </div>
            </div>
            <div className="border-border bg-card flex-1 overflow-hidden rounded-xl border">
              <MermaidPreview
                code={code}
                theme={theme}
                look={look}
                fontFamily={fontFamily}
                handDrawnSeed={handDrawnSeed}
                fontSize={fontSize}
                backgroundColor={backgroundColor}
                primaryColor={primaryColor}
                fontColor={fontColor}
                curve={curve}
                onErrorAction={handleError}
                onRenderAction={handleRender}
              />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
