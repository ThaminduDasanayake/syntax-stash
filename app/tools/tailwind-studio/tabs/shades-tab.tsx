"use client";

import chroma from "chroma-js";
import { useMemo, useState } from "react";

import ExportBlock from "@/app/tools/tailwind-studio/export-block";
import ShadeButton from "@/app/tools/tailwind-studio/shade-button";
import { ColorField } from "@/components/ui/color-field";
import { InputField } from "@/components/ui/input-field";

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function generateShades(hex: string): { shade: number; hex: string; oklch: string }[] {
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

    const [l, c, h] = color.oklch();
    const formattedOklch = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${(h || 0).toFixed(1)})`;

    return { hex: color.hex(), oklch: formattedOklch, shade };
  });
}

export function ShadesTab() {
  const [baseColor, setBaseColor] = useState("#c4e456");
  const [colorName, setColorName] = useState("primary");

  const shades = useMemo(() => {
    try {
      return generateShades(baseColor);
    } catch {
      return [];
    }
  }, [baseColor]);

  const cssVariables = useMemo(() => {
    if (!shades.length) return "";
    const vars = shades.map((s) => `  --${colorName}-${s.shade}: ${s.hex};`).join("\n");
    return `:root {\n${vars}\n}`;
  }, [colorName, shades]);

  const cssVariablesOklch = useMemo(() => {
    if (!shades.length) return "";
    const vars = shades.map((s) => `  --${colorName}-${s.shade}: ${s.oklch};`).join("\n");
    return `:root {\n${vars}\n}`;
  }, [colorName, shades]);

  const tailwindConfig = useMemo(() => {
    if (!shades.length) return "";
    const vars = shades.map((s) => `    ${s.shade}: '${s.hex}',`).join("\n");
    return `  ${colorName}: {\n${vars}\n  },`;
  }, [colorName, shades]);

  return (
    <div>
      <div className="mb-8 grid max-w-lg grid-cols-1 gap-10 sm:grid-cols-2">
        <ColorField label="Base Color" value={baseColor} onValueChange={setBaseColor} />

        <InputField
          label="Color Name"
          value={colorName}
          onChange={(e) => setColorName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          placeholder="primary"
        />
      </div>

      {shades.length > 0 && (
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {shades.map(({ hex, shade }) => (
            <ShadeButton key={shade} shade={shade} hex={hex} />
          ))}
        </div>
      )}

      {shades.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-foreground text-lg font-semibold tracking-tight">Export Code</h3>
          <ExportBlock title="CSS Variables" code={cssVariables} />
          <ExportBlock title="CSS Variables (OKLCH)" code={cssVariablesOklch} />
          <ExportBlock title="Tailwind Config" code={tailwindConfig} />
        </div>
      )}
    </div>
  );
}
