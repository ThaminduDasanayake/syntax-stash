"use client";

import { Clock, Plus, Minus, RefreshCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import CopyButton from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

function humanReadable(d: Date): string {
  return `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

function toLocal(d: Date): string {
  const y = d.getFullYear();
  const mo = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return `${y}-${mo}-${day} ${h}:${mi}:${s}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

// ---------------------------------------------------------------------------
// Timezone data
// ---------------------------------------------------------------------------

const TIMEZONES = [
  { label: "UTC",             tz: "UTC" },
  { label: "New York",        tz: "America/New_York" },
  { label: "Los Angeles",     tz: "America/Los_Angeles" },
  { label: "São Paulo",       tz: "America/Sao_Paulo" },
  { label: "London",          tz: "Europe/London" },
  { label: "Paris / Berlin",  tz: "Europe/Paris" },
  { label: "Moscow",          tz: "Europe/Moscow" },
  { label: "Dubai",           tz: "Asia/Dubai" },
  { label: "Mumbai",          tz: "Asia/Kolkata" },
  { label: "Singapore",       tz: "Asia/Singapore" },
  { label: "Tokyo",           tz: "Asia/Tokyo" },
  { label: "Sydney",          tz: "Australia/Sydney" },
];

function formatInTZ(d: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "—";
  }
}

// ---------------------------------------------------------------------------
// ConvertField — single labelled input with copy button
// ---------------------------------------------------------------------------

interface ConvertFieldProps {
  label: string;
  hint: string;
  value: string;
  placeholder: string;
  onChange: (raw: string) => void;
}

function ConvertField({ label, hint, value, placeholder, onChange }: ConvertFieldProps) {
  return (
    <Card className="transition-colors focus-within:border-primary/50">
      <CardContent className="p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{hint}</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="font-mono text-sm"
          />
          <CopyButton value={value} disabled={!value} />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type MathUnit = "seconds" | "minutes" | "hours" | "days";

export default function TimeCalculatorPage() {
  const [date, setDate] = useState<Date>(() => new Date());

  // Raw string buffers — only the "active" field drives the date; others derive
  const [unixSec,  setUnixSec]  = useState<string>("");
  const [unixMs,   setUnixMs]   = useState<string>("");
  const [iso,      setIso]      = useState<string>("");
  const [local,    setLocal]    = useState<string>("");

  // Date math state
  const [mathAmount, setMathAmount] = useState<string>("1");
  const [mathUnit,   setMathUnit]   = useState<MathUnit>("days");

  // ---------------------------------------------------------------------------
  // Sync all derived fields from a new Date
  // ---------------------------------------------------------------------------

  const syncFrom = useCallback((d: Date) => {
    if (!isValidDate(d)) return;
    setDate(d);
    setUnixSec(String(Math.floor(d.getTime() / 1000)));
    setUnixMs(String(d.getTime()));
    setIso(d.toISOString());
    setLocal(toLocal(d));
  }, []);

  // ---------------------------------------------------------------------------
  // Per-field parsers
  // ---------------------------------------------------------------------------

  const handleUnixSec = useCallback((raw: string) => {
    setUnixSec(raw);
    const n = Number(raw);
    if (raw === "" || isNaN(n)) return;
    const d = new Date(n * 1000);
    if (!isValidDate(d)) return;
    setDate(d);
    setUnixMs(String(d.getTime()));
    setIso(d.toISOString());
    setLocal(toLocal(d));
  }, []);

  const handleUnixMs = useCallback((raw: string) => {
    setUnixMs(raw);
    const n = Number(raw);
    if (raw === "" || isNaN(n)) return;
    const d = new Date(n);
    if (!isValidDate(d)) return;
    setDate(d);
    setUnixSec(String(Math.floor(d.getTime() / 1000)));
    setIso(d.toISOString());
    setLocal(toLocal(d));
  }, []);

  const handleIso = useCallback((raw: string) => {
    setIso(raw);
    const d = new Date(raw);
    if (!isValidDate(d)) return;
    setDate(d);
    setUnixSec(String(Math.floor(d.getTime() / 1000)));
    setUnixMs(String(d.getTime()));
    setLocal(toLocal(d));
  }, []);

  const handleLocal = useCallback((raw: string) => {
    setLocal(raw);
    // Accept "YYYY-MM-DD HH:mm:ss" and "YYYY-MM-DD"
    const d = new Date(raw.replace(" ", "T"));
    if (!isValidDate(d)) return;
    setDate(d);
    setUnixSec(String(Math.floor(d.getTime() / 1000)));
    setUnixMs(String(d.getTime()));
    setIso(d.toISOString());
  }, []);

  const useNow = useCallback(() => syncFrom(new Date()), [syncFrom]);

  // ---------------------------------------------------------------------------
  // Date math
  // ---------------------------------------------------------------------------

  const UNIT_MS: Record<MathUnit, number> = {
    seconds: 1_000,
    minutes: 60_000,
    hours:   3_600_000,
    days:    86_400_000,
  };

  const applyMath = useCallback((sign: 1 | -1) => {
    const amount = parseFloat(mathAmount);
    if (isNaN(amount)) return;
    syncFrom(new Date(date.getTime() + sign * amount * UNIT_MS[mathUnit]));
  }, [date, mathAmount, mathUnit, syncFrom]); // eslint-disable-line react-hooks/exhaustive-deps

  const mathUnitOptions: MathUnit[] = ["seconds", "minutes", "hours", "days"];

  // ---------------------------------------------------------------------------
  // Header values (derived, never stale)
  // ---------------------------------------------------------------------------

  const headerHuman = useMemo(() => humanReadable(date), [date]);
  const headerTs    = useMemo(() => String(date.getTime()), [date]);

  return (
    <ToolLayout
      icon={Clock}
      title="Time"
      highlight="Calculator"
      description="Unix timestamps, date arithmetic, and timezone conversion."
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header card                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center py-6 text-center">
          <p className="font-mono text-2xl font-semibold tracking-tight">
            {headerHuman}
          </p>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {headerTs}
          </p>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Tabs defaultValue="convert">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="convert"  className="flex-1">Convert</TabsTrigger>
          <TabsTrigger value="timezones" className="flex-1">Timezones</TabsTrigger>
          <TabsTrigger value="math"     className="flex-1">Date Math</TabsTrigger>
        </TabsList>

        {/* Convert */}
        <TabsContent value="convert">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ConvertField
              label="Unix Timestamp (seconds)"
              hint="s"
              value={unixSec}
              placeholder="e.g. 1745000000"
              onChange={handleUnixSec}
            />
            <ConvertField
              label="Unix Timestamp (milliseconds)"
              hint="ms"
              value={unixMs}
              placeholder="e.g. 1745000000000"
              onChange={handleUnixMs}
            />
            <ConvertField
              label="ISO 8601"
              hint="UTC"
              value={iso}
              placeholder="e.g. 2026-04-19T21:39:21.000Z"
              onChange={handleIso}
            />
            <ConvertField
              label="Local Date & Time"
              hint="browser TZ"
              value={local}
              placeholder="e.g. 2026-04-19 21:39:21"
              onChange={handleLocal}
            />
          </div>
        </TabsContent>

        {/* Timezones */}
        <TabsContent value="timezones">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {TIMEZONES.map(({ label, tz }) => {
              const formatted = formatInTZ(date, tz);
              return (
                <Card key={tz} className="transition-colors">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="font-mono text-xs text-muted-foreground">{tz}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{formatted}</p>
                      <CopyButton value={formatted} disabled={!formatted} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Date Math */}
        <TabsContent value="math">
          <div className="space-y-6">
            {/* Controls */}
            <Card>
              <CardContent className="p-5">
                <p className="mb-4 text-sm font-medium">Add or subtract time from the current date</p>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 space-y-1 min-w-24">
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <Input
                      type="number"
                      min={0}
                      value={mathAmount}
                      onChange={(e) => setMathAmount(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex flex-1 flex-wrap gap-2 min-w-48">
                    {mathUnitOptions.map((u) => (
                      <Button
                        key={u}
                        variant={mathUnit === u ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMathUnit(u)}
                        className="capitalize"
                      >
                        {u}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => applyMath(-1)} variant="outline" className="gap-2">
                      <Minus size={14} /> Subtract
                    </Button>
                    <Button onClick={() => applyMath(1)} className="gap-2">
                      <Plus size={14} /> Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Result preview */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-5 text-center">
                <p className="font-mono text-lg font-semibold">{humanReadable(date)}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{date.toISOString()}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ------------------------------------------------------------------ */}
      {/* Footer — Use Current Time                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-6 border-t pt-6">
        <Button onClick={useNow} variant="outline" className="w-full gap-2">
          <RefreshCw size={15} />
          Use Current Time
        </Button>
      </div>
    </ToolLayout>
  );
}
