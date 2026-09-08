import type { Metadata } from "next";

import { DesignSystemShowcase } from "@/components/design-system-showcase";
import { getAllCategories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Design System & Color Tokens",
  description:
    "Interactive showcase of Syntax Stash's brutalist typography scales, 8-color neo-brutalist theme matrix, atomic UI components, and category simulators.",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function DesignSystemPage() {
  const categories = await getAllCategories();

  return <DesignSystemShowcase categories={categories} />;
}
