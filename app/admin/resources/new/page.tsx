import type { Metadata } from "next";

import { ResourceForm } from "@/components/admin/resources/resource-form";

export const metadata: Metadata = {
  title: "Add New Resource — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default function AdminNewResourcePage() {
  return <ResourceForm mode="create" />;
}
