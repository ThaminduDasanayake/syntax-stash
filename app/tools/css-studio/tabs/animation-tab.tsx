"use client";

import { ArrowCounterClockwiseIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useId, useMemo, useState } from "react";

import {
  COMMON_PROPERTIES,
  type Keyframe,
  type Preset,
  PRESETS,
  TIMING_FUNCTIONS,
} from "@/app/tools/css-studio/animation-data";
import { InputField } from "@/components/ui//input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { StepperField } from "@/components/ui/stepper-field";
import { TextareaGroup } from "@/components/ui/textarea-group";

export function AnimationTab() {
  const animId = useId().replace(/:/g, "");
  const [keyframes, setKeyframes] = useState<Keyframe[]>(PRESETS[0].keyframes);
  const [duration, setDuration] = useState(400);
  const [timing, setTiming] = useState("ease-out");
  const [iterations, setIterations] = useState("1");
  const [replayKey, setReplayKey] = useState(0);

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
    <>
      <style>{previewKeyframesCss}</style>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant={p.label === animId ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyPreset(p)}
                  className="font-semibold"
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Keyframe Stops</Label>
              <Button variant="outline" size="sm" onClick={addStop}>
                <PlusIcon /> Add Stop
              </Button>
            </div>

            {keyframes.map((kf, stopIdx) => (
              <Card key={stopIdx}>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <StepperField
                      label="Percent"
                      min={0}
                      max={100}
                      value={kf.percent}
                      onValueChange={(val) => updateStop(stopIdx, "percent", val)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStop(stopIdx)}
                      disabled={keyframes.length <= 2}
                      className="mt-5"
                    >
                      <MinusIcon />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {kf.properties.map((prop, propIdx) => (
                      <div key={propIdx} className="flex w-full items-center gap-2">
                        <div className="w-50 shrink-0">
                          <Combobox
                            items={COMMON_PROPERTIES}
                            value={prop.key || null}
                            onValueChange={(val) => {
                              updateProp(stopIdx, propIdx, "key", val || "");
                            }}
                            autoHighlight
                          >
                            <ComboboxInput placeholder="property" showClear />

                            <ComboboxContent className="w-50">
                              <ComboboxEmpty>No items found.</ComboboxEmpty>
                              <ComboboxList>
                                {(item) => (
                                  <ComboboxItem key={item} value={item}>
                                    {item}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                        </div>

                        <InputField
                          value={prop.value}
                          onChange={(e) => updateProp(stopIdx, propIdx, "value", e.target.value)}
                          placeholder="value"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProp(stopIdx, propIdx)}
                          disabled={kf.properties.length <= 1}
                          className="shrink-0"
                        >
                          <MinusIcon />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addProp(stopIdx)}
                      className="w-full gap-2"
                    >
                      <PlusIcon /> Add Property
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StepperField
              label="Duration (ms)"
              min={50}
              max={10000}
              step={50}
              value={duration}
              onValueChange={setDuration}
            />

            <SelectField
              label="Timing"
              value={timing}
              onValueChange={(v) => v && setTiming(v)}
              options={TIMING_FUNCTIONS.map((timing) => ({ value: timing, label: timing }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StepperField
              label="Iterations"
              min={1}
              step={1}
              value={iterations === "infinite" ? 1 : Number(iterations)}
              onValueChange={(val) => setIterations(val.toString())}
              disabled={iterations === "infinite"}
            />
            <Button
              variant={iterations === "infinite" ? "default" : "outline"}
              className="mt-5.5"
              onClick={() => setIterations(iterations === "infinite" ? "1" : "infinite")}
            >
              Infinite
            </Button>
          </div>
        </div>

        <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Live Preview</Label>
              <Button variant="outline" size="sm" onClick={() => setReplayKey((k) => k + 1)}>
                <ArrowCounterClockwiseIcon /> Replay
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

          <TextareaGroup
            label="Generated CSS"
            readOnly
            value={cssOutput}
            action={<CopyButton iconOnly textToCopy={cssOutput} disabled={!cssOutput} />}
          />
        </div>
      </div>
    </>
  );
}
