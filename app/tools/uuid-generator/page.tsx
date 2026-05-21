"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { SliderField } from "@/components/ui/slider-field";
import { SwitchField } from "@/components/ui/switch-field";
import { internalTools } from "@/lib/tools-data";

import { formatUUID, generateV4, generateV7, NIL_UUID } from "./helpers";

type UUIDVersion = "v4" | "v7" | "nil";

function generateBatch(version: UUIDVersion, count: number): string[] {
  if (version === "nil") return Array(count).fill(NIL_UUID);
  return Array.from({ length: count }, () => (version === "v4" ? generateV4() : generateV7()));
}

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [count, setCount] = useState(10);
  const [uuids, setUuids] = useState<string[]>(() => generateBatch("v4", 10));
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);

  const handleVersionChange = (v: UUIDVersion) => {
    setVersion(v);
    setUuids(generateBatch(v, count));
  };

  const handleCountChange = (val: number | number[]) => {
    const newCount = Array.isArray(val) ? val[0] : val;
    setCount(newCount);
    setUuids(generateBatch(version, newCount));
  };

  const handleRegenerate = () => {
    setUuids(generateBatch(version, count));
  };

  const formatted = uuids.map((id) => formatUUID(id, uppercase, noHyphens));
  const allText = formatted.join("\n");

  const versionOptions = [
    { value: "v4", label: "v4 — Random" },
    { value: "v7", label: "v7 — Time-ordered (RFC 9562)" },
    { value: "nil", label: "NIL — All zeros" },
  ];

  const tool = internalTools.find((t) => t.slug === "uuid-generator");

  return (
    <ToolLayout tool={tool}>
      {/* Controls */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField
          label="Version"
          value={version}
          onValueChange={(v) => handleVersionChange(v as UUIDVersion)}
          options={versionOptions}
        />

        <SliderField
          label="Count"
          valueLabel={count}
          value={[count]}
          onValueChange={handleCountChange}
          min={1}
          max={100}
        />

        <div className="flex flex-col justify-end gap-3">
          <SwitchField label="Uppercase" checked={uppercase} onCheckedChange={setUppercase} />
          <SwitchField label="No hyphens" checked={noHyphens} onCheckedChange={setNoHyphens} />
        </div>

        <div className="flex flex-col justify-end gap-2">
          <Button onClick={handleRegenerate} className="w-full font-semibold">
            <ArrowsClockwiseIcon weight="bold" /> Regenerate
          </Button>
          <CopyButton
            textToCopy={allText}
            disabled={!allText}
            labelName="Copy All"
            className="w-full"
          />
        </div>
      </div>

      {/* UUID List */}
      <div className="mt-8 space-y-1">
        {formatted.map((uuid, i) => (
          <div
            key={i}
            className="group bg-muted hover:bg-muted/80 flex items-center justify-between rounded-md px-3 py-2 transition-colors"
          >
            <span className="font-mono text-sm">{uuid}</span>

            <CopyButton iconOnly textToCopy={uuid} />
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 border-t pt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Count</p>
            <p className="text-lg font-semibold">{formatted.length}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Version</p>
            <p className="text-lg font-semibold">{version.toUpperCase()}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Character Length</p>
            <p className="text-lg font-semibold">{formatted[0]?.length ?? 0}</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
