"use client";

import chroma from "chroma-js";
import { ArrowLeft, Palette } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorField } from "@/types";

function formatRgb(c: chroma.Color) {
  const [r, g, b] = c.rgb();
  return `rgb(${r}, ${g}, ${b})`;
}

function formatHsl(c: chroma.Color) {
  const [h, s, l] = c.hsl();
  const hh = Number.isNaN(h) ? 0 : Math.round(h);
  return `hsl(${hh}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function formatOklch(c: chroma.Color) {
  const [l, chr, h] = c.oklch();
  const hh = Number.isNaN(h) ? 0 : Number(h.toFixed(1));
  return `oklch(${l.toFixed(3)} ${chr.toFixed(3)} ${hh})`;
}

function parseColor(field: ColorField, value: string): chroma.Color {
  if (field === "oklch") {
    const m = value.trim().match(/^oklch\s*\(\s*([\d.]+%?)\s+([\d.]+)\s+(-?[\d.]+)\s*\)$/i);
    if (!m) throw new Error("Invalid OKLCH format");
    let l = parseFloat(m[1]);
    if (m[1].endsWith("%")) l = l / 100;
    const c = parseFloat(m[2]);
    const h = parseFloat(m[3]);
    return chroma.oklch(l, c, h);
  }
  return chroma(value);
}

export default function ColorConverterPage() {
  const initial = chroma("#f97316");
  const [hex, setHex] = useState(initial.hex());
  const [rgb, setRgb] = useState(formatRgb(initial));
  const [hsl, setHsl] = useState(formatHsl(initial));
  const [oklch, setOklch] = useState(formatOklch(initial));
  const [preview, setPreview] = useState(initial.hex());
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: ColorField, value: string) {
    if (field === "hex") setHex(value);
    if (field === "rgb") setRgb(value);
    if (field === "hsl") setHsl(value);
    if (field === "oklch") setOklch(value);

    try {
      const c = parseColor(field, value);
      if (field !== "hex") setHex(c.hex());
      if (field !== "rgb") setRgb(formatRgb(c));
      if (field !== "hsl") setHsl(formatHsl(c));
      if (field !== "oklch") setOklch(formatOklch(c));
      setPreview(c.hex());
      setError(null);
    } catch {
      setError(`Invalid ${field.toUpperCase()} value`);
    }
  }

  const inputClass =
    "h-10 bg-background border-border text-foreground font-mono placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30";

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <Palette className="text-primary" size={36} />
            Color <span className="text-primary">Converter</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Convert colors between HEX, RGB, HSL, and OKLCH in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground">HEX</Label>
              <Input
                value={hex}
                onChange={(e) => handleChange("hex", e.target.value)}
                placeholder="#f97316"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">RGB</Label>
              <Input
                value={rgb}
                onChange={(e) => handleChange("rgb", e.target.value)}
                placeholder="rgb(249, 115, 22)"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">HSL</Label>
              <Input
                value={hsl}
                onChange={(e) => handleChange("hsl", e.target.value)}
                placeholder="hsl(25, 95%, 53%)"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">OKLCH</Label>
              <Input
                value={oklch}
                onChange={(e) => handleChange("oklch", e.target.value)}
                placeholder="oklch(0.671 0.137 48.5)"
                className={inputClass}
              />
            </div>
            {error && <p className="text-destructive font-mono text-sm">{error}</p>}
          </div>

          {/* Right — live preview */}
          <div className="flex flex-col gap-4">
            <Label className="text-foreground">Preview</Label>
            <div
              className="border-border h-full min-h-[300px] rounded-xl border shadow-lg transition-colors duration-150"
              style={{ backgroundColor: preview }}
            />
            <p className="text-muted-foreground text-center font-mono text-xs">{preview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
