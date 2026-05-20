"use client";

import { useMemo, useState } from "react";

import {
  BASE_LIST,
  BITWISE_OPS,
  clamp,
  toBin,
  toDec,
  toHex,
  toOct,
} from "@/app/tools/base-converter/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";

export default function BitwiseOps() {
  const [bitwiseA, setBitwiseA] = useState("");
  const [baseA, setBaseA] = useState<number>(10);

  const [bitwiseB, setBitwiseB] = useState("");
  const [baseB, setBaseB] = useState<number>(10);

  const [selectedOp, setSelectedOp] = useState<string>("and");

  const handleOperandChange = (raw: string, base: number, setOperand: (val: string) => void) => {
    let clean = raw;

    if (base === 10) clean = raw.replace(/[^0-9]/g, "");
    if (base === 16) clean = raw.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
    if (base === 2) clean = raw.replace(/[^01]/g, "");
    if (base === 8) clean = raw.replace(/[^0-7]/g, "");

    clean = clean.replace(/^0+(?=.)/, "");

    if (clean && parseInt(clean, base) > Number.MAX_SAFE_INTEGER) return;

    setOperand(clean);
  };

  // Handles dropdown switches: Translates the existing number to the new base
  const handleBaseChange = (
    newBase: number,
    oldBase: number,
    currentRaw: string,
    setBase: (val: number) => void,
    setRaw: (val: string) => void,
  ) => {
    setBase(newBase);
    if (!currentRaw) return;

    const parsed = parseInt(currentRaw, oldBase);
    if (!isNaN(parsed)) {
      let converted = parsed.toString(newBase);
      if (newBase === 16) converted = converted.toUpperCase();
      setRaw(converted);
    }
  };

  const parseWithBase = (raw: string, base: number) => {
    if (!raw) return 0;

    let clean = raw;
    if (base === 10) clean = raw.replace(/[^0-9]/g, "");
    if (base === 16) clean = raw.replace(/[^0-9A-Fa-f]/g, "");
    if (base === 2) clean = raw.replace(/[^01]/g, "");
    if (base === 8) clean = raw.replace(/[^0-7]/g, "");

    const parsed = parseInt(clean, base);
    return isNaN(parsed) ? 0 : parsed;
  };

  const bitwiseResult = useMemo(() => {
    const op = BITWISE_OPS.find((o) => o.id === selectedOp);
    if (!op) return null;

    const a = clamp(parseWithBase(bitwiseA, baseA));
    const b = clamp(parseWithBase(bitwiseB, baseB));

    const result = op.unary ? op.fn(a, 0) : op.fn(a, b);
    const safe = clamp(result);

    return {
      decimal: toDec(safe),
      hex: "0x" + toHex(safe),
      binary: "0b" + toBin(safe),
      octal: "0o" + toOct(safe),
    };
  }, [bitwiseA, bitwiseB, selectedOp, baseA, baseB]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Operands */}
      <div className="space-y-4">
        <div className="space-y-2">
          <InputField
            label="Operand A (Auto-detects base)"
            value={bitwiseA}
            placeholder="e.g., 255, FF, 01"
            onChange={(e) => handleOperandChange(e.target.value, baseA, setBitwiseA)}
            showSeparator={true}
            prefix={
              <SelectField
                value={baseA.toString()}
                options={BASE_LIST}
                onValueChange={(v) =>
                  handleBaseChange(Number(v), baseA, bitwiseA, setBaseA, setBitwiseA)
                }
                triggerClassName="bg-transparent!  border-0 w-18"
              />
            }
          />
          <p className="text-muted-foreground font-mono text-xs">
            0b{toBin(clamp(parseWithBase(bitwiseA, baseA)))}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Operator</Label>
          <div className="flex flex-wrap gap-2">
            {BITWISE_OPS.map((op) => (
              <Button
                key={op.id}
                onClick={() => setSelectedOp(op.id)}
                variant={selectedOp === op.id ? "default" : "secondary"}
                className="px-3 text-xs"
              >
                {op.symbol} {op.label}
              </Button>
            ))}
          </div>
        </div>

        {!BITWISE_OPS.find((o) => o.id === selectedOp)?.unary && (
          <div className="space-y-2">
            <InputField
              label="Operand B (Auto-detects base)"
              value={bitwiseB}
              onChange={(e) => handleOperandChange(e.target.value, baseB, setBitwiseB)}
              placeholder="e.g., 255, FF, 11"
              showSeparator={true}
              prefix={
                <SelectField
                  value={baseB.toString()}
                  options={BASE_LIST}
                  onValueChange={(v) =>
                    handleBaseChange(Number(v), baseB, bitwiseB, setBaseB, setBitwiseB)
                  }
                  triggerClassName="bg-transparent! border-0 w-18"
                />
              }
            />
            <p className="text-muted-foreground font-mono text-xs">
              0b{toBin(clamp(parseWithBase(bitwiseB, baseB)))}
            </p>
          </div>
        )}
      </div>

      {/* Result */}
      {bitwiseResult && (
        <Card>
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
                  <Label className="text-muted-foreground w-16 shrink-0 capitalize">{fmt}</Label>
                  <code className="flex-1 truncate font-mono text-sm">{bitwiseResult[fmt]}</code>
                  <CopyButton textToCopy={bitwiseResult[fmt]} disabled={false} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
