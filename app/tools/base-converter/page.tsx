"use client";

import { Binary } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  BITS,
  BITWISE_OPS,
  clamp,
  toBin,
  toDec,
  toHex,
  toOct,
  toSigned,
} from "@/app/tools/base-converter/helpers";
import PrefixInput from "@/app/tools/base-converter/prefix-input";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const syncFrom = useCallback((n: number) => {
    const safe = clamp(n);
    setValue(safe);
    setDecRaw(toDec(safe));
    setHexRaw(toHex(safe));
    setBinRaw(toBin(safe));
    setOctRaw(toOct(safe));
  }, []);

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

  const bits = useMemo(() => {
    return Array.from({ length: BITS }, (_, i) => {
      const bitIndex = BITS - 1 - i;
      return (value >> bitIndex) & 1;
    });
  }, [value]);

  const toggleBit = useCallback(
    (i: number) => {
      const bitIndex = BITS - 1 - i;
      syncFrom(value ^ (1 << bitIndex));
    },
    [value, syncFrom],
  );

  const bitwiseResult = useMemo(() => {
    const op = BITWISE_OPS.find((o) => o.id === selectedOp);
    if (!op) return null;
    const a = clamp(parseInt(bitwiseA, 10) || 0);
    const b = clamp(parseInt(bitwiseB, 10) || 0);
    const result = op.unary ? op.fn(a, 0) : op.fn(a, b);
    const safe = clamp(result);
    return {
      decimal: toDec(safe),
      hex: "0x" + toHex(safe),
      binary: "0b" + toBin(safe),
      octal: "0o" + toOct(safe),
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
      <Tabs defaultValue="converter" className="flex w-full flex-col">
        <TabsList className="mb-4 w-full flex-wrap">
          <TabsTrigger
            value="converter"
            className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
          >
            Converter
          </TabsTrigger>
          <TabsTrigger
            value="bitwise"
            className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
          >
            Bitwise Ops
          </TabsTrigger>
        </TabsList>

        <TabsContent value="converter" className="space-y-6">
          {/* Signed / unsigned info bar */}
          <div className="bg-muted/50 flex flex-wrap gap-4 rounded-lg px-4 py-3 font-mono text-xs">
            <span>
              <span className="text-muted-foreground">unsigned </span>
              {value}
            </span>
            <span>
              <span className="text-muted-foreground">signed </span>
              {signed}
            </span>
            <span>
              <span className="text-muted-foreground">hex </span>0x{toHex(value)}
            </span>
            <span>
              <span className="text-muted-foreground">bits </span>
              {BITS}-bit
            </span>
          </div>

          {/* 2×2 input grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PrefixInput
              label="Decimal"
              prefix=""
              value={decRaw}
              onChange={handleDec}
              placeholder="e.g. 255"
            />
            <PrefixInput
              label="Hexadecimal"
              prefix="0x"
              value={hexRaw}
              onChange={handleHex}
              placeholder="e.g. FF"
            />
            <PrefixInput
              label="Binary"
              prefix="0b"
              value={binRaw}
              onChange={handleBin}
              placeholder="e.g. 11111111"
            />
            <PrefixInput
              label="Octal"
              prefix="0o"
              value={octRaw}
              onChange={handleOct}
              placeholder="e.g. 377"
            />
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
                        className={`border-border bg-card text-foreground/40 hover:border-primary/50 hover:text-foreground h-9 w-9 rounded border-2 font-mono text-sm font-bold transition-all data-[on=true]:text-white ${nibbleColor}`}
                      >
                        {bit}
                      </button>
                      <span className="text-muted-foreground font-mono text-[10px]">
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
                { label: "bits 11–8", color: "bg-blue-500" },
                { label: "bits 7–4", color: "bg-emerald-500" },
                { label: "bits 3–0", color: "bg-amber-500" },
              ].map(({ label, color }) => (
                <span key={label} className="text-muted-foreground flex items-center gap-1">
                  <span className={`inline-block h-2 w-2 rounded-sm ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

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
                <p className="text-muted-foreground font-mono text-xs">
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
                      className="border-border hover:border-primary/50 data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground rounded-md border px-3 py-1.5 font-mono text-xs transition-colors"
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
                  <p className="text-muted-foreground font-mono text-xs">
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
                    <span className="text-muted-foreground ml-2 font-mono">
                      A {BITWISE_OPS.find((o) => o.id === selectedOp)?.symbol}{" "}
                      {!BITWISE_OPS.find((o) => o.id === selectedOp)?.unary && "B"}
                    </span>
                  </p>
                  <div className="space-y-3">
                    {(["decimal", "hex", "binary", "octal"] as const).map((fmt) => (
                      <div key={fmt} className="flex items-center justify-between gap-2">
                        <Label className="text-muted-foreground w-16 shrink-0 capitalize">
                          {fmt}
                        </Label>
                        <code className="flex-1 truncate font-mono text-sm">
                          {bitwiseResult[fmt]}
                        </code>
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
