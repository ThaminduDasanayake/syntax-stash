"use client";

import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ColorField } from "@/components/ui/color-field";
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
      {pass ? <CheckIcon weight="bold" /> : <XIcon weight="bold" />}
      {pass ? "Pass" : "Fail"}
    </Badge>
  );
}

export function ContrastTab() {
  const { resolvedTheme } = useTheme();
  const [prevTheme, setPrevTheme] = useState(resolvedTheme);
  const [fg, setFg] = useState("#3C402B");
  const [bg, setBg] = useState("#F7F5F1");

  if (resolvedTheme !== prevTheme) {
    setPrevTheme(resolvedTheme);

    if (resolvedTheme === "dark") {
      setBg("#F7F5F1");
      setFg("#3C402B");
    } else {
      setBg("#141312");
      setFg("#F7F5F1");
    }
  }

  const result = useMemo(() => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return null;
    const ratio = contrastRatio(relativeLuminance(fgRgb), relativeLuminance(bgRgb));
    return { ratio, wcag: evaluateWcag(ratio) };
  }, [fg, bg]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <ColorField label="Foreground Color" value={fg} onValueChange={setFg} />
        <ColorField label="Background Color" value={bg} onValueChange={setBg} />

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
              Small body text example — check readability at smaller sizes. WCAG defines &quot;large
              text&quot; as 18pt (24px) or 14pt bold (18.66px).
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
  );
}
