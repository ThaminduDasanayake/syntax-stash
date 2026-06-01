"use client";

import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { SliderField } from "@/components/ui/slider-field";
import { internalTools } from "@/lib/tools-data";

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  id: number;
  color: string;
  position: number; // 0–100
}

let nextId = 3;

const DEFAULT_STOPS: ColorStop[] = [
  { id: 1, color: "#6366f1", position: 0 },
  { id: 2, color: "#ec4899", position: 100 },
];

const LINEAR_DIRS = [
  { value: "to right", label: "→ To Right" },
  { value: "to left", label: "← To Left" },
  { value: "to bottom", label: "↓ To Bottom" },
  { value: "to top", label: "↑ To Top" },
  { value: "to bottom right", label: "↘ To Bottom Right" },
  { value: "to bottom left", label: "↙ To Bottom Left" },
  { value: "to top right", label: "↗ To Top Right" },
  { value: "to top left", label: "↖ To Top Left" },
  { value: "custom", label: "Custom angle" },
];

const RADIAL_SHAPES = [
  { value: "circle", label: "Circle" },
  { value: "ellipse", label: "Ellipse" },
];

const TAILWIND_GRADIENT_DIRS: Record<string, string> = {
  "to right": "bg-gradient-to-r",
  "to left": "bg-gradient-to-l",
  "to bottom": "bg-gradient-to-b",
  "to top": "bg-gradient-to-t",
  "to bottom right": "bg-gradient-to-br",
  "to bottom left": "bg-gradient-to-bl",
  "to top right": "bg-gradient-to-tr",
  "to top left": "bg-gradient-to-tl",
};

export default function GradientGeneratorPage() {
  const [type, setType] = useState<GradientType>("linear");
  const [direction, setDirection] = useState("to right");
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState("circle");
  const [conicAngle, setConicAngle] = useState(0);
  const [stops, setStops] = useState<ColorStop[]>(DEFAULT_STOPS);

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => a.position - b.position),
    [stops],
  );

  const stopString = sortedStops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");

  const cssValue = useMemo(() => {
    if (type === "linear") {
      const dir = direction === "custom" ? `${angle}deg` : direction;
      return `linear-gradient(${dir}, ${stopString})`;
    }
    if (type === "radial") {
      return `radial-gradient(${radialShape} at center, ${stopString})`;
    }
    return `conic-gradient(from ${conicAngle}deg at center, ${stopString})`;
  }, [type, direction, angle, radialShape, conicAngle, stopString]);

  const cssRule = `background: ${cssValue};`;

  const tailwindClass = useMemo(() => {
    if (type === "linear" && direction in TAILWIND_GRADIENT_DIRS && stops.length === 2) {
      const dir = TAILWIND_GRADIENT_DIRS[direction];
      const from = `from-[${sortedStops[0].color}]`;
      const to = `to-[${sortedStops[sortedStops.length - 1].color}]`;
      return `${dir} ${from} ${to}`;
    }
    return `bg-[${cssValue.replace(/\s/g, "_")}]`;
  }, [type, direction, stops, sortedStops, cssValue]);

  const addStop = () => {
    const mid = Math.round((sortedStops[0].position + sortedStops[sortedStops.length - 1].position) / 2);
    setStops((s) => [...s, { id: nextId++, color: "#a855f7", position: mid }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((s) => s.filter((st) => st.id !== id));
  };

  const updateStop = (id: number, field: "color" | "position", value: string | number) => {
    setStops((s) => s.map((st) => (st.id === id ? { ...st, [field]: value } : st)));
  };

  const tool = internalTools.find((t) => t.slug === "gradient-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={type === t ? "default" : "outline"}
                  onClick={() => setType(t)}
                  className="capitalize flex-1"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Direction / shape */}
          {type === "linear" && (
            <>
              <SelectField
                label="Direction"
                value={direction}
                onValueChange={setDirection}
                options={LINEAR_DIRS}
              />
              {direction === "custom" && (
                <SliderField
                  label={`Angle: ${angle}°`}
                  value={[angle]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={([v]) => setAngle(v)}
                />
              )}
            </>
          )}
          {type === "radial" && (
            <SelectField
              label="Shape"
              value={radialShape}
              onValueChange={setRadialShape}
              options={RADIAL_SHAPES}
            />
          )}
          {type === "conic" && (
            <SliderField
              label={`Start angle: ${conicAngle}°`}
              value={[conicAngle]}
              min={0}
              max={360}
              step={1}
              onValueChange={([v]) => setConicAngle(v)}
            />
          )}

          {/* Color stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Color stops</Label>
              <Button size="sm" variant="outline" onClick={addStop} className="gap-1">
                <PlusIcon weight="bold" size={12} />
                Add stop
              </Button>
            </div>
            {sortedStops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border p-0.5"
                />
                <div className="flex-1">
                  <SliderField
                    label=""
                    value={[stop.position]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([v]) => updateStop(stop.id, "position", v)}
                  />
                </div>
                <span className="text-muted-foreground w-8 text-right text-xs">
                  {stop.position}%
                </span>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className="text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                  title="Remove stop"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview + output */}
        <div className="space-y-6 lg:col-span-2">
          {/* Preview */}
          <div
            className="rounded-xl border"
            style={{ background: cssValue, height: 220 }}
          />

          {/* CSS output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>CSS</Label>
              <CopyButton size="sm" variant="outline" textToCopy={cssRule}>
                Copy CSS
              </CopyButton>
            </div>
            <pre className="bg-muted rounded-lg p-3 text-sm font-mono break-all whitespace-pre-wrap">
              {cssRule}
            </pre>
          </div>

          {/* Tailwind output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tailwind</Label>
              <CopyButton size="sm" variant="outline" textToCopy={tailwindClass}>
                Copy Tailwind
              </CopyButton>
            </div>
            <pre className="bg-muted rounded-lg p-3 text-sm font-mono break-all whitespace-pre-wrap">
              {tailwindClass}
            </pre>
          </div>

          {/* Color stop strip */}
          <div
            className="h-3 rounded-full border"
            style={{ background: cssValue }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
