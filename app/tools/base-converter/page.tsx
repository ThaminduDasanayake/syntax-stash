"use client";

import { Binary } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import CopyButton from "@/components/ui/copy-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Constants & types
// ---------------------------------------------------------------------------

const BITS = 16;
const MAX = (1 << BITS) - 1;   // 65535  (unsigned 16-bit)
const SIGNED_MIN = -(1 << (BITS - 1)); // -32768
const SIGNED_MAX = (1 << (BITS - 1)) - 1; // 32767

// Bitwise operations config
interface BitwiseOp {
  id: string;
  label: string;
  symbol: string;
  fn: (a: number, b: number) => number;
  unary?: boolean;
}

const BITWISE_OPS: BitwiseOp[] = [
  { id: "and",  label: "AND",  symbol: "&",   fn: (a, b) => a & b },
  { id: "or",   label: "OR",   symbol: "|",   fn: (a, b) => a | b },
  { id: "xor",  label: "XOR",  symbol: "^",   fn: (a, b) => a ^ b },
  { id: "not",  label: "NOT",  symbol: "~",   fn: (a)    => (~a) & MAX, unary: true },
  { id: "shl",  label: "Shift Left",  symbol: "<<",  fn: (a, b) => (a << b) & MAX },
  { id: "shr",  label: "Shift Right", symbol: ">>",  fn: (a, b) => a >> b },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(n: number): number {
  if (!isFinite(n) || isNaN(n)) return 0;
  return Math.max(0, Math.min(MAX, Math.floor(n)));
}

function toBin(n: number): string   { return n.toString(2).padStart(BITS, "0"); }
function toHex(n: number): string   { return n.toString(16).toUpperCase(); }
function toOct(n: number): string   { return n.toString(8); }
function toDec(n: number): string   { return n.toString(10); }

// Two's-complement signed value for 16-bit
function toSigned(n: number): number {
  return n >= (1 << (BITS - 1)) ? n - (1 << BITS) : n;
}

// ---------------------------------------------------------------------------
// PrefixInput — input with a visual prefix label
// ---------------------------------------------------------------------------

interface PrefixInputProps {
  label: string;
  prefix: string;
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
}

function PrefixInput({ label, prefix, value, onChange, placeholder }: PrefixInputProps) {
  return (
    <Card className="transition-colors focus-within:border-primary/50">
      <CardContent className="p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{prefix}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex flex-1 items-center">
            {prefix && (
              <span className="pointer-events-none absolute left-3 select-none font-mono text-sm text-muted-foreground">
                {prefix}
              </span>
            )}
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`font-mono text-sm ${prefix ? "pl-8" : ""}`}
            />
          </div>
          <CopyButton value={prefix + value} disabled={!value} />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BaseConverterPage() {
  const [value, setValue] = useState<number>(0);

  // Raw field buffers (what the user is typing)
  const [decRaw, setDecRaw] = useState("0");
  const [hexRaw, setHexRaw] = useState("0");
  const [binRaw, setBinRaw] = useState("0".padStart(BITS, "0"));
  const [octRaw, setOctRaw] = useState("0");

  // Bitwise ops state
  const [bitwiseA, setBitwiseA] = useState("0");
  const [bitwiseB, setBitwiseB] = useState("0");
  const [selectedOp, setSelectedOp] = useState<string>("and");

  // ---------------------------------------------------------------------------
  // Sync all derived fields from a new number
  // ---------------------------------------------------------------------------

  const syncFrom = useCallback((n: number) => {
    const safe = clamp(n);
    setValue(safe);
    setDecRaw(toDec(safe));
    setHexRaw(toHex(safe));
    setBinRaw(toBin(safe));
    setOctRaw(toOct(safe));
  }, []);

  // ---------------------------------------------------------------------------
  // Per-field parsers
  // ---------------------------------------------------------------------------

  const handleDec = (raw: string) => {
    setDecRaw(raw);
    const n = parseInt(raw, 10);
    if (raw === "" || isNaN(n)) return;
    const safe = clamp(n);
    setValue(safe);
    setHexRaw(toHex(safe));
    setBinRaw(toBin(safe));
    setOctRaw(toOct(safe));
  };

  const handleHex = (raw: string) => {
    const stripped = raw.replace(/^0x/i, "");
    setHexRaw(stripped.toUpperCase());
    if (!stripped || stripped === "") return;
    const n = parseInt(stripped, 16);
    if (isNaN(n)) return;
    const safe = clamp(n);
    setValue(safe);
    setDecRaw(toDec(safe));
    setBinRaw(toBin(safe));
    setOctRaw(toOct(safe));
  };

  const handleBin = (raw: string) => {
    const stripped = raw.replace(/^0b/i, "").replace(/[^01]/g, "");
    setBinRaw(stripped);
    if (!stripped) return;
    const n = parseInt(stripped, 2);
    if (isNaN(n)) return;
    const safe = clamp(n);
    setValue(safe);
    setDecRaw(toDec(safe));
    setHexRaw(toHex(safe));
    setOctRaw(toOct(safe));
  };

  const handleOct = (raw: string) => {
    const stripped = raw.replace(/^0o/i, "").replace(/[^0-7]/g, "");
    setOctRaw(stripped);
    if (!stripped) return;
    const n = parseInt(stripped, 8);
    if (isNaN(n)) return;
    const safe = clamp(n);
    setValue(safe);
    setDecRaw(toDec(safe));
    setHexRaw(toHex(safe));
    setBinRaw(toBin(safe));
  };

  // ---------------------------------------------------------------------------
  // Bit toggle
  // ---------------------------------------------------------------------------

  const bits = useMemo(() => {
    return Array.from({ length: BITS }, (_, i) => {
      const bitIndex = BITS - 1 - i;
      return (value >> bitIndex) & 1;
    });
  }, [value]);

  const toggleBit = useCallback((i: number) => {
    const bitIndex = BITS - 1 - i;
    syncFrom(value ^ (1 << bitIndex));
  }, [value, syncFrom]);

  // ---------------------------------------------------------------------------
  // Bitwise ops
  // ---------------------------------------------------------------------------

  const bitwiseResult = useMemo(() => {
    const op = BITWISE_OPS.find((o) => o.id === selectedOp);
    if (!op) return null;
    const a = clamp(parseInt(bitwiseA, 10) || 0);
    const b = clamp(parseInt(bitwiseB, 10) || 0);
    const result = op.unary ? op.fn(a, 0) : op.fn(a, b);
    const safe = clamp(result);
    return {
      decimal: toDec(safe),
      hex:     "0x" + toHex(safe),
      binary:  "0b" + toBin(safe),
      octal:   "0o" + toOct(safe),
    };
  }, [bitwiseA, bitwiseB, selectedOp]);

  const signed = toSigned(value);

  return (
    <ToolLayout
      icon={Binary}
      title="Base"
      highlight="Converter"
      description="Convert between decimal, hex, binary, and octal with a 16-bit toggle grid."
    >
      <Tabs defaultValue="converter">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="converter" className="flex-1">Converter</TabsTrigger>
          <TabsTrigger value="bitwise"   className="flex-1">Bitwise Ops</TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------------- */}
        {/* Converter tab                                                     */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="converter" className="space-y-6">
          {/* Signed / unsigned info bar */}
          <div className="flex flex-wrap gap-4 rounded-lg bg-muted/50 px-4 py-3 font-mono text-xs">
            <span><span className="text-muted-foreground">unsigned </span>{value}</span>
            <span><span className="text-muted-foreground">signed   </span>{signed}</span>
            <span><span className="text-muted-foreground">hex      </span>0x{toHex(value)}</span>
            <span><span className="text-muted-foreground">bits     </span>{BITS}-bit</span>
          </div>

          {/* 2×2 input grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PrefixInput label="Decimal"     prefix=""   value={decRaw} onChange={handleDec} placeholder="e.g. 255" />
            <PrefixInput label="Hexadecimal" prefix="0x" value={hexRaw} onChange={handleHex} placeholder="e.g. FF" />
            <PrefixInput label="Binary"      prefix="0b" value={binRaw} onChange={handleBin} placeholder="e.g. 11111111" />
            <PrefixInput label="Octal"       prefix="0o" value={octRaw} onChange={handleOct} placeholder="e.g. 377" />
          </div>

          {/* Bit toggle grid */}
          <div>
            <p className="mb-3 text-sm font-semibold">Bit Toggle (16-bit)</p>
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-max gap-1">
                {bits.map((bit, i) => {
                  const bitIndex = BITS - 1 - i;
                  const isMsbNibble = bitIndex >= 12;
                  const isHighNibble = bitIndex >= 8 && bitIndex < 12;
                  const isLowNibble = bitIndex >= 4 && bitIndex < 8;

                  const nibbleColor = isMsbNibble
                    ? "data-[on=true]:bg-violet-500 data-[on=true]:border-violet-600"
                    : isHighNibble
                    ? "data-[on=true]:bg-blue-500 data-[on=true]:border-blue-600"
                    : isLowNibble
                    ? "data-[on=true]:bg-emerald-500 data-[on=true]:border-emerald-600"
                    : "data-[on=true]:bg-amber-500 data-[on=true]:border-amber-600";

                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => toggleBit(i)}
                        data-on={bit === 1}
                        className={`h-9 w-9 rounded border-2 font-mono text-sm font-bold transition-all
                          border-border bg-card text-foreground/40
                          hover:border-primary/50 hover:text-foreground
                          data-[on=true]:text-white ${nibbleColor}`}
                      >
                        {bit}
                      </button>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {bitIndex}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Nibble labels */}
            <div className="mt-2 flex flex-wrap gap-3 text-[10px]">
              {[
                { label: "bits 15–12", color: "bg-violet-500" },
                { label: "bits 11–8",  color: "bg-blue-500" },
                { label: "bits 7–4",   color: "bg-emerald-500" },
                { label: "bits 3–0",   color: "bg-amber-500" },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1 text-muted-foreground">
                  <span className={`inline-block h-2 w-2 rounded-sm ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        {/* Bitwise Ops tab                                                   */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="bitwise" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Operands */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Operand A (decimal)</Label>
                <Input
                  type="number"
                  value={bitwiseA}
                  onChange={(e) => setBitwiseA(e.target.value)}
                  className="font-mono"
                  placeholder="0"
                />
                <p className="font-mono text-xs text-muted-foreground">
                  0b{toBin(clamp(parseInt(bitwiseA) || 0))}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Operation</Label>
                <div className="flex flex-wrap gap-2">
                  {BITWISE_OPS.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOp(op.id)}
                      data-active={selectedOp === op.id}
                      className="rounded-md border px-3 py-1.5 font-mono text-xs transition-colors
                        border-border hover:border-primary/50
                        data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      {op.symbol} {op.label}
                    </button>
                  ))}
                </div>
              </div>

              {!BITWISE_OPS.find((o) => o.id === selectedOp)?.unary && (
                <div className="space-y-2">
                  <Label>Operand B (decimal)</Label>
                  <Input
                    type="number"
                    value={bitwiseB}
                    onChange={(e) => setBitwiseB(e.target.value)}
                    className="font-mono"
                    placeholder="0"
                  />
                  <p className="font-mono text-xs text-muted-foreground">
                    0b{toBin(clamp(parseInt(bitwiseB) || 0))}
                  </p>
                </div>
              )}
            </div>

            {/* Result */}
            {bitwiseResult && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5">
                  <p className="mb-4 text-sm font-semibold">
                    Result
                    <span className="ml-2 font-mono text-muted-foreground">
                      A {BITWISE_OPS.find((o) => o.id === selectedOp)?.symbol}{" "}
                      {!BITWISE_OPS.find((o) => o.id === selectedOp)?.unary && "B"}
                    </span>
                  </p>
                  <div className="space-y-3">
                    {(["decimal", "hex", "binary", "octal"] as const).map((fmt) => (
                      <div key={fmt} className="flex items-center justify-between gap-2">
                        <Label className="w-16 shrink-0 capitalize text-muted-foreground">{fmt}</Label>
                        <code className="flex-1 truncate font-mono text-sm">{bitwiseResult[fmt]}</code>
                        <CopyButton value={bitwiseResult[fmt]} disabled={false} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
