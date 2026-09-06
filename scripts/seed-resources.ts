import { loadEnvConfig } from "@next/env";

import { slugifyAuthor } from "@/lib/authors";
import { CATEGORY_DEFINITIONS } from "@/lib/categories";
import { resourceLinks } from "@/lib/resource-data";
import { AUTHORS_REGISTRY } from "@/lib/resource-data/authors";
import { TAGS } from "@/lib/resource-data/tags";
import { normalizeTag } from "@/lib/tags";

loadEnvConfig(process.cwd());

async function seed() {
  const { db } = await import("../lib/db");
  const { author, category, resource, resourceTag, tag } = await import("../lib/db/schema");

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

  // 2. Seed Tags
  console.log("📦 Collecting and seeding tags...");
  const tagsMap = new Map<string, { id: string; name: string; slug: string }>();

  // From predefined TAGS dictionary
  for (const [key, val] of Object.entries(TAGS)) {
    const slug = normalizeTag(val || key);
    if (!slug) continue;
    tagsMap.set(slug, {
      id: crypto.randomUUID(),
      name: val || key,
      slug,
    });
  }

  // From resource links
  for (const item of resourceLinks) {
    if (!item.tags) continue;
    const tagsArray = Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === "string"
        ? (item.tags as string).split(",")
        : [];

    for (const rawTag of tagsArray) {
      const slug = normalizeTag(rawTag);
      if (!slug) continue;
      if (!tagsMap.has(slug)) {
        tagsMap.set(slug, {
          id: crypto.randomUUID(),
          name: rawTag.trim(),
          slug,
        });
      }
    }
  }

  console.log(`📦 Found ${tagsMap.size} unique tags to seed.`);
  const tagList = Array.from(tagsMap.values());
  const tagChunkSize = 50;
  for (let i = 0; i < tagList.length; i += tagChunkSize) {
    const chunk = tagList.slice(i, i + tagChunkSize);
    await db.insert(tag).values(chunk).onConflictDoNothing({ target: tag.slug });
  }

  const existingTags = await db.select().from(tag);
  const tagSlugToId = new Map<string, string>();
  for (const t of existingTags) {
    tagSlugToId.set(t.slug, t.id);
  }
  console.log(`✅ Seeded ${existingTags.length} tags.`);

  // 3. Collect and deduplicate all authors from AUTHORS_REGISTRY and resourceLinks
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

  // 4. Prepare Resources & Tag Associations
  console.log(`📦 Preparing ${resourceLinks.length} resources to seed...`);
  const resourceValues: (typeof resource.$inferInsert)[] = [];
  const resourceTagPairs: { resourceId: string; tagId: string }[] = [];
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
    const resourceId = crypto.randomUUID();

    const tagsArray = item.tags
      ? Array.isArray(item.tags)
        ? item.tags
        : typeof item.tags === "string"
          ? (item.tags as string).split(",")
          : []
      : [];

    for (const rawTag of tagsArray) {
      const tagSlug = normalizeTag(rawTag);
      const tagId = tagSlugToId.get(tagSlug);
      if (tagId) {
        resourceTagPairs.push({ resourceId, tagId });
      }
    }

    resourceValues.push({
      id: resourceId,
      title: item.title,
      authorId,
      category: item.category,
      categoryId,
      description: item.description || "",
      favicon: item.favicon || null,
      github: item.github || null,
      ogImage: item.ogImage || null,
      subtitle: item.subtitle || null,
      tags: tagsArray.length > 0 ? tagsArray.join(",") : null,
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

  // Fetch actual DB resources to match real IDs for tag pairs in case of conflict resolution
  const dbResources = await db.select({ id: resource.id, url: resource.url }).from(resource);
  const urlToDbResourceId = new Map<string, string>();
  for (const r of dbResources) {
    urlToDbResourceId.set(r.url, r.id);
  }

  const verifiedResourceTagPairs: (typeof resourceTag.$inferInsert)[] = [];
  const pairSet = new Set<string>();

  for (const item of resourceLinks) {
    const realResourceId = urlToDbResourceId.get(item.url);
    if (!realResourceId || !item.tags) continue;

    const tagsArray = Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === "string"
        ? (item.tags as string).split(",")
        : [];

    for (const rawTag of tagsArray) {
      const tagSlug = normalizeTag(rawTag);
      const tagId = tagSlugToId.get(tagSlug);
      if (tagId) {
        const key = `${realResourceId}_${tagId}`;
        if (!pairSet.has(key)) {
          pairSet.add(key);
          verifiedResourceTagPairs.push({ resourceId: realResourceId, tagId });
        }
      }
    }
  }

  // Batch insert resourceTag pairs
  console.log(`📦 Inserting ${verifiedResourceTagPairs.length} resource-tag relations...`);
  const tagPairChunkSize = 150;
  for (let i = 0; i < verifiedResourceTagPairs.length; i += tagPairChunkSize) {
    const chunk = verifiedResourceTagPairs.slice(i, i + tagPairChunkSize);
    await db.insert(resourceTag).values(chunk).onConflictDoNothing();
  }

  console.log(
    `🎉 Seeding complete! Database now contains ${dbResources.length} live resources across ${existingCategories.length} categories, ${existingAuthors.length} authors, and ${existingTags.length} tags with ${verifiedResourceTagPairs.length} tag links.`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });

