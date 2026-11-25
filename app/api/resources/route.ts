import { NextRequest, NextResponse } from "next/server";

import { getAllResources } from "@/lib/resources";

export async function GET(request: NextRequest) {
  try {
    const isMinimal = request.nextUrl.searchParams.get("minimal") === "true";
    const resources = await getAllResources();

    const data = isMinimal
      ? resources.map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          description: r.description,
          tags: r.tags,
          url: r.url,
        }))
      : resources;

    return NextResponse.json(
      { resources: data, total: data.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/resources error:", error);
    return NextResponse.json({ error: "Failed to fetch resources." }, { status: 500 });
  }
}
