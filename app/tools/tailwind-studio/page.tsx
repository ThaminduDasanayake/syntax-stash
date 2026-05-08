"use client";

import { ScissorsIcon, SwatchesIcon, EyedropperIcon } from "@phosphor-icons/react";

import { CheatsheetTab } from "@/app/tools/tailwind-studio/tabs/cheatsheet-tab";
import { ExtractorTab } from "@/app/tools/tailwind-studio/tabs/extractor-tab";
import { ShadesTab } from "@/app/tools/tailwind-studio/tabs/shades-tab";
import { ToolLayout } from "@/components/layout/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function TailwindStudioPage() {
  const tool = internalTools.find((t) => t.url === "/tools/tailwind-studio");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="cheatsheet" className="flex flex-col gap-6">
        <div className="flex w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="cheatsheet" className="tab-trigger">
              <SwatchesIcon weight="duotone" className="size-4.5" />
              Cheatsheet
            </TabsTrigger>
            <TabsTrigger value="extractor" className="tab-trigger">
              <ScissorsIcon weight="duotone" className="size-4.5" />
              Extractor
            </TabsTrigger>
            <TabsTrigger value="shades" className="tab-trigger">
              <EyedropperIcon weight="duotone" className="size-4.5" />
              Shades
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cheatsheet" className="mt-0">
          <CheatsheetTab />
        </TabsContent>
        <TabsContent value="extractor" className="mt-0">
          <ExtractorTab />
        </TabsContent>
        <TabsContent value="shades" className="mt-0">
          <ShadesTab />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
