"use client";

import { Check, Copy, Grid3X3, Minus, RotateCcw, Square, Type } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const ROWS = 20;
const COLS = 48;

type DrawTool = "box" | "erase" | "text";
type Cell = { row: number; col: number };

function makeGrid(): string[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function drawBox(
  grid: string[][],
  r1: number, c1: number,
  r2: number, c2: number,
): string[][] {
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
      const bot = r === maxR;
      const lft = c === minC;
      const rgt = c === maxC;

      if (top && lft) next[r][c] = "┌";
      else if (top && rgt) next[r][c] = "┐";
      else if (bot && lft) next[r][c] = "└";
      else if (bot && rgt) next[r][c] = "┘";
      else if (top || bot) next[r][c] = "─";
      else if (lft || rgt) next[r][c] = "│";
      // interior cells left unchanged
    }
  }
  return next;
}

export default function AsciiDiagramPage() {
  const [grid, setGrid] = useState<string[][]>(makeGrid);
  const [activeTool, setActiveTool] = useState<DrawTool>("box");
  const [textCell, setTextCell] = useState<Cell | null>(null);
  const [textInput, setTextInput] = useState("");

  // Drag state in refs — avoids stale closure / lag issues in mousemove
  const dragging = useRef(false);
  const dragStart = useRef<Cell | null>(null);
  const dragEnd = useRef<Cell | null>(null);
  // Force re-render while dragging to show preview
  const [previewTick, setPreviewTick] = useState(0);

  // Measure one character cell so we can compute row/col from pixel coords
  const gridRef = useRef<HTMLDivElement>(null);
  const cellW = useRef(0);
  const cellH = useRef(0);

  useEffect(() => {
    const el = gridRef.current?.querySelector<HTMLSpanElement>("[data-cell]");
    if (el) {
      const r = el.getBoundingClientRect();
      cellW.current = r.width;
      cellH.current = r.height;
    }
  }, []);

  function cellFromPointer(clientX: number, clientY: number): Cell | null {
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
  }

  // Preview: merge current drag state onto grid (no state update)
  const displayGrid = useMemo(() => {
    // previewTick included so useMemo re-runs during drag
    void previewTick;
    if (!dragging.current || !dragStart.current || !dragEnd.current) return grid;
    if (activeTool === "box") {
      return drawBox(
        grid,
        dragStart.current.row, dragStart.current.col,
        dragEnd.current.row, dragEnd.current.col,
      );
    }
    return grid;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, activeTool, previewTick]);

  const ascii = useMemo(() => displayGrid.map((r) => r.join("")).join("\n"), [displayGrid]);

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
      dragging.current = true;
      dragStart.current = cell;
      dragEnd.current = cell;

      if (activeTool === "erase") {
        setGrid((g) => {
          const next = g.map((r) => [...r]);
          next[cell.row][cell.col] = " ";
          return next;
        });
      }
      setPreviewTick((t) => t + 1);
    },
    [activeTool],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      const cell = cellFromPointer(e.clientX, e.clientY);
      if (!cell) return;

      dragEnd.current = cell;

      if (activeTool === "erase") {
        setGrid((g) => {
          const next = g.map((r) => [...r]);
          next[cell.row][cell.col] = " ";
          return next;
        });
        return;
      }

      setPreviewTick((t) => t + 1);
    },
    [activeTool],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      dragging.current = false;

      const start = dragStart.current;
      const end = cellFromPointer(e.clientX, e.clientY) ?? dragEnd.current;

      if (activeTool === "box" && start && end) {
        setGrid((g) => drawBox(g, start.row, start.col, end.row, end.col));
      }

      dragStart.current = null;
      dragEnd.current = null;
      setPreviewTick((t) => t + 1);
    },
    [activeTool],
  );

  function commitText() {
    if (!textCell) return;
    const text = textInput;
    setGrid((g) => {
      const next = g.map((r) => [...r]);
      for (let i = 0; i < text.length; i++) {
        const c = textCell.col + i;
        if (c < COLS) next[textCell.row][c] = text[i];
      }
      return next;
    });
    setTextCell(null);
    setTextInput("");
  }

  const textRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (textCell) textRef.current?.focus();
  }, [textCell]);

  const { copied, copy } = useCopyToClipboard();

  const TOOLS: { id: DrawTool; label: string; icon: React.ReactNode }[] = [
    { id: "box", label: "Box", icon: <Square size={13} /> },
    { id: "erase", label: "Erase", icon: <Minus size={13} /> },
    { id: "text", label: "Text", icon: <Type size={13} /> },
  ];

  return (
    <ToolLayout
      icon={Grid3X3}
      title="ASCII Diagram"
      highlight="Editor"
      description="Draw boxes and add text on a character grid. Outputs clean ASCII art using Unicode box-drawing characters."
      maxWidth="max-w-7xl"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
          {textCell && (
            <div className="flex items-center gap-2">
              <input
                ref={textRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") commitText();
                }}
                onBlur={commitText}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:border-ring w-full rounded-md border px-3 py-1.5 font-mono text-sm outline-none"
                placeholder={`Typing at row ${textCell.row}, col ${textCell.col} — press Enter to place`}
              />
              <Button size="sm" onClick={commitText} className="shrink-0 rounded-full">
                Place
              </Button>
            </div>
          )}

          {/* Grid */}
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Canvas ({COLS} × {ROWS})
              {activeTool === "box" && " — drag to draw a box"}
              {activeTool === "erase" && " — click/drag to erase"}
              {activeTool === "text" && " — click a cell, then type"}
            </Label>
            <div className="border-border overflow-auto rounded-lg border bg-muted/20">
              <div
                ref={gridRef}
                className="cursor-crosshair select-none p-2"
                style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: "1.5" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                // Do NOT commit on leave — just let the pointer capture handle it
              >
                {displayGrid.map((row, r) => (
                  <div key={r} style={{ display: "flex", height: "1.5em" }}>
                    {row.map((char, c) => {
                      const isTextTarget = textCell?.row === r && textCell?.col === c;
                      const isDragStart =
                        dragStart.current?.row === r && dragStart.current?.col === c;
                      return (
                        <span
                          key={c}
                          data-cell
                          data-row={r}
                          data-col={c}
                          style={{
                            display: "inline-block",
                            width: "1ch",
                            textAlign: "center",
                          }}
                          className={
                            isTextTarget
                              ? "bg-primary/30 text-primary"
                              : isDragStart
                                ? "bg-primary/20 text-foreground"
                                : "text-foreground hover:bg-muted/60"
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
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </Button>
          </div>
          <Textarea
            readOnly
            value={ascii}
            rows={ROWS + 2}
            style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: "1.5" }}
          />
          <p className="text-muted-foreground text-xs">
            Box-drawing chars: ┌ ─ ┐ │ └ ┘ · Drag to draw · Double-click Clear to reset
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
