"use client";

import { useCallback, useMemo, useState } from "react";

import BaseInput from "@/app/tools/base-converter/base-input";
import {
  BITS,
  clamp,
  MAX,
  toBin,
  toDec,
  toHex,
  toOct,
  toSigned,
} from "@/app/tools/base-converter/helpers";
import { Button } from "@/components/ui/button";

export function Converter() {
  const [value, setValue] = useState<number>(0);

  const [decRaw, setDecRaw] = useState("");
  const [hexRaw, setHexRaw] = useState("");
  const [binRaw, setBinRaw] = useState("");
  const [octRaw, setOctRaw] = useState("");

  const syncFrom = useCallback((n: number) => {
    const safe = clamp(n);
    setValue(safe);
    setDecRaw(toDec(safe));
    setHexRaw(toHex(safe));
    setBinRaw(toBin(safe));
    setOctRaw(toOct(safe));
  }, []);

  const handleDec = (raw: string) => {
    const stripped = raw.replace(/[^0-9]/g, "");
    if (stripped && parseInt(stripped, 10) > Number.MAX_SAFE_INTEGER) return;

    setDecRaw(stripped);

    if (!stripped) return;

    const n = parseInt(stripped, 10);
    if (isNaN(n)) return;

    const safe = clamp(n);
    setValue(safe);
    setHexRaw(toHex(safe));
    setBinRaw(toBin(safe));
    setOctRaw(toOct(safe));
  };

  const handleHex = (raw: string) => {
    const stripped = raw.replace(/^0x/i, "").replace(/[^0-9A-Fa-f]/g, "");
    const upperHex = stripped.toUpperCase();

    if (upperHex && parseInt(stripped, 16) > Number.MAX_SAFE_INTEGER) return;
    setHexRaw(upperHex);

    if (!upperHex) return;

    const n = parseInt(upperHex, 16);
    if (isNaN(n)) return;

    const safe = clamp(n);
    setValue(safe);
    setDecRaw(toDec(safe));
    setBinRaw(toBin(safe));
    setOctRaw(toOct(safe));
  };

  const handleBin = (raw: string) => {
    const stripped = raw.replace(/^0b/i, "").replace(/[^01]/g, "");

    if (stripped && parseInt(stripped, 2) > Number.MAX_SAFE_INTEGER) return;
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

    if (stripped && parseInt(stripped, 8) > Number.MAX_SAFE_INTEGER) return;
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

  const signed = toSigned(value);

  return (
    <>
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

      {/* Input grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BaseInput
          label="Decimal"
          prefix=""
          value={decRaw}
          onChange={handleDec}
          placeholder="255"
        />
        <BaseInput
          label="Hexadecimal"
          prefix="0x"
          value={hexRaw}
          onChange={handleHex}
          placeholder="FF"
        />
        <BaseInput
          label="Binary"
          prefix="0b"
          value={binRaw}
          onChange={handleBin}
          placeholder="11111111"
        />
        <BaseInput
          label="Octal"
          prefix="0o"
          value={octRaw}
          onChange={handleOct}
          placeholder="377"
        />
      </div>

      {/* Bit toggle grid */}
      {value <= MAX && (
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
                  ? "data-[on=true]:bg-red-500/90 data-[on=true]:border-red-600"
                  : isHighNibble
                    ? "data-[on=true]:bg-orange-500/90 data-[on=true]:border-orange-600"
                    : isLowNibble
                      ? "data-[on=true]:bg-yellow-500/90 data-[on=true]:border-yellow-600"
                      : "data-[on=true]:bg-green-500/90 data-[on=true]:border-green-600";

                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <Button
                      onClick={() => toggleBit(i)}
                      data-on={bit === 1}
                      className={`border-border bg- bg-card text-foreground/40 hover:text-foreground h-9 w-9 rounded border-2 font-mono text-sm font-bold transition-all data-[on=true]:text-white ${nibbleColor}`}
                    >
                      {bit}
                    </Button>
                    <span className="text-muted-foreground font-mono text-[10px]">{bitIndex}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Nibble labels */}
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {[
              { label: "bits 15–12", color: "bg-red-500" },
              { label: "bits 11–8", color: "bg-orange-500" },
              { label: "bits 7–4", color: "bg-yellow-500" },
              { label: "bits 3–0", color: "bg-green-500" },
            ].map(({ label, color }) => (
              <span key={label} className="text-muted-foreground flex items-center gap-1">
                <span className={`inline-block h-2 w-2 rounded-sm ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
