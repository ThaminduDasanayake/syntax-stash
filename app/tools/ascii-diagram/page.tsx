"use client";

import { Check, Copy, Grid3X3, Minus, RotateCcw, Square, Type } from "lucide-react";
import { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const ROWS = 24;
const COLS = 54;
const FONT_SIZE = 13;
const LINE_HEIGHT = 1.5;

type DrawTool = "box" | "erase" | "text";
type Cell = { row: number; col: number };

function makeGrid(): string[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function drawBox(grid: string[][], r1: number, c1: number, r2: number, c2: number): string[][] {
  const minR = Math.min(r1, r2);
  const maxR = Math.max(r1, r2);
  const minC = Math.min(c1, c2);
  const maxC = Math.max(c1, c2);

  // Need at least 2×2 to draw a meaningful box
  if (minR === maxR && minC === maxC) return grid;

  const next = grid.map((row) => [...row]);

  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      const top = r === minR;
      const bottom = r === maxR;
      const left = c === minC;
      const right = c === maxC;

      if (top && left) next[r][c] = "┌";
      else if (top && right) next[r][c] = "┐";
      else if (bottom && left) next[r][c] = "└";
      else if (bottom && right) next[r][c] = "┘";
      else if (top || bottom) next[r][c] = "─";
      else if (left || right) next[r][c] = "│";
      // interior cells left unchanged
    }
  }
  return next;
}

const TOOLS: { id: DrawTool; label: string; icon: ReactNode }[] = [
  { id: "box", label: "Box", icon: <Square size={13} /> },
  { id: "erase", label: "Erase", icon: <Minus size={13} /> },
  { id: "text", label: "Text", icon: <Type size={13} /> },
] as const;

export default function AsciiDiagramPage() {
  const [grid, setGrid] = useState<string[][]>(makeGrid);
  const [activeTool, setActiveTool] = useState<DrawTool>("box");
  const [textCell, setTextCell] = useState<Cell | null>(null);
  const [textInput, setTextInput] = useState("");

  const [dragStart, setDragStart] = useState<Cell | null>(null);
  const [dragEnd, setDragEnd] = useState<Cell | null>(null);
  const isDragging = dragStart !== null;

  // Measure one character cell so we can compute row/col from pixel coords
  const gridRef = useRef<HTMLDivElement>(null);
  const cellW = useRef(0);
  const cellH = useRef(0);
  const textRef = useRef<HTMLInputElement>(null);
  const placingRef = useRef(false);

  useEffect(() => {
    const el = gridRef.current?.querySelector<HTMLSpanElement>("[data-cell]");
    if (el) {
      const r = el.getBoundingClientRect();
      cellW.current = r.width;
      cellH.current = r.height;
    }
  }, []);

  useEffect(() => {
    if (textCell) textRef.current?.focus();
  }, [textCell]);

  const cellFromPointer = useCallback((clientX: number, clientY: number): Cell | null => {
    const container = gridRef.current;
    if (!container || !cellW.current || !cellH.current) return null;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0) return null;
    const col = Math.floor(x / cellW.current);
    const row = Math.floor(y / cellH.current);
    if (row >= ROWS || col >= COLS) return null;
    return { row: clamp(row, 0, ROWS - 1), col: clamp(col, 0, COLS - 1) };
  }, []);

  const commitText = useCallback(() => {
    if (!textCell) return;

    // Only save to the actual grid if they typed something
    if (textInput) {
      setGrid((g) => {
        const next = g.map((r) => [...r]);
        for (let i = 0; i < textInput.length; i++) {
          const c = textCell.col + i;
          if (c < COLS) next[textCell.row][c] = textInput[i];
        }
        return next;
      });
    }

    // Clear the input UI
    setTextCell(null);
    setTextInput("");
  }, [textCell, textInput]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const cell = cellFromPointer(e.clientX, e.clientY);
      if (!cell) return;

      if (activeTool === "text") {
        setTextCell(cell);
        setTextInput("");
        return;
      }

      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      setDragStart(cell);
      setDragEnd(cell);

      if (activeTool === "erase") {
        setGrid((g) => {
          const next = g.map((r) => [...r]);
          next[cell.row][cell.col] = " ";
          return next;
        });
      }
    },
    [activeTool, cellFromPointer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const cell = cellFromPointer(e.clientX, e.clientY);
      if (!cell) return;

      setDragEnd(cell);

      if (activeTool === "erase") {
        setGrid((g) => {
          const next = g.map((r) => [...r]);
          next[cell.row][cell.col] = " ";
          return next;
        });
        return;
      }
    },
    [activeTool, isDragging, cellFromPointer],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStart) return;

      const end = cellFromPointer(e.clientX, e.clientY) ?? dragEnd;

      if (activeTool === "box" && end) {
        setGrid((g) => drawBox(g, dragStart.row, dragStart.col, end.row, end.col));
      }

      setDragStart(null);
      setDragEnd(null);
    },
    [activeTool, isDragging, dragStart, dragEnd, cellFromPointer],
  );

  const displayGrid = useMemo(() => {
    let currentGrid = grid;

    // 1. Draw box if dragging
    if (isDragging && dragStart && dragEnd && activeTool === "box") {
      currentGrid = drawBox(currentGrid, dragStart.row, dragStart.col, dragEnd.row, dragEnd.col);
    }

    // 2. Live Text Preview
    if (textCell && textInput) {
      const next = currentGrid.map((r) => [...r]);
      for (let i = 0; i < textInput.length; i++) {
        const c = textCell.col + i;
        if (c < COLS) next[textCell.row][c] = textInput[i];
      }
      currentGrid = next;
    }

    return currentGrid;
  }, [grid, activeTool, isDragging, dragStart, dragEnd, textCell, textInput]);

  const ascii = useMemo(() => displayGrid.map((r) => r.join("")).join("\n"), [displayGrid]);

  const { copied, copy } = useCopyToClipboard();

  const monoStyle: CSSProperties = {
    fontFamily: "monospace",
    fontSize: `${FONT_SIZE}px`,
    lineHeight: LINE_HEIGHT,
  };

  return (
    <ToolLayout
      icon={Grid3X3}
      title="ASCII Diagram"
      highlight="Editor"
      description="Draw boxes and add text on a character grid. Outputs clean ASCII art using Unicode box-drawing characters."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left — Canvas */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {TOOLS.map((t) => (
              <Button
                key={t.id}
                variant={activeTool === t.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveTool(t.id);
                  setTextCell(null);
                }}
                className="rounded-full font-semibold"
              >
                {t.icon}
                {t.label}
              </Button>
            ))}
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGrid(makeGrid());
                setTextCell(null);
              }}
              className="rounded-full font-semibold"
            >
              <RotateCcw size={13} />
              Clear
            </Button>
          </div>

          {/* Text input (shown when text tool is active and a cell is selected) */}
          {activeTool === "text" && (
            <div className="flex items-center gap-2">
              <input
                ref={textRef}
                disabled={!textCell}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitText();
                  if (e.key === "Escape") {
                    setTextCell(null);
                    setTextInput("");
                  }
                }}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:border-ring w-full rounded-md border px-3 py-1.5 font-mono text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={
                  textCell
                    ? `Typing at row ${textCell.row}, col ${textCell.col} — press Enter to place`
                    : "Click a cell on the canvas to start typing..."
                }
              />
              <Button
                size="sm"
                disabled={!textCell || !textInput}
                onClick={commitText}
                className="shrink-0 rounded-full"
              >
                Place
              </Button>
            </div>
          )}

          {/* Grid */}
          <div className="space-y-1">
            <div className="border-border bg-input overflow-auto rounded-lg border p-2">
              <div
                ref={gridRef}
                className="cursor-crosshair select-none"
                style={{ ...monoStyle, width: "max-content" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {displayGrid.map((row, r) => (
                  <div key={r} style={{ display: "flex", height: "1.5em" }}>
                    {row.map((char, c) => {
                      const isTextTarget = textCell?.row === r && textCell?.col === c;
                      const isDragStartCell = dragStart?.row === r && dragStart?.col === c;
                      return (
                        <span
                          key={c}
                          data-cell
                          data-row={r}
                          data-col={c}
                          style={{
                            display: "inline-block",
                            width: "1ch",
                            height: "100%",
                            textAlign: "center",
                            backgroundImage: `
                      linear-gradient(to right, transparent calc(50% - 0.5px), rgba(255,255,255,0.08) calc(50% - 0.5px), rgba(255,255,255,0.08) calc(50% + 0.5px), transparent calc(50% + 0.5px)),
                      linear-gradient(to bottom, transparent calc(50% - 0.5px), rgba(255,255,255,0.08) calc(50% - 0.5px), rgba(255,255,255,0.08) calc(50% + 0.5px), transparent calc(50% + 0.5px))
                    `,
                          }}
                          className={
                            isTextTarget
                              ? "bg-accent-foreground text-accent-foreground"
                              : isDragStartCell
                                ? "bg-accent-foreground text-foreground"
                                : "text-foreground hover:bg-white/20"
                          }
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Label className="text-xs font-semibold tracking-wider uppercase">
            Canvas ({COLS} × {ROWS}){activeTool === "box" && " — drag to draw a box"}
            {activeTool === "erase" && " — click/drag to erase"}
            {activeTool === "text" && " — click a cell, then type"}
          </Label>
        </div>

        {/* Right — ASCII Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>ASCII Output</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(ascii)}
              className="rounded-full font-semibold"
            >
              {copied ? (
                <>
                  <Check size={12} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={12} /> Copy
                </>
              )}
            </Button>
          </div>
          <Textarea
            readOnly
            value={ascii}
            rows={ROWS}
            style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: "1.5" }}
          />
          <p className="text-muted-foreground text-xs">
            Box-drawing chars: ┌ ─ ┐ │ └ ┘ · Drag to draw
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
