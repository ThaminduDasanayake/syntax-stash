"use client";

import { Check, Eye, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type WcagLevel = { normalAA: boolean; normalAAA: boolean; largeAA: boolean; largeAAA: boolean };

function evaluateWcag(ratio: number): WcagLevel {
  return {
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  };
}

function PassFail({ pass }: { pass: boolean }) {
  return (
    <Badge variant={pass ? "default" : "destructive"} className="gap-1">
      {pass ? <Check className="size-3" /> : <X className="size-3" />}
      {pass ? "Pass" : "Fail"}
    </Badge>
  );
}

export default function ContrastCheckerPage() {
  const [fg, setFg] = useState("#3c402b");
  const [bg, setBg] = useState("#eeeae3");

  const result = useMemo(() => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return null;
    const ratio = contrastRatio(relativeLuminance(fgRgb), relativeLuminance(bgRgb));
    return { ratio, wcag: evaluateWcag(ratio) };
  }, [fg, bg]);

  return (
    <ToolLayout
      icon={Eye}
      title="WCAG Contrast"
      highlight="Checker"
      description="Check foreground/background color contrast against WCAG 2.x accessibility standards."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Foreground Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-md border p-1"
              />
              <Input
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                maxLength={7}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-md border p-1"
              />
              <Input
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                maxLength={7}
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Ratio Display */}
          {result && (
            <Card>
              <CardContent>
                <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                  Contrast Ratio
                </p>
                <p className="text-primary font-mono text-4xl font-bold tabular-nums">
                  {result.ratio.toFixed(2)}
                  <span className="text-muted-foreground text-lg">:1</span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* WCAG Results */}
          {result && (
            <div className="space-y-3">
              <div className="border-border flex items-center justify-between rounded-lg border p-3">
                <span className="text-foreground text-sm font-medium">AA Normal Text</span>
                <PassFail pass={result.wcag.normalAA} />
              </div>
              <div className="border-border flex items-center justify-between rounded-lg border p-3">
                <span className="text-foreground text-sm font-medium">AA Large Text</span>
                <PassFail pass={result.wcag.largeAA} />
              </div>
              <div className="border-border flex items-center justify-between rounded-lg border p-3">
                <span className="text-foreground text-sm font-medium">AAA Normal Text</span>
                <PassFail pass={result.wcag.normalAAA} />
              </div>
              <div className="border-border flex items-center justify-between rounded-lg border p-3">
                <span className="text-foreground text-sm font-medium">AAA Large Text</span>
                <PassFail pass={result.wcag.largeAAA} />
              </div>
            </div>
          )}
        </div>

        {/* Right — Live Preview */}
        <div className="space-y-4">
          <Label>Live Preview</Label>
          <div className="overflow-hidden rounded-lg border" style={{ backgroundColor: bg }}>
            <div className="space-y-6 p-8">
              <h2 className="text-4xl font-bold tracking-tight" style={{ color: fg }}>
                Heading Text
              </h2>
              <p className="text-base leading-relaxed" style={{ color: fg }}>
                The quick brown fox jumps over the lazy dog. This sample paragraph demonstrates how
                body text appears at normal size with your chosen color combination.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: fg }}>
                Small body text example — check readability at smaller sizes. WCAG defines
                &quot;large text&quot; as 18pt (24px) or 14pt bold (18.66px).
              </p>
              <div className="flex items-center gap-4">
                <button
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{ backgroundColor: fg, color: bg }}
                >
                  Button
                </button>
                <a className="text-sm font-medium underline" style={{ color: fg }}>
                  Link text example
                </a>
              </div>
            </div>
          </div>
          {!result && (
            <p className="text-destructive font-mono text-sm">
              Enter valid 6-digit hex codes for both colors.
            </p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
