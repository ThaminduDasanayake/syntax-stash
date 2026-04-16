"use client";

import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";
import { AlertTriangle,ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CronParsed } from "@/types";

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
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <Clock className="text-primary" size={36} />
            Cron <span className="text-primary">Translator</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Convert cron expressions to plain English and preview upcoming executions.
          </p>
        </div>

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
      </div>
    </div>
  );
}
