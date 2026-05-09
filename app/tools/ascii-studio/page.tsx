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
  const tool = internalTools.find((t) => t.url === "/tools/ascii-studio");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="banner" className="flex flex-col gap-6">
        <div className="flex w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
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

        <TabsContent value="banner" className="mt-0">
          <TextBannerTab />
        </TabsContent>
        <TabsContent value="tree" className="mt-0">
          <FolderTreeTab />
        </TabsContent>
        <TabsContent value="table" className="mt-0">
          <MarkdownTableTab />
        </TabsContent>
        <TabsContent value="zalgo" className="mt-0">
          <ZalgoTextTab />
        </TabsContent>
        <TabsContent value="image" className="mt-0">
          <ImageToAsciiTab />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
