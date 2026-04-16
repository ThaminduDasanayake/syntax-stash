"use client";

import { Check, Copy, Download, Frame } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function PlaceholderGeneratorPage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [textColor, setTextColor] = useState("#e94560");
  const [customText, setCustomText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { copied, copy } = useCopyToClipboard();

  const displayText = customText || `${width} x ${height}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    const fontSize = Math.max(16, Math.min(width, height) / 8);
    ctx.fillStyle = textColor;
    ctx.font = `600 ${fontSize}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2);
  }, [width, height, bgColor, textColor, displayText]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `placeholder-${width}x${height}.png`;
    a.click();
  }

  function handleCopyDataUrl() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    copy(canvas.toDataURL("image/png"));
  }

  return (
    <ToolLayout
      icon={Frame}
      title="Placeholder"
      highlight="Generator"
      description="Generate custom placeholder images using the Canvas API, entirely in your browser."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Controls */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
                min={1}
                max={4096}
              />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
                min={1}
                max={4096}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-md border p-1"
                />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} maxLength={7} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-md border p-1"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Text (optional)</Label>
            <Input
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={`${width} x ${height}`}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleDownload} className="rounded-full px-5 font-semibold">
              <Download size={14} />
              Download PNG
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyDataUrl}
              className="rounded-full px-5 font-semibold"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Data URL
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right — Preview */}
        <div className="space-y-4">
          <Label>Preview</Label>
          <div className="border-border flex items-center justify-center overflow-hidden rounded-lg border p-4">
            <canvas
              ref={canvasRef}
              className="max-h-96 max-w-full rounded object-contain"
              style={{ imageRendering: "auto" }}
            />
          </div>
          <p className="text-muted-foreground text-center font-mono text-xs">
            {width} &times; {height}px
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
