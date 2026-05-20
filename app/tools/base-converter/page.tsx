"use client";

import BitwiseOps from "@/app/tools/base-converter/tabs/bitwise-ops";
import { Converter } from "@/app/tools/base-converter/tabs/converter";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function BaseConverterPage() {
  const tool = internalTools.find((t) => t.slug === "base-converter");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="converter" className="flex w-full flex-col">
        <TabsList className="mb-4 w-full flex-wrap">
          <TabsTrigger
            value="converter"
            className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
          >
            Converter
          </TabsTrigger>
          <TabsTrigger
            value="bitwise"
            className="data-active:bg-primary! data-active:text-background! data-active:border-card/60! p-1 font-semibold hover:cursor-pointer data-active:border!"
          >
            Bitwise Ops
          </TabsTrigger>
        </TabsList>

        <TabsContent value="converter" className="space-y-6">
          <Converter />
        </TabsContent>

        <TabsContent value="bitwise" className="space-y-6">
          <BitwiseOps />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
