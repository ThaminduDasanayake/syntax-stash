"use client";

import { useMemo, useState } from "react";

import {
  generateNextConfig,
  gradeLabel,
  gradeToVariant,
  parseHeaders,
} from "@/app/tools/http-security-header-analyzer/helpers";
import { SECURITY_HEADERS } from "@/app/tools/http-security-header-analyzer/rules";
import { ToolLayout } from "@/components/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

// language=text
const PLACEHOLDER = `HTTP/2 200
content-type: text/html; charset=utf-8
strict-transport-security: max-age=31536000; includeSubDomains
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin`;

const NEXT_CONFIG_BLOCK = generateNextConfig();

export default function HeaderAnalyzerPage() {
  const [input, setInput] = useState(PLACEHOLDER);

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

  const tool = internalTools.find((t) => t.slug === "http-security-header-analyzer");

  return (
    <ToolLayout tool={tool}>
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="flex flex-col space-y-4">
          <div className="flex shrink-0 flex-col space-y-2">
            <TextareaGroup
              label="Raw HTTP Response Headers"
              value={input}
              containerClassName="flex-1 min-h-[350px]"
              onChange={(e) => setInput(e.target.value.slice(0, 10_000))}
              placeholder={PLACEHOLDER}
              action={<ClearButton size="sm" onClick={() => setInput("")} />}
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
        <div className="flex h-full min-h-0 flex-col space-y-4">
          <div className="shrink-0 space-y-3">
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
          <div className="flex min-h-75 flex-1 flex-col pt-1">
            <TextareaGroup
              autoGrow
              label="Generated next.config.ts"
              readOnly
              value={NEXT_CONFIG_BLOCK}
              action={<CopyButton iconOnly textToCopy={NEXT_CONFIG_BLOCK} />}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
