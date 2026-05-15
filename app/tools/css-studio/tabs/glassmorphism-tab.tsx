"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/components/ui/slider-field";

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

export function GlassmorphismTab() {
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
    border: `1px solid rgba(0, 0, 0, ${(borderOpacity / 100).toFixed(2)})`,
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-1">
          <div className="space-y-3">
            <SliderField
              label="Blur Amount"
              valueLabel={`${blur}px`}
              value={[blur]}
              onValueChange={(vals) => setBlur(vals[0])}
              min={0}
              max={40}
              leftLabel="Controls the blur radius of the background"
            />
          </div>

          <div className="space-y-3">
            <SliderField
              label="Opacity"
              valueLabel={`${opacity}%`}
              value={[opacity]}
              onValueChange={(vals) => setOpacity(vals[0])}
              min={0}
              max={100}
              leftLabel="Controls the background transparency"
            />
          </div>

          <div className="space-y-3">
            <SliderField
              label="Border Opacity"
              valueLabel={`${borderOpacity}%`}
              value={[borderOpacity]}
              onValueChange={(vals) => setBorderOpacity(vals[0])}
              min={1}
              max={100}
              leftLabel="Controls the border transparency"
            />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Label>Preview</Label>
          <Card
            className="overflow-hidden"
            style={{
              background: `linear-gradient(to bottom,
                #61bb46 16.6%,
                #fdb827 16.6% 33.3%,
                #f5821f 33.3% 50%,
                #e03a3e 50% 66.6%,
                #963d97 66.6% 83.3%,
                #009cdf 83.3%)`,
            }}
          >
            <CardContent className="flex min-h-125 items-center justify-center p-8">
              <div
                style={glassStyle}
                className="flex h-64 w-72 flex-col items-center justify-center rounded-lg text-center shadow-2xl transition-all duration-300"
              >
                <div className="space-y-2">
                  <p className="text-muted text-lg font-semibold">Glass Card</p>
                  <p className="text-muted text-sm">
                    Blur: {blur}px • Opacity: {opacity}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Label className="text-foreground text-sm font-semibold">Generated Code</Label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-foreground text-xs font-medium">CSS</p>
            <CopyButton labelName="Copy CSS" textToCopy={cssCode} />
          </div>
          <div className="bg-background border-border overflow-x-auto rounded-lg border p-4">
            <pre className="text-primary font-mono text-xs wrap-break-word whitespace-pre-wrap">
              {cssCode}
            </pre>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-foreground text-xs font-medium">Tailwind Classes</p>
            <CopyButton labelName="Copy Tailwind CSS" textToCopy={tailwindClasses} />
          </div>
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
      </div>

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
    </div>
  );
}
