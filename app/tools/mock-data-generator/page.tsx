"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { SCHEMA_DETAILS } from "@/app/tools/mock-data-generator/data";
import { generate } from "@/app/tools/mock-data-generator/helpers";
import { SchemaId } from "@/app/tools/mock-data-generator/types";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { SliderField } from "@/components/ui/slider-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";
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

  const tool = internalTools.find((t) => t.slug === "mock-data-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-4">
        <div className="flex shrink-0 flex-col space-y-4">
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
            <SelectField
              label="Schema"
              options={SCHEMA_DETAILS}
              value={schema}
              containerClassName="w-full"
              onValueChange={(v) => v && setSchema(v as SchemaId)}
            />
            <SliderField
              label="Count (1–50)"
              valueLabel={count}
              value={[count]}
              containerClassName="w-full"
              onValueChange={(vals) => setCount(vals[0])}
              min={1}
              max={50}
            />
          </div>
          <Button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="max-w-48 font-semibold"
          >
            <ArrowsClockwiseIcon weight="bold" className={cn(isGenerating && "animate-spin")} />
            {isGenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <TextareaGroup
            label="Output"
            readOnly
            value={json}
            action={<CopyButton iconOnly textToCopy={json} disabled={!json} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
