import type { Metadata } from "next";

import { ResourcesView } from "@/components/admin/resources/resources-view";
import { getAllAdminResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Live Resource Manager — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminResourcesPage() {
  const { categoryCounts, resources } = await getAllAdminResources();

  return <ResourcesView _initialCategoryCounts={categoryCounts} initialResources={resources} />;
}
