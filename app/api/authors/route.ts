import { NextResponse } from "next/server";

import { getAllAuthors } from "@/lib/authors";
import { getAllResources } from "@/lib/resources";

export async function GET() {
  try {
    const resources = await getAllResources();
    const authors = getAllAuthors(resources).map((a) => ({
      count: a.count,
      links: a.links || null,
      name: a.name,
      slug: a.slug,
    }));

    return NextResponse.json({
      authors,
      total: authors.length,
    });
  } catch (error) {
    console.error("GET /api/authors error:", error);
    return NextResponse.json({ error: "Failed to fetch authors." }, { status: 500 });
  }
}
