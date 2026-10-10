import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Resources — Syntax Stash",
  alternates: { canonical: "/" },
  description: "A curated list of developer resources — frameworks, tools, and references.",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      sp.set(key, value);
    } else if (Array.isArray(value)) {
      for (const v of value) sp.append(key, v);
    }
  }
  const queryStr = sp.toString();
  redirect(queryStr ? `/?${queryStr}` : "/");
}
