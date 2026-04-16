"use client";

import { FileText, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AnalyzerMetrics, AnalyzerStat } from "@/app/tools/text-analyzer/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function analyze(text: string): AnalyzerMetrics {
  const chars = text.length;
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const sentences = trimmed ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length : 0;
  const bytes = new Blob([text]).size;
  const tokens = chars > 0 ? Math.ceil(chars / 4) : 0;
  return { chars, words, sentences, bytes, tokens };
}

function formatReadingTime(words: number): string {
  const READING_SPEED = 200; // words per minute
  const totalSeconds = Math.round((words / READING_SPEED) * 60);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function formatSpeakingTime(words: number): string {
  const SPEAKING_SPEED = 130; // words per minute
  const totalSeconds = Math.round((words / SPEAKING_SPEED) * 60);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function countParagraphs(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\n\n+/).filter((p) => p.trim().length > 0).length;
}

export default function AnalyzerPage() {
  const [text, setText] = useState("");

  const metrics = useMemo(() => analyze(text), [text]);
  const paragraphs = useMemo(() => countParagraphs(text), [text]);
  const readingTime = useMemo(() => formatReadingTime(metrics.words), [metrics.words]);
  const speakingTime = useMemo(() => formatSpeakingTime(metrics.words), [metrics.words]);

  const stats: AnalyzerStat[] = [
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
    <ToolLayout
      icon={FileText}
      title="Text"
      highlight="Analyzer"
      description="Count characters, words, bytes, and estimate LLM tokens for any block of text."
    >
      <div className="space-y-8">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Input Text</Label>
            {text && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText("")}
                className="text-muted-foreground hover:text-foreground h-8 gap-2"
              >
                <Trash2 size={14} />
                <span className="text-xs">Clear</span>
              </Button>
            )}
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to analyze..."
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

        {/* Additional metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Card className="bg-background">
            <CardContent>
              <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
                Paragraphs
              </p>
              <p className="text-primary font-mono text-3xl tabular-nums">{paragraphs}</p>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardContent>
              <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
                Reading Time
              </p>
              <p className="text-primary font-mono text-2xl tabular-nums">{readingTime}</p>
              <p className="text-muted-foreground mt-1 font-mono text-[10px]">@200 WPM</p>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardContent>
              <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
                Speaking Time
              </p>
              <p className="text-primary font-mono text-2xl tabular-nums">{speakingTime}</p>
              <p className="text-muted-foreground mt-1 font-mono text-[10px]">@130 WPM</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
