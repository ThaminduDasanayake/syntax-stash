"use client";

import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";
import { useEffect, useMemo, useState } from "react";

import { COMMON_TIMEZONES, RANGE_OPTIONS } from "@/app/tools/cron-studio/explore-constants";
import { formatDate, relativeTime } from "@/app/tools/cron-studio/explore-helpers";
import { CronParsed, Range } from "@/app/tools/cron-studio/explore-types";
import { ErrorAlert } from "@/components/error-alert";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExploreTabProps {
  expression: string;
  setExpression: (v: string) => void;
}

export function ExploreTab({ expression, setExpression }: ExploreTabProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  const [timezone, setTimezone] = useState("UTC");
  const [range, setRange] = useState<Range>("24h");

  useEffect(() => {
    const mTimer = setTimeout(() => {
      setMounted(true);
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (COMMON_TIMEZONES.includes(userTz)) setTimezone(userTz);
    }, 0);

    const interval = setInterval(() => setNow(new Date()), 60000);

    return () => {
      clearTimeout(mTimer);
      clearInterval(interval);
    };
  }, []);

  const parsed = useMemo<CronParsed>(() => {
    const expr = expression.trim();
    if (!expr) return { ok: false, error: "Enter a cron expression." };

    try {
      const human = cronstrue.toString(expr);
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
  const datesInRange = parsed.ok ? parsed.dates.filter((d) => d <= rangeEnd) : [];

  if (!mounted) return null;

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Inputs & Translation */}
      <div className="space-y-6">
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
            options={RANGE_OPTIONS}
          />
        </div>

        {parsed.ok ? (
          <div className="border-border bg-background border p-6">
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Translation
            </p>
            <p className="text-primary font-mono text-xl leading-snug">{parsed.human}</p>
          </div>
        ) : (
          expression.trim() && <ErrorAlert message={parsed.error} />
        )}

        {parsed.ok && datesInRange.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Timeline ({datesInRange.length} fires in range)
            </p>

            <TooltipProvider>
              <div className="bg-muted border-accent relative h-12 overflow-hidden border">
                {[25, 50, 75].map((pct) => (
                  <div
                    key={pct}
                    className="bg-secondary absolute top-0 bottom-0 w-px"
                    style={{ left: `${pct}%` }}
                  />
                ))}

                <div className="absolute inset-y-0 right-0 left-0 z-10 flex items-center px-2">
                  <div className="bg-secondary h-px w-full" />
                </div>

                {datesInRange.map((d, i) => {
                  const pct = ((d.getTime() - now.getTime()) / rangeMs) * 100;
                  return (
                    <Tooltip key={i}>
                      <TooltipTrigger
                        className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-150"
                        style={{ left: `${Math.min(98, Math.max(2, pct))}%` }}
                      >
                        <div className="bg-primary ring-accent size-2.5 rounded-full ring" />
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

                <span className="text-foreground text-telemetry pointer-events-none absolute bottom-1 left-2 z-10">
                  Now
                </span>
                <span className="text-foreground text-telemetry pointer-events-none absolute right-2 bottom-1 z-10">
                  +{RANGE_OPTIONS.find((r) => r.value === range)!.label.replace("Next ", "")}
                </span>
              </div>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Execution Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Next 20 Executions</Label>
          <span className="bg-muted text-console px-2 py-0.5">{timezone}</span>
        </div>

        {parsed.ok ? (
          <div className="space-y-2">
            {parsed.dates.map((d, i) => (
              <div
                key={i}
                className="bg-background border-border flex items-center justify-between border px-4 py-3"
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
          <div className="border-border bg-muted flex min-h-full items-center justify-center border border-dashed">
            <p className="text-muted-foreground text-sm">
              Enter a valid expression to generate schedule.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
