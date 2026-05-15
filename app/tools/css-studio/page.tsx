"use client";

import {
  CardsIcon,
  DropIcon,
  FrameCornersIcon,
  PenNibIcon,
  PlayIcon,
  SparkleIcon,
  SquareIcon,
} from "@phosphor-icons/react";

import { AnimationTab } from "@/app/tools/css-studio/tabs/animation-tab";
import { AspectRatioTab } from "@/app/tools/css-studio/tabs/aspect-ratio-tab";
import { BorderRadiusTab } from "@/app/tools/css-studio/tabs/border-radius-tab";
import { BoxShadowTab } from "@/app/tools/css-studio/tabs/box-shadow-tab";
import { CubicBezierTab } from "@/app/tools/css-studio/tabs/cubic-bezier-tab";
import { GlassmorphismTab } from "@/app/tools/css-studio/tabs/glassmorphism-tab";
import { GsapTab } from "@/app/tools/css-studio/tabs/gsap-tab";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { internalTools } from "@/lib/tools-data";

export default function CssStudioPage() {
  const tool = internalTools.find((t) => t.slug === "css-studio");

  return (
    <ToolLayout tool={tool}>
      <Tabs defaultValue="border-radius" className="flex flex-col gap-6">
        <div className="flex w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7">
            <TabsTrigger value="border-radius" className="tab-trigger">
              <SquareIcon weight="duotone" className="size-4.5" />
              Radius
            </TabsTrigger>
            <TabsTrigger value="aspect-ratio" className="tab-trigger">
              <FrameCornersIcon weight="duotone" className="size-4.5" />
              Ratio
            </TabsTrigger>
            <TabsTrigger value="box-shadow" className="tab-trigger">
              <DropIcon weight="duotone" className="size-4.5" />
              Shadow
            </TabsTrigger>
            <TabsTrigger value="glassmorphism" className="tab-trigger">
              <CardsIcon weight="duotone" className="size-4.5" />
              Glass
            </TabsTrigger>
            <TabsTrigger value="cubic-bezier" className="tab-trigger">
              <PenNibIcon weight="duotone" className="size-4.5" />
              Bezier
            </TabsTrigger>
            <TabsTrigger value="animation" className="tab-trigger">
              <PlayIcon weight="duotone" className="size-4.5" />
              Animate
            </TabsTrigger>
            <TabsTrigger value="gsap" className="tab-trigger">
              <SparkleIcon weight="duotone" className="size-4.5" />
              GSAP
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="border-radius" className="mt-0">
          <BorderRadiusTab />
        </TabsContent>
        <TabsContent value="aspect-ratio" className="mt-0">
          <AspectRatioTab />
        </TabsContent>
        <TabsContent value="box-shadow" className="mt-0">
          <BoxShadowTab />
        </TabsContent>
        <TabsContent value="glassmorphism" className="mt-0">
          <GlassmorphismTab />
        </TabsContent>
        <TabsContent value="cubic-bezier" className="mt-0">
          <CubicBezierTab />
        </TabsContent>
        <TabsContent value="animation" className="mt-0">
          <AnimationTab />
        </TabsContent>
        <TabsContent value="gsap" className="mt-0">
          <GsapTab />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
