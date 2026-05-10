"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const PRESETS: { label: string; w: number; h: number }[] = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "21:9", w: 21, h: 9 },
  { label: "9:16", w: 9, h: 16 },
];

export function AspectRatioTab() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const computed = useMemo(() => {
    const w = Math.max(1, width);
    const h = Math.max(1, height);
    const d = gcd(w, h);
    const rw = w / d;
    const rh = h / d;
    const paddingPct = ((h / w) * 100).toFixed(4);

    const css = `aspect-ratio: ${rw} / ${rh};`;
    const tailwind = `aspect-[${rw}/${rh}]`;
    const legacy = `.container {\n  position: relative;\n  width: 100%;\n  padding-bottom: ${paddingPct}%;\n}\n.container > * {\n  position: absolute;\n  inset: 0;\n}`;

    return { rw, rh, paddingPct, css, tailwind, legacy };
  }, [width, height]);

  function applyPreset(w: number, h: number) {
    setWidth(w);
    setHeight(h);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Presets</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = width === p.w && height === p.h;
              return (
                <Button
                  key={p.label}
                  variant={active ? "default" : "secondary"}
                  size="sm"
                  onClick={() => applyPreset(p.w, p.h)}
                >
                  {p.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Width</Label>
            <Input
              type="number"
              min={1}
              value={width}
              onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              type="number"
              min={1}
              value={height}
              onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>

        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
            Simplified Ratio
          </p>
          <p className="text-primary font-mono text-4xl font-bold">
            {computed.rw}:{computed.rh}
          </p>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            {width} × {height} px · padding {computed.paddingPct}%
          </p>
        </div>
      </div>

      {/* Preview + Output */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Live Preview</Label>
          <div className="border-border bg-muted/20 flex h-64 items-center justify-center rounded-xl border p-4">
            <div
              className="bg-primary/40 border-primary text-primary flex items-center justify-center rounded border-2 font-mono text-sm transition-all duration-150"
              style={{
                aspectRatio: `${width} / ${height}`,
                width: "100%",
                maxWidth: height > width ? "140px" : "100%",
                maxHeight: "220px",
              }}
            >
              {computed.rw}:{computed.rh}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">CSS</Label>
            <CopyButton textToCopy={computed.css} />
          </div>
          <div className="bg-muted/40 border-border overflow-x-auto rounded-lg border px-4 py-3">
            <code className="text-primary font-mono text-sm">{computed.css}</code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Tailwind CSS</Label>
            <CopyButton textToCopy={computed.tailwind} />
          </div>
          <div className="bg-muted/40 border-border overflow-x-auto rounded-lg border px-4 py-3">
            <code className="text-primary font-mono text-sm">{computed.tailwind}</code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Legacy padding-bottom hack</Label>
            <CopyButton textToCopy={computed.legacy} />
          </div>
          <pre className="bg-muted/40 border-border overflow-x-auto rounded-lg border px-4 py-3 font-mono text-xs">
            <code className="text-primary">{computed.legacy}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
