"use client";

import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";
import { CalendarClock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { COMMON_TIMEZONES, RANGE_OPTIONS } from "@/app/tools/cron-explorer/constants";
import { formatDate, relativeTime } from "@/app/tools/cron-explorer/helpers";
import { CronParsed, Range } from "@/app/tools/cron-explorer/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CronExplorerPage() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  const [expression, setExpression] = useState("*/15 * * * *");
  const [timezone, setTimezone] = useState("UTC");
  const [range, setRange] = useState<Range>("24h");

  // Hydration & Tick
  useEffect(() => {
    const mTimer = setTimeout(() => {
      setMounted(true);
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (COMMON_TIMEZONES.includes(userTz)) setTimezone(userTz);
    }, 0);

    // Tick every minute to keep relative times accurate
    const interval = setInterval(() => setNow(new Date()), 60000);

    return () => {
      clearTimeout(mTimer);
      clearInterval(interval);
    };
  }, []);

  // Parse Cron Expression
  const parsed = useMemo<CronParsed>(() => {
    const expr = expression.trim();
    if (!expr) return { ok: false, error: "Enter a cron expression." };

    try {
      const human = cronstrue.toString(expr);
      // Passing timezone to cronParser ensures accurate DST calculation!
      const interval = CronExpressionParser.parse(expr, { tz: timezone });

      const dates: Date[] = [];
      for (let i = 0; i < 20; i++) {
        dates.push(interval.next().toDate());
      }
      return { ok: true, human, dates };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Invalid cron expression" };
    }
  }, [expression, timezone]);

  const rangeMs = RANGE_OPTIONS.find((r) => r.value === range)!.ms;
  const rangeEnd = new Date(now.getTime() + rangeMs);

  // Filter dates for the timeline visualization
  const datesInRange = parsed.ok ? parsed.dates.filter((d) => d <= rangeEnd) : [];

  if (!mounted) return null;

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <ToolLayout
      icon={CalendarClock}
      title="Cron"
      highlight="Explorer"
      description="Translate cron expressions to plain English, and visualize upcoming executions on a timeline."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column — Inputs & Translation */}
        <div className="space-y-6">
          {/* Cron Input */}
          <div className="space-y-2">
            <InputField
              label="Cron Expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="* * * * *"
            />
            <p className="text-muted-foreground font-mono text-xs">
              minute · hour · day-of-month · month · day-of-week
            </p>
          </div>

          {/* Config row */}
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Timezone"
              value={timezone}
              onValueChange={setTimezone}
              options={COMMON_TIMEZONES.map((tz) => ({ value: tz, label: tz }))}
            />

            <SelectField
              label="Timeline Range"
              value={range}
              onValueChange={(v) => setRange(v as Range)}
              options={RANGE_OPTIONS.map((range) => ({ value: range.value, label: range.label }))}
            />
          </div>

          {/* Human-readable translation */}
          {parsed.ok ? (
            <div className="border-border bg-background rounded-xl border p-6 shadow-sm">
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                Translation
              </p>
              <p className="text-primary font-mono text-xl leading-snug">{parsed.human}</p>
            </div>
          ) : (
            expression.trim() && <ErrorAlert message={parsed.error} />
          )}

          {/* Timeline Visualization */}
          {parsed.ok && datesInRange.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
                Timeline ({datesInRange.length} fires in range)
              </p>

              <TooltipProvider>
                <div className="bg-muted border-accent relative h-12 overflow-hidden rounded-lg border">
                  {/* Visual Grid Lines (Quarters) */}
                  {[25, 50, 75].map((pct) => (
                    <div
                      key={pct}
                      className="bg-secondary absolute top-0 bottom-0 w-px"
                      style={{ left: `${pct}%` }}
                    />
                  ))}

                  {/* Center line */}
                  <div className="absolute inset-y-0 right-0 left-0 z-10 flex items-center px-2">
                    <div className="bg-secondary h-px w-full" />
                  </div>

                  {/* Data dots */}
                  {datesInRange.map((d, i) => {
                    const pct = ((d.getTime() - now.getTime()) / rangeMs) * 100;
                    return (
                      <Tooltip key={i}>
                        <TooltipTrigger
                          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-150"
                          style={{ left: `${Math.min(98, Math.max(2, pct))}%` }}
                        >
                          <div className="bg-primary ring-background size-2.5 rounded-full shadow-sm ring-2" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={8}
                          className="flex flex-col font-mono text-xs font-bold"
                        >
                          <p>
                            Execution #{i + 1} ({timezone})
                          </p>
                          <p>{formatDate(d, timezone)}</p>

                          {localTz && timezone !== localTz && (
                            <p className="border-border/50 border-t pt-1.5">
                              {formatDate(d, localTz)} LOCAL
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}

                  {/* Metadata */}
                  <span className="text-foreground pointer-events-none absolute bottom-1 left-2 z-10 text-[10px] font-medium uppercase">
                    Now
                  </span>
                  <span className="text-foreground pointer-events-none absolute right-2 bottom-1 z-10 text-[10px] font-medium uppercase">
                    +{RANGE_OPTIONS.find((r) => r.value === range)!.label.replace("Next ", "")}
                  </span>
                </div>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Right Column — Execution Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Next 20 Executions</Label>
            <span className="bg-muted rounded px-2 py-0.5 font-mono text-xs font-semibold tracking-wider uppercase">
              {timezone}
            </span>
          </div>

          {parsed.ok ? (
            <div className="space-y-2">
              {parsed.dates.map((d, i) => (
                <div
                  key={i}
                  className="bg-background border-border flex items-center justify-between rounded-lg border px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground w-6 font-mono text-xs">#{i + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-foreground font-mono text-sm">
                        {formatDate(d, timezone)}
                      </span>
                      {localTz && timezone !== localTz && (
                        <span className="text-muted-foreground mt-0.5 font-mono text-xs">
                          {formatDate(d, localTz)} <span className="ml-1 opacity-50">LOCAL</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-primary font-mono text-xs font-medium">
                    {relativeTime(d, now)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-border bg-muted flex min-h-full items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                Enter a valid expression to generate schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
