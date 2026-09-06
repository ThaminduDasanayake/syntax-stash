import type { Metadata } from "next";

import { AdminResourceForm } from "@/components/admin/admin-resource-form";

export const metadata: Metadata = {
  title: "Add New Tool — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default function AdminNewResourcePage() {
  return <AdminResourceForm mode="create" />;
}
