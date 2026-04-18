"use client";

import { Clock } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TimestampPage() {
  const [input, setInput] = useState<string>("");

  const { localTime, utcTime, isValid, msTimestamp } = useMemo(() => {
    if (!input.trim() || isNaN(Number(input))) {
      return { localTime: null, utcTime: null, isValid: false, msTimestamp: 0 };
    }

    const num = Number(input);
    const inputStr = input.trim().split(".")[0];
    const isSeconds = inputStr.length <= 10;
    const ms = isSeconds ? num * 1000 : num;
    const date = new Date(ms);

    // Guard against invalid dates
    if (isNaN(date.getTime())) {
      return { localTime: null, utcTime: null, isValid: false, msTimestamp: 0 };
    }

    return {
      localTime: date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      utcTime: date.toUTCString(),
      isValid: true,
      msTimestamp: ms,
    };
  }, [input]);

  function handleCurrentTime() {
    setInput(Math.floor(Date.now() / 1000).toString());
  }

  return (
    <ToolLayout
      icon={Clock}
      title="Unix Timestamp"
      highlight="Converter"
      description="Convert Unix epoch timestamps to human-readable local and UTC dates."
    >
      <div className="space-y-8">
        {/* Input Section */}
        <div className="space-y-3">
          <label className="text-foreground text-sm font-medium">Enter Unix Timestamp</label>
          <div className="flex gap-3">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter timestamp in seconds or milliseconds..."
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 h-10 font-mono focus-visible:ring-1"
            />
            <Button onClick={handleCurrentTime} variant="outline" className="h-10 shrink-0">
              Current Time
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Accepts 10-digit seconds (e.g., 1713008400) or 13-digit milliseconds
          </p>
        </div>

        {/* Output Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Local Time Card */}
          <Card className="bg-background">
            <CardContent className="space-y-3">
              <div className="border-border border-b pb-3">
                <h3 className="text-foreground text-sm font-semibold">Local Time</h3>
              </div>
              <div className="space-y-2">
                {input.trim() ? (
                  <p
                    className={`font-mono text-sm leading-relaxed wrap-break-word ${
                      !isValid ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {isValid ? localTime : "Invalid Date"}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Enter a timestamp to see local time
                  </p>
                )}
              </div>
              {isValid && (
                <div className="text-muted-foreground border-border space-y-1 border-t pt-2 text-xs">
                  <p>Timestamp: {input}</p>
                  <p>Milliseconds: {msTimestamp}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* UTC Time Card */}
          <Card className="bg-background">
            <CardContent className="space-y-3">
              <div className="border-border border-b pb-3">
                <h3 className="text-foreground text-sm font-semibold">UTC Time</h3>
              </div>
              <div className="space-y-2">
                {input.trim() ? (
                  <p
                    className={`font-mono text-sm leading-relaxed wrap-break-word ${
                      !isValid ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {isValid ? utcTime : "Invalid Date"}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">Enter a timestamp to see UTC time</p>
                )}
              </div>
              {isValid && (
                <div className="text-muted-foreground border-border border-t pt-2 text-xs">
                  <p>ISO String: {new Date(msTimestamp).toISOString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
