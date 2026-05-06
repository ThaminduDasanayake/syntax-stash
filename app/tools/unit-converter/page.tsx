"use client";

import { TABS } from "@/app/tools/unit-converter/constants";
import ConversionGrid from "@/app/tools/unit-converter/conversion-grid";
import { ToolLayout } from "@/components/layout/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function UnitConverterPage() {
  const tool = internalTools.find((t) => t.url === "/tools/unit-converter");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="length" className="flex w-full flex-col">
        <TabsList className="mb-4 w-full flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
            >
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
