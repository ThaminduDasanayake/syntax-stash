"use client";

import { Check, Copy, FileDiff } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const PLACEHOLDER_A = `# App config
NODE_ENV=production
DATABASE_URL=postgres://user:pass@localhost/db
API_KEY=abc123
PORT=3000
LOG_LEVEL=info`;

const PLACEHOLDER_B = `# App config
NODE_ENV=production
DATABASE_URL=postgres://user:pass@prod-host/db
API_KEY=abc123
REDIS_URL=redis://localhost:6379
SENTRY_DSN=https://abc@sentry.io/123`;

type EnvMap = Map<string, string>;

function parseEnv(text: string): EnvMap {
  const map: EnvMap = new Map();
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    const value = line.slice(eqIdx + 1).trim();
    if (key) map.set(key, value);
  }
  return map;
}

function maskValue(value: string): string {
  if (value.length <= 4) return "****";
  return value.slice(0, 4) + "****";
}

function buildMerged(a: EnvMap, b: EnvMap): string {
  const lines: string[] = [];
  const allKeys = new Set([...a.keys(), ...b.keys()]);

  for (const key of allKeys) {
    const inA = a.has(key);
    const inB = b.has(key);

    if (inA && inB) {
      const valA = a.get(key)!;
      const valB = b.get(key)!;
      if (valA === valB) {
        lines.push(`${key}=${valA}`);
      } else {
        lines.push(`${key}=${valA}`);
        lines.push(`# ↕ File B has: ${key}=${valB}`);
      }
    } else if (inA) {
      lines.push(`${key}=${a.get(key)!}`);
    } else {
      lines.push(`# From File B:`);
      lines.push(`${key}=${b.get(key)!}`);
    }
  }

  return lines.join("\n");
}

function DiffSection({
  title,
  color,
  keys,
  mapA,
  mapB,
  mode,
}: {
  title: string;
  color: "green" | "red" | "yellow";
  keys: string[];
  mapA?: EnvMap;
  mapB?: EnvMap;
  mode: "only-a" | "only-b" | "diff";
}) {
  const colorClasses = {
    green: "border-green-500/30 bg-green-500/5",
    red: "border-red-500/30 bg-red-500/5",
    yellow: "border-yellow-500/30 bg-yellow-500/5",
  };
  const labelClasses = {
    green: "text-green-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
  };

  if (keys.length === 0) {
    return (
      <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
        <p className={`mb-1 text-xs font-semibold tracking-wider uppercase ${labelClasses[color]}`}>
          {title}
        </p>
        <p className="text-muted-foreground text-xs italic">None</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className={`mb-3 text-xs font-semibold tracking-wider uppercase ${labelClasses[color]}`}>
        {title} ({keys.length})
      </p>
      <div className="space-y-1.5">
        {keys.map((key) => {
          if (mode === "diff" && mapA && mapB) {
            return (
              <div key={key} className="space-y-0.5">
                <p className="text-foreground font-mono text-xs font-semibold">{key}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  A: {maskValue(mapA.get(key) ?? "")}
                </p>
                <p className="text-muted-foreground font-mono text-xs">
                  B: {maskValue(mapB.get(key) ?? "")}
                </p>
              </div>
            );
          }
          const map = mode === "only-a" ? mapA : mapB;
          const value = map?.get(key) ?? "";
          return (
            <div key={key} className="flex items-baseline justify-between gap-2">
              <span className="text-foreground font-mono text-xs">{key}</span>
              <span className="text-muted-foreground truncate font-mono text-xs">
                {maskValue(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EnvDiffPage() {
  const [fileA, setFileA] = useState(PLACEHOLDER_A);
  const [fileB, setFileB] = useState(PLACEHOLDER_B);
  const { copied, copy } = useCopyToClipboard();

  const diff = useMemo(() => {
    const a = parseEnv(fileA);
    const b = parseEnv(fileB);

    const onlyInA: string[] = [];
    const onlyInB: string[] = [];
    const sharedSame: string[] = [];
    const sharedDiff: string[] = [];

    const allKeys = new Set([...a.keys(), ...b.keys()]);
    for (const key of allKeys) {
      const inA = a.has(key);
      const inB = b.has(key);
      if (inA && inB) {
        a.get(key) === b.get(key) ? sharedSame.push(key) : sharedDiff.push(key);
      } else if (inA) {
        onlyInA.push(key);
      } else {
        onlyInB.push(key);
      }
    }

    const merged = buildMerged(a, b);
    return { a, b, onlyInA, onlyInB, sharedSame, sharedDiff, merged };
  }, [fileA, fileB]);

  return (
    <ToolLayout
      icon={FileDiff}
      title=".env File"
      highlight="Diff & Merge"
      description="Semantically compare two .env files. Finds missing keys, extra keys, and value mismatches — then generates a safe merged output."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>File A</Label>
            <Textarea
              value={fileA}
              onChange={(e) => setFileA(e.target.value)}
              placeholder={PLACEHOLDER_A}
              rows={10}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-xs">
              {diff.a.size} key{diff.a.size !== 1 ? "s" : ""} parsed
            </p>
          </div>

          <div className="space-y-2">
            <Label>File B</Label>
            <Textarea
              value={fileB}
              onChange={(e) => setFileB(e.target.value)}
              placeholder={PLACEHOLDER_B}
              rows={10}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-xs">
              {diff.b.size} key{diff.b.size !== 1 ? "s" : ""} parsed
            </p>
          </div>
        </div>

        {/* Right — Results */}
        <div className="space-y-4">
          <DiffSection
            title="Only in File A"
            color="red"
            keys={diff.onlyInA}
            mapA={diff.a}
            mode="only-a"
          />
          <DiffSection
            title="Only in File B"
            color="green"
            keys={diff.onlyInB}
            mapB={diff.b}
            mode="only-b"
          />
          <DiffSection
            title="Same key, different value"
            color="yellow"
            keys={diff.sharedDiff}
            mapA={diff.a}
            mapB={diff.b}
            mode="diff"
          />

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label>Merged Output</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(diff.merged)}
                disabled={!diff.merged}
                className="rounded-full font-semibold"
              >
                {copied ? (
                  <><Check size={12} /> Copied!</>
                ) : (
                  <><Copy size={12} /> Copy</>
                )}
              </Button>
            </div>
            <Textarea
              readOnly
              value={diff.merged}
              rows={12}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-xs">
              File A values take precedence. Conflicts are preserved as comments.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
