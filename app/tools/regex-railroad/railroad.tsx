import React from "react";
import { type CharacterClassBody, type RootNode } from "regjsparser";

// ─── Layout constants ──────────────────────────────────────────────────────
const BOX_H = 30;
const R = 6;       // border radius
const H_GAP = 18;  // gap between items in a sequence
const V_GAP = 14;  // gap between alternatives
const CONN = 18;   // horizontal connector margin for disjunction
const CHAR_W = 7.5; // approx width per character in 12px mono
const PAD_X = 10;  // horizontal padding inside boxes

// Colors
const C = {
  literal: { fill: "#0f172a", stroke: "#38bdf8", text: "#7dd3fc" },     // sky
  charClass: { fill: "#0f172a", stroke: "#fbbf24", text: "#fde68a" },    // amber
  group: { fill: "#0f172a", stroke: "#34d399", text: "#6ee7b7" },        // emerald
  anchor: { fill: "#0f172a", stroke: "#f87171", text: "#fca5a5" },       // rose
  quantifier: { fill: "#0f172a", stroke: "#a78bfa", text: "#c4b5fd" },   // violet
  fallback: { fill: "#0f172a", stroke: "#6b7280", text: "#9ca3af" },     // gray
};

// ─── Types ─────────────────────────────────────────────────────────────────
type Rendered = {
  width: number;
  height: number;
  railY: number;  // Y coordinate of the connecting rail, relative to this node's top
  el: (key: string) => React.ReactNode;
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function textWidth(s: string) {
  return Math.max(s.length * CHAR_W + PAD_X * 2, 40);
}

function pill(
  label: string,
  color: { fill: string; stroke: string; text: string },
  rx = R,
  additionalEls?: React.ReactNode,
): Rendered {
  const w = textWidth(label);
  const h = BOX_H;
  const ry = h / 2;
  return {
    width: w, height: h, railY: ry,
    el: (key) => (
      <g key={key}>
        {additionalEls}
        <rect x={0} y={0} width={w} height={h} rx={rx} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
        <text x={w / 2} y={ry + 4} fontFamily="monospace" fontSize={12} textAnchor="middle" fill={color.text}>
          {label}
        </text>
      </g>
    ),
  };
}

/** Horizontal line connector. */
function hline(x1: number, y: number, x2: number) {
  return <line x1={x1} y1={y} x2={x2} y2={y} stroke="#475569" strokeWidth={1.5} />;
}

// ─── Sequence ─────────────────────────────────────────────────────────────
function renderSequence(children: Rendered[]): Rendered {
  if (children.length === 0) return pill("ε", C.fallback);
  if (children.length === 1) return children[0];

  const maxUp   = Math.max(...children.map((c) => c.railY));
  const maxDown = Math.max(...children.map((c) => c.height - c.railY));
  const totalH  = maxUp + maxDown;
  const railY   = maxUp;

  let cursor = 0;
  const positions: number[] = [];
  for (const c of children) {
    positions.push(cursor);
    cursor += c.width + H_GAP;
  }
  const totalW = cursor - H_GAP;

  return {
    width: totalW, height: totalH, railY,
    el: (key) => (
      <g key={key}>
        {children.map((c, i) => {
          const dx = positions[i];
          const dy = railY - c.railY;
          return (
            <g key={i} transform={`translate(${dx},${dy})`}>
              {c.el(`child-${i}`)}
              {/* connector line to next child */}
              {i < children.length - 1 && hline(c.width, c.railY, c.width + H_GAP)}
            </g>
          );
        })}
      </g>
    ),
  };
}

// ─── Disjunction (alternation) ─────────────────────────────────────────────
function renderDisjunction(children: Rendered[]): Rendered {
  if (children.length === 0) return pill("∅", C.fallback);
  if (children.length === 1) return children[0];

  const maxW = Math.max(...children.map((c) => c.width));
  // Total width: maxW + 2 * CONN (connectors on each side)
  const totalW = maxW + CONN * 2;

  // Stack children vertically
  let cursor = 0;
  const offsets: number[] = [];
  for (const c of children) {
    offsets.push(cursor);
    cursor += c.height + V_GAP;
  }
  const totalH = cursor - V_GAP;
  // Rail aligns with first child
  const railY = offsets[0] + children[0].railY;

  return {
    width: totalW, height: totalH, railY,
    el: (key) => (
      <g key={key}>
        {children.map((c, i) => {
          const dy = offsets[i];
          const childRailAbs = dy + c.railY;
          // Center child horizontally within the max width
          const dx = CONN + (maxW - c.width) / 2;

          // Left connector path from main rail to this child's rail
          const leftPath = i === 0
            ? `M 0,${railY} L ${CONN},${childRailAbs}`
            : `M 0,${railY} L 0,${childRailAbs} L ${CONN},${childRailAbs}`;

          // Right connector path
          const rightPath = i === 0
            ? `M ${totalW},${railY} L ${totalW - CONN},${childRailAbs}`
            : `M ${totalW},${railY} L ${totalW},${childRailAbs} L ${totalW - CONN},${childRailAbs}`;

          return (
            <g key={i}>
              <path d={leftPath}  fill="none" stroke="#475569" strokeWidth={1.5} />
              <path d={rightPath} fill="none" stroke="#475569" strokeWidth={1.5} />
              <g transform={`translate(${dx},${dy})`}>{c.el(`alt-${i}`)}</g>
            </g>
          );
        })}
        {/* Vertical lines on left and right joining the alternation rails */}
        <line x1={0} y1={railY} x2={0} y2={offsets[children.length - 1] + children[children.length - 1].railY} stroke="#475569" strokeWidth={1.5} />
        <line x1={totalW} y1={railY} x2={totalW} y2={offsets[children.length - 1] + children[children.length - 1].railY} stroke="#475569" strokeWidth={1.5} />
      </g>
    ),
  };
}

// ─── Quantifier wrap ───────────────────────────────────────────────────────
function wrapQuantifier(inner: Rendered, label: string): Rendered {
  const loopH = 14;   // loop arc height above/below the node
  const w = inner.width;
  const h = inner.height + loopH;

  return {
    width: w, height: h, railY: inner.railY + loopH,
    el: (key) => (
      <g key={key}>
        <g transform={`translate(0,${loopH})`}>{inner.el("inner")}</g>
        {/* Loop arc above */}
        <path
          d={`M 0,${loopH + inner.railY} Q 0,4 ${w / 2},4 Q ${w},4 ${w},${loopH + inner.railY}`}
          fill="none" stroke={C.quantifier.stroke} strokeWidth={1.2} strokeDasharray="3 2"
        />
        <text x={w / 2} y={loopH - 1} fontFamily="monospace" fontSize={10} textAnchor="middle" fill={C.quantifier.text}>
          {label}
        </text>
      </g>
    ),
  };
}

// ─── Group wrap ────────────────────────────────────────────────────────────
function wrapGroup(inner: Rendered, label: string, color: typeof C.group): Rendered {
  const labelH = 14;
  const borderPad = 6;
  const w = inner.width + borderPad * 2;
  const h = inner.height + labelH + borderPad;

  return {
    width: w, height: h, railY: inner.railY + labelH,
    el: (key) => (
      <g key={key}>
        <rect x={0} y={0} width={w} height={h} rx={R + 2} fill={color.fill} stroke={color.stroke} strokeWidth={1} strokeDasharray="4 2" opacity={0.8} />
        <text x={w / 2} y={12} fontFamily="monospace" fontSize={9} textAnchor="middle" fill={color.stroke} opacity={0.8}>
          {label}
        </text>
        <g transform={`translate(${borderPad},${labelH})`}>{inner.el("inner")}</g>
      </g>
    ),
  };
}

// ─── Character class helpers ───────────────────────────────────────────────
function formatCharClassBody(body: CharacterClassBody[]): string {
  return body.slice(0, 4).map((n) => {
    if (n.type === "value") return String.fromCodePoint(n.codePoint);
    if (n.type === "characterClassRange") {
      const from = String.fromCodePoint(n.min.codePoint);
      const to   = String.fromCodePoint(n.max.codePoint);
      return `${from}-${to}`;
    }
    if (n.type === "characterClassEscape") return `\\${n.value}`;
    return "…";
  }).join("") + (body.length > 4 ? "…" : "");
}

// ─── Main render function ──────────────────────────────────────────────────
export function renderNode(node: RootNode): Rendered {
  switch (node.type) {
    case "alternative":
      return renderSequence(node.body.map(renderNode));

    case "disjunction":
      return renderDisjunction(node.body.map(renderNode));

    case "value": {
      const ch = String.fromCodePoint(node.codePoint);
      return pill(`"${ch}"`, C.literal);
    }

    case "dot":
      return pill(".", C.literal);

    case "characterClassEscape":
      return pill(`\\${node.value}`, C.charClass);

    case "characterClass": {
      const content = formatCharClassBody(node.body as unknown as CharacterClassBody[]);
      const label = node.negative ? `[^${content}]` : `[${content}]`;
      return pill(label, C.charClass);
    }

    case "anchor": {
      const labels: Record<string, string> = {
        start: "^", end: "$", boundary: "\\b", "not-boundary": "\\B",
      };
      return pill(labels[node.kind] ?? node.kind, C.anchor);
    }

    case "group": {
      const body = renderSequence((node.body as RootNode[]).map(renderNode));
      const behavior = node.behavior;
      if (behavior === "normal") {
        return wrapGroup(body, "group", C.group);
      }
      const labels: Record<string, string> = {
        lookahead: "(?=…)", negativeLookahead: "(?!…)",
        lookbehind: "(?<=…)", negativeLookbehind: "(?<!…)",
        ignore: "(?:…)",
      };
      return wrapGroup(body, labels[behavior] ?? behavior, C.anchor);
    }

    case "quantifier": {
      const inner = renderNode(node.body[0]);
      const { symbol, min, max, greedy } = node;
      let label = symbol ?? `{${min}${max === undefined ? "," : max === min ? "" : `,${max}`}}`;
      if (!greedy) label += "?";
      return wrapQuantifier(inner, label);
    }

    case "reference": {
      const n = node as { matchIndex?: number; name?: { value?: string }; raw: string };
      const ref = n.matchIndex !== undefined ? `\\${n.matchIndex}` : `\\k<${n.name?.value ?? "?"}>`;
      return pill(ref, C.fallback);
    }

    default: {
      // unicodePropertyEscape and any future node types
      const raw = (node as { raw?: string }).raw ?? (node as { type: string }).type;
      return pill(raw, C.fallback);
    }
  }
}

// ─── Root wrapper with entry/exit rails ────────────────────────────────────
const MARGIN = 24;

export function RailroadDiagram({ ast }: { ast: RootNode }) {
  const result = renderNode(ast);
  const svgW = result.width + MARGIN * 2;
  const svgH = result.height + MARGIN * 2;
  const railY = result.railY + MARGIN;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width={svgW}
      height={svgH}
      className="max-w-full"
      style={{ fontFamily: "monospace" }}
    >
      {/* Entry rail */}
      {hline(0, railY, MARGIN)}
      {/* Exit rail */}
      {hline(MARGIN + result.width, railY, svgW)}
      {/* Entry/exit circles */}
      <circle cx={0} cy={railY} r={5} fill="#475569" />
      <circle cx={svgW} cy={railY} r={5} fill="#475569" />

      <g transform={`translate(${MARGIN},${MARGIN})`}>
        {result.el("root")}
      </g>
    </svg>
  );
}
