import { NextResponse } from "next/server";

import { getAllResources } from "@/lib/resources";

export async function GET() {
  try {
    const resources = await getAllResources();
    return NextResponse.json({ resources, total: resources.length });
  } catch (error) {
    console.error("GET /api/resources error:", error);
    return NextResponse.json({ error: "Failed to fetch resources." }, { status: 500 });
  }
}
