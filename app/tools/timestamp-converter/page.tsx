"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const utcFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
});

export default function TimestampPage() {
  const [input, setInput] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    if (!input.trim()) {
      setLocalTime("");
      setUtcTime("");
      return;
    }

    // Parse the input
    let timestamp = parseFloat(input);

    if (isNaN(timestamp)) {
      setLocalTime("Invalid Date");
      setUtcTime("Invalid Date");
      return;
    }

    // Auto-detect seconds (10 digits) vs milliseconds (13 digits)
    // Also handle decimal numbers
    const inputStr = input.trim();
    const integerPart = inputStr.split(".")[0];

    // If it's 10 digits or less, assume seconds and convert to milliseconds
    if (integerPart.length <= 10) {
      timestamp *= 1000;
    }

    // Create date object
    const date = new Date(timestamp);

    // Check if valid date
    if (isNaN(date.getTime())) {
      setLocalTime("Invalid Date");
      setUtcTime("Invalid Date");
      return;
    }

    // Format the dates
    try {
      setLocalTime(dateFormatter.format(date));
      setUtcTime(utcFormatter.format(date));
    } catch {
      setLocalTime("Invalid Date");
      setUtcTime("Invalid Date");
    }
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
      maxWidth="max-w-7xl"
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
            Accepts 10-digit seconds (e.g., 1713008400) or 13-digit milliseconds (e.g.,
            1713008400000)
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
                    className={`font-mono text-sm leading-relaxed break-words ${
                      localTime === "Invalid Date" ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {localTime}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Enter a timestamp to see local time
                  </p>
                )}
              </div>
              {input.trim() && localTime !== "Invalid Date" && (
                <div className="text-muted-foreground border-border border-t pt-2 text-xs">
                  <p>Timestamp: {input}</p>
                  <p>
                    Milliseconds:{" "}
                    {Math.floor(
                      parseFloat(input) * (input.trim().split(".")[0].length <= 10 ? 1000 : 1),
                    )}
                  </p>
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
                    className={`font-mono text-sm leading-relaxed break-words ${
                      utcTime === "Invalid Date" ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {utcTime}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">Enter a timestamp to see UTC time</p>
                )}
              </div>
              {input.trim() && utcTime !== "Invalid Date" && (
                <div className="text-muted-foreground border-border border-t pt-2 text-xs">
                  <p>
                    ISO String:{" "}
                    {new Date(
                      Math.floor(
                        parseFloat(input) * (input.trim().split(".")[0].length <= 10 ? 1000 : 1),
                      ),
                    ).toISOString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Reference */}
        <div className="bg-muted/30 border-border space-y-2 rounded-lg border p-4">
          <h4 className="text-foreground text-sm font-semibold">Quick Reference</h4>
          <div className="text-muted-foreground grid grid-cols-1 gap-4 font-mono text-xs md:grid-cols-3">
            <div>
              <p className="text-foreground mb-1">Common Timestamps</p>
              <p>1234567890 = Feb 13, 2009</p>
              <p>1609459200 = Jan 1, 2021</p>
            </div>
            <div>
              <p className="text-foreground mb-1">Format Info</p>
              <p>Seconds: 10 digits</p>
              <p>Milliseconds: 13 digits</p>
            </div>
            <div>
              <p className="text-foreground mb-1">Current Timestamp</p>
              <p>{Math.floor(Date.now() / 1000)} (seconds)</p>
              <p>{Date.now()} (milliseconds)</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
