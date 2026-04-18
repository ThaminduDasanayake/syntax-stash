import chroma from "chroma-js";

export function formatRgb(c: chroma.Color) {
  const [r, g, b] = c.rgb();
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatDecimalRgb(c: chroma.Color) {
  const [r, g, b] = c.gl();
  return `rgb(${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)})`;
}

export function formatHsl(c: chroma.Color) {
  const [h, s, l] = c.hsl();
  const hh = Number.isNaN(h) ? 0 : Math.round(h);
  return `hsl(${hh.toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
}

export function formatLab(c: chroma.Color) {
  const [l, a, b] = c.lab();
  return `lab(${l.toFixed(4)} ${a.toFixed(4)} ${b.toFixed(4)})`;
}

export function formatLch(c: chroma.Color) {
  const [l, ch, h] = c.lch();
  const hh = Number.isNaN(h) ? 0 : h;
  return `lch(${l.toFixed(4)} ${ch.toFixed(4)} ${hh.toFixed(4)})`;
}

export function formatOklch(c: chroma.Color) {
  const [l, chr, h] = c.oklch();
  const hh = Number.isNaN(h) ? 0 : Number(h.toFixed(1));
  return `oklch(${l.toFixed(4)} ${chr.toFixed(4)} ${hh})`;
}

export function formatOklab(c: chroma.Color) {
  try {
    const oklabFn = (c as unknown as { oklab: () => [number, number, number] }).oklab;
    if (typeof oklabFn !== "function") return "N/A (Requires newer chroma-js)";

    const [l, a, b] = oklabFn.call(c);
    return `oklab(${l.toFixed(4)} ${a.toFixed(4)} ${b.toFixed(4)})`;
  } catch {
    return "N/A (Requires newer chroma-js)";
  }
}

export function parseColor(format: string, value: string): chroma.Color {
  const cleanValue = value.trim();
  if (!cleanValue) throw new Error("Empty value");

  // Handle OKLCH
  if (format === "OKLCH" || cleanValue.toLowerCase().startsWith("oklch")) {
    const m = cleanValue.match(/^oklch\s*\(\s*([\d.]+%?)\s+([\d.-]+)\s+([\d.-]+)\s*\)$/i);
    if (!m) throw new Error("Invalid OKLCH format");
    let l = parseFloat(m[1]);
    if (m[1].endsWith("%")) l = l / 100;
    return chroma.oklch(l, parseFloat(m[2]), parseFloat(m[3]));
  }

  // Handle Decimal RGB
  if (format === "DEC_RGB" && cleanValue.toLowerCase().startsWith("rgb")) {
    const m = cleanValue.match(/^rgb\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i);
    if (!m) throw new Error("Invalid Decimal RGB format");
    return chroma.gl(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }

  // Handle LAB
  if (format === "LAB" || cleanValue.toLowerCase().startsWith("lab")) {
    const m = cleanValue.match(/^lab\s*\(\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s*\)$/i);
    if (!m) throw new Error("Invalid LAB format");
    return chroma.lab(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }

  // Handle LCH
  if (format === "LCH" || cleanValue.toLowerCase().startsWith("lch")) {
    const m = cleanValue.match(/^lch\s*\(\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s*\)$/i);
    if (!m) throw new Error("Invalid LCH format");
    return chroma.lch(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }

  return chroma(cleanValue);
}
