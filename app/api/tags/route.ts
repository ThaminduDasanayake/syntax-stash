import { NextResponse } from "next/server";

import { getAllResources } from "@/lib/resources";
import { getAllTags } from "@/lib/tags";

export async function GET() {
  try {
    const resources = await getAllResources();
    const tags = getAllTags(resources);

    return NextResponse.json({
      tags,
      total: tags.length,
    });
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ error: "Failed to fetch tags." }, { status: 500 });
  }
}
