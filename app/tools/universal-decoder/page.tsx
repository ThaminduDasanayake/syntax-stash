"use client";

import { Scan } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Confidence = "high" | "medium";

type DetectionResult = {
  format: string;
  confidence: Confidence;
  timestamp?: Date;
  metadata: Record<string, string>;
};

// ─── Decoders ────────────────────────────────────────────────────────────────

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function tryJwt(input: string): DetectionResult | null {
  const parts = input.split(".");
  if (parts.length !== 3) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]+$/.test(parts[1])) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const meta: Record<string, string> = {};
    if (header.alg) meta["Algorithm"] = String(header.alg);
    if (header.typ) meta["Type"] = String(header.typ);
    if (payload.sub) meta["Subject"] = String(payload.sub);
    if (payload.iss) meta["Issuer"] = String(payload.iss);
    if (payload.aud) meta["Audience"] = String(payload.aud);
    const iat = payload.iat ? new Date(payload.iat * 1000) : undefined;
    const exp = payload.exp ? new Date(payload.exp * 1000) : undefined;
    if (iat) meta["Issued At"] = iat.toUTCString();
    if (exp) {
      meta["Expires At"] = exp.toUTCString();
      meta["Status"] = exp < new Date() ? "Expired" : "Valid";
    }
    if (payload.jti) meta["JWT ID"] = String(payload.jti);
    return {
      format: "JSON Web Token (JWT)",
      confidence: "high",
      timestamp: iat,
      metadata: meta,
    };
  } catch {
    return null;
  }
}

function tryMongoObjectId(input: string): DetectionResult | null {
  if (!/^[0-9a-fA-F]{24}$/.test(input)) return null;
  const tsHex = input.slice(0, 8);
  const machine = input.slice(8, 14);
  const pid = input.slice(14, 18);
  const counter = input.slice(18, 24);
  const timestamp = new Date(parseInt(tsHex, 16) * 1000);
  return {
    format: "MongoDB ObjectId",
    confidence: "high",
    timestamp,
    metadata: {
      "Machine ID": machine.toUpperCase(),
      "Process ID": `${parseInt(pid, 16)} (0x${pid.toUpperCase()})`,
      Counter: `${parseInt(counter, 16).toLocaleString()} (0x${counter.toUpperCase()})`,
      "Hex Structure": `${tsHex} ${machine} ${pid} ${counter}`,
    },
  };
}

function tryUuid(input: string): DetectionResult | null {
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = input.match(uuidRe);
  if (!match) return null;
  const version = parseInt(match[1], 16);
  const meta: Record<string, string> = { Version: `v${version}` };
  let timestamp: Date | undefined;

  if (version === 1) {
    // v1: time_low (8 hex) - time_mid (4 hex) - time_high_version (4 hex, strip leading '1')
    const hex = input.replace(/-/g, "");
    const timeLow = hex.slice(0, 8);
    const timeMid = hex.slice(8, 12);
    const timeHigh = hex.slice(13, 16); // skip version nibble at position 12
    const timeHex = timeHigh + timeMid + timeLow;
    const intervalsSince1582 = BigInt("0x" + timeHex);
    // 100-nanosecond intervals from Oct 15 1582 to Unix epoch
    const unixNs = intervalsSince1582 - BigInt("122192928000000000");
    const unixMs = Number(unixNs / BigInt(10000));
    timestamp = new Date(unixMs);
    meta["Timestamp Source"] = "Gregorian epoch (v1 time-based)";
  } else if (version === 7) {
    // v7: first 48 bits = Unix ms timestamp
    const hex = input.replace(/-/g, "");
    const msHex = hex.slice(0, 12);
    timestamp = new Date(parseInt(msHex, 16));
    meta["Timestamp Source"] = "Unix epoch ms (v7)";
  } else {
    meta["Note"] = `v${version} UUIDs do not embed a timestamp`;
  }

  return {
    format: `UUID v${version}`,
    confidence: "high",
    timestamp,
    metadata: meta,
  };
}

function tryIso8601(input: string): DetectionResult | null {
  const iso = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
  if (!iso.test(input)) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return {
    format: "ISO 8601 Date String",
    confidence: "high",
    timestamp: d,
    metadata: {},
  };
}

function tryUnixMs(input: string): DetectionResult | null {
  if (!/^\d{13}$/.test(input)) return null;
  const ms = parseInt(input, 10);
  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;
  return {
    format: "Unix Timestamp (milliseconds)",
    confidence: "high",
    timestamp: d,
    metadata: { "Raw Value": `${ms.toLocaleString()} ms` },
  };
}

function tryUnixSec(input: string): DetectionResult | null {
  if (!/^\d{10}$/.test(input)) return null;
  const sec = parseInt(input, 10);
  const d = new Date(sec * 1000);
  if (isNaN(d.getTime())) return null;
  return {
    format: "Unix Timestamp (seconds)",
    confidence: "high",
    timestamp: d,
    metadata: { "Raw Value": `${sec.toLocaleString()} sec` },
  };
}

function trySnowflake(input: string): DetectionResult | null {
  if (!/^\d{17,20}$/.test(input)) return null;
  try {
    const id = BigInt(input);
    // Discord/Twitter epoch: Jan 1 2015 = 1420070400000 ms
    const DISCORD_EPOCH = BigInt(1420070400000);
    const ms = Number((id >> BigInt(22)) + DISCORD_EPOCH);
    const d = new Date(ms);
    if (isNaN(d.getTime()) || ms < 0 || ms > Date.now() + 1e12) return null;
    const workerId = Number((id >> BigInt(17)) & BigInt(0x1f));
    const processId = Number((id >> BigInt(12)) & BigInt(0x1f));
    const increment = Number(id & BigInt(0xfff));
    return {
      format: "Snowflake ID (Discord/Twitter)",
      confidence: "medium",
      timestamp: d,
      metadata: {
        "Worker ID": String(workerId),
        "Process ID": String(processId),
        Increment: String(increment),
        Note: "Epoch assumes Discord (Jan 1 2015)",
      },
    };
  } catch {
    return null;
  }
}

function detect(raw: string): DetectionResult | null {
  const input = raw.trim();
  if (!input) return null;

  return (
    tryJwt(input) ??
    tryMongoObjectId(input) ??
    tryUuid(input) ??
    tryIso8601(input) ??
    tryUnixMs(input) ??
    tryUnixSec(input) ??
    trySnowflake(input) ??
    null
  );
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

const localFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "long",
});
const utcFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "long",
  timeZone: "UTC",
});

function relativeTime(d: Date): string {
  const diffMs = d.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const past = diffMs < 0;
  const sec = Math.round(abs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const yr = Math.round(day / 365);
  let label: string;
  if (sec < 60) label = `${sec}s`;
  else if (min < 60) label = `${min}m`;
  else if (hr < 24) label = `${hr}h`;
  else if (day < 365) label = `${day}d`;
  else label = `${yr}yr`;
  return past ? `${label} ago` : `in ${label}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const EXAMPLES = [
  { label: "JWT", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" },
  { label: "ObjectId", value: "507f1f77bcf86cd799439011" },
  { label: "UUID v1", value: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" },
  { label: "Unix sec", value: "1713264000" },
  { label: "ISO 8601", value: "2024-04-16T12:00:00Z" },
  { label: "Snowflake", value: "175928847299117063" },
];

export default function UniversalDecoderPage() {
  const [input, setInput] = useState("");
  const result = useMemo(() => detect(input), [input]);

  return (
    <ToolLayout
      icon={Scan}
      title="Universal"
      highlight="Decoder"
      description='Paste any mystery string — Unix timestamp, JWT, UUID, MongoDB ObjectId, ISO date, or Snowflake ID — and this tool identifies and decodes it automatically.'
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Paste Anything</Label>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="eyJhbGci... or 507f1f77... or 1713264000"
              className="font-mono text-sm"
            />
            <p className="text-muted-foreground text-xs">
              Detects: JWT, MongoDB ObjectId, UUID (v1/v4/v7), ISO 8601, Unix epoch (sec/ms), Snowflake ID
            </p>
          </div>

          {/* Quick examples */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Quick Examples
            </Label>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setInput(ex.value)}
                  className="border-border text-muted-foreground hover:text-foreground hover:border-primary rounded-full border px-3 py-1 text-xs transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detection badge */}
          {input.trim() && (
            <div className="space-y-2">
              {result ? (
                <div className="border-border rounded-lg border p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={result.confidence === "high" ? "default" : "secondary"}>
                      {result.confidence === "high" ? "High confidence" : "Medium confidence"}
                    </Badge>
                  </div>
                  <p className="text-foreground font-mono text-lg font-semibold">
                    {result.format}
                  </p>
                </div>
              ) : (
                <div className="border-border rounded-lg border border-dashed p-4">
                  <p className="text-muted-foreground text-sm">
                    Format not recognised. Try a JWT, Unix timestamp, UUID, MongoDB ObjectId, or ISO date string.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — Decoded Output */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Timestamp */}
              {result.timestamp && (
                <Card>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                      Timestamp
                    </p>
                    <div className="space-y-2">
                      <div className="border-border rounded-md border p-3">
                        <p className="text-muted-foreground mb-0.5 text-xs">Local</p>
                        <p className="text-foreground font-mono text-sm">
                          {localFmt.format(result.timestamp)}
                        </p>
                      </div>
                      <div className="border-border rounded-md border p-3">
                        <p className="text-muted-foreground mb-0.5 text-xs">UTC</p>
                        <p className="text-foreground font-mono text-sm">
                          {utcFmt.format(result.timestamp)}
                        </p>
                      </div>
                      <div className="border-border rounded-md border p-3">
                        <p className="text-muted-foreground mb-0.5 text-xs">Relative</p>
                        <p className="text-primary font-mono text-sm font-semibold">
                          {relativeTime(result.timestamp)}
                        </p>
                      </div>
                      <div className="border-border rounded-md border p-3">
                        <p className="text-muted-foreground mb-0.5 text-xs">Unix (seconds)</p>
                        <p className="text-foreground font-mono text-sm">
                          {Math.floor(result.timestamp.getTime() / 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              {Object.keys(result.metadata).length > 0 && (
                <Card>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                      Decoded Fields
                    </p>
                    <div className="space-y-2">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <div key={key} className="border-border rounded-md border p-3">
                          <p className="text-muted-foreground mb-0.5 text-xs">{key}</p>
                          <p className="text-foreground break-all font-mono text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="border-border flex min-h-60 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                {input.trim() ? "Unrecognised format." : "Paste a value to decode."}
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
