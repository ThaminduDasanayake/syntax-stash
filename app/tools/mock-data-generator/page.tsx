"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { SCHEMA_DETAILS } from "@/app/tools/mock-data-generator/data";
import { generate } from "@/app/tools/mock-data-generator/helpers";
import { SchemaId } from "@/app/tools/mock-data-generator/types";
import { ToolLayout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Slider } from "@/components/ui/slider";
import { TextAreaField } from "@/components/ui/textarea-field";
import { developmentTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

export default function MockDataPage() {
  const [schema, setSchema] = useState<SchemaId>("users");
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const json = useMemo(() => {
    void seed;

    const safeCount = Math.max(1, Math.min(50, Math.floor(count) || 1));
    return JSON.stringify(generate(schema, safeCount), null, 2);
  }, [schema, count, seed]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setSeed((s) => s + 1);

    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  const tool = developmentTools.find((t) => t.url === "/tools/mock-data-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div className="space-y-6">
          <SelectField
            label="Schema"
            options={SCHEMA_DETAILS.map(({ value, label }) => ({ value: value, label: label }))}
            value={schema}
            onValueChange={(v) => v && setSchema(v as SchemaId)}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Count (1–50)</Label>
              <span className="text-muted-foreground font-mono text-sm">{count}</span>
            </div>
            <Slider
              value={[count]}
              onValueChange={(vals) => setCount(Array.isArray(vals) ? vals[0] : vals)}
              min={1}
              max={50}
              step={1}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button onClick={handleRegenerate} disabled={isGenerating} className="font-semibold">
              <ArrowsClockwiseIcon weight="bold" className={cn(isGenerating && "animate-spin")} />
              {isGenerating ? "Regenerating..." : "Regenerate"}
            </Button>
            <CopyButton className="text-sm" value={json} disabled={!json} />
          </div>
        </div>

        <TextAreaField label="Output" readOnly value={json} rows={20} />
      </div>
    </ToolLayout>
  );
}
