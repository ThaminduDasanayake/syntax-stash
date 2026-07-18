"use client";

import { BookOpenIcon, FlaskIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { LiveTester } from "@/app/tools/regex-studio/tabs/live-tester";
import { PatternLibrary } from "@/app/tools/regex-studio/tabs/pattern-library";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function RegexStudioPage() {
  const [activeTab, setActiveTab] = useState<string>("tester");

  const [pattern, setPattern] = useState("[a-z]+");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState(
    "Hello world 123\nThe quick brown fox jumps over the lazy dog.",
  );

  const tool = internalTools.find((t) => t.slug === "regex-studio");

  function handleUsePattern(entryPattern: string, entryFlags: string, exampleText: string) {
    setPattern(entryPattern);
    setFlags(entryFlags);
    setTestString(exampleText);
    setActiveTab("tester");
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  return (
    <ToolLayout tool={tool}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <TabsList className="tab-list grid max-w-md grid-cols-2">
          <TabsTrigger value="tester" className="tab-trigger">
            <FlaskIcon weight="duotone" className="size-4.5" />
            Live Tester
          </TabsTrigger>
          <TabsTrigger value="library" className="tab-trigger">
            <BookOpenIcon weight="duotone" className="size-4.5" />
            Pattern Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tester">
          <LiveTester
            pattern={pattern}
            setPattern={setPattern}
            flags={flags}
            setFlags={setFlags}
            testString={testString}
            setTestString={setTestString}
          />
        </TabsContent>

        <TabsContent value="library">
          <PatternLibrary onUsePatternAction={handleUsePattern} />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
