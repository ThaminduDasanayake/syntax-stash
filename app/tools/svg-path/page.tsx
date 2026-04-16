"use client";

import { PenTool } from "lucide-react";
import { useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SvgPathViewerPage() {
  const [pathData, setPathData] = useState(
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  );
  const [viewBoxWidth, setViewBoxWidth] = useState("24");
  const [viewBoxHeight, setViewBoxHeight] = useState("24");
  const [fillColor, setFillColor] = useState("#000000");
  const [strokeColor, setStrokeColor] = useState("none");
  const [strokeWidth, setStrokeWidth] = useState("0");

  const viewBoxValue = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

  return (
    <ToolLayout
      icon={PenTool}
      title="SVG Path Viewer"
      highlight="Editor"
      description="Preview and edit raw SVG 'd' paths with real-time visualization and customizable styling."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Controls */}
        <div className="space-y-6">
          {/* SVG Path Input */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-semibold">SVG Path (d attribute)</Label>
            <Textarea
              value={pathData}
              onChange={(e) => setPathData(e.target.value)}
              placeholder={"M10 10 H 90 V 90 H 10 Z\n\nExample path data..."}
              rows={12}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-xs leading-relaxed focus-visible:ring-1"
            />
            <p className="text-muted-foreground text-xs">
              Paste the content from the SVG's d attribute. Supports all SVG path commands (M, L, H,
              V, C, S, Q, T, A, Z, etc.)
            </p>
          </div>

          {/* ViewBox Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">ViewBox Width</Label>
              <Input
                type="number"
                value={viewBoxWidth}
                onChange={(e) => setViewBoxWidth(e.target.value)}
                className="bg-background border-border text-foreground focus-visible:ring-primary/30 h-9 font-mono focus-visible:ring-1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">ViewBox Height</Label>
              <Input
                type="number"
                value={viewBoxHeight}
                onChange={(e) => setViewBoxHeight(e.target.value)}
                className="bg-background border-border text-foreground focus-visible:ring-primary/30 h-9 font-mono focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Color Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Fill Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="border-border h-9 w-20 cursor-pointer rounded border"
                />
                <Input
                  type="text"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="bg-background border-border text-foreground focus-visible:ring-primary/30 h-9 flex-1 font-mono text-xs focus-visible:ring-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Stroke Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={strokeColor === "none" ? "#000000" : strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="border-border h-9 w-20 cursor-pointer rounded border"
                />
                <Input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="bg-background border-border text-foreground focus-visible:ring-primary/30 h-9 flex-1 font-mono text-xs focus-visible:ring-1"
                  placeholder="none"
                />
              </div>
            </div>
          </div>

          {/* Stroke Width */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Stroke Width</Label>
            <Input
              type="number"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(e.target.value)}
              min="0"
              step="0.5"
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 h-9 font-mono focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="space-y-3">
          <Label className="text-foreground text-sm font-semibold">Preview</Label>
          <Card className="bg-background overflow-hidden">
            <CardContent
              className="flex min-h-125 items-center justify-center p-0"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, transparent 24%, rgba(200, 200, 200, 0.05) 25%, rgba(200, 200, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.05) 75%, rgba(200, 200, 200, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(200, 200, 200, 0.05) 25%, rgba(200, 200, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.05) 75%, rgba(200, 200, 200, 0.05) 76%, transparent 77%, transparent)",
                backgroundSize: "50px 50px",
              }}
            >
              <svg
                viewBox={viewBoxValue}
                className="text-primary"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  maxWidth: "400px",
                  maxHeight: "400px",
                  width: "100%",
                  height: "auto",
                }}
              >
                <path
                  d={pathData}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={Number(strokeWidth)}
                />
              </svg>
            </CardContent>
          </Card>

          {/* SVG Code Export */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">SVG Code</Label>
            <div className="bg-background border-border text-foreground max-h-32 overflow-x-auto rounded border p-3 font-mono text-xs">
              <pre className="wrap-break-word whitespace-pre-wrap">{`<svg viewBox="${viewBoxValue}" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathData}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
</svg>`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Section */}
      <div className="bg-muted/30 border-border mt-8 space-y-3 rounded-lg border p-4">
        <h4 className="text-foreground text-sm font-semibold">SVG Path Commands Reference</h4>
        <div className="text-muted-foreground grid grid-cols-1 gap-4 font-mono text-xs md:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </div>
    </ToolLayout>
  );
}
