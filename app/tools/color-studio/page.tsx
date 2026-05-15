"use client";

import { ArrowsClockwiseIcon, EyeIcon, PaletteIcon } from "@phosphor-icons/react";

import { ContrastTab } from "@/app/tools/color-studio/tabs/contrast-tab";
import { ConverterTab } from "@/app/tools/color-studio/tabs/converter-tab";
import { PaletteTab } from "@/app/tools/color-studio/tabs/palette-tab";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function ColorStudioPage() {
  const tool = internalTools.find((t) => t.slug === "color-studio");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="converter" className="flex flex-col gap-6">
        <div className="flex w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="converter" className="tab-trigger">
              <ArrowsClockwiseIcon className="size-4.5" />
              Converter
            </TabsTrigger>
            <TabsTrigger value="palette" className="tab-trigger">
              <PaletteIcon weight="duotone" className="size-4.5" />
              Palette
            </TabsTrigger>
            <TabsTrigger value="contrast" className="tab-trigger">
              <EyeIcon weight="duotone" className="size-4.5" />
              Contrast
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="converter" className="mt-0">
          <ConverterTab />
        </TabsContent>
        <TabsContent value="palette" className="mt-0">
          <PaletteTab />
        </TabsContent>
        <TabsContent value="contrast" className="mt-0">
          <ContrastTab />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
