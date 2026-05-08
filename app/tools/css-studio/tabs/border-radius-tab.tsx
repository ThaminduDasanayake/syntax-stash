"use client";

import { useMemo, useState } from "react";

import { Corners, Mode, PRESETS } from "@/app/tools/css-studio/border-radius-data";
import {
  buildCssBorderRadius,
  buildTailwindClass,
} from "@/app/tools/css-studio/border-radius-helpers";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function BorderRadiusTab() {
  const [mode, setMode] = useState<Mode>("Simple");
  const [corners, setCorners] = useState<Corners>({
    tl: { h: 8, v: 8 },
    tr: { h: 8, v: 8 },
    br: { h: 8, v: 8 },
    bl: { h: 8, v: 8 },
  });

  const cssValue = useMemo(() => buildCssBorderRadius(corners, mode), [corners, mode]);
  const twClass = useMemo(() => buildTailwindClass(corners, mode), [corners, mode]);

  function setCorner(key: keyof Corners, axis: "h" | "v", value: number) {
    setCorners((prev) => ({ ...prev, [key]: { ...prev[key], [axis]: value } }));
  }

  function applyPreset(preset: (typeof PRESETS)[0]) {
    setCorners(preset.corners);
    const isAdvanced = Object.values(preset.corners).some((c) => c.h !== c.v);
    if (!isAdvanced && mode === "Advanced") setMode("Simple");
  }

  const cornerKeys: { key: keyof Corners; label: string }[] = [
    { key: "tl", label: "Top Left" },
    { key: "tr", label: "Top Right" },
    { key: "br", label: "Bottom Right" },
    { key: "bl", label: "Bottom Left" },
  ];

  const MAX = 200;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Mode</Label>
          <div className="flex gap-2">
            {(["Simple", "Advanced"] as Mode[]).map((m) => (
              <Button
                key={m}
                onClick={() => setMode(m)}
                variant={mode === m ? "default" : "secondary"}
              >
                {m}
              </Button>
            ))}
          </div>
          {mode === "Advanced" && (
            <p className="text-muted-foreground text-xs">
              Set independent horizontal (H) and vertical (V) radii per corner.
            </p>
          )}
        </div>

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
              <p className="text-foreground text-xs font-medium">{label}</p>
              <div className="grid grid-cols-2 gap-3">
                {(mode === "Advanced" ? (["h", "v"] as const) : (["h"] as const)).map((axis) => (
                  <div key={axis} className="space-y-1.5">
                    {mode === "Advanced" && (
                      <Label className="text-muted-foreground text-xs">
                        {axis === "h" ? "Horizontal" : "Vertical"}
                      </Label>
                    )}
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[Math.min(corners[key][axis], MAX)]}
                        onValueChange={(vals) =>
                          setCorner(key, axis, Array.isArray(vals) ? vals[0] : vals)
                        }
                        min={1}
                        max={MAX}
                        step={1}
                        className="w-full"
                      />

                      <Input
                        min={0}
                        max={MAX}
                        value={corners[key][axis]}
                        onChange={(e) => {
                          const rawValue = e.target.value;

                          if (rawValue === "") {
                            setCorner(key, axis, 0);
                            return;
                          }

                          const parsedValue = parseInt(rawValue) || 0;
                          setCorner(key, axis, Math.min(MAX, parsedValue));
                        }}
                        className="w-14 text-center font-mono"
                      />
                    </div>
                  </div>
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
              className="bg-primary/40 border-primary h-40 w-40 border-2 transition-all duration-150"
              style={{ borderRadius: cssValue }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">CSS</Label>
            <CopyButton value={`border-radius: ${cssValue};`} />
          </div>
          <div className="bg-muted/40 border-border overflow-x-auto rounded-lg border px-4 py-3">
            <code className="text-primary font-mono text-sm">border-radius: {cssValue};</code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Tailwind CSS</Label>
            <CopyButton value={twClass} />
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
                  {mode === "Advanced" && corners[key].h !== corners[key].v
                    ? ` / ${corners[key].v}px`
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
