"use client";

import { FileJson } from "lucide-react";
import { useCallback, useState } from "react";

import { type SampleKey, SAMPLES } from "@/app/tools/json-studio/samples";
import { FormatTab } from "@/app/tools/json-studio/tabs/format-tab";
import { OrganizeTab } from "@/app/tools/json-studio/tabs/organize-tab";
import { QueryTab } from "@/app/tools/json-studio/tabs/query-tab";
import { TreeTab } from "@/app/tools/json-studio/tabs/tree-tab";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

type TabId = "format" | "tree" | "query" | "organize";

const TABS: { id: TabId; label: string }[] = [
  { id: "format", label: "Format" },
  { id: "tree", label: "Tree" },
  { id: "query", label: "Query" },
  { id: "organize", label: "Organize" },
];

const SAMPLE_LABELS: { key: SampleKey; label: string }[] = [
  { key: "format", label: "Simple object" },
  { key: "tree", label: "Nested user" },
  { key: "query", label: "Bookstore" },
  { key: "organize", label: "People array" },
];

export default function JsonStudioPage() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("format");
  const [queryPath, setQueryPath] = useState("$.store.book[*].author");

  const handleTestInQuery = useCallback((path: string) => {
    setQueryPath(path);
    setActiveTab("query");
  }, []);

  return (
    <ToolLayout
      icon={FileJson}
      title="JSON"
      highlight="Studio"
      description="Format, browse, query, and organize JSON — all in one place."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input pane */}
        <div className="space-y-2">
          <TextAreaField
            label="JSON Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here…"
            rows={28}
            className="font-mono text-sm"
            action={<ClearButton onClick={() => setInput("")} disabled={!input} />}
          />

          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_LABELS.map(({ key, label }) => (
              <Button
                key={key}
                variant="outline"
                className="text-xs"
                onClick={() => setInput(SAMPLES[key])}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Output pane */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabId)}
          className="flex flex-col gap-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            {TABS.map((tab) => (
              <TabsTrigger className="tab-trigger" key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="format">
            <FormatTab input={input} />
          </TabsContent>

          <TabsContent value="tree">
            <TreeTab input={input} onTestInQuery={handleTestInQuery} />
          </TabsContent>

          <TabsContent value="query">
            <QueryTab input={input} query={queryPath} onQueryChange={setQueryPath} />
          </TabsContent>

          <TabsContent value="organize">
            <OrganizeTab input={input} />
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
