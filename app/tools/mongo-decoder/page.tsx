"use client";

import { Hash } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObjectIdDecoded = {
  timestamp: Date;
  machineId: string;
  processId: string;
  counter: string;
};

function decodeObjectId(id: string): ObjectIdDecoded | null {
  const clean = id.trim();
  if (!/^[0-9a-fA-F]{24}$/.test(clean)) return null;

  const timestampHex = clean.slice(0, 8);
  const machineId = clean.slice(8, 14);
  const processId = clean.slice(14, 18);
  const counter = clean.slice(18, 24);

  const timestampSeconds = parseInt(timestampHex, 16);
  const timestamp = new Date(timestampSeconds * 1000);

  return { timestamp, machineId, processId, counter };
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border-border rounded-lg border p-4">
      <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
        {label}
      </p>
      <p className="text-foreground font-mono text-base font-medium">{value}</p>
      {sub && <p className="text-muted-foreground mt-0.5 font-mono text-xs">{sub}</p>}
    </div>
  );
}

export default function MongoDecoderPage() {
  const [input, setInput] = useState("507f1f77bcf86cd799439011");

  const isValidLength = input.trim().length === 0 || /^[0-9a-fA-F]{0,24}$/.test(input.trim());
  const result = useMemo(() => decodeObjectId(input), [input]);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "long",
    timeZone: "UTC",
  });

  return (
    <ToolLayout
      icon={Hash}
      title="MongoDB ObjectId"
      highlight="Decoder"
      description="Decode a MongoDB ObjectId into its timestamp, machine identifier, process ID, and counter."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>ObjectId</Label>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="507f1f77bcf86cd799439011"
              className="font-mono"
              maxLength={24}
            />
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                A valid ObjectId is exactly 24 hexadecimal characters.
              </p>
              <p
                className={`font-mono text-xs ${
                  input.trim().length === 24
                    ? "text-primary"
                    : input.trim().length > 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {input.trim().length}/24
              </p>
            </div>
          </div>

          {!isValidLength && (
            <p className="text-destructive font-mono text-sm">Only hex characters (0-9, a-f) are valid.</p>
          )}

          {input.trim().length === 24 && !result && (
            <p className="text-destructive font-mono text-sm">Invalid ObjectId — contains non-hex characters.</p>
          )}

          {result && (
            <Card>
              <CardContent>
                <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                  Structure
                </p>
                <div className="flex font-mono text-sm">
                  <span className="text-primary">{input.slice(0, 8)}</span>
                  <span className="text-secondary">{input.slice(8, 14)}</span>
                  <span className="text-primary/70">{input.slice(14, 18)}</span>
                  <span className="text-muted-foreground">{input.slice(18, 24)}</span>
                </div>
                <div className="mt-2 flex gap-4 text-xs">
                  <span className="text-primary">timestamp</span>
                  <span className="text-secondary">machine</span>
                  <span className="text-primary/70">pid</span>
                  <span className="text-muted-foreground">counter</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Decoded Fields */}
        <div className="space-y-3">
          {result ? (
            <>
              <StatRow
                label="Creation Timestamp"
                value={dateFormatter.format(result.timestamp)}
                sub={`Unix: ${Math.floor(result.timestamp.getTime() / 1000)}`}
              />
              <StatRow
                label="Machine Identifier"
                value={result.machineId.toUpperCase()}
                sub="First 3 bytes of MD5 hash of hostname"
              />
              <StatRow
                label="Process ID"
                value={`${parseInt(result.processId, 16)} (0x${result.processId.toUpperCase()})`}
                sub="2-byte process identifier"
              />
              <StatRow
                label="Random Counter"
                value={`${parseInt(result.counter, 16).toLocaleString()} (0x${result.counter.toUpperCase()})`}
                sub="3-byte incrementing counter"
              />
            </>
          ) : (
            <div className="border-border flex min-h-60 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                Paste a 24-character ObjectId to decode.
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
