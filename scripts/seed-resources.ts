import { loadEnvConfig } from "@next/env";

import { slugifyAuthor } from "@/lib/authors";
import { CATEGORY_DEFINITIONS } from "@/lib/categories";
import { resourceLinks } from "@/lib/resource-data";
import { AUTHORS_REGISTRY } from "@/lib/resource-data/authors";

loadEnvConfig(process.cwd());

async function seed() {
  const { db } = await import("../lib/db");
  const { author, category, resource } = await import("../lib/db/schema");

  console.log("🚀 Starting database seeding for Syntax Stash...");

  // 1. Seed Categories
  console.log(`📦 Seeding ${CATEGORY_DEFINITIONS.length} core categories...`);
  const categoryValues = CATEGORY_DEFINITIONS.map((cat) => ({
    id: crypto.randomUUID(),
    description: cat.description,
    icon: cat.icon,
    name: cat.name,
    order: cat.order,
    slug: cat.slug,
    themeColor: cat.themeColor,
  }));

  for (const cat of categoryValues) {
    await db
      .insert(category)
      .values(cat)
      .onConflictDoUpdate({
        set: {
          description: cat.description,
          icon: cat.icon,
          name: cat.name,
          order: cat.order,
          themeColor: cat.themeColor,
          updatedAt: new Date(),
        },
        target: category.slug,
      });
  }

  // Fetch all existing categories from DB to map name & slug -> DB id
  const existingCategories = await db.select().from(category);
  const categoryNameToId = new Map<string, string>();
  for (const c of existingCategories) {
    categoryNameToId.set(c.name.toLowerCase(), c.id);
    categoryNameToId.set(c.slug.toLowerCase(), c.id);
  }
  console.log(`✅ Seeded ${existingCategories.length} categories.`);

  // 2. Collect and deduplicate all authors from AUTHORS_REGISTRY and resourceLinks
  const authorsMap = new Map<
    string,
    {
      blog?: string;
      github?: string;
      id: string;
      linkedin?: string;
      name: string;
      slug: string;
      twitter?: string;
      website?: string;
      youtube?: string;
    }
  >();

  // Add from AUTHORS_REGISTRY
  for (const [slug, profile] of Object.entries(AUTHORS_REGISTRY)) {
    const cleanSlug = slugifyAuthor(slug);
    authorsMap.set(cleanSlug, {
      id: crypto.randomUUID(),
      blog: profile.links?.blog,
      github: profile.links?.github,
      linkedin: profile.links?.linkedin,
      name: profile.name,
      slug: cleanSlug,
      twitter: profile.links?.twitter,
      website: profile.links?.website,
      youtube: profile.links?.youtube,
    });
  }

  // Add any authors mentioned in resourceLinks not yet in registry
  for (const item of resourceLinks) {
    if (!item.author) continue;
    const authorNames = Array.isArray(item.author) ? item.author : [item.author];

    for (let i = 0; i < authorNames.length; i++) {
      const name = authorNames[i]?.trim();
      if (!name) continue;
      const slug = slugifyAuthor(name);

      if (!authorsMap.has(slug)) {
        authorsMap.set(slug, {
          id: crypto.randomUUID(),
          name,
          slug,
        });
      }
    }
  }

  console.log(`📦 Found ${authorsMap.size} unique authors to seed.`);

  // Insert authors into database
  const authorsList = Array.from(authorsMap.values());
  const authorChunkSize = 50;
  let insertedAuthors = 0;

  for (let i = 0; i < authorsList.length; i += authorChunkSize) {
    const chunk = authorsList.slice(i, i + authorChunkSize);
    await db.insert(author).values(chunk).onConflictDoNothing({ target: author.slug });
    insertedAuthors += chunk.length;
  }
  console.log(`✅ Seeded authors (processed ${insertedAuthors} entries).`);

  // Fetch all existing authors from DB to map slug -> DB id accurately
  const existingAuthors = await db.select().from(author);
  const slugToIdMap = new Map<string, string>();
  for (const a of existingAuthors) {
    slugToIdMap.set(a.slug, a.id);
  }

  // 3. Prepare Resources
  console.log(`📦 Preparing ${resourceLinks.length} resources to seed...`);
  const resourceValues: (typeof resource.$inferInsert)[] = [];
  const seenUrls = new Set<string>();

  for (const item of resourceLinks) {
    if (!item.url || seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);

    let authorId: string | null = null;
    if (item.author) {
      const primaryAuthor = Array.isArray(item.author) ? item.author[0] : item.author;
      if (primaryAuthor) {
        const slug = slugifyAuthor(primaryAuthor);
        authorId = slugToIdMap.get(slug) || null;
      }
    }

    const categoryId = categoryNameToId.get(item.category.trim().toLowerCase()) || null;

    resourceValues.push({
      id: crypto.randomUUID(),
      title: item.title,
      authorId,
      category: item.category,
      categoryId,
      description: item.description || "",
      favicon: item.favicon || null,
      github: item.github || null,
      ogImage: item.ogImage || null,
      subtitle: item.subtitle || null,
      tags: item.tags && item.tags.length > 0 ? item.tags.join(",") : null,
      url: item.url,
    });
  }

  // Batch insert resources
  const resourceChunkSize = 100;
  let insertedResources = 0;

  for (let i = 0; i < resourceValues.length; i += resourceChunkSize) {
    const chunk = resourceValues.slice(i, i + resourceChunkSize);
    await db.insert(resource).values(chunk).onConflictDoNothing({ target: resource.url });
    insertedResources += chunk.length;
    process.stdout.write(
      `\r   Progress: ${Math.min(insertedResources, resourceValues.length)} / ${resourceValues.length} resources processed...`,
    );
  }

  console.log("\n");
  const totalInDb = await db.select().from(resource);
  console.log(
    `🎉 Seeding complete! Database now contains ${totalInDb.length} live resources across ${existingCategories.length} categories and ${existingAuthors.length} authors.`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
