import type { Metadata } from "next";

import { AdminResourceForm } from "@/components/admin/resources/admin-resource-form";

export const metadata: Metadata = {
  title: "Add New Resource — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default function AdminNewResourcePage() {
  return <AdminResourceForm mode="create" />;
}
