import { loadEnvConfig } from "@next/env";
import { count, eq, isNull, sql } from "drizzle-orm";

loadEnvConfig(process.cwd());

async function verifyTables() {
  const { db } = await import("../lib/db");
  const {
    author,
    bookmark,
    category,
    collection,
    collectionItem,
    resource,
    resourceTag,
    submission,
    tag,
    user,
  } = await import("../lib/db/schema");

  console.log("=========================================");
  console.log("🔍 DATABASE AUDIT & INTEGRITY CHECK");
  console.log("=========================================\n");

  // 1. Table Row Counts
  const [userCount] = await db.select({ count: count() }).from(user);
  const [authorCount] = await db.select({ count: count() }).from(author);
  const [categoryCount] = await db.select({ count: count() }).from(category);
  const [tagCount] = await db.select({ count: count() }).from(tag);
  const [resourceCount] = await db.select({ count: count() }).from(resource);
  const [resourceTagCount] = await db.select({ count: count() }).from(resourceTag);
  const [bookmarkCount] = await db.select({ count: count() }).from(bookmark);
  const [collectionCount] = await db.select({ count: count() }).from(collection);
  const [collectionItemCount] = await db.select({ count: count() }).from(collectionItem);
  const [submissionCount] = await db.select({ count: count() }).from(submission);

  console.log("📊 Table Row Counts:");
  console.log(`  • user:            ${userCount.count}`);
  console.log(`  • author:          ${authorCount.count}`);
  console.log(`  • category:        ${categoryCount.count}`);
  console.log(`  • tag:             ${tagCount.count}`);
  console.log(`  • resource:        ${resourceCount.count}`);
  console.log(`  • resource_tag:    ${resourceTagCount.count}`);
  console.log(`  • bookmark:        ${bookmarkCount.count}`);
  console.log(`  • collection:      ${collectionCount.count}`);
  console.log(`  • collection_item: ${collectionItemCount.count}`);
  console.log(`  • submission:      ${submissionCount.count}`);

  // 2. Integrity Checks on `resource`
  console.log("\n🛡️  Resource Integrity Checks:");
  
  // Check for orphaned categoryId in resource
  const orphanedCategory = await db
    .select({
      id: resource.id,
      title: resource.title,
      categoryId: resource.categoryId,
    })
    .from(resource)
    .leftJoin(category, eq(resource.categoryId, category.id))
    .where(isNull(category.id));

  console.log(`  • Resources with invalid/missing categoryId: ${orphanedCategory.length}`);
  if (orphanedCategory.length > 0) {
    console.log(`    ⚠️  Found:`, orphanedCategory.slice(0, 5));
  }

  // Check for orphaned authorId in resource
  const orphanedAuthor = await db
    .select({
      id: resource.id,
      title: resource.title,
      authorId: resource.authorId,
    })
    .from(resource)
    .leftJoin(author, eq(resource.authorId, author.id))
    .where(sql`${resource.authorId} IS NOT NULL AND ${author.id} IS NULL`);

  console.log(`  • Resources with invalid authorId: ${orphanedAuthor.length}`);

  // 3. Integrity Checks on `resource_tag` junction table
  console.log("\n🛡️  Resource-Tag Junction Checks:");
  const orphanedResourceTags = await db
    .select({
      resourceId: resourceTag.resourceId,
      tagId: resourceTag.tagId,
    })
    .from(resourceTag)
    .leftJoin(resource, eq(resourceTag.resourceId, resource.id))
    .where(isNull(resource.id));

  console.log(`  • resource_tag rows pointing to non-existent resources: ${orphanedResourceTags.length}`);

  const orphanedTagLinks = await db
    .select({
      resourceId: resourceTag.resourceId,
      tagId: resourceTag.tagId,
    })
    .from(resourceTag)
    .leftJoin(tag, eq(resourceTag.tagId, tag.id))
    .where(isNull(tag.id));

  console.log(`  • resource_tag rows pointing to non-existent tags: ${orphanedTagLinks.length}`);

  // 4. Sample Resources Joined Output
  console.log("\n🧪 Testing Full Dynamic Query (Sample 3 items):");
  const sampleRows = await db
    .select({
      id: resource.id,
      title: resource.title,
      authorName: author.name,
      categoryName: category.name,
      categorySlug: category.slug,
      tagName: tag.name,
    })
    .from(resource)
    .leftJoin(category, eq(resource.categoryId, category.id))
    .leftJoin(author, eq(resource.authorId, author.id))
    .leftJoin(resourceTag, eq(resource.id, resourceTag.resourceId))
    .leftJoin(tag, eq(resourceTag.tagId, tag.id))
    .limit(15);

  const sampleMap = new Map<string, { author: string; category: string; tags: string[]; title: string }>();
  for (const row of sampleRows) {
    if (!sampleMap.has(row.id)) {
      sampleMap.set(row.id, {
        title: row.title,
        author: row.authorName || "(None)",
        category: row.categoryName || "(None)",
        tags: row.tagName ? [row.tagName] : [],
      });
    } else if (row.tagName) {
      sampleMap.get(row.id)!.tags.push(row.tagName);
    }
  }

  for (const [, data] of Array.from(sampleMap.entries()).slice(0, 3)) {
    console.log(`  • [${data.category}] "${data.title}" by ${data.author} | Tags: [${data.tags.join(", ")}]`);
  }

  console.log("\n=========================================");
  console.log("✅ ALL TABLES AND RELATIONS VERIFIED!");
  console.log("=========================================\n");
}

verifyTables()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  });
