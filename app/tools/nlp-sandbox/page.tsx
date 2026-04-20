"use client";

import { BrainCircuit } from "lucide-react";
import { useMemo, useState } from "react";

import { STOPWORDS } from "@/app/tools/nlp-sandbox/constants";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

function termFreq(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) ?? 0) + 1);
  return map;
}

/** TF-IDF simulation (single doc): TF * log(1 + N/freq) */
function tfidf(tf: Map<string, number>, totalTokens: number): Map<string, number> {
  const out = new Map<string, number>();
  const N = totalTokens;
  for (const [term, freq] of tf) {
    const termFreqNorm = freq / N;
    const idf = Math.log(1 + N / freq); // single-doc approximation
    out.set(term, termFreqNorm * idf);
  }
  return out;
}

/** Standard Scaler: z = (x - μ) / σ */
function standardScale(values: number[]): number[] {
  if (values.length === 0) return [];
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const std = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length) || 1;
  return values.map((v) => (v - mean) / std);
}

/**
 * Truncated SVD (1 component) simulation.
 * Projects each value through a seeded pseudo-random unit vector
 * derived from the term string so results are stable and deterministic.
 */
function truncatedSVD(
  entries: Array<{ term: string; score: number }>,
): Array<{ term: string; score: number }> {
  return entries.map(({ term, score }) => {
    // Deterministic "singular vector" component from term hash
    let h = 0;
    for (let i = 0; i < term.length; i++) h = (Math.imul(31, h) + term.charCodeAt(i)) | 0;
    const weight = 0.6 + (Math.abs(h) % 1000) / 2500; // range [0.6, 1.0)
    return { term, score: score * weight };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SAMPLE = `The new action thriller delivers pulse-pounding excitement and jaw-dropping visuals, but the plot feels thin and predictable. The lead actor carries every scene with magnetic charisma, yet the supporting cast is largely wasted on underdeveloped characters. Fans of the genre will find plenty to enjoy here, though critics demanding deeper storytelling may leave disappointed.`;

type VectorizerType = "count" | "tfidf";
type ScalerType = "standard" | "svd";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, description, checked, onToggle }: ToggleRowProps) {
  return (
    <button
      onClick={onToggle}
      className="hover:bg-accent flex w-full items-center justify-between rounded-md px-1 py-1.5 text-left transition-colors"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}

export default function NLPSandboxPage() {
  const [rawText, setRawText] = useState(SAMPLE);
  const [lowercase, setLowercase] = useState(true);
  const [removePunctuation, setRemovePunctuation] = useState(true);
  const [removeStopwords, setRemoveStopwords] = useState(true);
  const [vectorizer, setVectorizer] = useState<VectorizerType>("tfidf");
  const [scaler, setScaler] = useState<ScalerType>("standard");

  const cleanedText = useMemo(() => {
    let text = rawText;
    if (lowercase) text = text.toLowerCase();
    if (removePunctuation) text = text.replace(/[^\w\s]/g, "");
    if (removeStopwords) {
      text = text
        .split(/\s+/)
        .filter((w) => w && !STOPWORDS.has(w.toLowerCase()))
        .join(" ");
    }
    return text.trim();
  }, [rawText, lowercase, removePunctuation, removeStopwords]);

  // Vectorized + scaled output
  const processedJSON = useMemo(() => {
    if (!cleanedText) return "[]";

    const tokens = tokenize(cleanedText);
    const tf = termFreq(tokens);
    const totalTokens = tokens.length;
    const TOP_N = 12;

    // Vectorize
    let scoreMap: Map<string, number>;
    if (vectorizer === "count") {
      scoreMap = tf;
    } else {
      scoreMap = tfidf(tf, totalTokens);
    }

    // Top N by score
    const sorted = [...scoreMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP_N);

    let entries = sorted.map(([term, score]) => ({ term, score }));

    // Scale
    const rawScores = entries.map((e) => e.score);
    if (scaler === "standard") {
      const scaled = standardScale(rawScores);
      entries = entries.map((e, i) => ({ ...e, score: scaled[i] }));
    } else {
      entries = truncatedSVD(entries);
      // Optionally standard-scale the SVD output too for readability
      const scaled = standardScale(entries.map((e) => e.score));
      entries = entries.map((e, i) => ({ ...e, score: scaled[i] }));
    }

    const result = entries.map(({ term, score }) => ({
      term,
      [vectorizer === "count" ? "count_scaled" : "tfidf_scaled"]: parseFloat(score.toFixed(6)),
      ...(scaler === "svd" ? { svd_component_1: parseFloat((score * 0.92).toFixed(6)) } : {}),
    }));

    return JSON.stringify(result, null, 2);
  }, [cleanedText, vectorizer, scaler]);

  const vectorizerOptions = [
    { value: "count", label: "Count Vectorizer" },
    { value: "tfidf", label: "TF-IDF Vectorizer" },
  ];

  const scalerOptions = [
    { value: "standard", label: "Standard Scaler" },
    { value: "svd", label: "Truncated SVD (dim reduction)" },
  ];

  const wordCount = cleanedText ? tokenize(cleanedText).length : 0;
  const uniqueCount = cleanedText ? new Set(tokenize(cleanedText)).size : 0;

  return (
    <ToolLayout
      icon={BrainCircuit}
      title="NLP"
      highlight="Sandbox"
      description="Simulate text cleaning, vectorization, and scaling pipelines."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <TextAreaField
            label="Raw Text Input"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste any raw text — a review, article, tweet…"
            rows={10}
            action={<ClearButton onClick={() => setRawText("")} disabled={!rawText} />}
          />

          {/* Control panel */}
          <Card>
            <CardContent className="space-y-5 p-4">
              {/* Cleaning toggles */}
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Text Cleaning
                </p>
                <div className="space-y-1">
                  <ToggleRow
                    label="Lowercase"
                    description="Convert all characters to lowercase"
                    checked={lowercase}
                    onToggle={() => setLowercase((v) => !v)}
                  />
                  <ToggleRow
                    label="Remove Punctuation"
                    description="Strip commas, periods, quotes, etc."
                    checked={removePunctuation}
                    onToggle={() => setRemovePunctuation((v) => !v)}
                  />
                  <ToggleRow
                    label="Remove Stopwords"
                    description="Drop common words (the, and, is…)"
                    checked={removeStopwords}
                    onToggle={() => setRemoveStopwords((v) => !v)}
                  />
                </div>
              </div>

              {/* Vectorizer */}
              <SelectField
                label="Vectorizer"
                value={vectorizer}
                onValueChange={(v) => setVectorizer(v as VectorizerType)}
                options={vectorizerOptions}
              />

              {/* Scaler */}
              <SelectField
                label="Scaler / Dimensionality Reduction"
                value={scaler}
                onValueChange={(v) => setScaler(v as ScalerType)}
                options={scalerOptions}
              />

              {/* Stats */}
              <div className="bg-muted flex gap-4 rounded-md p-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Tokens </span>
                  <span className="font-semibold">{wordCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Unique </span>
                  <span className="font-semibold">{uniqueCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vocabulary ratio </span>
                  <span className="font-semibold">
                    {wordCount > 0 ? ((uniqueCount / wordCount) * 100).toFixed(1) : "0"}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <TextAreaField
            label="Cleaned Text"
            value={cleanedText}
            readOnly
            rows={10}
            placeholder="Cleaned text will appear here…"
            action={<CopyButton value={cleanedText} disabled={!cleanedText} />}
          />

          <TextAreaField
            label={`Processed Output — ${vectorizer === "count" ? "Count Vectorizer" : "TF-IDF"} + ${scaler === "standard" ? "Standard Scaler" : "Truncated SVD"} (top 12 terms)`}
            value={processedJSON}
            readOnly
            rows={16}
            placeholder="Vectorized output will appear here…"
            action={<CopyButton value={processedJSON} disabled={processedJSON === "[]"} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
