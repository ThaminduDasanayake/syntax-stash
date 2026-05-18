import { LinkIcon, WrenchIcon } from "@phosphor-icons/react/ssr";

import ToolCard from "@/components/tool-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resourceLinks } from "@/lib/resources-data";
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
      <TabsList className="mb-8 grid min-w-sm grid-cols-2">
        <TabsTrigger value="tools" className="tab-trigger">
          <WrenchIcon weight="duotone" /> Tools
        </TabsTrigger>
        <TabsTrigger value="resources" className="tab-trigger">
          <LinkIcon weight="bold" /> Resources
        </TabsTrigger>
      </TabsList>

      {/* Tools Tab */}
      <TabsContent value="tools" className="space-y-12 pb-8">
        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category} className="space-y-6">
            <h3 className="text-primary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">
              {category}
              <span className="bg-primary h-px flex-1" />
            </h3>
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
          <div key={category} className="space-y-6">
            <h3 className="text-primary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">
              {category}
              <span className="bg-primary h-px flex-1" />
            </h3>
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
