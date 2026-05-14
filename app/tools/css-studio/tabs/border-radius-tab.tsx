"use client";

import { useMemo, useState } from "react";

import { Corners, PRESETS } from "@/app/tools/css-studio/border-radius-data";
import {
  buildCssBorderRadius,
  buildTailwindClass,
} from "@/app/tools/css-studio/border-radius-helpers";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/components/ui/slider-field";
import { Switch } from "@/components/ui/switch";

export function BorderRadiusTab() {
  const [linked, setLinked] = useState({
    tl: true,
    tr: true,
    br: true,
    bl: true,
  });
  const [corners, setCorners] = useState<Corners>({
    tl: { h: 8, v: 8 },
    tr: { h: 8, v: 8 },
    br: { h: 8, v: 8 },
    bl: { h: 8, v: 8 },
  });

  const derivedMode = Object.values(corners).some((c) => c.h !== c.v) ? "Advanced" : "Simple";

  const cssValue = useMemo(
    () => buildCssBorderRadius(corners, derivedMode),
    [corners, derivedMode],
  );
  const twClass = useMemo(() => buildTailwindClass(corners, derivedMode), [corners, derivedMode]);

  function setCorner(key: keyof Corners, axis: "h" | "v", value: number) {
    setCorners((prev) => {
      if (linked[key]) {
        return { ...prev, [key]: { h: value, v: value } };
      }
      return { ...prev, [key]: { ...prev[key], [axis]: value } };
    });
  }

  function toggleLink(key: keyof Corners) {
    setLinked((prev) => {
      const isNowLinked = !prev[key];
      if (isNowLinked) {
        setCorners((c) => ({ ...c, [key]: { h: c[key].h, v: c[key].h } }));
      }
      return { ...prev, [key]: isNowLinked };
    });
  }

  function applyPreset(preset: (typeof PRESETS)[0]) {
    setCorners(preset.corners);
    setLinked({
      tl: preset.corners.tl.h === preset.corners.tl.v,
      tr: preset.corners.tr.h === preset.corners.tr.v,
      br: preset.corners.br.h === preset.corners.br.v,
      bl: preset.corners.bl.h === preset.corners.bl.v,
    });
  }

  const cornerKeys: { key: keyof Corners; label: string }[] = [
    { key: "tl", label: "Top Left" },
    { key: "tr", label: "Top Right" },
    { key: "br", label: "Bottom Right" },
    { key: "bl", label: "Bottom Left" },
  ];

  const MAX = 160;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Presets</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant={preset.corners === corners ? "default" : "secondary"}
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Corners</Label>
          {cornerKeys.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`link-${key}`}
                    className="text-muted-foreground cursor-pointer text-xs"
                  >
                    {linked[key] ? "Linked" : "Split"}
                  </Label>
                  <Switch
                    id={`link-${key}`}
                    checked={linked[key]}
                    onCheckedChange={() => toggleLink(key)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(["h", "v"] as const).map((axis) => (
                  <SliderField
                    key={axis}
                    label={label}
                    labelClassName="text-xs"
                    valueLabel={axis === "h" ? "Horizontal" : "Vertical"}
                    valueLabelClassName="text-muted-foreground text-xs font-sans"
                    value={[Math.min(corners[key][axis], MAX)]}
                    showInput={true}
                    onValueChange={(vals) => setCorner(key, axis, vals[0])}
                    min={0}
                    max={MAX}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Live Preview</Label>
          <div className="border-border bg-muted/20 flex h-64 items-center justify-center rounded-xl border">
            <div
              className="bg-primary/40 border-primary h-40 w-64 border-2 transition-all duration-150"
              style={{ borderRadius: cssValue }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">CSS</Label>
            <CopyButton textToCopy={`border-radius: ${cssValue};`} />
          </div>
          <div className="bg-muted/40 border-border overflow-x-auto rounded-lg border px-4 py-3">
            <code className="text-primary font-mono text-sm">border-radius: {cssValue};</code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Tailwind CSS</Label>
            <CopyButton textToCopy={twClass} />
          </div>
          <div className="bg-muted/40 border-border overflow-x-auto rounded-lg border px-4 py-3">
            <code className="text-primary font-mono text-sm">{twClass}</code>
          </div>
        </div>

        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Corner Values
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {cornerKeys.map(({ key, label }) => (
              <div key={key} className="flex items-baseline justify-between gap-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">
                  {corners[key].h}px
                  {corners[key].h !== corners[key].v ? ` / ${corners[key].v}px` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
