"use client";

import { LinkIcon, WrenchIcon } from "@phosphor-icons/react/ssr";
import { useMemo,useState } from "react";

import ToolCard from "@/components/tool-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";
import { Tool } from "@/types";

export function HomeTabs() {
  const [activeTab, setActiveTab] = useState("tools");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    resourceLinks.forEach((resource) => resource.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  // Filter tools and group by category
  const groupedTools = useMemo(() => {
    return internalTools.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, Tool[]>,
    );
  }, []);

  // Filter resources and group by category
  const groupedResources = useMemo(() => {
    return resourceLinks
      .filter((resource) => !activeTag || resource.tags?.includes(activeTag))
      .reduce(
        (acc, resource) => {
          if (!acc[resource.category]) acc[resource.category] = [];
          acc[resource.category].push(resource);
          return acc;
        },
        {} as Record<string, Tool[]>,
      );
  }, [activeTag]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full flex-col">
      <div className="mb-8 flex flex-col gap-6">
        <TabsList className="tab-list max-w-sm">
          <TabsTrigger value="tools" className="tab-trigger flex-1">
            <WrenchIcon weight="duotone" className="mr-2" /> Tools
          </TabsTrigger>
          <TabsTrigger value="resources" className="tab-trigger flex-1">
            <LinkIcon weight="bold" className="mr-2" /> Resources
          </TabsTrigger>
        </TabsList>

        {activeTab === "resources" && allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-telemetry text-muted-foreground mr-2">Filter:</span>
            <button
              onClick={() => setActiveTag(null)}
              className={`border-border border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeTag === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`border-border border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tools Tab */}
      <TabsContent value="tools" className="space-y-12 pb-8">
        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category} className="space-y-6 pt-4">
            <div className="flex w-full items-center gap-4">
              <span className="text-foreground text-console shrink-0 tracking-[0.2em]">
                {category}
              </span>

              <div className="border-border h-0 flex-1 border-b-2 border-dashed" />
              <span className="text-muted-foreground text-telemetry shrink-0">
                {"//"} {tools.length} ITEMS
              </span>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </TabsContent>

      {/* Resources Tab */}
      <TabsContent value="resources" className="space-y-12 pb-8">
        {Object.entries(groupedResources).length === 0 ? (
          <div className="text-muted-foreground py-12 text-center font-mono text-sm">
            No resources found for tag: #{activeTag}
          </div>
        ) : (
          Object.entries(groupedResources).map(([category, items]) => (
            <div key={category} className="space-y-6 pt-4">
              <div className="flex w-full items-center gap-4">
                <span className="text-foreground text-console shrink-0 tracking-[0.2em]">
                  {category}
                </span>

                <div className="border-border h-0 flex-1 border-b-2 border-dashed" />
                <span className="text-muted-foreground text-telemetry shrink-0">
                  {"//"} {items.length} ITEMS
                </span>
              </div>

              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((resource) => (
                  <ToolCard key={resource.url} tool={resource} />
                ))}
              </div>
            </div>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
