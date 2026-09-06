import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { slugifyAuthor } from "../lib/authors";
import { resourceLinks } from "../lib/resource-data";
import { AUTHORS_REGISTRY } from "../lib/resource-data/authors";

async function seed() {
  const { db } = await import("../lib/db");
  const { author, resource } = await import("../lib/db/schema");

  console.log("🚀 Starting database seeding for Syntax Stash...");

  // 1. Collect and deduplicate all authors from AUTHORS_REGISTRY and resourceLinks
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
    const authorLinks = Array.isArray(item.authorLink)
      ? item.authorLink
      : item.authorLink
        ? [item.authorLink]
        : [];

    for (let i = 0; i < authorNames.length; i++) {
      const name = authorNames[i]?.trim();
      if (!name) continue;
      const slug = slugifyAuthor(name);

      if (!authorsMap.has(slug)) {
        const link = authorLinks[i] || authorLinks[0];
        let website: string | undefined;
        let twitter: string | undefined;
        let github: string | undefined;

        if (link) {
          if (link.includes("twitter.com") || link.includes("x.com")) {
            twitter = link;
          } else if (link.includes("github.com")) {
            github = link;
          } else if (link.startsWith("http")) {
            website = link;
          }
        }

        authorsMap.set(slug, {
          id: crypto.randomUUID(),
          name,
          slug,
          ...(website ? { website } : {}),
          ...(twitter ? { twitter } : {}),
          ...(github ? { github } : {}),
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

  // 2. Prepare Resources
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

    resourceValues.push({
      id: crypto.randomUUID(),
      title: item.title,
      authorId,
      category: item.category,
      description: item.description || "",
      favicon: item.favicon || null,
      github: item.gitHubLink || null, // Renamed from gitHubLink to github
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
    `🎉 Seeding complete! Database now contains ${totalInDb.length} live resources across ${existingAuthors.length} authors.`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
