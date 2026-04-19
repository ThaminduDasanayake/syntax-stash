"use client";

import { Square } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { Label } from "@/components/ui/label";

export default function BoxShadowBuilderPage() {
  const [xOffset, setXOffset] = useState(10);
  const [yOffset, setYOffset] = useState(10);
  const [blurRadius, setBlurRadius] = useState(5);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowOpacity, setShadowOpacity] = useState(0.75);
  const [inset, setInset] = useState(false);

  const shadowString = useMemo(() => {
    // Convert hex to rgb
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
    <ToolLayout
      icon={Square}
      title="Shadow"
      highlight="Builder"
      description="Visually generate CSS box-shadow styles with live preview."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Inputs */}
        <div className="space-y-6">
          {/* X Offset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>X Offset</Label>
              <span className="text-sm font-mono text-muted-foreground">{xOffset}px</span>
            </div>
            <div className="flex gap-3 items-center">
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

          {/* Y Offset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Y Offset</Label>
              <span className="text-sm font-mono text-muted-foreground">{yOffset}px</span>
            </div>
            <div className="flex gap-3 items-center">
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

          {/* Blur Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Blur Radius</Label>
              <span className="text-sm font-mono text-muted-foreground">{blurRadius}px</span>
            </div>
            <div className="flex gap-3 items-center">
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

          {/* Spread Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Spread Radius</Label>
              <span className="text-sm font-mono text-muted-foreground">{spreadRadius}px</span>
            </div>
            <div className="flex gap-3 items-center">
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

          {/* Shadow Color */}
          <div className="space-y-2">
            <Label>Shadow Color</Label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                className="h-10 w-16 rounded cursor-pointer border"
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

          {/* Shadow Opacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opacity</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {(shadowOpacity * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex gap-3 items-center">
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

          {/* Inset Toggle */}
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

          {/* Reset Button */}
          <Button
            variant="ghost"
            onClick={handleReset}
            className="w-full border"
          >
            Reset to Defaults
          </Button>
        </div>

        {/* Right: Preview & Code */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="rounded-lg border bg-card p-8">
            <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg">
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

          {/* CSS Output */}
          <TextAreaField
            label="CSS Code"
            value={cssCode}
            readOnly
            rows={3}
            action={
              <CopyButton
                value={cssCode}
                disabled={false}
              />
            }
          />

          {/* Additional Info */}
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground space-y-2">
            <div>
              <span className="font-medium">Format:</span>
              <p className="font-mono text-xs mt-1">box-shadow: [inset] X Y Blur Spread Color;</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
