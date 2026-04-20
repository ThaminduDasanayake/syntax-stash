"use client";

import { Clock, Minus, Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { MATH_UNIT_OPTIONS, TIMEZONES, UNIT_MS } from "@/app/tools/time-calculator/constants";
import ConvertField from "@/app/tools/time-calculator/convert-field";
import {
  getGmtOffset,
  getRelativeTime,
  isValidDate,
  toLocal,
} from "@/app/tools/time-calculator/helpers";
import { MathUnit } from "@/app/tools/time-calculator/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TimeCalculatorPage() {
  const [mounted, setMounted] = useState(false);
  const [liveDate, setLiveDate] = useState<Date>(() => new Date());

  // Hydration workaround & Live Clock
  useEffect(() => {
    const mTimer = setTimeout(() => setMounted(true), 0);
    const interval = setInterval(() => setLiveDate(new Date()), 1000);
    return () => {
      clearTimeout(mTimer);
      clearInterval(interval);
    };
  }, []);

  const [unixSec, setUnixSec] = useState<string>("");
  const [unixMs, setUnixMs] = useState<string>("");
  const [iso, setIso] = useState<string>("");
  const [local, setLocal] = useState<string>("");
  const [use12Hour, setUse12Hour] = useState(false);

  // Dynamic formatting engine that respects the toggle
  const formatDisplayTime = useCallback(
    (d: Date, tz?: string, showTzName: boolean = true) => {
      return d.toLocaleString("en-GB", {
        timeZone: tz,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: use12Hour,
        ...(showTzName && { timeZoneName: "short" }),
      });
    },
    [use12Hour],
  );

  const syncFrom = useCallback((d: Date) => {
    if (!isValidDate(d)) return;
    setUnixSec(String(Math.floor(d.getTime() / 1000)));
    setUnixMs(String(d.getTime()));
    setIso(d.toISOString());
    setLocal(toLocal(d));
  }, []);

  const handleUnixSec = useCallback(
    (raw: string) => {
      setUnixSec(raw);
      const n = Number(raw);
      if (raw === "" || isNaN(n)) return;
      const d = new Date(n * 1000);
      if (isValidDate(d)) syncFrom(d);
    },
    [syncFrom],
  );

  const handleUnixMs = useCallback(
    (raw: string) => {
      setUnixMs(raw);
      const n = Number(raw);
      if (raw === "" || isNaN(n)) return;
      const d = new Date(n);
      if (isValidDate(d)) syncFrom(d);
    },
    [syncFrom],
  );

  const handleIso = useCallback(
    (raw: string) => {
      setIso(raw);
      const d = new Date(raw);
      if (isValidDate(d)) syncFrom(d);
    },
    [syncFrom],
  );

  const handleLocal = useCallback(
    (raw: string) => {
      setLocal(raw);
      const d = new Date(raw.replace(" ", "T"));
      if (isValidDate(d)) syncFrom(d);
    },
    [syncFrom],
  );

  const useNow = useCallback(() => syncFrom(new Date()), [syncFrom]);

  const [mathBaseDate, setMathBaseDate] = useState<string>(() => toLocal(new Date()));
  const [mathAmount, setMathAmount] = useState<string>("1");
  const [mathUnit, setMathUnit] = useState<MathUnit>("days");
  const [mathMode, setMathMode] = useState<"add" | "subtract">("add");

  const mathResult = useMemo(() => {
    if (!mathBaseDate) return null;
    const date = new Date(mathBaseDate.replace(" ", "T"));
    if (!isValidDate(date)) return null;

    const amount = parseFloat(mathAmount) || 0;
    if (amount === 0) return date;

    const multiplier = mathMode === "add" ? 1 : -1;
    // UNIT_MS should contain seconds, minutes, hours, days (from your constants)
    const msToAdd = multiplier * amount * (UNIT_MS[mathUnit] || 0);

    return new Date(date.getTime() + msToAdd);
  }, [mathBaseDate, mathAmount, mathUnit, mathMode]);

  const headerUTCTime = useMemo(
    () => formatDisplayTime(liveDate, "UTC"),
    [liveDate, formatDisplayTime],
  );
  const headerTimestamp = useMemo(() => String(Math.floor(liveDate.getTime() / 1000)), [liveDate]);

  if (!mounted) return null;

  return (
    <ToolLayout
      icon={Clock}
      title="Time"
      highlight="Calculator"
      description="Unix timestamps, date arithmetic, and timezone conversion."
    >
      <div className="space-y-6">
        <Card className="mb-6">
          <CardContent className="flex flex-row items-center justify-between py-4">
            <div className="flex flex-col space-y-1">
              <p className="text-muted-foreground font-mono text-sm">Current Time</p>
              <p className="font-mono text-2xl font-semibold tracking-tight">{headerUTCTime}</p>
              <p className="text-muted-foreground font-mono text-sm">{headerTimestamp}</p>
            </div>
            <Tabs
              value={use12Hour ? "12h" : "24h"}
              onValueChange={(v) => setUse12Hour(v === "12h")}
              className="w-30"
            >
              <TabsList className="flex w-full">
                <TabsTrigger
                  value="24h"
                  className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
                >
                  24h
                </TabsTrigger>
                <TabsTrigger
                  value="12h"
                  className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
                >
                  12h
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Tabs defaultValue="convert" className="flex w-full flex-col">
          <TabsList className="mb-4 w-full flex-wrap">
            <TabsTrigger
              value="convert"
              className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
            >
              Convert
            </TabsTrigger>
            <TabsTrigger
              value="timezones"
              className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
            >
              Timezones
            </TabsTrigger>
            <TabsTrigger
              value="math"
              className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
            >
              Date Math
            </TabsTrigger>
          </TabsList>

          {/* Convert Tab */}
          <TabsContent value="convert" className="flex w-full flex-col space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ConvertField
                label="Unix Timestamp (seconds)"
                value={unixSec}
                placeholder="e.g. 1745000000"
                onChange={handleUnixSec}
              />
              <ConvertField
                label="Unix Timestamp (milliseconds)"
                value={unixMs}
                placeholder="e.g. 1745000000000"
                onChange={handleUnixMs}
              />
              <ConvertField
                label="ISO 8601"
                value={iso}
                placeholder="e.g. 2026-04-19T21:39:21.000Z"
                onChange={handleIso}
              />
              <ConvertField
                label="Local Date & Time"
                value={local}
                placeholder="e.g. 2026-04-19 21:39:21"
                onChange={handleLocal}
              />
            </div>
            <Button onClick={useNow} variant="secondary" className="w-full gap-2">
              <RefreshCw size={15} /> Set Inputs to Current Time
            </Button>
          </TabsContent>

          {/* Timezones Tab */}
          <TabsContent value="timezones">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {TIMEZONES.map(({ label, tz }) => {
                const formatted = formatDisplayTime(liveDate, tz, false);
                const gmtOffset = getGmtOffset(liveDate, tz);

                return (
                  <Card key={tz} className="transition-colors">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        {/* Label and GMT Offset */}
                        <div className="flex items-baseline gap-2">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-muted-foreground font-mono text-xs tracking-tight">
                            {gmtOffset}
                          </p>
                        </div>
                        {/* Formatted Time */}
                        <p className="text-foreground font-mono text-sm">{formatted}</p>
                      </div>
                      <CopyButton label={false} value={formatted} disabled={!formatted} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Date Math Tab */}
          <TabsContent value="math">
            <div className="space-y-6">
              {/* Controls */}
              <Card>
                <CardContent className="p-5">
                  <div className="mb-5">
                    <Label className="text-sm font-medium">Starting Date & Time</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={mathBaseDate}
                        onChange={(e) => setMathBaseDate(e.target.value)}
                        placeholder="YYYY-MM-DD HH:mm:ss"
                        className="flex-1 font-mono"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setMathBaseDate(toLocal(new Date()))}
                      >
                        Now
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium">Operation</Label>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex gap-2">
                        <Button
                          variant={mathMode === "add" ? "default" : "outline"}
                          onClick={() => setMathMode("add")}
                          className="gap-2"
                        >
                          <Plus size={14} /> Add
                        </Button>
                        <Button
                          variant={mathMode === "subtract" ? "default" : "outline"}
                          onClick={() => setMathMode("subtract")}
                          className="gap-2"
                        >
                          <Minus size={14} /> Subtract
                        </Button>
                      </div>

                      <div className="w-24">
                        <InputField
                          type="number"
                          min={0}
                          value={mathAmount}
                          onChange={(e) => setMathAmount(e.target.value)}
                          className="font-mono"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {MATH_UNIT_OPTIONS.map((unit) => (
                          <Button
                            key={unit}
                            variant={mathUnit === unit ? "default" : "outline"}
                            onClick={() => setMathUnit(unit as MathUnit)}
                            className="capitalize"
                          >
                            {unit}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reactive Result Preview */}
              {mathResult && (
                <Card>
                  <CardContent className="flex flex-col items-center py-6">
                    <p className="text-muted-foreground mb-6 text-xs font-semibold tracking-widest uppercase">
                      Calculated Result
                    </p>

                    {/* Timezone Split Display */}
                    <div className="mb-6 flex w-full flex-col items-stretch justify-center gap-6 text-center md:flex-row md:gap-4 lg:gap-8">
                      {/* flex-1 forces both sides to be exactly equal width */}
                      <div className="flex flex-1 flex-col justify-center space-y-1">
                        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                          Local Time {getGmtOffset(mathResult)}
                        </p>
                        {/* leading-snug keeps wrapped text grouped nicely together */}
                        <p className="text-foreground font-mono text-lg leading-snug font-semibold tracking-tight lg:text-xl">
                          {formatDisplayTime(mathResult, undefined, false)}
                        </p>
                      </div>

                      {/* self-stretch forces the line to grow to the height of the wrapped text */}
                      <div className="bg-border hidden w-px self-stretch md:block"></div>

                      <div className="flex flex-1 flex-col justify-center space-y-1">
                        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                          UTC Time
                        </p>
                        <p className="text-foreground font-mono text-lg leading-snug font-semibold tracking-tight lg:text-xl">
                          {formatDisplayTime(mathResult, "UTC", false)}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="border-border/50 flex w-full max-w-sm items-center justify-center gap-4 border-t pt-4">
                      <p className="text-muted-foreground font-mono text-sm" title="Unix Timestamp">
                        {Math.floor(mathResult.getTime() / 1000)}
                      </p>

                      {/* Shrunk from h-10 to h-4 to fit the font size perfectly */}
                      <div className="bg-border h-4 w-px"></div>

                      <p className="text-primary font-mono text-sm font-medium">
                        {getRelativeTime(mathResult)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
