import { Link, Wrench } from "lucide-react";

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

export default function Home() {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-y-auto p-6">
      <div className="bg-card border-border mb-8 flex w-full shrink-0 flex-col items-center justify-center space-y-4 rounded-xl border p-8 text-center">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">
          syntax<span className="text-primary">-</span>stash
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          A curated command center for modern web development.
        </p>
        <p className="text-muted-foreground mt-4 font-mono text-xs">
          Built with Next.js · handmade, no tracking.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tools" className="flex w-full flex-col">
        <TabsList className="mb-8 h-10 gap-1 px-1">
          <TabsTrigger
            value="tools"
            className="data-active:bg-accent! data-active:decoration-primary data-active:border-muted-foreground! h-9 p-2 hover:cursor-pointer data-active:border! data-active:underline data-active:decoration-2 data-active:underline-offset-4"
          >
            <Wrench className="text-primary" /> Tools
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-active:bg-accent! data-active:decoration-secondary data-active:border-muted-foreground! h-9 p-2 hover:cursor-pointer data-active:border! data-active:underline data-active:decoration-2 data-active:underline-offset-4"
          >
            <Link className="text-secondary" /> Resources
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
                  <ToolCard key={tool.url} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-12 pb-8">
          {Object.entries(groupedResources).map(([category, items]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-secondary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">
                {category}
                <span className="bg-secondary h-px flex-1" />
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
    </div>
  );
}

{
  /*<div className="w-full space-y-10 pb-8">*/
}
{
  /*  {internalTools.length > 0 && (*/
}
{
  /*    <div>*/
}
{
  /*      <h2 className="text-foreground mb-4 font-mono text-lg font-semibold tracking-tight uppercase">*/
}
{
  /*        <span className="text-primary mr-2">/</span> Inbuilt Tools*/
}
{
  /*      </h2>*/
}

{
  /*      <div className="space-y-12">*/
}
{
  /*        {Object.entries(groupedTools).map(([category, tools]) => (*/
}
{
  /*          <div key={category} className="space-y-6">*/
}
{
  /*            <h3 className="text-primary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">*/
}
{
  /*              {category}*/
}
{
  /*              <span className="bg-border h-px flex-1" />*/
}
{
  /*            </h3>*/
}

{
  /*            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">*/
}
{
  /*              {tools.map((tool) => (*/
}
{
  /*                <ToolCard key={tool.url} tool={tool} />*/
}
{
  /*              ))}*/
}
{
  /*            </div>*/
}
{
  /*          </div>*/
}
{
  /*        ))}*/
}
{
  /*      </div>*/
}
{
  /*    </div>*/
}
{
  /*  )}*/
}

{
  /*  {resourceCategories.length > 0 && (*/
}
{
  /*    <div>*/
}
{
  /*      <h2 className="text-foreground mb-4 font-mono text-lg font-semibold tracking-tight uppercase">*/
}
{
  /*        <span className="text-secondary mr-2">/</span> Resource Stash*/
}
{
  /*      </h2>*/
}
{
  /*      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">*/
}
{
  /*        {resourceCategories.map((category) => (*/
}
{
  /*          <ResourceCard key={category} category={category} />*/
}
{
  /*        ))}*/
}
{
  /*      </div>*/
}
{
  /*    </div>*/
}
{
  /*  )}*/
}

{
  /*  {internalTools.length === 0 && resourceCategories.length === 0 && (*/
}
{
  /*    <div className="text-muted-foreground mt-10 text-center text-sm">*/
}
{
  /*      No tools or resources found.*/
}
{
  /*    </div>*/
}
{
  /*  )}*/
}
{
  /*</div>*/
}
