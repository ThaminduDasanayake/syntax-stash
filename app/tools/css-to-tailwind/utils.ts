// Spacing scale: px value → Tailwind number (1 unit = 4px)
const SPACING_MAP: Record<number, string> = {
  0: "0",
  1: "px",
  2: "0.5",
  4: "1",
  6: "1.5",
  8: "2",
  10: "2.5",
  12: "3",
  14: "3.5",
  16: "4",
  20: "5",
  24: "6",
  28: "7",
  32: "8",
  36: "9",
  40: "10",
  44: "11",
  48: "12",
  56: "14",
  64: "16",
  80: "20",
  96: "24",
  112: "28",
  128: "32",
  144: "36",
  160: "40",
  176: "44",
  192: "48",
  208: "52",
  224: "56",
  240: "60",
  256: "64",
  288: "72",
  320: "80",
  384: "96",
};

function spacingClass(px: number, prefix: string): string {
  if (px in SPACING_MAP) return `${prefix}-${SPACING_MAP[px]}`;
  return `${prefix}-[${px}px]`;
}

function pxValue(val: string): number | null {
  const m = val.match(/^(-?\d*\.?\d+)px$/);
  return m ? parseFloat(m[1]) : null;
}

function remValue(val: string): number | null {
  const m = val.match(/^(-?\d*\.?\d+)rem$/);
  return m ? parseFloat(m[1]) * 16 : null;
}

function toPx(val: string): number | null {
  return pxValue(val) ?? remValue(val);
}

// Font-size map: px → Tailwind class suffix
const FONT_SIZE_MAP: Record<number, string> = {
  10: "xs",
  12: "xs",
  14: "sm",
  16: "base",
  18: "lg",
  20: "xl",
  24: "2xl",
  30: "3xl",
  36: "4xl",
  48: "5xl",
  60: "6xl",
  72: "7xl",
  96: "8xl",
  128: "9xl",
};

// Font-weight map
const FONT_WEIGHT_MAP: Record<string, string> = {
  "100": "font-thin",
  "200": "font-extralight",
  "300": "font-light",
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
  "800": "font-extrabold",
  "900": "font-black",
  black: "font-black",
  bold: "font-bold",
  extrabold: "font-extrabold",
  extralight: "font-extralight",
  light: "font-light",
  medium: "font-medium",
  normal: "font-normal",
  semibold: "font-semibold",
  thin: "font-thin",
};

// Line-height
const LINE_HEIGHT_MAP: Record<string, string> = {
  "1": "leading-none",
  "1.25": "leading-tight",
  "1.375": "leading-snug",
  "1.5": "leading-normal",
  "1.625": "leading-relaxed",
  "2": "leading-loose",
};

// Letter-spacing
const LETTER_SPACING_MAP: Record<string, string> = {
  "-0.05em": "tracking-tighter",
  "-0.025em": "tracking-tight",
  "0": "tracking-normal",
  "0em": "tracking-normal",
  "0.025em": "tracking-wide",
  "0.05em": "tracking-wider",
  "0.1em": "tracking-widest",
};

// Border-radius
const BORDER_RADIUS_MAP: Record<string, string> = {
  "0": "rounded-none",
  "0px": "rounded-none",
  "2px": "rounded-sm",
  "4px": "rounded",
  "6px": "rounded-md",
  "8px": "rounded-lg",
  "12px": "rounded-xl",
  "16px": "rounded-2xl",
  "24px": "rounded-3xl",
  "50%": "rounded-full",
  "9999px": "rounded-full",
};

// Display
const DISPLAY_MAP: Record<string, string> = {
  block: "block",
  contents: "contents",
  flex: "flex",
  grid: "grid",
  inline: "inline",
  "inline-block": "inline-block",
  "inline-flex": "inline-flex",
  "inline-grid": "inline-grid",
  "list-item": "list-item",
  none: "hidden",
};

// Position
const POSITION_MAP: Record<string, string> = {
  absolute: "absolute",
  fixed: "fixed",
  relative: "relative",
  static: "static",
  sticky: "sticky",
};

// Overflow
const OVERFLOW_MAP: Record<string, string> = {
  auto: "overflow-auto",
  clip: "overflow-clip",
  hidden: "overflow-hidden",
  scroll: "overflow-scroll",
  visible: "overflow-visible",
};

// Text-align
const TEXT_ALIGN_MAP: Record<string, string> = {
  center: "text-center",
  end: "text-end",
  justify: "text-justify",
  left: "text-left",
  right: "text-right",
  start: "text-start",
};

// Flex-direction
const FLEX_DIR_MAP: Record<string, string> = {
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
};

// Justify-content
const JUSTIFY_MAP: Record<string, string> = {
  center: "justify-center",
  "flex-end": "justify-end",
  "flex-start": "justify-start",
  normal: "justify-normal",
  "space-around": "justify-around",
  "space-between": "justify-between",
  "space-evenly": "justify-evenly",
  stretch: "justify-stretch",
};

// Align-items
const ALIGN_ITEMS_MAP: Record<string, string> = {
  baseline: "items-baseline",
  center: "items-center",
  "flex-end": "items-end",
  "flex-start": "items-start",
  stretch: "items-stretch",
};

// Cursor
const CURSOR_MAP: Record<string, string> = {
  auto: "cursor-auto",
  crosshair: "cursor-crosshair",
  default: "cursor-default",
  grab: "cursor-grab",
  grabbing: "cursor-grabbing",
  move: "cursor-move",
  "not-allowed": "cursor-not-allowed",
  pointer: "cursor-pointer",
  text: "cursor-text",
  wait: "cursor-wait",
  zoom_in: "cursor-zoom-in",
};

// Text-decoration
const TEXT_DECO_MAP: Record<string, string> = {
  "line-through": "line-through",
  none: "no-underline",
  overline: "overline",
  underline: "underline",
};

// Text-transform
const TEXT_TRANSFORM_MAP: Record<string, string> = {
  capitalize: "capitalize",
  lowercase: "lowercase",
  none: "normal-case",
  uppercase: "uppercase",
};

// Font-style
const FONT_STYLE_MAP: Record<string, string> = {
  italic: "italic",
  normal: "not-italic",
};

// Flex-wrap
const FLEX_WRAP_MAP: Record<string, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

// Align-self
const ALIGN_SELF_MAP: Record<string, string> = {
  auto: "self-auto",
  baseline: "self-baseline",
  center: "self-center",
  "flex-end": "self-end",
  "flex-start": "self-start",
  stretch: "self-stretch",
};

// Justify-self
const JUSTIFY_SELF_MAP: Record<string, string> = {
  auto: "justify-self-auto",
  center: "justify-self-center",
  end: "justify-self-end",
  start: "justify-self-start",
  stretch: "justify-self-stretch",
};

// White-space
const WHITE_SPACE_MAP: Record<string, string> = {
  "break-spaces": "whitespace-break-spaces",
  normal: "whitespace-normal",
  nowrap: "whitespace-nowrap",
  pre: "whitespace-pre",
  "pre-line": "whitespace-pre-line",
  "pre-wrap": "whitespace-pre-wrap",
};

// Visibility
const VISIBILITY_MAP: Record<string, string> = {
  collapse: "collapse",
  hidden: "invisible",
  visible: "visible",
};

// Box-sizing
const BOX_SIZING_MAP: Record<string, string> = {
  "border-box": "box-border",
  "content-box": "box-content",
};

// Pointer-events
const POINTER_EVENTS_MAP: Record<string, string> = {
  auto: "pointer-events-auto",
  none: "pointer-events-none",
};

// User-select
const USER_SELECT_MAP: Record<string, string> = {
  all: "select-all",
  auto: "select-auto",
  none: "select-none",
  text: "select-text",
};

// Vertical-align
const VERTICAL_ALIGN_MAP: Record<string, string> = {
  baseline: "align-baseline",
  bottom: "align-bottom",
  middle: "align-middle",
  sub: "align-sub",
  super: "align-super",
  "text-bottom": "align-text-bottom",
  "text-top": "align-text-top",
  top: "align-top",
};

// Aspect-ratio
const ASPECT_RATIO_MAP: Record<string, string> = {
  "1 / 1": "aspect-square",
  "1/1": "aspect-square",
  "16 / 9": "aspect-video",
  "16/9": "aspect-video",
  auto: "aspect-auto",
};

function mapSpacingShorthand(
  val: string,
  prefixes: [string, string, string, string], // [top, right, bottom, left]
): string[] {
  const parts = val.trim().split(/\s+/);
  if (parts.length === 1) {
    const px = toPx(parts[0]);
    if (px !== null) return [spacingClass(px, prefixes[0].replace(/-([trblxy])?$/, ""))];
  }

  const mapped: string[] = [];
  const topPx = toPx(parts[0]);
  const rightPx = toPx(parts[1] ?? parts[0]);
  const bottomPx = toPx(parts[2] ?? parts[0]);
  const leftPx = toPx(parts[3] ?? parts[1] ?? parts[0]);

  if (topPx !== null) mapped.push(spacingClass(topPx, prefixes[0]));
  if (rightPx !== null) mapped.push(spacingClass(rightPx, prefixes[1]));
  if (bottomPx !== null) mapped.push(spacingClass(bottomPx, prefixes[2]));
  if (leftPx !== null) mapped.push(spacingClass(leftPx, prefixes[3]));

  return mapped;
}

export interface ConvertResult {
  classes: string[];
  unhandled: string[];
}

function mapDeclaration(prop: string, val: string): { handled: string[] | null } {
  const v = val.trim().toLowerCase();
  const vRaw = val.trim();

  // Margin shorthand
  if (prop === "margin") {
    return { handled: mapSpacingShorthand(vRaw, ["mb", "ml", "mr", "mt"]) };
  }
  if (prop === "padding") {
    return { handled: mapSpacingShorthand(vRaw, ["pb", "pl", "pr", "pt"]) };
  }

  // Individual spacing
  const spacingProps: Record<string, string> = {
    bottom: "bottom",
    "column-gap": "gap-x",
    "flex-basis": "basis",
    gap: "gap",
    height: "h",
    left: "left",
    "margin-bottom": "mb",
    "margin-left": "ml",
    "margin-right": "mr",
    "margin-top": "mt",
    "max-height": "max-h",
    "max-width": "max-w",
    "min-height": "min-h",
    "min-width": "min-w",
    "padding-bottom": "pb",
    "padding-left": "pl",
    "padding-right": "pr",
    "padding-top": "pt",
    right: "right",
    "row-gap": "gap-y",
    top: "top",
    width: "w",
  };
  if (prop in spacingProps) {
    if (v === "auto") return { handled: [`${spacingProps[prop]}-auto`] };
    if (v === "full" || v === "100%") return { handled: [`${spacingProps[prop]}-full`] };
    if (v === "screen" || (prop.includes("width") && v === "100vw"))
      return { handled: [`${spacingProps[prop]}-screen`] };
    if (v === "fit-content") return { handled: [`${spacingProps[prop]}-fit`] };
    if (v === "min-content") return { handled: [`${spacingProps[prop]}-min`] };
    if (v === "max-content") return { handled: [`${spacingProps[prop]}-max`] };
    const px = toPx(vRaw);
    if (px !== null) return { handled: [spacingClass(px, spacingProps[prop])] };
    const pct = vRaw.match(/^(\d*\.?\d+)%$/);
    if (pct) return { handled: [`${spacingProps[prop]}-[${vRaw}]`] };
    return { handled: [`${spacingProps[prop]}-[${vRaw}]`] };
  }

  // Font-size
  if (prop === "font-size") {
    const px = toPx(vRaw);
    if (px !== null && px in FONT_SIZE_MAP) return { handled: [`text-${FONT_SIZE_MAP[px]}`] };
    if (px !== null) return { handled: [`text-[${px}px]`] };
    return { handled: [`text-[${vRaw}]`] };
  }

  // Font-weight
  if (prop === "font-weight") {
    return { handled: [FONT_WEIGHT_MAP[v] ?? `font-[${vRaw}]`] };
  }

  // Font-family
  if (prop === "font-family") {
    if (v.includes("sans-serif")) return { handled: ["font-sans"] };
    if (v.includes("serif")) return { handled: ["font-serif"] };
    if (v.includes("mono") || v.includes("courier") || v.includes("console"))
      return { handled: ["font-mono"] };
    return { handled: [`font-[${vRaw.replace(/\s/g, "_")}]`] };
  }

  // Line-height
  if (prop === "line-height") {
    if (v in LINE_HEIGHT_MAP) return { handled: [LINE_HEIGHT_MAP[v]] };
    const px = toPx(vRaw);
    if (px !== null) return { handled: [`leading-[${px}px]`] };
    return { handled: [`leading-[${vRaw}]`] };
  }

  // Letter-spacing
  if (prop === "letter-spacing") {
    return { handled: [LETTER_SPACING_MAP[v] ?? `tracking-[${vRaw}]`] };
  }

  // Border-radius
  if (prop === "border-radius") {
    return { handled: [BORDER_RADIUS_MAP[v] ?? BORDER_RADIUS_MAP[vRaw] ?? `rounded-[${vRaw}]`] };
  }

  // Colors (background-color, color)
  if (prop === "color") {
    return { handled: [`text-[${vRaw}]`] };
  }
  if (prop === "background-color" || prop === "background") {
    if (v === "transparent") return { handled: ["bg-transparent"] };
    if (v === "currentcolor") return { handled: ["bg-current"] };
    return { handled: [`bg-[${vRaw}]`] };
  }

  // Display
  if (prop === "display") return { handled: [DISPLAY_MAP[v] ?? null].filter(Boolean) as string[] };

  // Position
  if (prop === "position")
    return { handled: [POSITION_MAP[v] ?? null].filter(Boolean) as string[] };

  // Overflow
  if (prop === "overflow")
    return { handled: [OVERFLOW_MAP[v] ? OVERFLOW_MAP[v] : null].filter(Boolean) as string[] };
  if (prop === "overflow-x") {
    const c = OVERFLOW_MAP[v];
    return { handled: c ? [c.replace("overflow-", "overflow-x-")] : null };
  }
  if (prop === "overflow-y") {
    const c = OVERFLOW_MAP[v];
    return { handled: c ? [c.replace("overflow-", "overflow-y-")] : null };
  }

  // Text-align
  if (prop === "text-align")
    return { handled: [TEXT_ALIGN_MAP[v] ?? null].filter(Boolean) as string[] };

  // Flex
  if (prop === "flex-direction")
    return { handled: [FLEX_DIR_MAP[v] ?? null].filter(Boolean) as string[] };
  if (prop === "justify-content")
    return { handled: [JUSTIFY_MAP[v] ?? null].filter(Boolean) as string[] };
  if (prop === "align-items")
    return { handled: [ALIGN_ITEMS_MAP[v] ?? null].filter(Boolean) as string[] };
  if (prop === "align-self")
    return { handled: [ALIGN_SELF_MAP[v] ?? null].filter(Boolean) as string[] };
  if (prop === "justify-self")
    return { handled: [JUSTIFY_SELF_MAP[v] ?? null].filter(Boolean) as string[] };
  if (prop === "flex-wrap")
    return { handled: [FLEX_WRAP_MAP[v] ?? null].filter(Boolean) as string[] };
  if (prop === "flex") {
    if (v === "1 1 0%" || v === "1") return { handled: ["flex-1"] };
    if (v === "1 1 auto") return { handled: ["flex-auto"] };
    if (v === "0 1 auto") return { handled: ["flex-initial"] };
    if (v === "none") return { handled: ["flex-none"] };
    return { handled: [`flex-[${vRaw}]`] };
  }
  if (prop === "flex-grow") {
    if (v === "0") return { handled: ["grow-0"] };
    if (v === "1") return { handled: ["grow"] };
    return { handled: [`grow-[${vRaw}]`] };
  }
  if (prop === "flex-shrink") {
    if (v === "0") return { handled: ["shrink-0"] };
    if (v === "1") return { handled: ["shrink"] };
    return { handled: [`shrink-[${vRaw}]`] };
  }

  // Opacity
  if (prop === "opacity") {
    const n = parseFloat(vRaw);
    if (!isNaN(n)) {
      const pct = Math.round(n <= 1 ? n * 100 : n);
      return { handled: [`opacity-${pct}`] };
    }
  }

  // Z-index
  if (prop === "z-index") {
    if (v === "auto") return { handled: ["z-auto"] };
    const n = parseInt(v);
    if ([0, 10, 20, 30, 40, 50].includes(n)) return { handled: [`z-${n}`] };
    return { handled: [`z-[${vRaw}]`] };
  }

  // Cursor
  if (prop === "cursor") return { handled: [CURSOR_MAP[v] ?? `cursor-[${vRaw}]`] };

  // Text-decoration
  if (prop === "text-decoration" || prop === "text-decoration-line")
    return { handled: [TEXT_DECO_MAP[v] ?? null].filter(Boolean) as string[] };

  // Text-transform
  if (prop === "text-transform")
    return { handled: [TEXT_TRANSFORM_MAP[v] ?? null].filter(Boolean) as string[] };

  // Font-style
  if (prop === "font-style")
    return { handled: [FONT_STYLE_MAP[v] ?? null].filter(Boolean) as string[] };

  // White-space
  if (prop === "white-space")
    return { handled: [WHITE_SPACE_MAP[v] ?? null].filter(Boolean) as string[] };

  // Visibility
  if (prop === "visibility")
    return { handled: [VISIBILITY_MAP[v] ?? null].filter(Boolean) as string[] };

  // Box-sizing
  if (prop === "box-sizing")
    return { handled: [BOX_SIZING_MAP[v] ?? null].filter(Boolean) as string[] };

  // Pointer-events
  if (prop === "pointer-events")
    return { handled: [POINTER_EVENTS_MAP[v] ?? null].filter(Boolean) as string[] };

  // User-select
  if (prop === "user-select" || prop === "-webkit-user-select")
    return { handled: [USER_SELECT_MAP[v] ?? null].filter(Boolean) as string[] };

  // Vertical-align
  if (prop === "vertical-align") return { handled: [VERTICAL_ALIGN_MAP[v] ?? `align-[${vRaw}]`] };

  // Aspect-ratio
  if (prop === "aspect-ratio") {
    const norm = v.replace(/\s/g, " ");
    return { handled: [ASPECT_RATIO_MAP[norm] ?? `aspect-[${vRaw.replace(/\s/g, "")}]`] };
  }

  // Border
  if (prop === "border") {
    if (v === "none" || v === "0") return { handled: ["border-0"] };
    if (v === "1px solid") return { handled: ["border"] };
    return { handled: [`border border-[${vRaw}]`] };
  }
  if (prop === "border-width") {
    const px = toPx(vRaw);
    if (px === 0) return { handled: ["border-0"] };
    if (px === 1) return { handled: ["border"] };
    if (px === 2) return { handled: ["border-2"] };
    if (px === 4) return { handled: ["border-4"] };
    if (px === 8) return { handled: ["border-8"] };
    if (px !== null) return { handled: [`border-[${px}px]`] };
  }
  if (prop === "border-color") return { handled: [`border-[${vRaw}]`] };
  if (prop === "border-style") {
    const styleMap: Record<string, string> = {
      dashed: "border-dashed",
      dotted: "border-dotted",
      double: "border-double",
      hidden: "border-hidden",
      none: "border-none",
      solid: "border-solid",
    };
    return { handled: [styleMap[v] ?? null].filter(Boolean) as string[] };
  }

  // Box-shadow
  if (prop === "box-shadow") {
    if (v === "none") return { handled: ["shadow-none"] };
    if (v.includes("0 1px 3px") || v.includes("0 1px 2px")) return { handled: ["shadow-sm"] };
    if (v.includes("0 4px 6px")) return { handled: ["shadow"] };
    if (v.includes("0 10px 15px")) return { handled: ["shadow-md"] };
    if (v.includes("0 20px 25px")) return { handled: ["shadow-lg"] };
    if (v.includes("0 25px 50px")) return { handled: ["shadow-xl"] };
    return { handled: [`shadow-[${vRaw.replace(/\s/g, "_")}]`] };
  }

  // Object-fit
  if (prop === "object-fit") {
    const map: Record<string, string> = {
      contain: "object-contain",
      cover: "object-cover",
      fill: "object-fill",
      none: "object-none",
      "scale-down": "object-scale-down",
    };
    return { handled: [map[v] ?? null].filter(Boolean) as string[] };
  }

  // Transition
  if (prop === "transition") {
    if (v === "none") return { handled: ["transition-none"] };
    if (v.includes("all")) return { handled: ["transition-all"] };
    if (v.includes("color") || v.includes("background")) return { handled: ["transition-colors"] };
    if (v.includes("opacity")) return { handled: ["transition-opacity"] };
    if (v.includes("shadow")) return { handled: ["transition-shadow"] };
    if (v.includes("transform")) return { handled: ["transition-transform"] };
    return { handled: ["transition"] };
  }

  return { handled: null };
}

export function convertCssToTailwind(css: string): ConvertResult {
  const classes: string[] = [];
  const unhandled: string[] = [];

  // Strip comments
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");

  // Extract declaration block(s) — handles both with and without selectors
  const blockRe = /\{([^}]*)}/g;
  let match: RegExpExecArray | null;
  let hasBlock = false;

  while ((match = blockRe.exec(stripped)) !== null) {
    hasBlock = true;
    parseBlock(match[1]);
  }

  // If no braces, treat entire input as a block
  if (!hasBlock) parseBlock(stripped);

  function parseBlock(block: string) {
    const declarations = block
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean);
    for (const decl of declarations) {
      const colonIdx = decl.indexOf(":");
      if (colonIdx === -1) continue;
      const prop = decl.slice(0, colonIdx).trim().toLowerCase();
      const val = decl.slice(colonIdx + 1).trim();
      if (!prop || !val) continue;

      const { handled } = mapDeclaration(prop, val);
      if (handled && handled.length > 0) {
        classes.push(...handled);
      } else {
        unhandled.push(`${prop}: ${val}`);
      }
    }
  }

  return { classes, unhandled };
}
