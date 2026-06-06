"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useState } from "react";

import {
  CronField,
  DEFAULT_FIELD,
  DOM,
  DOW,
  HOURS,
  MINUTES,
  MONTHS,
  PresetKey,
  PRESETS,
} from "@/app/tools/cron-studio/build-constants";
import { buildDescription, buildExpression } from "@/app/tools/cron-studio/build-helpers";
import { FieldEditor } from "@/app/tools/cron-studio/components/field-editor";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

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
    <div className="space-y-8">
      {/* Expression output */}
      <Card>
        <CardContent>
          <div className="mb-1 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-3xl font-bold tracking-widest">{finalExpression}</p>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendToExplore(finalExpression)}
                className="gap-2"
              >
                Test in Explore
                <ArrowRightIcon weight="bold" />
              </Button>
              <CopyButton textToCopy={finalExpression} size="sm" />
            </ButtonGroup>
          </div>
          <div className="mt-4 flex gap-6">
            {["minute", "hour", "day", "month", "weekday"].map((label, i) => (
              <div key={label} className="text-center">
                <p className="font-mono text-lg font-semibold">{finalExpression.split(" ")[i]}</p>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
        <div className="space-y-5 border p-6">
          <h3 className="text-base font-semibold">Custom Expression Builder</h3>
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
            <div key={token} className="bg-muted p-3">
              <p className="font-mono text-sm font-semibold">{token}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
