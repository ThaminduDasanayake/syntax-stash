import { NextResponse } from "next/server";

import { getAllAuthors } from "@/lib/authors";

export async function GET() {
  try {
    const authors = await getAllAuthors();
    return NextResponse.json({
      authors: authors.map((a) => ({
        id: a.id,
        categories: a.categories,
        count: a.count,
        links: a.links || null,
        name: a.name,
        slug: a.slug,
      })),
      total: authors.length,
    });
  } catch (error) {
    console.error("GET /api/authors error:", error);
    return NextResponse.json({ error: "Failed to fetch authors." }, { status: 500 });
  }
}
