import type { Metadata } from "next";

import { AdminResourcesClient } from "@/components/admin-resources-client";
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

  return (
    <AdminResourcesClient
      _initialCategoryCounts={categoryCounts}
      initialResources={resources}
    />
  );
}


