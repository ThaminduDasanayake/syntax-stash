"use client";

import { DownloadIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { ToolLayout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { internalTools } from "@/lib/tools-data";

export default function PlaceholderGeneratorPage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [textColor, setTextColor] = useState("#e94560");
  const [customText, setCustomText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const tool = internalTools.find((t) => t.url === "/tools/placeholder-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Controls */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Width (px)"
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
              min={1}
              max={4096}
            />

            <InputField
              label="Height (px)"
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
              min={1}
              max={4096}
            />
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

          <InputField
            label="Custom Text (optional)"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={`${width} x ${height}`}
          />

          <div className="flex gap-3">
            <Button onClick={handleDownload} className="px-4">
              <DownloadIcon weight="duotone" className="size-4.5" />
              Download PNG
            </Button>
            <CopyButton
              labelName="Copy Data URL"
              value={() => {
                const canvas = canvasRef.current;
                return canvas ? canvas.toDataURL("image/png") : "";
              }}
            />
          </div>
        </div>

        {/* Right — Preview */}
        <div className="space-y-4">
          <Label>Preview</Label>
          <div className="border-border bg-foreground flex items-center justify-center overflow-hidden rounded-lg border p-4">
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
