import chroma from "chroma-js";

export type PaletteColor = {
  hex: string;
  rgb: string;
  hsl: string;
};

export type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split-complementary"
  | "monochromatic";

export type Palette = {
  name: string;
  type: HarmonyType;
  colors: PaletteColor[];
};

function makePaletteColor(color: chroma.Color): PaletteColor {
  const [r, g, b] = color.rgb().map(Math.round);
  const [h, s, l] = color.hsl();
  const hh = Number.isNaN(h) ? 0 : Math.round(h);
  return {
    hex: color.hex(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${hh}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
  };
}

function rotateHue(base: chroma.Color, degrees: number): chroma.Color {
  const [h, s, l] = base.hsl();
  const safeH = Number.isNaN(h) ? 0 : h;
  return chroma.hsl(((safeH + degrees) % 360 + 360) % 360, s, l);
}

export function generatePalettes(baseHex: string): Palette[] {
  const base = chroma(baseHex);

  const complementary: Palette = {
    name: "Complementary",
    type: "complementary",
    colors: [base, rotateHue(base, 180)].map(makePaletteColor),
  };

  const analogous: Palette = {
    name: "Analogous",
    type: "analogous",
    colors: [rotateHue(base, -30), base, rotateHue(base, 30)].map(makePaletteColor),
  };

  const triadic: Palette = {
    name: "Triadic",
    type: "triadic",
    colors: [base, rotateHue(base, 120), rotateHue(base, 240)].map(makePaletteColor),
  };

  const splitComplementary: Palette = {
    name: "Split-Complementary",
    type: "split-complementary",
    colors: [base, rotateHue(base, 150), rotateHue(base, 210)].map(makePaletteColor),
  };

  const [h, s] = base.hsl();
  const safeH = Number.isNaN(h) ? 0 : h;
  const monoColors = chroma
    .scale([
      chroma.hsl(safeH, s, 0.15),
      base,
      chroma.hsl(safeH, Math.max(s - 0.1, 0.1), 0.92),
    ])
    .mode("lab")
    .colors(7)
    .slice(0, 7)
    .map((hex) => makePaletteColor(chroma(hex)));

  const monochromatic: Palette = {
    name: "Monochromatic",
    type: "monochromatic",
    colors: monoColors,
  };

  return [complementary, analogous, triadic, splitComplementary, monochromatic];
}

export function exportAsCssProperties(palettes: Palette[], name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-") || "color";
  const lines: string[] = [":root {"];
  for (const palette of palettes) {
    const key = palette.type;
    palette.colors.forEach((c, i) => {
      lines.push(`  --${slug}-${key}-${i + 1}: ${c.hex};`);
    });
  }
  lines.push("}");
  return lines.join("\n");
}

export function exportAsTailwindConfig(palettes: Palette[], name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-") || "color";
  const lines: string[] = [`  colors: {`, `    "${slug}": {`];
  for (const palette of palettes) {
    const key = palette.type;
    palette.colors.forEach((c, i) => {
      lines.push(`      "${key}-${i + 1}": "${c.hex}",`);
    });
  }
  lines.push(`    },`);
  lines.push(`  },`);
  return lines.join("\n");
}
