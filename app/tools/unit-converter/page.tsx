"use client";

import { TABS } from "@/app/tools/unit-converter/constants";
import ConversionGrid from "@/app/tools/unit-converter/conversion-grid";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function UnitConverterPage() {
  const tool = internalTools.find((t) => t.slug === "unit-converter");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="length" className="flex w-full flex-col">
        <TabsList className="tab-list mb-4">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="tab-trigger">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <ConversionGrid units={tab.units} />
          </TabsContent>
        ))}
      </Tabs>
    </ToolLayout>
  );
}
