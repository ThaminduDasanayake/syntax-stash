"use client";

import { Scale } from "lucide-react";

import { TABS } from "@/app/tools/unit-converter/constants";
import ConversionGrid from "@/app/tools/unit-converter/conversion-grid";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UnitConverterPage() {
  return (
    <ToolLayout
      icon={Scale}
      title="Unit"
      highlight="Converter"
      description="Convert between units of length, weight, data, temperature, speed, area and volume."
    >
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
