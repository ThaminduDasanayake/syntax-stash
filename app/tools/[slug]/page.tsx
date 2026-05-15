import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { internalTools } from "@/lib/tools-data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return internalTools
    .filter((tool) => tool.slug)
    .map((tool) => ({ slug: tool.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = internalTools.find((t) => t.slug === slug);

  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `/tools/${slug}`,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tool = internalTools.find((t) => t.slug === slug);

  if (!tool) notFound();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-6">
      <header className="border-border bg-card rounded-xl border p-6">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">{tool.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{tool.description}</p>
      </header>
      <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
        This tool is being migrated to the new dynamic route. The interactive UI is currently
        served by the static route at <code className="font-mono">app/tools/{slug}/page.tsx</code>.
      </div>
    </div>
  );
}
