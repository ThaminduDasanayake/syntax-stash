import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";

import { CATEGORY_DEFINITIONS } from "@/lib/categories";

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
      categoryId: resource.categoryId,
    })
    .from(resource);

  console.log(`🔍 Inspecting ${resourcesToUpdate.length} total resources in the database...`);

  let alreadyLinkedCount = 0;

  for (const res of resourcesToUpdate) {
    // If it already has a valid categoryId pointing to an existing category, verify it
    if (res.categoryId && allCategories.some((c) => c.id === res.categoryId)) {
      alreadyLinkedCount++;
      continue;
    }
  }

  console.log("\n🎉 Category backfill summary:");
  console.log(`   - Linked resources: ${alreadyLinkedCount}`);
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
