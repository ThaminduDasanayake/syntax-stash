"use client";

import { useCallback, useRef } from "react";

import { buildCurveSamples } from "./helpers";

type Props = {
  p1x: number; p1y: number;
  p2x: number; p2y: number;
  onChange: (field: "p1x" | "p1y" | "p2x" | "p2y", value: number) => void;
};

const CANVAS = 240;
const PAD = 28;
const PLOT = CANVAS - PAD * 2;

function toSvg(x: number, y: number) {
  return { cx: PAD + x * PLOT, cy: PAD + (1 - y) * PLOT };
}

export function CurveCanvas({ p1x, p1y, p2x, p2y, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"p1" | "p2" | null>(null);

  const svgCoords = useCallback((e: PointerEvent | React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left - PAD) / PLOT));
    const y = 1 - (e.clientY - rect.top - PAD) / PLOT; // no clamp — allows overshoot
    return { x, y };
  }, []);

  const onPointerDown = (handle: "p1" | "p2") =>
    (e: React.PointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = handle;
    };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const { x, y } = svgCoords(e);
    if (dragging.current === "p1") { onChange("p1x", x); onChange("p1y", y); }
    else                           { onChange("p2x", x); onChange("p2y", y); }
  };

  const onPointerUp = () => { dragging.current = null; };

  const samples = buildCurveSamples(p1x, p1y, p2x, p2y);
  const pathD = samples
    .map((pt, i) => {
      const { cx, cy } = toSvg(pt.x, pt.y);
      return `${i === 0 ? "M" : "L"} ${cx.toFixed(1)},${cy.toFixed(1)}`;
    })
    .join(" ");

  const start = toSvg(0, 0);
  const end   = toSvg(1, 1);
  const h1    = toSvg(p1x, p1y);
  const h2    = toSvg(p2x, p2y);

  const gridLines: number[] = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg
      ref={svgRef}
      width={CANVAS}
      height={CANVAS}
      viewBox={`0 0 ${CANVAS} ${CANVAS}`}
      className="touch-none select-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Grid */}
      {gridLines.map((v) => {
        const x = PAD + v * PLOT;
        const y = PAD + v * PLOT;
        return (
          <g key={v}>
            <line x1={x} y1={PAD} x2={x} y2={PAD + PLOT} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            <line x1={PAD} y1={y} x2={PAD + PLOT} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
          </g>
        );
      })}

      {/* Diagonal reference (linear) */}
      <line x1={start.cx} y1={start.cy} x2={end.cx} y2={end.cy} stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="4 3" />

      {/* Handle lines */}
      <line x1={start.cx} y1={start.cy} x2={h1.cx} y2={h1.cy} stroke="#60a5fa" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 2" />
      <line x1={end.cx}   y1={end.cy}   x2={h2.cx} y2={h2.cy} stroke="#f472b6" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 2" />

      {/* Curve */}
      <path d={pathD} fill="none" stroke="#a78bfa" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Endpoint dots */}
      <circle cx={start.cx} cy={start.cy} r={4} fill="#a78bfa" />
      <circle cx={end.cx}   cy={end.cy}   r={4} fill="#a78bfa" />

      {/* Draggable handles */}
      <circle
        cx={h1.cx} cy={h1.cy} r={7}
        fill="#3b82f6" stroke="#93c5fd" strokeWidth={1.5}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown("p1")}
      />
      <circle
        cx={h2.cx} cy={h2.cy} r={7}
        fill="#ec4899" stroke="#f9a8d4" strokeWidth={1.5}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown("p2")}
      />

      {/* Axis labels */}
      <text x={PAD}       y={CANVAS - 4} fontSize={9} fill="currentColor" fillOpacity={0.4} textAnchor="middle">0</text>
      <text x={PAD + PLOT} y={CANVAS - 4} fontSize={9} fill="currentColor" fillOpacity={0.4} textAnchor="middle">1</text>
      <text x={4}         y={PAD + PLOT}  fontSize={9} fill="currentColor" fillOpacity={0.4} textAnchor="middle">0</text>
      <text x={4}         y={PAD}         fontSize={9} fill="currentColor" fillOpacity={0.4} textAnchor="middle">1</text>
    </svg>
  );
}
