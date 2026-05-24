"use client";

import { useGSAP } from "@gsap/react";
import { PlayIcon } from "@phosphor-icons/react";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";

import {
  easingOptions,
  positionClasses,
  positionOptions,
  typeOptions,
} from "@/app/tools/css-studio/gsap-data";
import {
  AnimationType,
  EasingType,
  generateCode,
  PositionType,
} from "@/app/tools/css-studio/gsap-helpers";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function GsapTab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startPosition, setStartPosition] = useState<PositionType>("center");

  const [type, setType] = useState<AnimationType>("from");
  const [ease, setEase] = useState<EasingType>("power3.inOut");
  const [duration, setDuration] = useState(1.2);
  const [x, setX] = useState(0);
  const [y, setY] = useState(-60);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(1);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handlePlay = contextSafe(() => {
    gsap.killTweensOf(".gsap-preview-box");
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
  });

  const handleReset = contextSafe(() => {
    gsap.killTweensOf(".gsap-preview-box");
    gsap.set(".gsap-preview-box", { clearProps: "all" });
  });

  const generatedCode = useMemo(
    () => generateCode({ type, ease, duration, x, y, rotation, opacity, scale }),
    [type, ease, duration, x, y, rotation, opacity, scale],
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <SelectField
            label="Initial Box Position"
            value={startPosition}
            onValueChange={(v) => setStartPosition(v as PositionType)}
            options={positionOptions}
          />

          <SelectField
            label="Animation Type"
            value={type}
            onValueChange={(v) => setType(v as AnimationType)}
            options={typeOptions}
          />

          <SelectField
            label="Easing"
            value={ease}
            onValueChange={(v) => setEase(v as EasingType)}
            options={easingOptions}
          />

          <InputField
            label="Duration (seconds)"
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
          />

          <div className="pt-2">
            <Label className="mb-2">Transform</Label>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                label="X (px)"
                type="number"
                value={x}
                onChange={(e) => setX(parseInt(e.target.value, 10) || 0)}
              />
              <InputField
                label="Y (px)"
                type="number"
                value={y}
                onChange={(e) => setY(parseInt(e.target.value, 10) || 0)}
              />
              <InputField
                label="Rotation (°)"
                type="number"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10) || 0)}
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
              />
              <InputField
                label="Scale"
                type="number"
                min={0}
                step={0.1}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button className="flex-1 gap-2" onClick={handlePlay}>
              <PlayIcon weight="duotone" />
              Play Animation
            </Button>

            <ClearButton label="Reset" onClick={handleReset} />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="bg-background dark:bg-foreground relative flex min-h-120 overflow-hidden rounded-xl border">
            <div ref={containerRef} className="relative h-full w-full">
              <div
                className={cn(
                  "gsap-preview-box bg-secondary dark:bg-primary border-foreground dark:border-border absolute h-16 w-16 rounded-xl border shadow-lg",
                  positionClasses[startPosition],
                )}
              />
            </div>
          </div>

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
                  className="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-mono"
                >
                  {label}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
        <TextareaGroup
          autoGrow
          label="Generated React 19 Code"
          value={generatedCode}
          readOnly
          action={<CopyButton iconOnly textToCopy={generatedCode} disabled={!generatedCode} />}
        />
      </div>
    </div>
  );
}
