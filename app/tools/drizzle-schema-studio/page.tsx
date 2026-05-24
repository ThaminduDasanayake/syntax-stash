"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { PrismaToDrizzle } from "@/app/tools/drizzle-schema-studio/tabs/prisma-to-drizzle";
import { SqlToDrizzle } from "@/app/tools/drizzle-schema-studio/tabs/sql-to-drizzle";
import { Mode } from "@/app/tools/drizzle-schema-studio/types";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function DrizzleSchemaStudioPage() {
  const [mode, setMode] = useState<Mode>("sql");

  const tool = internalTools.find((t) => t.slug === "drizzle-schema-studio");

  return (
    <ToolLayout tool={tool}>
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="flex w-full flex-col">
        <TabsList className="mb-6 grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="sql" className="tab-trigger">
            SQL <ArrowRightIcon /> Drizzle
          </TabsTrigger>
          <TabsTrigger value="prisma" className="tab-trigger">
            Prisma <ArrowRightIcon /> Drizzle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sql">
          <SqlToDrizzle />
        </TabsContent>

        <TabsContent value="prisma">
          <PrismaToDrizzle />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
