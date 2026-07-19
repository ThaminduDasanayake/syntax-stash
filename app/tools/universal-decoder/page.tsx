"use client";

import { useMemo, useState } from "react";

import { detect, localFmt, relativeTime, utcFmt } from "@/app/tools/universal-decoder/helpers";
import { ToolLayout } from "@/components/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { internalTools } from "@/lib/tools-data";

const EXAMPLES = [
  { label: "ISO 8601", value: "2024-04-16T12:00:00Z" },
  {
    label: "JWT",
    value:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  },
  { label: "ObjectId", value: "507f1f77bcf86cd799439011" },
  { label: "Snowflake", value: "175928847299117063" },
  { label: "Unix sec", value: "1713264000" },
  { label: "UUID v1", value: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" },
];

export default function UniversalDecoderPage() {
  const [input, setInput] = useState("");
  const result = useMemo(() => detect(input), [input]);

  const tool = internalTools.find((t) => t.slug === "universal-decoder");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-6">
          <InputField
            label="Encoded Text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="eyJhbGci... or 507f1f77... or 1713264000"
            className="text-sm"
          />
          <p className="text-muted-foreground text-xs">
            Detects: JWT, MongoDB ObjectId, UUID (v1/v4/v7), ISO 8601, Unix epoch (sec/ms),
            Snowflake ID
          </p>

          {/* Quick examples */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Quick Examples
            </Label>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <Button
                  key={ex.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(ex.value)}
                >
                  {ex.label}
                </Button>
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
                  <p className="text-foreground font-mono text-lg font-semibold">{result.format}</p>
                </div>
              ) : (
                <div className="border-border rounded-lg border border-dashed p-4">
                  <p className="text-muted-foreground text-sm">
                    Format not recognised. Try a JWT, Unix timestamp, UUID, MongoDB ObjectId, or ISO
                    date string.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decoded Output */}
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
                          <p className="text-foreground font-mono text-sm break-all">{value}</p>
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
