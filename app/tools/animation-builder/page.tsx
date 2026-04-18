"use client";

import { Check, Copy, Minus, Play, Plus, RotateCcw } from "lucide-react";
import { useId, useMemo, useState } from "react";

import {
  type Keyframe,
  type Preset,
  PRESETS,
  TIMING_FUNCTIONS,
} from "@/app/tools/animation-builder/presets";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function AnimationBuilderPage() {
  const animId = useId().replace(/:/g, "");
  const [keyframes, setKeyframes] = useState<Keyframe[]>(PRESETS[0].keyframes);
  const [duration, setDuration] = useState(400);
  const [timing, setTiming] = useState("ease-out");
  const [iterations, setIterations] = useState("1");
  const [replayKey, setReplayKey] = useState(0);
  const { copied, copy } = useCopyToClipboard();

  function applyPreset(preset: Preset) {
    setKeyframes(preset.keyframes);
    setDuration(preset.duration);
    setTiming(preset.timing);
    setIterations(preset.iterations);
    setReplayKey((k) => k + 1);
  }

  function addStop() {
    const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
    const lastPct = sorted[sorted.length - 1]?.percent ?? 0;
    const newPct = Math.min(100, lastPct + 20);
    setKeyframes([...keyframes, { percent: newPct, properties: [{ key: "opacity", value: "1" }] }]);
  }

  function removeStop(idx: number) {
    if (keyframes.length <= 2) return;
    setKeyframes(keyframes.filter((_, i) => i !== idx));
  }

  function updateStop(idx: number, field: "percent", value: number): void;
  function updateStop(
    idx: number,
    field: "properties",
    value: { key: string; value: string }[],
  ): void;
  function updateStop(idx: number, field: string, value: unknown) {
    setKeyframes(keyframes.map((kf, i) => (i === idx ? { ...kf, [field]: value } : kf)));
  }

  function addProp(stopIdx: number) {
    updateStop(stopIdx, "properties", [...keyframes[stopIdx].properties, { key: "", value: "" }]);
  }

  function removeProp(stopIdx: number, propIdx: number) {
    updateStop(
      stopIdx,
      "properties",
      keyframes[stopIdx].properties.filter((_, i) => i !== propIdx),
    );
  }

  function updateProp(stopIdx: number, propIdx: number, field: "key" | "value", val: string) {
    const props = keyframes[stopIdx].properties.map((p, i) =>
      i === propIdx ? { ...p, [field]: val } : p,
    );
    updateStop(stopIdx, "properties", props);
  }

  const sortedFrames = useMemo(
    () => [...keyframes].sort((a, b) => a.percent - b.percent),
    [keyframes],
  );

  const cssOutput = useMemo(() => {
    const name = `ss-anim-${animId.slice(-6)}`;
    const stops = sortedFrames
      .map((kf) => {
        const props = kf.properties
          .filter((p) => p.key && p.value)
          .map((p) => `    ${p.key}: ${p.value};`)
          .join("\n");
        return `  ${kf.percent}% {\n${props}\n  }`;
      })
      .join("\n");

    const iterStr = iterations === "infinite" ? "infinite" : iterations;
    return `@keyframes ${name} {\n${stops}\n}\n\n.animated {\n  animation: ${name} ${duration}ms ${timing} ${iterStr};\n}`;
  }, [sortedFrames, duration, timing, iterations, animId]);

  const previewStyle = useMemo(() => {
    return {
      animation: `ss-preview-${animId.slice(-6)} ${duration}ms ${timing} ${iterations === "infinite" ? "infinite" : parseInt(iterations) || 1}`,
    };
  }, [duration, timing, iterations, animId]);

  const previewKeyframesCss = useMemo(() => {
    const stops = sortedFrames
      .map((kf) => {
        const props = kf.properties
          .filter((p) => p.key && p.value)
          .map((p) => `${p.key}: ${p.value};`)
          .join(" ");
        return `${kf.percent}% { ${props} }`;
      })
      .join(" ");
    return `@keyframes ss-preview-${animId.slice(-6)} { ${stops} }`;
  }, [sortedFrames, animId]);

  return (
    <ToolLayout
      icon={Play}
      title="CSS Animation"
      highlight="Builder"
      description="Build CSS @keyframes animations visually. Add stops, set properties, and preview the result live."
    >
      <style>{previewKeyframesCss}</style>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Editor */}
        <div className="space-y-6">
          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Presets
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(p)}
                  className="rounded-full font-semibold"
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Keyframe stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Keyframe Stops
              </Label>
              <Button variant="outline" size="sm" onClick={addStop} className="rounded-full">
                <Plus size={12} /> Add Stop
              </Button>
            </div>

            {keyframes.map((kf, stopIdx) => (
              <Card key={stopIdx}>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Percent</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={kf.percent}
                        onChange={(e) =>
                          updateStop(stopIdx, "percent", parseInt(e.target.value) || 0)
                        }
                        className="font-mono"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStop(stopIdx)}
                      disabled={keyframes.length <= 2}
                      className="mt-5 rounded-full"
                    >
                      <Minus size={12} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {kf.properties.map((prop, propIdx) => (
                      <div key={propIdx} className="flex items-center gap-2">
                        <Input
                          value={prop.key}
                          onChange={(e) => updateProp(stopIdx, propIdx, "key", e.target.value)}
                          placeholder="property"
                          className="flex-1 font-mono text-xs"
                        />
                        <Input
                          value={prop.value}
                          onChange={(e) => updateProp(stopIdx, propIdx, "value", e.target.value)}
                          placeholder="value"
                          className="flex-1 font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProp(stopIdx, propIdx)}
                          disabled={kf.properties.length <= 1}
                          className="shrink-0 rounded-full"
                        >
                          <Minus size={12} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addProp(stopIdx)}
                      className="w-full rounded-full text-xs"
                    >
                      <Plus size={12} /> Add Property
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Animation settings */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Duration (ms)</Label>
              <Input
                type="number"
                min={50}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 300)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Timing</Label>
              <Select value={timing} onValueChange={(v) => v && setTiming(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMING_FUNCTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Iterations</Label>
              <Input
                value={iterations}
                onChange={(e) => setIterations(e.target.value)}
                placeholder="1 or infinite"
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right — Preview + Output */}
        <div className="space-y-6">
          {/* Live preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Live Preview
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReplayKey((k) => k + 1)}
                className="rounded-full font-semibold"
              >
                <RotateCcw size={12} /> Replay
              </Button>
            </div>
            <div className="border-border bg-muted/20 flex h-52 items-center justify-center rounded-xl border">
              <div
                key={replayKey}
                style={previewStyle}
                className="bg-primary/20 border-primary/40 text-primary flex h-16 w-16 items-center justify-center rounded-xl border font-mono text-xs"
              >
                .el
              </div>
            </div>
          </div>

          {/* CSS Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated CSS</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(cssOutput)}
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
            <Textarea readOnly value={cssOutput} rows={16} className="font-mono text-xs" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
