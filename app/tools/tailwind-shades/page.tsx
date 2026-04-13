"use client";

import chroma from "chroma-js";
import { ArrowLeft, Palette } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function generateShades(hex: string): { shade: number; hex: string }[] {
  const base = chroma(hex);
  return SHADES.map((shade) => {
    let color: chroma.Color;
    if (shade < 500) {
      const t = (500 - shade) / 500;
      color = chroma.mix(base, "white", t, "lab");
    } else if (shade > 500) {
      const t = (shade - 500) / 500;
      color = chroma.mix(base, "black", t, "lab");
    } else {
      color = base;
    }
    return { shade, hex: color.hex() };
  });
}

function isLight(hex: string): boolean {
  try {
    return chroma(hex).luminance() > 0.5;
  } catch {
    return false;
  }
}

export default function TailwindShadesPage() {
  const [baseColor, setBaseColor] = useState("#f97316");
  const [copiedShade, setCopiedShade] = useState<number | null>(null);

  const shades = useMemo(() => {
    try {
      return generateShades(baseColor);
    } catch {
      return [];
    }
  }, [baseColor]);

  function handleCopy(shade: number, hex: string) {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedShade(shade);
      setTimeout(() => setCopiedShade(null), 2000);
    });
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

        <div className="mb-10">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <Palette className="text-primary" size={36} />
            Tailwind <span className="text-primary">Shades</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Generate a full 50–950 Tailwind color scale from a single hex value.
          </p>
        </div>

        <div className="mb-8 max-w-xs space-y-2">
          <Label className="text-foreground">Base Color (Hex)</Label>
          <Input
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            placeholder="#f97316"
            className={inputClass}
          />
          {shades.length === 0 && baseColor.trim() && (
            <p className="text-destructive font-mono text-sm">Invalid hex value</p>
          )}
        </div>

        {shades.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {shades.map(({ shade, hex }) => {
              // const textColor = isLight(hex) ? "#000000" : "#ffffff";
              const isBase = shade === 500;
              const isCopied = copiedShade === shade;
              return (
                <button
                  key={shade}
                  onClick={() => handleCopy(shade, hex)}
                  className={`overflow-hidden rounded-xl border text-left transition-all hover:scale-105 active:scale-95 ${
                    isBase
                      ? "ring-primary ring-offset-background border-primary ring-2 ring-offset-2"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="h-20 w-full" style={{ backgroundColor: hex }} />
                  <div className="bg-card p-2">
                    <p className="text-foreground font-mono text-[11px] font-semibold">
                      {shade}
                      {isBase && <span className="text-primary ml-1 text-[9px]">base</span>}
                    </p>
                    <p className="text-muted-foreground truncate font-mono text-[10px]">
                      {isCopied ? "Copied!" : hex}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {shades.length > 0 && (
          <p className="text-muted-foreground mt-6 font-mono text-xs">
            Click any swatch to copy the hex value to clipboard.
          </p>
        )}
      </div>
    </div>
  );
}
