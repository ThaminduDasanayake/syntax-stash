"use client";

import { Check, Copy, Lock } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

// Bit layout (index from 0 = least significant):
// bit 8 = owner read, 7 = owner write, 6 = owner exec
// bit 5 = group read, 4 = group write, 3 = group exec
// bit 2 = other read, 1 = other write, 0 = other exec

const GROUPS = ["Owner", "Group", "Other"] as const;
const PERMS = ["Read", "Write", "Execute"] as const;
const PERM_CHARS = ["r", "w", "x"] as const;

// Bit position for [group][perm]: Owner-Read = bit 8, Owner-Write = bit 7, ..., Other-Exec = bit 0
function bitIndex(groupIdx: number, permIdx: number): number {
  return 8 - groupIdx * 3 - permIdx;
}

const PRESETS: { label: string; bits: number }[] = [
  { label: "644", bits: 0o644 },
  { label: "755", bits: 0o755 },
  { label: "777", bits: 0o777 },
  { label: "600", bits: 0o600 },
  { label: "400", bits: 0o400 },
];

function symbolicToBits(sym: string): number | null {
  if (!/^[rwx-]{9}$/i.test(sym)) return null;
  let bits = 0;
  for (let i = 0; i < 9; i++) {
    const char = sym[i].toLowerCase();
    const expected = PERM_CHARS[i % 3];
    if (char === expected) {
      bits |= 1 << (8 - i);
    } else if (char !== "-") {
      return null;
    }
  }
  return bits;
}

function bitsToSymbolic(bits: number): string {
  let result = "";
  for (let g = 0; g < 3; g++) {
    for (let p = 0; p < 3; p++) {
      const isSet = (bits >> bitIndex(g, p)) & 1;
      result += isSet ? PERM_CHARS[p] : "-";
    }
  }
  return result;
}

function humanReadable(bits: number): string {
  return GROUPS.map((group, g) => {
    const perms: string[] = [];
    if ((bits >> bitIndex(g, 0)) & 1) perms.push("read");
    if ((bits >> bitIndex(g, 1)) & 1) perms.push("write");
    if ((bits >> bitIndex(g, 2)) & 1) perms.push("execute");
    if (perms.length === 0) return `${group}: no permissions`;
    return `${group}: ${perms.join(", ")}`;
  }).join("\n");
}

export default function ChmodCalculatorPage() {
  const [bits, setBits] = useState(0o644);
  const [octalInput, setOctalInput] = useState("644");
  const [symInput, setSymInput] = useState("rw-r--r--");
  const { copied: copiedCmd, copy: copyCmd } = useCopyToClipboard();
  const { copied: copiedLs, copy: copyLs } = useCopyToClipboard();

  const derived = useMemo(() => {
    const octal = bits.toString(8).padStart(3, "0");
    const symbolic = bitsToSymbolic(bits);
    const ls = `-${symbolic}`;
    const human = humanReadable(bits);
    const command = `chmod ${octal} <file>`;
    return { octal, symbolic, ls, human, command };
  }, [bits]);

  function toggleBit(groupIdx: number, permIdx: number) {
    const idx = bitIndex(groupIdx, permIdx);
    const newBits = bits ^ (1 << idx);
    setBits(newBits);
    setOctalInput(newBits.toString(8).padStart(3, "0"));
    setSymInput(bitsToSymbolic(newBits));
  }

  function handleOctalChange(value: string) {
    setOctalInput(value);
    if (/^[0-7]{1,3}$/.test(value)) {
      const parsed = parseInt(value, 8);
      if (parsed >= 0 && parsed <= 0o777) {
        setBits(parsed);
        setSymInput(bitsToSymbolic(parsed));
      }
    }
  }

  function handleSymbolicChange(value: string) {
    setSymInput(value);
    const parsed = symbolicToBits(value);
    if (parsed !== null) {
      setBits(parsed);
      setOctalInput(parsed.toString(8).padStart(3, "0"));
    }
  }

  function applyPreset(presetBits: number) {
    setBits(presetBits);
    setOctalInput(presetBits.toString(8).padStart(3, "0"));
    setSymInput(bitsToSymbolic(presetBits));
  }

  return (
    <ToolLayout
      icon={Lock}
      title="chmod"
      highlight="Calculator"
      description="Calculate Unix file permissions with a click-to-toggle grid. Bidirectionally synced across octal, symbolic, and ls formats."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Controls */}
        <div className="space-y-6">
          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Presets
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(p.bits)}
                  className="rounded-full font-mono font-semibold"
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Permission Grid */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Permission Grid
            </Label>
            <div className="overflow-hidden rounded-lg border border-border">
              {/* Header row */}
              <div className="grid grid-cols-4 border-b border-border">
                <div className="bg-muted/50 p-2" />
                {PERMS.map((p) => (
                  <div
                    key={p}
                    className="bg-muted/50 p-2 text-center text-xs font-semibold text-muted-foreground"
                  >
                    {p}
                  </div>
                ))}
              </div>
              {/* Data rows */}
              {GROUPS.map((group, gi) => (
                <div
                  key={group}
                  className={`grid grid-cols-4 ${gi < 2 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {group}
                  </div>
                  {PERMS.map((_, pi) => {
                    const isActive = Boolean((bits >> bitIndex(gi, pi)) & 1);
                    return (
                      <button
                        key={pi}
                        onClick={() => toggleBit(gi, pi)}
                        className={`border-l border-border py-3 text-center text-xs font-bold font-mono transition-colors ${
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {isActive ? PERM_CHARS[pi] : "–"}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Octal + Symbolic inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Octal</Label>
              <Input
                value={octalInput}
                onChange={(e) => handleOctalChange(e.target.value)}
                placeholder="755"
                className="font-mono"
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Symbolic</Label>
              <Input
                value={symInput}
                onChange={(e) => handleSymbolicChange(e.target.value)}
                placeholder="rwxr-xr-x"
                className="font-mono"
                maxLength={9}
              />
            </div>
          </div>
        </div>

        {/* Right — Output */}
        <div className="space-y-4">
          {/* ls -la display */}
          <Card>
            <CardContent>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                ls -la
              </p>
              <div className="flex items-center justify-between">
                <p className="text-primary font-mono text-3xl font-bold tracking-widest">
                  {derived.ls}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLs(derived.ls)}
                  className="rounded-full font-semibold"
                >
                  {copiedLs ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* chmod command */}
          <Card>
            <CardContent>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Command
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-foreground font-mono text-base">
                  {derived.command}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCmd(derived.command)}
                  className="shrink-0 rounded-full font-semibold"
                >
                  {copiedCmd ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Human readable */}
          <Card>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                Human Readable
              </p>
              <div className="space-y-1">
                {derived.human.split("\n").map((line, i) => {
                  const [label, ...rest] = line.split(": ");
                  const value = rest.join(": ");
                  return (
                    <div key={i} className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground text-sm">{label}</span>
                      <span className="text-foreground font-mono text-sm">{value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Octal breakdown */}
          <Card>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                Octal Breakdown
              </p>
              <div className="flex justify-around">
                {GROUPS.map((group, gi) => {
                  const digit = derived.octal[gi] ?? "0";
                  return (
                    <div key={group} className="text-center">
                      <p className="text-primary font-mono text-3xl font-bold">{digit}</p>
                      <p className="text-muted-foreground mt-1 text-xs">{group}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
