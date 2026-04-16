"use client";

import { Check, Copy, Ratio } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

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

function CodeBlock({ label, code, onCopy, copied }: {
  label: string;
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {label}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="rounded-full font-semibold"
        >
          {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
        </Button>
      </div>
      <pre className="bg-muted text-foreground rounded-lg border border-border px-4 py-3 font-mono text-sm">
        {code}
      </pre>
    </div>
  );
}

export default function AspectRatioPage() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const { copied: copiedCss, copy: copyCss } = useCopyToClipboard();
  const { copied: copiedTw, copy: copyTw } = useCopyToClipboard();
  const { copied: copiedLegacy, copy: copyLegacy } = useCopyToClipboard();

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
    <ToolLayout
      icon={Ratio}
      title="Aspect Ratio"
      highlight="Calculator"
      description="Calculate CSS aspect-ratio, Tailwind utility, and legacy padding-bottom values for any dimensions."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Presets
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(p.w, p.h)}
                  className="rounded-full font-semibold"
                >
                  {p.label}
                </Button>
              ))}
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

          <Card>
            <CardContent>
              <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                Simplified Ratio
              </p>
              <p className="text-primary font-mono text-4xl font-bold">
                {computed.rw}:{computed.rh}
              </p>
              <p className="text-muted-foreground mt-1 font-mono text-sm">
                {width} × {height} px · padding {computed.paddingPct}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right — Output */}
        <div className="space-y-6">
          {/* Visual preview */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Preview
            </Label>
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4">
              <div
                className="bg-primary/10 border-primary/40 flex items-center justify-center rounded border font-mono text-sm text-primary"
                style={{
                  aspectRatio: `${width} / ${height}`,
                  width: "100%",
                  maxWidth: height > width ? "160px" : "100%",
                  maxHeight: "220px",
                  objectFit: "contain",
                }}
              >
                {computed.rw}:{computed.rh}
              </div>
            </div>
          </div>

          <CodeBlock
            label="CSS aspect-ratio"
            code={computed.css}
            onCopy={() => copyCss(computed.css)}
            copied={copiedCss}
          />
          <CodeBlock
            label="Tailwind CSS"
            code={computed.tailwind}
            onCopy={() => copyTw(computed.tailwind)}
            copied={copiedTw}
          />
          <CodeBlock
            label="Legacy padding-bottom hack"
            code={computed.legacy}
            onCopy={() => copyLegacy(computed.legacy)}
            copied={copiedLegacy}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
