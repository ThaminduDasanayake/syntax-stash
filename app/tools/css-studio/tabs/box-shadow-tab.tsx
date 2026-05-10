"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";

export function BoxShadowTab() {
  const [xOffset, setXOffset] = useState(10);
  const [yOffset, setYOffset] = useState(10);
  const [blurRadius, setBlurRadius] = useState(5);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowOpacity, setShadowOpacity] = useState(0.75);
  const [inset, setInset] = useState(false);

  const shadowString = useMemo(() => {
    const hex = shadowColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const insetStr = inset ? "inset " : "";
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;

    return `${insetStr}${xOffset}px ${yOffset}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;
  }, [xOffset, yOffset, blurRadius, spreadRadius, shadowColor, shadowOpacity, inset]);

  const cssCode = `box-shadow: ${shadowString};`;

  const handleReset = () => {
    setXOffset(10);
    setYOffset(10);
    setBlurRadius(5);
    setSpreadRadius(0);
    setShadowColor("#000000");
    setShadowOpacity(0.75);
    setInset(false);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>X Offset</Label>
            <span className="text-muted-foreground font-mono text-sm">{xOffset}px</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-50"
              max="50"
              value={xOffset}
              onChange={(e) => setXOffset(Number(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <InputField
              value={String(xOffset)}
              onChange={(e) => setXOffset(Number(e.target.value))}
              type="number"
              containerClassName=""
              className="w-16"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Y Offset</Label>
            <span className="text-muted-foreground font-mono text-sm">{yOffset}px</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-50"
              max="50"
              value={yOffset}
              onChange={(e) => setYOffset(Number(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <InputField
              value={String(yOffset)}
              onChange={(e) => setYOffset(Number(e.target.value))}
              type="number"
              containerClassName=""
              className="w-16"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Blur Radius</Label>
            <span className="text-muted-foreground font-mono text-sm">{blurRadius}px</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="50"
              value={blurRadius}
              onChange={(e) => setBlurRadius(Number(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <InputField
              value={String(blurRadius)}
              onChange={(e) => setBlurRadius(Number(e.target.value))}
              type="number"
              containerClassName=""
              className="w-16"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Spread Radius</Label>
            <span className="text-muted-foreground font-mono text-sm">{spreadRadius}px</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-20"
              max="20"
              value={spreadRadius}
              onChange={(e) => setSpreadRadius(Number(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <InputField
              value={String(spreadRadius)}
              onChange={(e) => setSpreadRadius(Number(e.target.value))}
              type="number"
              containerClassName=""
              className="w-16"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Shadow Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded border"
            />
            <InputField
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
              containerClassName=""
              className="flex-1 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Opacity</Label>
            <span className="text-muted-foreground font-mono text-sm">
              {(shadowOpacity * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={shadowOpacity}
              onChange={(e) => setShadowOpacity(Number(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <InputField
              value={shadowOpacity.toFixed(2)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) setShadowOpacity(Math.min(Math.max(val, 0), 1));
              }}
              type="number"
              step="0.05"
              min="0"
              max="1"
              containerClassName=""
              className="w-16"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Shadow Type</Label>
          <Button
            variant={inset ? "default" : "outline"}
            onClick={() => setInset(!inset)}
            className="w-full"
          >
            {inset ? "✓ Inset Shadow" : "Outset Shadow"}
          </Button>
        </div>

        <Button variant="ghost" onClick={handleReset} className="w-full border">
          Reset to Defaults
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-8">
          <div className="flex h-64 items-center justify-center rounded-lg bg-linear-to-br from-slate-100 to-slate-50">
            <div
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: shadowString,
                transition: "box-shadow 0.15s ease",
              }}
            />
          </div>
        </div>

        <TextAreaField
          label="CSS Code"
          value={cssCode}
          readOnly
          rows={3}
          action={<CopyButton textToCopy={cssCode} disabled={false} />}
        />

        <div className="bg-muted text-muted-foreground space-y-2 rounded-lg p-4 text-sm">
          <div>
            <span className="font-medium">Format:</span>
            <p className="mt-1 font-mono text-xs">box-shadow: [inset] X Y Blur Spread Color;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
