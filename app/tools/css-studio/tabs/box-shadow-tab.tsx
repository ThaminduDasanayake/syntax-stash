"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ColorField } from "@/components/ui/color-field";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/components/ui/slider-field";
import { TextAreaField } from "@/components/ui/textarea-field";

export function BoxShadowTab() {
  const [xOffset, setXOffset] = useState(10);
  const [yOffset, setYOffset] = useState(10);
  const [blurRadius, setBlurRadius] = useState(5);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowOpacity, setShadowOpacity] = useState(0.75);
  const [shadowType, setShadowType] = useState("outset");

  const shadowString = useMemo(() => {
    const hex = shadowColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const insetStr = shadowType === "inset" ? "inset " : "";
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;

    return `${insetStr}${xOffset}px ${yOffset}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;
  }, [xOffset, yOffset, blurRadius, spreadRadius, shadowColor, shadowOpacity, shadowType]);

  const cssCode = `box-shadow: ${shadowString};`;

  const handleReset = () => {
    setXOffset(10);
    setYOffset(10);
    setBlurRadius(5);
    setSpreadRadius(0);
    setShadowColor("#000000");
    setShadowOpacity(0.75);
    setShadowType("outset");
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <SliderField
          label="X Offset"
          value={[xOffset]}
          showInput={true}
          onValueChange={(vals) => setXOffset(vals[0])}
          min={-50}
          max={50}
          suffix="px"
        />

        <SliderField
          label="Y Offset"
          value={[yOffset]}
          showInput={true}
          onValueChange={(vals) => setYOffset(vals[0])}
          min={-50}
          max={50}
          suffix="px"
        />

        <SliderField
          label="Blur Radius"
          value={[blurRadius]}
          showInput={true}
          onValueChange={(vals) => setBlurRadius(vals[0])}
          min={0}
          max={50}
          suffix="px"
        />

        <SliderField
          label="Spread Radius"
          value={[spreadRadius]}
          showInput={true}
          onValueChange={(vals) => setSpreadRadius(vals[0])}
          min={-20}
          max={20}
          suffix="px"
        />

        <ColorField
          label="Shadow Color"
          value={shadowColor}
          onValueChange={setShadowColor}
          className="w-fit"
        />

        <SliderField
          label="Opacity"
          value={[shadowOpacity]}
          valueLabel={`${shadowOpacity}%`}
          onValueChange={(vals) => setShadowOpacity(vals[0])}
          min={0}
          max={1}
          step={0.05}
          suffix="%"
        />

        <div className="space-y-2">
          <Label>Shadow Type</Label>
          <div className="flex justify-between space-y-2">
            <ButtonGroup>
              <Button
                variant={shadowType === "outset" ? "default" : "outline"}
                onClick={() => setShadowType("outset")}
              >
                Outset Shadow
              </Button>
              <Button
                variant={shadowType === "inset" ? "default" : "outline"}
                onClick={() => setShadowType("inset")}
              >
                Inset Shadow
              </Button>
            </ButtonGroup>

            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
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
          textClassName="resize-none text-xs!"
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
