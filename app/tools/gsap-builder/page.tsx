"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Play, RotateCcw, Wand2 } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import CopyButton from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";

gsap.registerPlugin(useGSAP);

type AnimType = "to" | "from";
type EasingType = "power1.out" | "power3.inOut" | "elastic.out(1, 0.3)" | "bounce.out";

interface AnimConfig {
  type: AnimType;
  ease: EasingType;
  duration: number;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  scale: number;
}

// ---------------------------------------------------------------------------
// Code generator
// ---------------------------------------------------------------------------

function generateCode(cfg: AnimConfig): string {
  const props: Record<string, unknown> = {};
  if (cfg.x !== 0) props.x = cfg.x;
  if (cfg.y !== 0) props.y = cfg.y;
  if (cfg.rotation !== 0) props.rotation = cfg.rotation;
  if (cfg.opacity !== 1) props.opacity = cfg.opacity;
  if (cfg.scale !== 1) props.scale = cfg.scale;
  props.duration = cfg.duration;
  props.ease = `"${cfg.ease}"`;

  const propsStr = Object.entries(props)
    .map(([k, v]) => `      ${k}: ${v},`)
    .join("\n");

  return `"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AnimatedComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.${cfg.type}(".box", {
${propsStr}
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <div
        className="box"
        style={{
          width: 80,
          height: 80,
          background: "oklch(0.6 0.2 260)",
          borderRadius: 8,
        }}
      />
    </div>
  );
}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GSAPBuilderPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playKey, setPlayKey] = useState(0);

  const [type, setType] = useState<AnimType>("from");
  const [ease, setEase] = useState<EasingType>("power3.inOut");
  const [duration, setDuration] = useState(1.2);
  const [x, setX] = useState(0);
  const [y, setY] = useState(-60);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(1);

  const config: AnimConfig = {
    type,
    ease,
    duration,
    x,
    y,
    rotation,
    opacity,
    scale,
  };

  // Live GSAP animation — reruns whenever playKey changes
  useGSAP(
    () => {
      if (!containerRef.current) return;
      // Reset before playing from-animations
      gsap.set(".gsap-preview-box", { clearProps: "all" });
      gsap[type](".gsap-preview-box", {
        x,
        y,
        rotation,
        opacity,
        scale,
        duration,
        ease,
      });
    },
    { scope: containerRef, dependencies: [playKey] },
  );

  const handlePlay = useCallback(() => {
    setPlayKey((k) => k + 1);
  }, []);

  const handleReset = useCallback(() => {
    gsap.set(".gsap-preview-box", { clearProps: "all" });
    setPlayKey(0);
  }, []);

  const generatedCode = useMemo(() => generateCode(config), [
    type, ease, duration, x, y, rotation, opacity, scale, // eslint-disable-line react-hooks/exhaustive-deps
  ]);

  const typeOptions = [
    { value: "to", label: "gsap.to() — animate to values" },
    { value: "from", label: "gsap.from() — animate from values" },
  ];

  const easingOptions = [
    { value: "power1.out", label: "power1.out — subtle ease" },
    { value: "power3.inOut", label: "power3.inOut — smooth ease" },
    { value: "elastic.out(1, 0.3)", label: "elastic.out — springy" },
    { value: "bounce.out", label: "bounce.out — bouncy" },
  ];

  return (
    <ToolLayout
      icon={Wand2}
      title="GSAP"
      highlight="Builder"
      description="Visually build GSAP animations and generate optimized React 19 boilerplate."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Left — controls                                                   */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          <SelectField
            label="Animation Type"
            value={type}
            onValueChange={(v) => setType(v as AnimType)}
            options={typeOptions}
          />

          <SelectField
            label="Easing"
            value={ease}
            onValueChange={(v) => setEase(v as EasingType)}
            options={easingOptions}
          />

          {/* Duration */}
          <InputField
            label="Duration (seconds)"
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
          />

          {/* Transform grid */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Transform</Label>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                label="X (px)"
                type="number"
                value={x}
                onChange={(e) => setX(parseInt(e.target.value, 10) || 0)}
                containerClassName=""
              />
              <InputField
                label="Y (px)"
                type="number"
                value={y}
                onChange={(e) => setY(parseInt(e.target.value, 10) || 0)}
                containerClassName=""
              />
              <InputField
                label="Rotation (°)"
                type="number"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10) || 0)}
                containerClassName=""
              />
              <InputField
                label="Opacity (0–1)"
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={opacity}
                onChange={(e) =>
                  setOpacity(Math.min(1, Math.max(0, parseFloat(e.target.value) || 0)))
                }
                containerClassName=""
              />
              <InputField
                label="Scale"
                type="number"
                min={0}
                step={0.1}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
                containerClassName=""
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <Button className="flex-1 gap-2" onClick={handlePlay}>
              <Play size={15} />
              Play Animation
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right — preview + code                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Live preview card */}
          <Card>
            <CardContent className="flex h-52 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-muted/60 to-muted p-6">
              {/* GSAP scope container */}
              <div ref={containerRef} className="flex items-center justify-center">
                <div
                  className="gsap-preview-box h-16 w-16 rounded-xl shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.6 0.22 260), oklch(0.5 0.22 310))",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Active config summary */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              [`gsap.${type}()`, ""],
              [ease, ""],
              [`${duration}s`, ""],
              x !== 0 ? [`x: ${x}px`, ""] : null,
              y !== 0 ? [`y: ${y}px`, ""] : null,
              rotation !== 0 ? [`rotate: ${rotation}°`, ""] : null,
              opacity !== 1 ? [`opacity: ${opacity}`, ""] : null,
              scale !== 1 ? [`scale: ${scale}`, ""] : null,
            ]
              .filter((item): item is [string, string] => item !== null)
              .map(([label], i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-primary"
                >
                  {label}
                </span>
              ))}
          </div>

          {/* Generated code */}
          <TextAreaField
            label="Generated React 19 Code"
            value={generatedCode}
            readOnly
            rows={16}
            action={
              <CopyButton value={generatedCode} disabled={!generatedCode} />
            }
          />
        </div>
      </div>
    </ToolLayout>
  );
}
