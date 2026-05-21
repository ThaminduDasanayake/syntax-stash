"use client";

import {
  FolderIcon,
  ImageIcon,
  MarkdownLogoIcon,
  SkullIcon,
  TextTIcon,
} from "@phosphor-icons/react";

import { FolderTreeTab } from "@/app/tools/ascii-studio/tabs/folder-tree-tab";
import { ImageToAsciiTab } from "@/app/tools/ascii-studio/tabs/image-to-ascii-tab";
import { MarkdownTableTab } from "@/app/tools/ascii-studio/tabs/markdown-table-tab";
import { TextBannerTab } from "@/app/tools/ascii-studio/tabs/text-banner-tab";
import { ZalgoTextTab } from "@/app/tools/ascii-studio/tabs/zalgo-text-tab";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function AsciiStudioPage() {
  const tool = internalTools.find((t) => t.slug === "ascii-studio");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="banner" className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="flex w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="banner" className="tab-trigger">
              <TextTIcon weight="duotone" className="size-4.5" />
              Banner
            </TabsTrigger>
            <TabsTrigger value="tree" className="tab-trigger">
              <FolderIcon weight="duotone" className="size-4.5" />
              Tree
            </TabsTrigger>
            <TabsTrigger value="table" className="tab-trigger">
              <MarkdownLogoIcon weight="duotone" className="size-4.5" />
              MD Table
            </TabsTrigger>
            <TabsTrigger value="zalgo" className="tab-trigger">
              <SkullIcon weight="duotone" className="size-4.5" />
              Zalgo
            </TabsTrigger>
            <TabsTrigger value="image" className="tab-trigger">
              <ImageIcon weight="duotone" className="size-4.5" />
              Image
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="banner" className="min-h-0 flex-1 data-[state=inactive]:hidden">
          <TextBannerTab />
        </TabsContent>
        <TabsContent value="tree" className="min-h-0 flex-1 data-[state=inactive]:hidden">
          <FolderTreeTab />
        </TabsContent>
        <TabsContent value="table" className="min-h-0 flex-1 data-[state=inactive]:hidden">
          <MarkdownTableTab />
        </TabsContent>
        <TabsContent value="zalgo" className="min-h-0 flex-1 data-[state=inactive]:hidden">
          <ZalgoTextTab />
        </TabsContent>
        <TabsContent value="image" className="min-h-0 flex-1 data-[state=inactive]:hidden">
          <ImageToAsciiTab />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
