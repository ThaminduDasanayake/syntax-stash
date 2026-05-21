"use client";

import { useMemo, useState } from "react";

import { applyZalgo } from "@/app/tools/ascii-studio/helpers";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/components/ui/slider-field";

export function ZalgoTextTab() {
  const [text, setText] = useState("glitch me");
  const [chaos, setChaos] = useState(30);

  const output = useMemo(() => applyZalgo(text, chaos), [text, chaos]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InputField
          label="Input Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to glitch..."
        />

        <SliderField
          label="Chaos Level"
          valueLabel={chaos}
          leftLabel="Mild"
          rightLabel="Extreme"
          value={[chaos]}
          onValueChange={(vals) => setChaos(vals[0])}
          min={1}
          max={100}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Output</Label>
          <CopyButton textToCopy={output} disabled={!output} />
        </div>
        <div className="bg-muted/30 border-border min-h-56 rounded-xl border p-6">
          <p className="text-foreground font-mono text-2xl leading-48 break-all">
            {output || <span className="text-muted-foreground text-sm">Enter text above...</span>}
          </p>
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Combines Unicode combining diacritical marks (U+0300–U+036F) proportional to the chaos
        level. Output is valid Unicode — paste anywhere.
      </p>
    </div>
  );
}
