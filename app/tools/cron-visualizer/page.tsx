"use client";

import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
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

type Range = "24h" | "7d" | "30d";

const RANGE_OPTIONS: { value: Range; label: string; ms: number }[] = [
  { value: "24h", label: "Next 24 hours", ms: 24 * 60 * 60 * 1000 },
  { value: "7d", label: "Next 7 days", ms: 7 * 24 * 60 * 60 * 1000 },
  { value: "30d", label: "Next 30 days", ms: 30 * 24 * 60 * 60 * 1000 },
];

// Common timezones — avoids rendering 600+ items in a Select
const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function relativeTime(date: Date, now: Date): string {
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);
  if (diffMin < 1) return "in < 1 min";
  if (diffMin < 60) return `in ${diffMin}m`;
  if (diffHr < 24) return `in ${diffHr}h ${diffMin % 60}m`;
  return `in ${diffDay}d ${diffHr % 24}h`;
}

function formatDate(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export default function CronVisualizerPage() {
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [expression, setExpression] = useState("*/15 * * * *");
  const [timezone, setTimezone] = useState(
    COMMON_TIMEZONES.includes(userTz) ? userTz : "UTC",
  );
  const [range, setRange] = useState<Range>("24h");

  const result = useMemo<
    | { ok: true; human: string; dates: Date[] }
    | { ok: false; error: string }
  >(() => {
    const expr = expression.trim();
    if (!expr) return { ok: false, error: "Enter a cron expression." };
    try {
      const human = cronstrue.toString(expr);
      const interval = CronExpressionParser.parse(expr);
      const dates: Date[] = [];
      for (let i = 0; i < 20; i++) {
        dates.push(interval.next().toDate());
      }
      return { ok: true, human, dates };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Invalid cron expression",
      };
    }
  }, [expression]);

  const rangeMs = RANGE_OPTIONS.find((r) => r.value === range)!.ms;
  const now = new Date();
  const rangeEnd = new Date(now.getTime() + rangeMs);

  // Dates within the selected range (for the timeline)
  const datesInRange = result.ok
    ? result.dates.filter((d) => d <= rangeEnd)
    : [];

  return (
    <ToolLayout
      icon={CalendarClock}
      title="Crontab Schedule"
      highlight="Visualizer"
      description="See exactly when your cron jobs fire. Visualise the next 20 executions on a timeline with relative times."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Cron Expression</Label>
            <Input
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="*/15 * * * *"
              className="font-mono"
            />
            <p className="text-muted-foreground font-mono text-xs">
              minute · hour · day-of-month · month · day-of-week
            </p>
          </div>

          <div className="space-y-2">
            <Label>Display Timezone</Label>
            <Select value={timezone} onValueChange={(v) => v && setTimezone(v)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMMON_TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Range</Label>
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Human-readable description */}
          {result.ok ? (
            <Card>
              <CardContent>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Translation
                </p>
                <p className="text-primary font-mono text-lg leading-snug">
                  {result.human}
                </p>
              </CardContent>
            </Card>
          ) : (
            expression.trim() && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p className="font-mono">{result.error}</p>
              </div>
            )
          )}

          {/* Timeline dot plot */}
          {result.ok && datesInRange.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Timeline ({datesInRange.length} fires in range)
              </p>
              <div className="relative h-10 overflow-hidden rounded-lg bg-muted">
                {/* Range bar */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center px-2">
                  <div className="bg-border h-0.5 w-full rounded" />
                </div>
                {/* Dots */}
                {datesInRange.map((d, i) => {
                  const pct =
                    ((d.getTime() - now.getTime()) / rangeMs) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${Math.min(98, Math.max(2, pct))}%` }}
                    >
                      <div className="bg-primary size-2.5 rounded-full" />
                    </div>
                  );
                })}
                {/* Labels */}
                <span className="text-muted-foreground absolute bottom-0 left-1 text-[9px]">
                  now
                </span>
                <span className="text-muted-foreground absolute bottom-0 right-1 text-[9px]">
                  +{RANGE_OPTIONS.find((r) => r.value === range)!.label.replace("Next ", "")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right — Execution table */}
        <div className="space-y-3">
          {result.ok ? (
            <>
              <div className="flex items-center justify-between">
                <Label>Next 20 Executions</Label>
                <span className="text-muted-foreground font-mono text-xs">
                  {timezone}
                </span>
              </div>
              <div className="space-y-1.5">
                {result.dates.map((d, i) => (
                  <div
                    key={i}
                    className="border-border flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-5 font-mono text-xs">
                        #{i + 1}
                      </span>
                      <span className="text-foreground font-mono text-xs">
                        {formatDate(d, timezone)}
                      </span>
                    </div>
                    <span className="text-primary font-mono text-xs">
                      {relativeTime(d, now)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="border-border flex min-h-60 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                Enter a valid cron expression to see the schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
