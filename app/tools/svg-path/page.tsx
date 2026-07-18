"use client";

import { useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { ClearButton } from "@/components/ui/clear-button";
import { ColorField } from "@/components/ui/color-field";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

export default function SvgPathViewerPage() {
  const [pathData, setPathData] = useState("M47 11 26 23l21 12m-30-6 21 12-21 12");
  const [viewBoxWidth, setViewBoxWidth] = useState("64");
  const [viewBoxHeight, setViewBoxHeight] = useState("64");
  const [fillColor, setFillColor] = useState("none");
  const [strokeColor, setStrokeColor] = useState("#c4e456");
  const [strokeWidth, setStrokeWidth] = useState("5");
  const [strokeLinecap, setStrokeLinecap] = useState<"butt" | "round" | "square">("round");
  const [strokeLinejoin, setStrokeLinejoin] = useState<"miter" | "round" | "bevel">("round");
  const [showBackground, setShowBackground] = useState(false);
  const [bgRadius, setBgRadius] = useState("14");
  const [bgColor, setBgColor] = useState("#000000");
  const [scale, setScale] = useState("1");

  const viewBoxValue = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

  const STROKE_LINECAP = [
    { label: "Butt", value: "butt" },
    { label: "Round", value: "round" },
    { label: "Square", value: "square" },
  ];

  const STROKE_LINEJOIN = [
    { label: "Bevel", value: "bevel" },
    { label: "Miter", value: "miter" },
    { label: "Round", value: "round" },
  ];

  const isValidPath = pathData.trim().length > 0;

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxValue}">
${showBackground ? `  <rect width="100%" height="100%" fill="${bgColor}" rx="${bgRadius}" />\n` : ""}${
    isValidPath
      ? `  <g transform="scale(${scale})">
    <path d="${pathData}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}" />
  </g>`
      : ""
  }
</svg>`;

  function downloadSvg() {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "icon.svg";
    a.click();

    URL.revokeObjectURL(url);
  }

  const tool = internalTools.find((t) => t.slug === "svg-path");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
          {/* SVG Path Input */}
          <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-2">
            <TextareaGroup
              label="SVG Path (d attribute)"
              value={pathData}
              onChange={(e) => setPathData(e.target.value)}
              placeholder={"M10 10 H 90 V 90 H 10 Z\n\nExample path data..."}
              action={
                <ClearButton size="sm" onClick={() => setPathData("")} disabled={!pathData} />
              }
            />
            <p className="text-muted-foreground text-xs">
              Paste the content from the SVG&apos;s d attribute. Supports all SVG path commands (M,
              L, H, V, C, S, Q, T, A, Z, etc.)
            </p>
          </div>

          {/* ViewBox Controls */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              label="ViewBox Width"
              value={viewBoxWidth}
              onChange={(e) => setViewBoxWidth(e.target.value)}
            />

            <InputField
              type="number"
              label="ViewBox Height"
              value={viewBoxHeight}
              onChange={(e) => setViewBoxHeight(e.target.value)}
            />
          </div>

          {/* Color Controls */}
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Fill Color" value={fillColor} onValueChange={setFillColor} />

            <ColorField label="Stroke Color" value={strokeColor} onValueChange={setStrokeColor} />
          </div>

          <div className="space-y-6">
            <Label>Background</Label>

            <CheckboxField
              label="Enable background"
              checked={showBackground}
              onCheckedChange={(checked) => setShowBackground(checked === true)}
            />

            {showBackground && (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  type="number"
                  label="Radius"
                  value={bgRadius}
                  onChange={(e) => setBgRadius(e.target.value)}
                />

                <ColorField label="Color" value={bgColor} onValueChange={setBgColor} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              label="Stroke Width"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(e.target.value)}
              min="0"
              step="0.5"
            />

            <InputField
              type="number"
              label="Scale"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              step="0.1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Stroke Linecap"
              value={strokeLinecap}
              onValueChange={(v) => v && setStrokeLinecap(v as "butt" | "round" | "square")}
              options={STROKE_LINECAP}
            />

            <SelectField
              label="Stroke Linejoin"
              value={strokeLinejoin}
              onValueChange={(v) => v && setStrokeLinejoin(v as "miter" | "round" | "bevel")}
              options={STROKE_LINEJOIN}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Preview</Label>
          <Card className="bg-background overflow-hidden">
            <CardContent className="bg-grid-slate flex min-h-125 items-center justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBoxValue}
                style={{
                  height: "auto",
                  maxHeight: "400px",
                  maxWidth: "400px",
                  width: "100%",
                }}
              >
                {showBackground && (
                  <rect width="100%" height="100%" fill={bgColor} rx={Number(bgRadius)} />
                )}
                {isValidPath && (
                  <g transform={`scale(${scale})`}>
                    <path
                      d={pathData}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={Number(strokeWidth)}
                      strokeLinecap={strokeLinecap}
                      strokeLinejoin={strokeLinejoin}
                    />
                  </g>
                )}
              </svg>
            </CardContent>
          </Card>

          {/* SVG Code Export */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">SVG Code</Label>
            <div className="bg-card border-border text-foreground max-h-32 overflow-x-auto rounded-lg border p-3 font-mono text-xs">
              <pre className="wrap-break-word whitespace-pre-wrap">{svgCode}</pre>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton textToCopy={svgCode} disabled={!svgCode} />
            <DownloadButton label="Download SVG" onClick={downloadSvg} disabled={!svgCode} />
          </div>
        </div>

        {/* Reference Section */}
        <Card className="col-span-2">
          <CardHeader>SVG Path Commands Reference</CardHeader>
          <CardContent className="text-muted-foreground grid grid-cols-1 gap-4 font-mono text-xs md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p>
                <span className="text-foreground font-semibold">M/m</span> Move to
              </p>
              <p>
                <span className="text-foreground font-semibold">L/l</span> Line to
              </p>
              <p>
                <span className="text-foreground font-semibold">H/h</span> Horizontal line
              </p>
              <p>
                <span className="text-foreground font-semibold">V/v</span> Vertical line
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="text-foreground font-semibold">C/c</span> Cubic Bézier
              </p>
              <p>
                <span className="text-foreground font-semibold">S/s</span> Smooth cubic
              </p>
              <p>
                <span className="text-foreground font-semibold">Q/q</span> Quadratic Bézier
              </p>
              <p>
                <span className="text-foreground font-semibold">T/t</span> Smooth quadratic
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="text-foreground font-semibold">A/a</span> Elliptical arc
              </p>
              <p>
                <span className="text-foreground font-semibold">Z/z</span> Close path
              </p>
              <p>Uppercase = absolute</p>
              <p>Lowercase = relative</p>
            </div>
            <div className="space-y-1">
              <p>
                Example: <span className="text-primary">M10 10</span>
              </p>
              <p>Move to 10,10</p>
              <p>
                <span className="text-primary">L20 20</span>
              </p>
              <p>Line to 20,20</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
