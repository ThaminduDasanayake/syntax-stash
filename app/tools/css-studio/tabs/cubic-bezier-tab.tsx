"use client";

import { PlayIcon } from "@phosphor-icons/react";
import { useCallback, useRef, useState } from "react";

import { CurveCanvas } from "@/app/tools/css-studio/cubic-bezier-curve-canvas";
import { PRESETS } from "@/app/tools/css-studio/cubic-bezier-helpers";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CubicBezierTab() {
  const [p1x, setP1x] = useState(0.25);
  const [p1y, setP1y] = useState(0.1);
  const [p2x, setP2x] = useState(0.25);
  const [p2y, setP2y] = useState(1.0);
  const [duration, setDuration] = useState(800);
  const [replayKey, setReplayKey] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fmt = (n: number) => parseFloat(n.toFixed(3)).toString();
  const cubicBezier = `cubic-bezier(${fmt(p1x)}, ${fmt(p1y)}, ${fmt(p2x)}, ${fmt(p2y)})`;

  const handleChange = useCallback((field: "p1x" | "p1y" | "p2x" | "p2y", value: number) => {
    if (field === "p1x") setP1x(value);
    else if (field === "p1y") setP1y(value);
    else if (field === "p2x") setP2x(value);
    else setP2y(value);
  }, []);

  function applyPreset(label: string) {
    const p = PRESETS.find((pr) => pr.label === label);
    if (!p) return;
    setP1x(p.p1x);
    setP1y(p.p1y);
    setP2x(p.p2x);
    setP2y(p.p2y);
  }

  function handlePlay() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimating(false);
    requestAnimationFrame(() => {
      setAnimating(true);
      setReplayKey((k) => k + 1);
      timerRef.current = setTimeout(() => setAnimating(false), duration + 200);
    });
  }

  const cssSnippet = `transition-timing-function: ${cubicBezier};`;
  const tailwindSnippet = `ease-[${cubicBezier}]`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="flex items-start gap-6">
            <div className="border-border bg-muted/20 rounded-xl border p-2">
              <CurveCanvas p1x={p1x} p1y={p1y} p2x={p2x} p2y={p2y} onChangeAction={handleChange} />
            </div>

            <div className="flex-1 space-y-3 pt-1">
              <div>
                <Label className="text-xs text-blue-400">P1</Label>
                <div className="mt-1.5 flex gap-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">x</Label>
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={fmt(p1x)}
                      onChange={(e) => setP1x(Number(e.target.value))}
                      className="w-20 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">y</Label>
                    <Input
                      type="number"
                      step={0.01}
                      value={fmt(p1y)}
                      onChange={(e) => setP1y(Number(e.target.value))}
                      className="w-20 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-pink-400">P2</Label>
                <div className="mt-1.5 flex gap-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">x</Label>
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={fmt(p2x)}
                      onChange={(e) => setP2x(Number(e.target.value))}
                      className="w-20 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">y</Label>
                    <Input
                      type="number"
                      step={0.01}
                      value={fmt(p2y)}
                      onChange={(e) => setP2y(Number(e.target.value))}
                      className="w-20 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Duration (ms)</Label>
                <Input
                  type="number"
                  min={100}
                  max={5000}
                  step={50}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-24 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label className="shrink-0 text-sm">Preset</Label>
            <Select
              onValueChange={(v) => {
                if (v) applyPreset(String(v));
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a preset…" />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((p) => (
                  <SelectItem key={p.label} value={p.label}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm">Live preview</Label>
            <div className="border-border bg-muted/20 relative h-20 overflow-hidden rounded-xl border px-4">
              <div
                key={replayKey}
                className="bg-primary absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg"
                style={{
                  left: animating ? "calc(100% - 2.5rem)" : "0.5rem",
                  transition: animating ? `left ${duration}ms ${cubicBezier}` : "none",
                }}
              />
            </div>
            <Button onClick={handlePlay} variant="outline" size="sm">
              <PlayIcon weight="duotone" />
              Play
            </Button>
          </div>

          <div className="space-y-3">
            <Label className="text-sm">Generated CSS</Label>
            <div className="border-border bg-muted/30 space-y-2 rounded-xl border p-4">
              <OutputRow label="CSS" value={cssSnippet} />
              <OutputRow label="Tailwind" value={tailwindSnippet} />
              <OutputRow label="Raw" value={cubicBezier} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-16 shrink-0 text-xs">{label}</span>
      <code className="bg-card flex-1 overflow-x-auto rounded px-2 py-1 font-mono text-xs">
        {value}
      </code>
      <CopyButton textToCopy={value} />
    </div>
  );
}
