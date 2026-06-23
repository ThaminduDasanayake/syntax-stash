"use client";

import { DotOutlineIcon } from "@phosphor-icons/react";
import { useMemo, useRef } from "react";

import Diagram from "@/app/tools/regex-studio/components/diagram";
import { parseRegex } from "@/app/tools/regex-studio/helpers";
import { RegexResult } from "@/app/tools/regex-studio/types";
import { DotButton } from "@/components/dot-button";
import { ErrorAlert } from "@/components/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { cn } from "@/lib/utils";

interface LiveTesterProps {
  pattern: string;
  setPattern: (p: string) => void;
  flags: string;
  setFlags: (f: string) => void;
  testString: string;
  setTestString: (ts: string) => void;
}

export function LiveTester({
  pattern,
  setPattern,
  flags,
  setFlags,
  testString,
  setTestString,
}: LiveTesterProps) {
  const diagramRef = useRef<SVGSVGElement>(null);

  const parsed = useMemo(() => parseRegex(pattern, flags), [pattern, flags]);

  const result = useMemo<RegexResult>(() => {
    if (!pattern) return { matches: [], ok: true };

    try {
      const re = new RegExp(pattern, flags);

      if (flags.includes("g")) {
        const all = Array.from(testString.matchAll(re));
        return {
          matches: all.map((m) => ({
            groups: m.slice(1),
            index: m.index ?? 0,
            value: m[0],
          })),
          ok: true,
        };
      }

      const m = testString.match(re);
      if (!m) return { matches: [], ok: true };
      return {
        matches: [
          {
            groups: m.slice(1),
            index: m.index ?? 0,
            value: m[0],
          },
        ],
        ok: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Invalid regular expression",
        ok: false,
      };
    }
  }, [pattern, flags, testString]);

  function toggleFlag(flag: string) {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  }

  const getSvgString = () => {
    const svg = diagramRef.current;
    if (!svg) return "";
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  };

  function downloadSvg() {
    const svg = diagramRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regex-railroad.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  const flagsConfig = [
    { id: "g", label: "Global" },
    { id: "i", label: "Case insensitive" },
    { id: "m", label: "Multiline" },
    { id: "s", label: "Dotall" },
  ];

  return (
    <div className="mt-0 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Regular Expression</Label>

          <div className="flex items-center gap-3">
            {/* Left Slash */}
            <span className="text-muted-foreground font-mono text-xl font-light">/</span>

            {/* Pattern Input */}
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              className="flex-1 font-mono text-sm"
            />

            {/* Right Slash */}
            <span className="text-muted-foreground font-mono text-xl font-light">/</span>

            {/* Flags Input */}
            <Input
              readOnly
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="g"
              className="w-20 text-center font-mono text-sm"
            />
          </div>
        </div>

        {/* Interactive Flag Toggles */}
        <div className="flex flex-wrap gap-2">
          {flagsConfig.map((f, index) => (
            <DotButton
              key={f.id}
              isActive={flags.includes(f.id)}
              index={index}
              badgeText={f.id}
              label={f.label}
              onClick={() => toggleFlag(f.id)}
            />
          ))}
          {/*{[*/}
          {/*  { className: "bg-c-orange text-foreground", id: "g", label: "Global" },*/}
          {/*  { className: "bg-c-blue", fill: true, id: "i", label: "Case insensitive" },*/}
          {/*  { className: "bg-c-pink text-foreground", id: "m", label: "Multiline" },*/}
          {/*  { className: "bg-c-green text-foreground", id: "s", label: "Dotall" },*/}
          {/*].map((f) => {*/}
          {/*  const isActive = flags.includes(f.id);*/}
          {/*  return (*/}
          {/*    <Button*/}
          {/*      key={f.id}*/}
          {/*      className={cn("h-10 gap-2 px-3.5 font-semibold", isActive && f.className)}*/}
          {/*      onClick={() => toggleFlag(f.id)}*/}
          {/*      variant={isActive ? "default" : "outline"}*/}
          {/*    >*/}
          {/*      <span*/}
          {/*        className={cn(*/}
          {/*          "h-2.5 w-2.5 rounded-full border",*/}
          {/*          f.fill && isActive ? "bg-background border-background" : "bg-foreground",*/}
          {/*          !isActive && f.className,*/}
          {/*        )}*/}
          {/*      />*/}
          {/*      <span className="font-mono">{f.id}</span>*/}
          {/*      <span>{f.label}</span>*/}
          {/*    </Button>*/}
          {/*  );*/}
          {/*})}*/}
        </div>
      </div>

      {!result.ok && <ErrorAlert message={result.error} />}

      <TextareaGroup
        label="Test String"
        value={testString}
        autoGrow
        onChange={(e) => setTestString(e.target.value)}
        placeholder="Paste text to test against..."
        action={<ClearButton size="sm" onClick={() => setTestString("")} disabled={!testString} />}
      />

      <div className="space-y-3 pt-4">
        <div className="flex items-baseline justify-between">
          <Label className="text-foreground">Matches</Label>
          {result.ok && (
            <span className="text-muted-foreground font-mono text-xs">
              {result.matches.length} {result.matches.length === 1 ? "match" : "matches"}
            </span>
          )}
        </div>

        {result.ok && result.matches.length === 0 && (
          <p className="text-muted-foreground font-mono text-sm">No matches found.</p>
        )}

        {result.ok && result.matches.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {result.matches.map((m, i) => (
              <Card key={i} size="sm" className="bg-background">
                <CardContent className="space-y-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-muted-foreground font-mono text-xs">#{i + 1}</span>
                    <span className="text-muted-foreground font-mono text-xs">index {m.index}</span>
                  </div>
                  <p className="text-primary font-mono text-sm break-all">{m.value || "\u00A0"}</p>
                  {m.groups.length > 0 && (
                    <div className="border-border space-y-1 border-t pt-2">
                      {m.groups.map((g, gi) => (
                        <p key={gi} className="text-muted-foreground font-mono text-xs break-all">
                          <span className="text-foreground/60">group {gi + 1}:</span>{" "}
                          {g ?? "(undefined)"}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <CopyButton textToCopy={getSvgString} labelName="Copy SVG" disabled={!parsed.ok} />

        <DownloadButton
          label="Download SVG"
          variant="outline"
          onClick={downloadSvg}
          disabled={!parsed.ok}
        />
      </div>

      {parsed.ok && (
        <div className="border-border bg-card overflow-auto rounded-xl border p-6">
          <Diagram ast={parsed.ast} svgRef={diagramRef} />
        </div>
      )}
    </div>
  );
}
