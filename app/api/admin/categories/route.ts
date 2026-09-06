import { asc, count, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { CATEGORY_DEFINITIONS } from "@/lib/categories";
import { db } from "@/lib/db";
import { category, resource } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

async function verifyAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }
  return session.user;
}

export async function GET() {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const rows = await db
      .select({
        id: category.id,
        createdAt: category.createdAt,
        description: category.description,
        icon: category.icon,
        name: category.name,
        order: category.order,
        slug: category.slug,
        themeColor: category.themeColor,
        toolCount: count(resource.id),
        updatedAt: category.updatedAt,
      })
      .from(category)
      .leftJoin(resource, eq(category.id, resource.categoryId))
      .groupBy(category.id)
      .orderBy(asc(category.order), asc(category.name));

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        categories: CATEGORY_DEFINITIONS.map((def) => ({
          ...def,
          id: def.slug,
          toolCount: 0,
        })),
        total: CATEGORY_DEFINITIONS.length,
      });
    }

    const result = rows.map((r) => ({
      ...r,
      toolCount: Number(r.toolCount) || 0,
    }));

    return NextResponse.json({
      categories: result,
      total: result.length,
    });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json({ error: "Failed to load categories." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { description, icon, name, order, slug, themeColor } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = slug?.trim() ? slugify(slug.trim()) : slugify(cleanName);

    // Check for existing slug or name
    const [existing] = await db
      .select()
      .from(category)
      .where(eq(category.slug, cleanSlug));

    if (existing) {
      return NextResponse.json(
        { error: `A category with slug "${cleanSlug}" already exists.` },
        { status: 409 },
      );
    }

    const categoryId = crypto.randomUUID();
    await db.insert(category).values({
      id: categoryId,
      createdAt: new Date(),
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      name: cleanName,
      order: typeof order === "number" ? order : 0,
      slug: cleanSlug,
      themeColor: themeColor?.trim() || null,
      updatedAt: new Date(),
    });

    revalidateTag("resources", "max");
    revalidatePath("/resources");
    revalidatePath("/admin/categories");

    return NextResponse.json({
      id: categoryId,
      message: "Category created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, description, icon, name, order, slug, themeColor } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    const [existing] = await db.select().from(category).where(eq(category.id, id));
    if (!existing) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    const updates: Partial<typeof category.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name !== undefined && name.trim()) {
      updates.name = name.trim();
    }
    if (slug !== undefined && slug.trim()) {
      updates.slug = slugify(slug.trim());
    }
    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }
    if (icon !== undefined) {
      updates.icon = icon?.trim() || null;
    }
    if (themeColor !== undefined) {
      updates.themeColor = themeColor?.trim() || null;
    }
    if (order !== undefined) {
      updates.order = typeof order === "number" ? order : parseInt(order, 10) || 0;
    }

    await db.update(category).set(updates).where(eq(category.id, id));

    revalidateTag("resources", "max");
    revalidatePath("/resources");
    revalidatePath("/admin/categories");

    return NextResponse.json({
      message: "Category updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/admin/categories error:", error);
    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing category ID." }, { status: 400 });
    }

    // Check if any resources are linked
    const linkedResources = await db
      .select({ id: resource.id })
      .from(resource)
      .where(eq(resource.categoryId, id));

    if (linkedResources.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${linkedResources.length} resource(s) are currently assigned to it. Reassign them first.`,
        },
        { status: 400 },
      );
    }

    await db.delete(category).where(eq(category.id, id));

    revalidateTag("resources", "max");
    revalidatePath("/resources");
    revalidatePath("/admin/categories");

    return NextResponse.json({
      message: "Category deleted.",
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/categories error:", error);
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }
}
