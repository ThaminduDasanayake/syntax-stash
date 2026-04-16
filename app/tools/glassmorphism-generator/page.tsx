"use client";

import { Check, Copy, Layers } from "lucide-react";
import { useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

function getBlurClass(blur: number): string {
  if (blur <= 5) return "backdrop-blur-sm";
  if (blur <= 10) return "backdrop-blur";
  if (blur <= 15) return "backdrop-blur-md";
  if (blur <= 20) return "backdrop-blur-lg";
  if (blur <= 25) return "backdrop-blur-xl";
  if (blur <= 30) return "backdrop-blur-2xl";
  return "backdrop-blur-3xl";
}

function getOpacityClass(opacity: number): string {
  const rounded = Math.round(opacity / 10) * 10;
  if (rounded === 0) return "bg-white/0";
  if (rounded === 10) return "bg-white/10";
  if (rounded === 20) return "bg-white/20";
  if (rounded === 30) return "bg-white/30";
  if (rounded === 40) return "bg-white/40";
  if (rounded === 50) return "bg-white/50";
  if (rounded === 60) return "bg-white/60";
  if (rounded === 70) return "bg-white/70";
  if (rounded === 80) return "bg-white/80";
  if (rounded === 90) return "bg-white/90";
  return "bg-white";
}

function getBorderOpacityClass(borderOpacity: number): string {
  const rounded = Math.round(borderOpacity / 10) * 10;
  if (rounded === 0) return "border-white/0";
  if (rounded === 10) return "border-white/10";
  if (rounded === 20) return "border-white/20";
  if (rounded === 30) return "border-white/30";
  if (rounded === 40) return "border-white/40";
  if (rounded === 50) return "border-white/50";
  if (rounded === 60) return "border-white/60";
  if (rounded === 70) return "border-white/70";
  if (rounded === 80) return "border-white/80";
  if (rounded === 90) return "border-white/90";
  return "border-white";
}

export default function GlassmorphismPage() {
  const [blur, setBlur] = useState(20);
  const [opacity, setOpacity] = useState(20);
  const [borderOpacity, setBorderOpacity] = useState(50);

  const cssCode = `.glass-card {
  backdrop-filter: blur(${blur}px);
  background-color: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});
  border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});
}`;

  const tailwindClasses = `${getBlurClass(blur)} ${getOpacityClass(opacity)} border ${getBorderOpacityClass(borderOpacity)}`;

  const glassStyle = {
    backdropFilter: `blur(${blur}px)`,
    backgroundColor: `rgba(255, 255, 255, ${(opacity / 100).toFixed(2)})`,
    border: `1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)})`,
  };

  const { copied, copy } = useCopyToClipboard();

  return (
    <ToolLayout
      icon={Layers}
      title="Glassmorphism"
      highlight="Generator"
      description="Generate beautiful glassmorphism UI elements with customizable backdrop blur and transparency."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Controls */}
        <div className="space-y-8 lg:col-span-1">
          {/* Blur Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground text-sm font-semibold">Blur Amount</Label>
              <span className="text-primary font-mono text-sm font-semibold">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
            />
            <p className="text-muted-foreground text-xs">
              Controls the blur radius of the background
            </p>
          </div>

          {/* Opacity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground text-sm font-semibold">Opacity</Label>
              <span className="text-primary font-mono text-sm font-semibold">{opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
            />
            <p className="text-muted-foreground text-xs">Controls the background transparency</p>
          </div>

          {/* Border Opacity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground text-sm font-semibold">Border Opacity</Label>
              <span className="text-primary font-mono text-sm font-semibold">{borderOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
            />
            <p className="text-muted-foreground text-xs">Controls the border transparency</p>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="space-y-4 lg:col-span-2">
          <Label className="text-foreground text-sm font-semibold">Preview</Label>
          <Card className="to-primary overflow-hidden bg-linear-to-br from-purple-500 via-pink-500">
            <CardContent className="flex min-h-125 items-center justify-center p-8">
              <div
                style={glassStyle}
                className="flex h-48 w-64 flex-col items-center justify-center rounded-2xl text-center shadow-2xl transition-all duration-300"
              >
                <div className="space-y-2">
                  <p className="text-foreground text-lg font-semibold">Glass Card</p>
                  <p className="text-muted-foreground text-sm">
                    Blur: {blur}px • Opacity: {opacity}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Section */}
      <div className="mt-8 space-y-4">
        <Label className="text-foreground text-sm font-semibold">Generated Code</Label>

        {/* CSS Code Block */}
        <div className="space-y-2">
          <p className="text-foreground text-xs font-medium">CSS</p>
          <div className="bg-background border-border overflow-x-auto rounded-lg border p-4">
            <pre className="text-primary font-mono text-xs wrap-break-word whitespace-pre-wrap">
              {cssCode}
            </pre>
          </div>
        </div>

        {/* Tailwind Classes Block */}
        <div className="space-y-2">
          <p className="text-foreground text-xs font-medium">Tailwind Classes</p>
          <div className="bg-background border-border space-y-3 rounded-lg border p-4">
            <pre className="text-primary font-mono text-xs wrap-break-word whitespace-pre-wrap">
              {tailwindClasses}
            </pre>
            <div className="bg-muted/50 space-y-1 rounded p-3">
              <p className="text-foreground text-xs font-semibold">HTML Example:</p>
              <pre className="text-muted-foreground font-mono text-xs wrap-break-word whitespace-pre-wrap">
                {`<div class="${tailwindClasses} rounded-2xl shadow-2xl p-8">
  Your content here
</div>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <Button onClick={() => copy(cssCode)} variant="outline" className="gap-2">
          {copied ? (
            <>
              <Check size={14} />
              <span>CSS Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy CSS</span>
            </>
          )}
        </Button>
      </div>

      {/* Reference Section */}
      <div className="bg-muted/30 border-border mt-8 space-y-3 rounded-lg border p-4">
        <h4 className="text-foreground text-sm font-semibold">Glassmorphism Tips</h4>
        <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
          <div className="space-y-2">
            <p>
              <span className="text-foreground font-semibold">Blur:</span> Higher values create
              stronger blur effect. 20-30px is typical.
            </p>
            <p>
              <span className="text-foreground font-semibold">Opacity:</span> Lower values (10-30%)
              work best for glassmorphism effect.
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="text-foreground font-semibold">Border:</span> Semi-transparent
              borders enhance the glass effect.
            </p>
            <p>
              <span className="text-foreground font-semibold">Layering:</span> Use on top of
              colorful gradients for best results.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
