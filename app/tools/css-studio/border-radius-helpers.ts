import { Corners, Mode } from "@/app/tools/css-studio/border-radius-data";

export function buildCssBorderRadius(corners: Corners, mode: Mode): string {
  const { bl, br, tl, tr } = corners;
  if (mode === "Simple") {
    const vals = [bl.h, br.h, tl.h, tr.h];
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

export function buildTailwindClass(corners: Corners, mode: Mode): string {
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
