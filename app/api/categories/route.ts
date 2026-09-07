import { NextResponse } from "next/server";

import { getAllCategories } from "@/lib/categories";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories." }, { status: 500 });
  }
}
