"use client";

import { CronField, FieldMode } from "@/app/tools/cron-studio/build-constants";
import { MultiSelect } from "@/app/tools/cron-studio/components/multi-select";
import { NumberInput } from "@/components/ui/number-input";
import { SelectField } from "@/components/ui/select-field";

interface FieldEditorProps {
  label: string;
  field: CronField;
  onChange: (f: CronField) => void;
  min: number;
  max: number;
  options: { value: number; label: string }[];
}

export function FieldEditor({ label, field, onChange, min, max, options }: FieldEditorProps) {
  const modeOptions = [
    { value: "every", label: "Every" },
    { value: "specific", label: "Specific values" },
    { value: "range", label: "Range" },
    { value: "step", label: "Step" },
  ];

  return (
    <div className="space-y-3">
      <SelectField
        label={label}
        value={field.mode}
        onValueChange={(v) => onChange({ ...field, mode: v as FieldMode })}
        options={modeOptions}
        triggerClassName="w-44"
      />

      {field.mode === "specific" && (
        <MultiSelect
          values={options}
          selected={field.specific}
          onChange={(vals) => onChange({ ...field, specific: vals })}
        />
      )}

      {field.mode === "range" && (
        <div className="flex w-full items-center gap-2">
          <NumberInput
            value={field.rangeFrom}
            onValueChange={(v) => onChange({ ...field, rangeFrom: v })}
            min={min}
            max={field.rangeTo}
            className="text-center font-mono"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <NumberInput
            value={field.rangeTo}
            onValueChange={(v) => onChange({ ...field, rangeTo: v })}
            min={field.rangeFrom}
            max={max}
            className="text-center font-mono"
          />
        </div>
      )}

      {field.mode === "step" && (
        <div className="flex items-center gap-2">
          <NumberInput
            value={field.stepFrom}
            onValueChange={(v) => onChange({ ...field, stepFrom: v })}
            min={min}
            max={max}
            prefix="from"
            inputGroupClassName="w-40"
            className="text-center font-mono"
          />

          <NumberInput
            value={field.stepEvery}
            onValueChange={(v) => onChange({ ...field, stepEvery: v })}
            min={1}
            max={max}
            prefix="every"
            inputGroupClassName="w-40"
            className="text-center font-mono"
          />
        </div>
      )}
    </div>
  );
}
