import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";

import { CATEGORY_DEFINITIONS } from "@/lib/categories";
import { slugify } from "@/lib/utils";

loadEnvConfig(process.cwd());

async function backfillCategories() {
  const { db } = await import("../lib/db");
  const { category, resource } = await import("../lib/db/schema");

  console.log("🚀 Starting Category Backfill & Linking...");

  // 1. Ensure core categories exist in the category table
  console.log(`📦 Ensuring ${CATEGORY_DEFINITIONS.length} core categories exist in the database...`);
  for (const cat of CATEGORY_DEFINITIONS) {
    const existing = await db.select().from(category).where(eq(category.slug, cat.slug));
    if (existing.length === 0) {
      await db.insert(category).values({
        id: crypto.randomUUID(),
        description: cat.description,
        icon: cat.icon,
        name: cat.name,
        order: cat.order,
        slug: cat.slug,
        themeColor: cat.themeColor,
      });
      console.log(`  ➕ Inserted category: ${cat.name} (${cat.slug})`);
    }
  }

  // 2. Fetch all current categories to build a fast lookup map
  const allCategories = await db.select().from(category);
  const categoryMap = new Map<string, typeof category.$inferSelect>();

  for (const c of allCategories) {
    categoryMap.set(c.name.trim().toLowerCase(), c);
    categoryMap.set(c.slug.trim().toLowerCase(), c);
  }

  console.log(`✅ Loaded ${allCategories.length} categories for lookup.`);

  // 3. Find all resources that need categoryId linked
  const resourcesToUpdate = await db
    .select({
      id: resource.id,
      title: resource.title,
      category: resource.category,
      categoryId: resource.categoryId,
    })
    .from(resource);

  console.log(`🔍 Inspecting ${resourcesToUpdate.length} total resources in the database...`);

  let updatedCount = 0;
  let alreadyLinkedCount = 0;
  let createdCategoryCount = 0;

  for (const res of resourcesToUpdate) {
    // If it already has a valid categoryId pointing to an existing category, verify it
    if (res.categoryId && allCategories.some((c) => c.id === res.categoryId)) {
      alreadyLinkedCount++;
      continue;
    }

    const rawCategoryName = (res.category || "").trim();
    if (!rawCategoryName) {
      console.warn(`  ⚠️ Resource "${res.title}" (${res.id}) has no category string. Skipping.`);
      continue;
    }

    let matchedCategory =
      categoryMap.get(rawCategoryName.toLowerCase()) ||
      categoryMap.get(slugify(rawCategoryName).toLowerCase());

    // If the category doesn't exist yet, create it on the fly
    if (!matchedCategory) {
      const newCatId = crypto.randomUUID();
      const newCatSlug = slugify(rawCategoryName);
      const [newCat] = await db
        .insert(category)
        .values({
          id: newCatId,
          name: rawCategoryName,
          order: allCategories.length + createdCategoryCount + 1,
          slug: newCatSlug,
        })
        .returning();

      matchedCategory = newCat;
      categoryMap.set(rawCategoryName.toLowerCase(), newCat);
      categoryMap.set(newCatSlug.toLowerCase(), newCat);
      createdCategoryCount++;
      console.log(`  ✨ Created missing category: "${rawCategoryName}" (${newCatSlug})`);
    }

    // Update resource with categoryId and canonical category name
    await db
      .update(resource)
      .set({
        category: matchedCategory.name,
        categoryId: matchedCategory.id,
        updatedAt: new Date(),
      })
      .where(eq(resource.id, res.id));

    updatedCount++;
  }

  console.log("\n🎉 Category backfill summary:");
  console.log(`   - Already linked resources: ${alreadyLinkedCount}`);
  console.log(`   - Newly linked resources: ${updatedCount}`);
  console.log(`   - New categories created: ${createdCategoryCount}`);
  console.log(`   - Total resources: ${resourcesToUpdate.length}`);
}

backfillCategories()
  .then(() => {
    console.log("✅ Category backfill completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Category backfill failed:", err);
    process.exit(1);
  });
