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

export default async function ResourcesPage() {
  const { resources } = await getAllAdminResources();

  return <ResourcesView initialResources={resources} />;
}
