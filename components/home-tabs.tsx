import { LinkIcon, WrenchIcon } from "@phosphor-icons/react/ssr";

import ToolCard from "@/components/tool-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";

const groupedTools = internalTools.reduce(
  (acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  },
  {} as Record<string, typeof internalTools>,
);

const groupedResources = resourceLinks.reduce(
  (acc, resource) => {
    if (!acc[resource.category]) acc[resource.category] = [];
    acc[resource.category].push(resource);
    return acc;
  },
  {} as Record<string, typeof resourceLinks>,
);

export function HomeTabs() {
  return (
    <Tabs defaultValue="tools" className="flex w-full flex-col">
      <TabsList className="tab-list mb-8 max-w-sm">
        <TabsTrigger value="tools" className="tab-trigger flex-1">
          <WrenchIcon weight="duotone" className="mr-2" /> Tools
        </TabsTrigger>
        <TabsTrigger value="resources" className="tab-trigger flex-1">
          <LinkIcon weight="bold" className="mr-2" /> Resources
        </TabsTrigger>
      </TabsList>

      {/* Tools Tab */}
      <TabsContent value="tools" className="space-y-12 pb-8">
        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category} className="space-y-6 pt-4">
            <div className="flex w-full items-center gap-4">
              <span className="text-foreground shrink-0 font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {category}
              </span>

              <div className="border-border h-0 flex-1 border-b-2 border-dashed" />
              <span className="text-muted-foreground shrink-0 font-mono text-[10px] font-bold">
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
        {Object.entries(groupedResources).map(([category, items]) => (
          <div key={category} className="space-y-6 pt-4">
            <div className="flex w-full items-center gap-4">
              <span className="text-foreground shrink-0 font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {category}
              </span>

              <div className="border-border h-0 flex-1 border-b-2 border-dashed" />
              <span className="text-muted-foreground shrink-0 font-mono text-[10px] font-bold">
                {"//"} {items.length} ITEMS
              </span>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((resource) => (
                <ToolCard key={resource.url} tool={resource} />
              ))}
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
