"use client";

import { Check, Copy, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { Grade, SECURITY_HEADERS } from "@/app/tools/header-analyzer/rules";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const PLACEHOLDER = `HTTP/2 200
content-type: text/html; charset=utf-8
strict-transport-security: max-age=31536000; includeSubDomains
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin`;

function parseHeaders(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();
    if (key) map.set(key, value);
  }
  return map;
}

function gradeToVariant(grade: Grade): "default" | "secondary" | "destructive" {
  if (grade === "pass") return "default";
  if (grade === "warn") return "secondary";
  return "destructive";
}

function gradeLabel(grade: Grade) {
  if (grade === "pass") return "Pass";
  if (grade === "warn") return "Warn";
  return "Fail";
}

function generateNextConfig(): string {
  const entries = SECURITY_HEADERS.filter((r) => r.key !== "x-xss-protection").map((r) => {
    const val = r.recommendation;
    return `      {\n        key: "${r.label}",\n        value: "${val}",\n      },`;
  });

  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
${entries.join("\n")}
        ],
      },
    ];
  },
};

export default nextConfig;`;
}

const NEXT_CONFIG_BLOCK = generateNextConfig();

export default function HeaderAnalyzerPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const { copied, copy } = useCopyToClipboard();

  const { graded, passCount, failCount, warnCount } = useMemo(() => {
    const map = parseHeaders(input);
    const graded = SECURITY_HEADERS.map((rule) => ({
      rule,
      grade: rule.validate(map.get(rule.key)),
      value: map.get(rule.key),
    }));
    const passCount = graded.filter((g) => g.grade === "pass").length;
    const warnCount = graded.filter((g) => g.grade === "warn").length;
    const failCount = graded.filter((g) => g.grade === "fail").length;
    return { graded, passCount, failCount, warnCount };
  }, [input]);

  return (
    <ToolLayout
      icon={ShieldCheck}
      title="HTTP Security Header"
      highlight="Analyzer"
      description="Paste raw HTTP response headers and get an OWASP-graded security scorecard with fix recommendations."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Raw HTTP Response Headers</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 10_000))}
              placeholder={PLACEHOLDER}
              rows={14}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-xs">
              Paste the output of <code className="text-primary">curl -I https://yoursite.com</code>{" "}
              or your DevTools response headers.
            </p>
          </div>

          {/* Score summary */}
          {input.trim() && (
            <Card>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                  Score Summary
                </p>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-primary font-mono text-2xl font-bold">{passCount}</p>
                    <p className="text-muted-foreground text-xs">Pass</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-2xl font-bold text-yellow-500">{warnCount}</p>
                    <p className="text-muted-foreground text-xs">Warn</p>
                  </div>
                  <div className="text-center">
                    <p className="text-destructive font-mono text-2xl font-bold">{failCount}</p>
                    <p className="text-muted-foreground text-xs">Fail</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Scorecard + Config */}
        <div className="space-y-4">
          <div className="space-y-3">
            {graded.map(({ rule, grade, value }) => (
              <div key={rule.key} className="border-border rounded-lg border p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-foreground truncate font-mono text-xs font-semibold">
                    {rule.label}
                  </p>
                  <Badge variant={gradeToVariant(grade)}>{gradeLabel(grade)}</Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{rule.description}</p>
                {(grade === "warn" || grade === "fail") && (
                  <p className="text-primary mt-1 font-mono text-xs">
                    Recommended: {rule.recommendation}
                  </p>
                )}
                {value && grade === "pass" && (
                  <p className="text-muted-foreground mt-1 truncate font-mono text-xs">{value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label>Generated next.config.ts</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(NEXT_CONFIG_BLOCK)}
                className="rounded-full font-semibold"
              >
                {copied ? (
                  <>
                    <Check size={12} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea readOnly value={NEXT_CONFIG_BLOCK} rows={12} className="font-mono text-xs" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
