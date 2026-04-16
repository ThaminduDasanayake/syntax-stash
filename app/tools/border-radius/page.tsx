"use client";

import { Check, Copy, Square } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type Corner = { h: number; v: number };
type Corners = { tl: Corner; tr: Corner; br: Corner; bl: Corner };
type Mode = "simple" | "advanced";

const PRESETS: { label: string; corners: Corners }[] = [
  {
    label: "None",
    corners: { tl: { h: 0, v: 0 }, tr: { h: 0, v: 0 }, br: { h: 0, v: 0 }, bl: { h: 0, v: 0 } },
  },
  {
    label: "Rounded",
    corners: { tl: { h: 8, v: 8 }, tr: { h: 8, v: 8 }, br: { h: 8, v: 8 }, bl: { h: 8, v: 8 } },
  },
  {
    label: "Large",
    corners: { tl: { h: 24, v: 24 }, tr: { h: 24, v: 24 }, br: { h: 24, v: 24 }, bl: { h: 24, v: 24 } },
  },
  {
    label: "Pill",
    corners: { tl: { h: 9999, v: 9999 }, tr: { h: 9999, v: 9999 }, br: { h: 9999, v: 9999 }, bl: { h: 9999, v: 9999 } },
  },
  {
    label: "Circle",
    corners: { tl: { h: 50, v: 50 }, tr: { h: 50, v: 50 }, br: { h: 50, v: 50 }, bl: { h: 50, v: 50 } },
  },
  {
    label: "Squircle",
    corners: { tl: { h: 30, v: 30 }, tr: { h: 30, v: 30 }, br: { h: 30, v: 30 }, bl: { h: 30, v: 30 } },
  },
  {
    label: "Blob",
    corners: { tl: { h: 30, v: 30 }, tr: { h: 70, v: 30 }, br: { h: 70, v: 70 }, bl: { h: 30, v: 70 } },
  },
  {
    label: "Notched",
    corners: { tl: { h: 0, v: 0 }, tr: { h: 48, v: 48 }, br: { h: 0, v: 0 }, bl: { h: 48, v: 48 } },
  },
];

function buildCssBorderRadius(corners: Corners, mode: Mode): string {
  const { tl, tr, br, bl } = corners;
  if (mode === "simple") {
    const vals = [tl.h, tr.h, br.h, bl.h];
    const unit = (v: number) => (v >= 9999 ? "9999px" : `${v}px`);
    if (vals.every((v) => v === vals[0])) return unit(vals[0]);
    return vals.map(unit).join(" ");
  }
  const unit = (v: number) => (v >= 9999 ? "9999px" : `${v}px`);
  const h = `${unit(tl.h)} ${unit(tr.h)} ${unit(br.h)} ${unit(bl.h)}`;
  const v = `${unit(tl.v)} ${unit(tr.v)} ${unit(br.v)} ${unit(bl.v)}`;
  if (h === v) {
    const vals = h.split(" ");
    if (vals.every((v) => v === vals[0])) return vals[0];
    return h;
  }
  return `${h} / ${v}`;
}

function buildTailwindClass(corners: Corners, mode: Mode): string {
  const val = buildCssBorderRadius(corners, mode);
  if (val === "0px" || val === "0") return "rounded-none";
  if (val === "9999px") return "rounded-full";
  if (val === "4px") return "rounded";
  if (val === "2px") return "rounded-sm";
  if (val === "6px") return "rounded-md";
  if (val === "8px") return "rounded-lg";
  if (val === "12px") return "rounded-xl";
  if (val === "16px") return "rounded-2xl";
  if (val === "24px") return "rounded-3xl";
  return `rounded-[${val}]`;
}

export default function BorderRadiusPage() {
  const [mode, setMode] = useState<Mode>("simple");
  const [corners, setCorners] = useState<Corners>({
    tl: { h: 8, v: 8 },
    tr: { h: 8, v: 8 },
    br: { h: 8, v: 8 },
    bl: { h: 8, v: 8 },
  });

  const { copied: copiedCss, copy: copyCss } = useCopyToClipboard();
  const { copied: copiedTw, copy: copyTw } = useCopyToClipboard();

  const cssValue = useMemo(() => buildCssBorderRadius(corners, mode), [corners, mode]);
  const twClass = useMemo(() => buildTailwindClass(corners, mode), [corners, mode]);

  function setCorner(key: keyof Corners, axis: "h" | "v", value: number) {
    setCorners((prev) => ({ ...prev, [key]: { ...prev[key], [axis]: value } }));
  }

  function applyPreset(preset: (typeof PRESETS)[0]) {
    setCorners(preset.corners);
    const isAdvanced = Object.values(preset.corners).some(
      (c) => c.h !== c.v,
    );
    if (!isAdvanced && mode === "advanced") setMode("simple");
  }

  const cornerKeys: { key: keyof Corners; label: string }[] = [
    { key: "tl", label: "Top Left" },
    { key: "tr", label: "Top Right" },
    { key: "br", label: "Bottom Right" },
    { key: "bl", label: "Bottom Left" },
  ];

  const MAX = 200;

  return (
    <ToolLayout
      icon={Square}
      title="Border Radius"
      highlight="Previewer"
      description="Visually configure CSS border-radius with per-corner sliders and preset shapes. Copy the CSS or Tailwind class."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Controls */}
        <div className="space-y-6">
          {/* Mode toggle */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Mode
            </Label>
            <div className="flex gap-2">
              {(["simple", "advanced"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    mode === m
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {mode === "advanced" && (
              <p className="text-muted-foreground text-xs">
                Set independent horizontal (H) and vertical (V) radii per corner.
              </p>
            )}
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Presets
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="rounded-full font-semibold"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Corner sliders */}
          <div className="space-y-4">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Corners
            </Label>
            {cornerKeys.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <p className="text-foreground text-xs font-medium">{label}</p>
                <div className="grid grid-cols-2 gap-3">
                  {(mode === "advanced" ? (["h", "v"] as const) : (["h"] as const)).map((axis) => (
                    <div key={axis} className="space-y-1.5">
                      {mode === "advanced" && (
                        <Label className="text-muted-foreground text-xs">
                          {axis === "h" ? "Horizontal" : "Vertical"}
                        </Label>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={MAX}
                          value={Math.min(corners[key][axis], MAX)}
                          onChange={(e) => setCorner(key, axis, parseInt(e.target.value))}
                          className="flex-1 accent-primary"
                        />
                        <Input
                          type="number"
                          min={0}
                          value={corners[key][axis]}
                          onChange={(e) => setCorner(key, axis, parseInt(e.target.value) || 0)}
                          className="w-16 font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Preview + Output */}
        <div className="space-y-6">
          {/* Live preview */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Live Preview
            </Label>
            <div className="border-border bg-muted/20 flex h-64 items-center justify-center rounded-xl border">
              <div
                className="bg-primary/20 border-primary/40 h-40 w-40 border-2 transition-all duration-150"
                style={{ borderRadius: cssValue }}
              />
            </div>
          </div>

          {/* CSS output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">CSS</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyCss(`border-radius: ${cssValue};`)}
                className="rounded-full font-semibold text-xs"
              >
                {copiedCss ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </Button>
            </div>
            <div
              className="bg-muted/40 border-border cursor-pointer overflow-x-auto rounded-lg border px-4 py-3"
              onClick={() => copyCss(`border-radius: ${cssValue};`)}
            >
              <code className="text-primary font-mono text-sm">
                border-radius: {cssValue};
              </code>
            </div>
          </div>

          {/* Tailwind output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Tailwind CSS</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyTw(twClass)}
                className="rounded-full font-semibold text-xs"
              >
                {copiedTw ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </Button>
            </div>
            <div
              className="bg-muted/40 border-border cursor-pointer overflow-x-auto rounded-lg border px-4 py-3"
              onClick={() => copyTw(twClass)}
            >
              <code className="text-primary font-mono text-sm">{twClass}</code>
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-border rounded-xl border p-4">
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Corner Values
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {cornerKeys.map(({ key, label }) => (
                <div key={key} className="flex items-baseline justify-between gap-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground">
                    {corners[key].h}px{mode === "advanced" && corners[key].h !== corners[key].v ? ` / ${corners[key].v}px` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
