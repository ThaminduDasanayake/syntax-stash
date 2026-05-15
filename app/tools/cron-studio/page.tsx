"use client";

import { HammerIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { BuildTab } from "@/app/tools/cron-studio/tabs/build-tab";
import { ExploreTab } from "@/app/tools/cron-studio/tabs/explore-tab";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function CronStudioPage() {
  const tool = internalTools.find((t) => t.slug === "cron-studio");

  const [activeTab, setActiveTab] = useState("build");
  const [exploreExpression, setExploreExpression] = useState("*/15 * * * *");

  const sendToExplore = (expression: string) => {
    setExploreExpression(expression);
    setActiveTab("explore");
  };

  return (
    <ToolLayout tool={tool}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <div className="flex w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="build" className="tab-trigger">
              <HammerIcon weight="duotone" className="size-4.5" />
              Build
            </TabsTrigger>
            <TabsTrigger value="explore" className="tab-trigger">
              <MagnifyingGlassIcon weight="duotone" className="size-4.5" />
              Explore
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="build" className="mt-0">
          <BuildTab onSendToExplore={sendToExplore} />
        </TabsContent>
        <TabsContent value="explore" className="mt-0">
          <ExploreTab expression={exploreExpression} setExpression={setExploreExpression} />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
