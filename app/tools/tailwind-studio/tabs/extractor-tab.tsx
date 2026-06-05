"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import ClassMapRow from "@/app/tools/tailwind-studio/class-map-row";
import {
  type ClassEntry,
  extractClasses,
  generateCss,
  reconcileEntries,
  refactorSource,
  SAMPLE_JSX,
} from "@/app/tools/tailwind-studio/extractor-helpers";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextareaGroup } from "@/components/ui/textarea-group";

export function ExtractorTab() {
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
    <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-8">
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-4">
        <TextareaGroup
          label="React / JSX input"
          value={source}
          containerClassName="flex-1 min-h-[400px]"
          onChange={(e) => {
            const newSource = e.target.value;
            setSource(newSource);
            setEntries((prev) => reconcileEntries(prev, extractClasses(newSource)));
          }}
          placeholder="Paste your JSX here..."
          action={
            <ClearButton
              size="sm"
              onClick={() => {
                setSource("");
                setEntries((prev) => reconcileEntries(prev, extractClasses("")));
              }}
              disabled={!source}
            />
          }
        />

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <WarningCircleIcon className="size-4 shrink-0" />
          Handles <code className="bg-muted rounded px-1">{`className="..."`}</code> and{" "}
          <code className="bg-muted rounded px-1">{`className={'...'}`}</code>. Dynamic expressions
          like <code className="bg-muted rounded px-1">cn()</code> are left as-is.
        </p>
      </div>

      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "css" | "jsx")}
          className="flex flex-col"
        >
          <TabsList className="tab-list grid max-w-xs grid-cols-2">
            <TabsTrigger value="css" className="tab-trigger w-36">
              Generated CSS
            </TabsTrigger>
            <TabsTrigger value="jsx" className="tab-trigger w-36">
              Refactored JSX
            </TabsTrigger>
          </TabsList>

          <TabsContent value="css">
            <TextareaGroup
              label="Generated CSS"
              readOnly
              containerClassName="flex-1 min-h-[400px]"
              value={generatedCss}
              placeholder={`Generated @layer components { ... } will appear here.\nPaste some JSX in the input pane to get started.`}
              action={<CopyButton iconOnly textToCopy={activeValue} disabled={!activeValue} />}
            />
          </TabsContent>

          <TabsContent value="jsx">
            <TextareaGroup
              label="Refactored JSX"
              readOnly
              containerClassName="flex-1 min-h-[400px]"
              value={refactoredJsx}
              placeholder="Refactored JSX - with semantic class names replacing the long inline strings - will appear here."
              action={<CopyButton iconOnly textToCopy={activeValue} disabled={!activeValue} />}
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
  );
}
