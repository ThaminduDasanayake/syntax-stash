"use client";

import { AlertCircle, Scissors } from "lucide-react";
import { useMemo, useState } from "react";

import ClassMapRow from "@/app/tools/tailwind-extractor/class-map-row";
import {
  type ClassEntry,
  extractClasses,
  generateCss,
  reconcileEntries,
  refactorSource,
  SAMPLE_JSX,
} from "@/app/tools/tailwind-extractor/helpers";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TextAreaField } from "@/components/ui/textarea-field";

export default function TailwindExtractorPage() {
  const [source, setSource] = useState(SAMPLE_JSX);
  const [entries, setEntries] = useState<ClassEntry[]>(() =>
    reconcileEntries([], extractClasses(SAMPLE_JSX)),
  );
  const [tab, setTab] = useState<"css" | "jsx">("css");

  const generatedCss = useMemo(() => generateCss(entries), [entries]);
  const refactoredJsx = useMemo(() => refactorSource(source, entries), [source, entries]);

  function renameEntry(id: string, name: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, semanticName: name } : e)));
  }

  const activeValue = tab === "css" ? generatedCss : refactoredJsx;

  return (
    <ToolLayout
      icon={Scissors}
      title="Tailwind"
      highlight="Extractor Studio"
      description="Paste messy JSX with long inline Tailwind classes. Name each extracted class group, then copy the generated CSS and refactored component."
    >
      <div className="space-y-10">
        <div className="space-y-2">
          <TextAreaField
            label="React / JSX input"
            value={source}
            onChange={(e) => {
              const newSource = e.target.value;
              setSource(newSource);
              setEntries((prev) => reconcileEntries(prev, extractClasses(newSource)));
            }}
            rows={22}
            className="resize-y text-xs"
            placeholder="Paste your JSX here…"
            spellCheck={false}
            action={
              <ClearButton
                onClick={() => {
                  setSource("");
                  setEntries((prev) => reconcileEntries(prev, extractClasses("")));
                }}
                disabled={!source}
              />
            }
          />

          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <AlertCircle size={11} className="shrink-0" />
            Handles <code className="bg-muted rounded px-1">className=&quot;…&quot;</code> and{" "}
            <code className="bg-muted rounded px-1">{`className={'…'}`}</code>. Dynamic expressions
            like <code className="bg-muted rounded px-1">cn()</code> are left as-is.
          </p>
        </div>

        <div className="space-y-2">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "css" | "jsx")}
            className="flex flex-col"
          >
            <div className="gap- flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="css" className="tab-trigger w-36">
                  Generated CSS
                </TabsTrigger>
                <TabsTrigger value="jsx" className="tab-trigger w-36">
                  Refactored JSX
                </TabsTrigger>
              </TabsList>
              <CopyButton value={activeValue} disabled={!activeValue} />
            </div>

            <TabsContent value="css">
              <Textarea
                readOnly
                value={generatedCss}
                rows={22}
                className="resize-y text-xs"
                placeholder={`Generated @layer components { ... } will appear here.\nPaste some JSX in the input pane to get started.`}
              />
            </TabsContent>

            <TabsContent value="jsx">
              <Textarea
                readOnly
                value={refactoredJsx}
                rows={22}
                className="resize-y text-xs"
                placeholder="Refactored JSX - with semantic class names replacing the long inline strings — will appear here."
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Class map</Label>
            {entries.length > 0 && (
              <span className="text-xs font-semibold">
                {entries.length} unique {entries.length === 1 ? "string" : "strings"} found
              </span>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="border-border bg-accent flex items-center justify-center rounded-xl border">
              <p className="text-muted-foreground text-sm">
                No <code className="bg-muted rounded px-1 font-mono text-xs">className</code>{" "}
                attributes found yet.
              </p>
            </div>
          ) : (
            <div className="border-border bg-accent overflow-y-auto rounded-xl border p-3">
              <div className="space-y-2">
                {entries.map((entry) => (
                  <ClassMapRow key={entry.id} entry={entry} onRename={renameEntry} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
