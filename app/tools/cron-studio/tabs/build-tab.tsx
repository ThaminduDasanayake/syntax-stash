"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useState } from "react";

import {
  CronField,
  DEFAULT_FIELD,
  DOM,
  DOW,
  FieldMode,
  HOURS,
  MINUTES,
  MONTHS,
  PresetKey,
  PRESETS,
} from "@/app/tools/cron-studio/build-constants";
import { buildDescription, buildExpression } from "@/app/tools/cron-studio/build-helpers";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";

function MultiSelect({
  values,
  selected,
  onChange,
  max = 10,
}: {
  values: { value: number; label: string }[];
  selected: number[];
  onChange: (vals: number[]) => void;
  max?: number;
}) {
  const toggle = (v: number) => {
    if (selected.includes(v)) {
      onChange(selected.filter((x) => x !== v));
    } else {
      if (selected.length >= max) return;
      onChange([...selected, v]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => toggle(value)}
          className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
            selected.includes(value)
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/60"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v >= min && v <= max) onChange(v);
      }}
      className="border-input bg-background w-20 rounded-md border px-2 py-1 text-sm"
    />
  );
}

interface FieldEditorProps {
  label: string;
  field: CronField;
  onChange: (f: CronField) => void;
  min: number;
  max: number;
  options: { value: number; label: string }[];
}

function FieldEditor({ label, field, onChange, min, max, options }: FieldEditorProps) {
  const modeOptions = [
    { value: "every", label: "Every" },
    { value: "specific", label: "Specific values" },
    { value: "range", label: "Range" },
    { value: "step", label: "Step" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-36 text-sm font-medium">{label}</span>
        <SelectField
          value={field.mode}
          onValueChange={(v) => onChange({ ...field, mode: v as FieldMode })}
          options={modeOptions}
          triggerClassName="w-44"
        />
      </div>

      {field.mode === "specific" && (
        <div className="pl-38">
          <MultiSelect
            values={options}
            selected={field.specific}
            onChange={(vals) => onChange({ ...field, specific: vals })}
          />
        </div>
      )}

      {field.mode === "range" && (
        <div className="flex items-center gap-2 pl-38">
          <NumberInput
            value={field.rangeFrom}
            onChange={(v) => onChange({ ...field, rangeFrom: v })}
            min={min}
            max={field.rangeTo}
          />
          <span className="text-muted-foreground text-sm">to</span>
          <NumberInput
            value={field.rangeTo}
            onChange={(v) => onChange({ ...field, rangeTo: v })}
            min={field.rangeFrom}
            max={max}
          />
        </div>
      )}

      {field.mode === "step" && (
        <div className="flex items-center gap-2 pl-38">
          <span className="text-muted-foreground text-sm">from</span>
          <NumberInput
            value={field.stepFrom}
            onChange={(v) => onChange({ ...field, stepFrom: v })}
            min={min}
            max={max}
          />
          <span className="text-muted-foreground text-sm">every</span>
          <NumberInput
            value={field.stepEvery}
            onChange={(v) => onChange({ ...field, stepEvery: v })}
            min={1}
            max={max}
          />
        </div>
      )}
    </div>
  );
}

interface BuildTabProps {
  onSendToExplore: (expression: string) => void;
}

export function BuildTab({ onSendToExplore }: BuildTabProps) {
  const [preset, setPreset] = useState<PresetKey>("every-15-minutes");
  const [minute, setMinute] = useState<CronField>(DEFAULT_FIELD(0, 59));
  const [hour, setHour] = useState<CronField>(DEFAULT_FIELD(0, 23));
  const [dom, setDom] = useState<CronField>(DEFAULT_FIELD(1, 31));
  const [month, setMonth] = useState<CronField>(DEFAULT_FIELD(1, 12));
  const [dow, setDow] = useState<CronField>(DEFAULT_FIELD(0, 6));

  const isCustom = preset === "custom";

  const expression = isCustom
    ? buildExpression(minute, hour, dom, month, dow)
    : PRESETS[preset].expression;

  const description = isCustom
    ? buildDescription(minute, hour, dom, month, dow)
    : PRESETS[preset].description;

  const minuteOptions = MINUTES.map((v) => ({ value: v, label: String(v) }));
  const hourOptions = HOURS.map((v) => ({ value: v, label: String(v) }));
  const domOptions = DOM.map((v) => ({ value: v, label: String(v) }));

  const finalExpression = expression || "* * * * *";

  return (
    <>
      {/* Expression output */}
      <div className="bg-muted mb-8 rounded-xl p-6">
        <div className="mb-1 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-3xl font-bold tracking-widest">{finalExpression}</p>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendToExplore(finalExpression)}
              className="gap-2"
            >
              Test in Explore
              <ArrowRightIcon weight="bold" className="size-4" />
            </Button>
            <CopyButton textToCopy={finalExpression} size="sm" />
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          {["minute", "hour", "day", "month", "weekday"].map((label, i) => (
            <div key={label} className="text-center">
              <p className="font-mono text-lg font-semibold">{finalExpression.split(" ")[i]}</p>
              <p className="text-muted-foreground text-[10px] tracking-wider uppercase">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preset selector */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {Object.entries(PRESETS).map(([k, v]) => (
          <Button
            key={k}
            variant={preset === k ? "default" : "outline"}
            size="sm"
            onClick={() => setPreset(k as PresetKey)}
            className="text-xs"
          >
            {v.label}
          </Button>
        ))}
      </div>

      {/* Custom builder */}
      {isCustom && (
        <div className="space-y-5 rounded-xl border p-6">
          <h3 className="text-sm font-semibold">Custom Expression Builder</h3>
          <FieldEditor
            label="Minute (0–59)"
            field={minute}
            onChange={setMinute}
            min={0}
            max={59}
            options={minuteOptions}
          />
          <FieldEditor
            label="Hour (0–23)"
            field={hour}
            onChange={setHour}
            min={0}
            max={23}
            options={hourOptions}
          />
          <FieldEditor
            label="Day of month"
            field={dom}
            onChange={setDom}
            min={1}
            max={31}
            options={domOptions}
          />
          <FieldEditor
            label="Month"
            field={month}
            onChange={setMonth}
            min={1}
            max={12}
            options={MONTHS}
          />
          <FieldEditor
            label="Day of week"
            field={dow}
            onChange={setDow}
            min={0}
            max={6}
            options={DOW}
          />
        </div>
      )}

      {/* Reference */}
      <div className="mt-8 border-t pt-6">
        <h3 className="mb-3 text-sm font-semibold">Cron Format Reference</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { token: "*", desc: "Every value" },
            { token: "5,15,30", desc: "Specific values" },
            { token: "1-5", desc: "Range" },
            { token: "*/15", desc: "Every Nth value" },
          ].map(({ token, desc }) => (
            <div key={token} className="bg-muted rounded-lg p-3">
              <p className="font-mono text-sm font-semibold">{token}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
