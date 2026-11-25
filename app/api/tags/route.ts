import { NextResponse } from "next/server";

import { getAllTags } from "@/lib/tags";

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json(
      {
        tags,
        total: tags.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ error: "Failed to fetch tags." }, { status: 500 });
  }
}
