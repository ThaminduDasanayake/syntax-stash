"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Metrics = {
  chars: number;
  words: number;
  sentences: number;
  bytes: number;
  tokens: number;
};

function analyze(text: string): Metrics {
  const chars = text.length;
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const sentences = trimmed ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length : 0;
  const bytes = new Blob([text]).size;
  const tokens = chars > 0 ? Math.ceil(chars / 4) : 0;
  return { chars, words, sentences, bytes, tokens };
}

type Stat = { label: string; value: number; hint?: string };

export default function AnalyzerPage() {
  const [text, setText] = useState(
    "Syntax Stash is a curated command center for modern web development. Fast, focused, and entirely local.",
  );

  const metrics = useMemo(() => analyze(text), [text]);

  const stats: Stat[] = [
    { label: "Characters", value: metrics.chars },
    { label: "Words", value: metrics.words },
    { label: "Sentences", value: metrics.sentences },
    { label: "Bytes", value: metrics.bytes, hint: "UTF-8 size" },
    {
      label: "Est. Tokens",
      value: metrics.tokens,
      hint: "chars ÷ 4 heuristic",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <FileText className="text-primary" size={36} />
            Text <span className="text-primary">Analyzer</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Count characters, words, bytes, and estimate LLM tokens for any block of text.
          </p>
        </div>

        <div className="space-y-8">
          {/* Input */}
          <div className="space-y-2">
            <Label className="text-foreground">Input Text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type text to analyze..."
              rows={12}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
            />
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => (
              <Card key={s.label} className="bg-background">
                <CardContent>
                  <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
                    {s.label}
                  </p>
                  <p className="text-primary font-mono text-3xl tabular-nums">
                    {s.value.toLocaleString()}
                  </p>
                  {s.hint && (
                    <p className="text-muted-foreground mt-1 font-mono text-[10px]">{s.hint}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
