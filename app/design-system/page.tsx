import type { Metadata } from "next";

import { DesignSystemShowcase } from "@/components/design-system-showcase";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Core color tokens, typography scales, action buttons, and foundational UI controls for Syntax Stash.",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}
