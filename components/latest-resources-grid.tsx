"use client";

import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { ResourceDialog } from "@/components/resource-dialog";
import StashCard from "@/components/stash-card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Resource } from "@/types";

interface LatestResourcesGridProps {
  allResources?: Resource[];
  resources: Resource[];
  totalCount?: number;
}

export function LatestResourcesGrid({
  allResources = [],
  resources,
  totalCount,
}: LatestResourcesGridProps) {
  const [activeDialogResource, setActiveDialogResource] = useState<Resource | null>(null);

  return (
    <>
      <section className="bg-background border-b-[1.5px] border-white/8 px-6 py-20 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-primary mb-2 flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
                <SparkleIcon weight="fill" className="size-4" />
                <span>Recently Added to Catalog</span>
              </div>
              <h2 className="flex flex-wrap items-baseline gap-3 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
                <span className="font-display font-black uppercase">LATEST</span>
                <span className="font-serif tracking-normal lowercase italic">additions.</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md font-mono text-xs leading-relaxed md:text-right">
              Freshly curated libraries, design kits, and engineering utilities added to the stash.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="card-grid w-full">
            {resources.map((item) => (
              <StashCard
                key={item.id || item.url}
                item={item}
                onCardClick={(clickedItem) => {
                  setActiveDialogResource(clickedItem as Resource);
                }}
              />
            ))}
          </div>

          {/* Footer Link */}
          <div className="mt-10 flex items-center justify-between border-t border-white/8 pt-8">
            <Button asChild size="sm" variant="default">
              <Link href="/resources" className="text-display-xs">
                VIEW ALL {totalCount || 1481} RESOURCES{" "}
                <ArrowRightIcon weight="bold" className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Resource Detail Dialog */}
      <Dialog
        open={!!activeDialogResource}
        onOpenChange={(open) => {
          if (!open) setActiveDialogResource(null);
        }}
      >
        {activeDialogResource && (
          <ResourceDialog
            key={activeDialogResource.url || activeDialogResource.title}
            resource={activeDialogResource}
            allResources={allResources.length > 0 ? allResources : resources}
          />
        )}
      </Dialog>
    </>
  );
}
