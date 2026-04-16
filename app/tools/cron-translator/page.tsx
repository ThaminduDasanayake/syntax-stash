"use client";

import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";
import { AlertTriangle, Clock } from "lucide-react";
import { useMemo, useState } from "react";

import { CronParsed } from "@/app/tools/cron-translator/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CronTranslatorPage() {
  const [expression, setExpression] = useState("* * * * *");

  const parsed = useMemo<CronParsed>(() => {
    const expr = expression.trim();
    if (!expr) {
      return { ok: false, error: "Enter a cron expression" };
    }
    try {
      const human = cronstrue.toString(expr);
      const interval = CronExpressionParser.parse(expr);
      const dates: Date[] = [];
      for (let i = 0; i < 5; i++) {
        dates.push(interval.next().toDate());
      }
      return { ok: true, human, dates };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Invalid cron expression",
      };
    }
  }, [expression]);

  return (
    <ToolLayout
      icon={Clock}
      title="Cron"
      highlight="Translator"
      description="Convert cron expressions to plain English and preview upcoming executions."
    >
      <div className="space-y-8">
        {/* Input */}
        <div className="space-y-2">
          <Label className="text-foreground">Cron Expression</Label>
          <Input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="* * * * *"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 h-12 font-mono text-lg focus-visible:ring-1"
          />
          <p className="text-muted-foreground font-mono text-xs">
            minute · hour · day-of-month · month · day-of-week
          </p>
        </div>

        {/* Human-readable output */}
        {parsed.ok ? (
          <div className="border-border bg-background rounded-xl border p-6">
            <p className="text-muted-foreground mb-3 text-[10px] font-semibold tracking-wider uppercase">
              Translation
            </p>
            <p className="text-primary font-mono text-2xl leading-snug">{parsed.human}</p>
          </div>
        ) : (
          <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p className="font-mono">{parsed.error}</p>
          </div>
        )}

        {/* Upcoming executions */}
        {parsed.ok && (
          <div className="space-y-3">
            <Label className="text-foreground">Next 5 Executions</Label>
            <div className="space-y-2">
              {parsed.dates.map((d, i) => (
                <Card key={i} size="sm" className="bg-background">
                  <CardContent className="flex items-baseline justify-between gap-4">
                    <span className="text-muted-foreground font-mono text-xs">#{i + 1}</span>
                    <span className="text-foreground font-mono text-sm">{formatDate(d)}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
