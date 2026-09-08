import { asc, count, desc, eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/lib/db";
import { author, resource } from "@/lib/db/schema";
import { getAllResources } from "@/lib/resources";
import { slugifyAuthor } from "@/lib/utils";
import { Resource } from "@/types";

export interface AuthorLinks {
  blog?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
}

export interface AuthorProfile {
  id?: string;
  links?: AuthorLinks;
  name: string;
  slug?: string;
}

export interface AuthorWithResources {
  id?: string;
  categories: string[];
  count: number;
  links?: AuthorLinks;
  name: string;
  resources: Resource[];
  slug: string;
}

export { slugifyAuthor };

/**
 * Derives authors in-memory from a resource list (fallback / offline mode).
 */
export function getAuthorsFromResources(list: Resource[]): AuthorWithResources[] {
  const authorMap = new Map<string, { name: string; resources: Resource[] }>();

  for (const item of list) {
    if (!item.author) continue;

    const rawAuthors = Array.isArray(item.author) ? item.author : [item.author];

    for (const authorItem of rawAuthors) {
      if (!authorItem) continue;
      const splitAuthors =
        typeof authorItem === "string" && authorItem.includes(",")
          ? authorItem
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [authorItem.trim()];

      for (const trimmedAuthor of splitAuthors) {
        if (!trimmedAuthor) continue;
        const slug = slugifyAuthor(trimmedAuthor);

        if (!authorMap.has(slug)) {
          authorMap.set(slug, {
            name: trimmedAuthor,
            resources: [],
          });
        }

        authorMap.get(slug)?.resources.push(item);
      }
    }
  }

  const result: AuthorWithResources[] = [];

  for (const [slug, { name, resources }] of authorMap.entries()) {
    const categories = Array.from(new Set(resources.map((r) => r.category)));

    result.push({
      categories,
      count: resources.length,
      name,
      resources,
      slug,
    });
  }

  return result.sort((a, b) => b.count - a.count);
}

/**
 * Fetches all canonical authors directly from Neon Postgres with resource counts and social links.
 * Cached at Next.js edge and revalidated on tag "authors".
 */
export const getAllAuthors = cache(
  unstable_cache(
    async (customResources?: Resource[]): Promise<AuthorWithResources[]> => {
      if (customResources && customResources.length > 0) {
        return getAuthorsFromResources(customResources);
      }

      try {
        const rows = await db
          .select({
            id: author.id,
            blog: author.blog,
            github: author.github,
            linkedin: author.linkedin,
            name: author.name,
            resourceCount: count(resource.id),
            slug: author.slug,
            twitter: author.twitter,
            website: author.website,
            youtube: author.youtube,
          })
          .from(author)
          .leftJoin(resource, eq(author.id, resource.authorId))
          .groupBy(author.id)
          .orderBy(desc(count(resource.id)), asc(author.name));

        const allResources = await getAllResources();

        return rows.map((r) => {
          const authorResources = allResources.filter(
            (res) =>
              res.author === r.name ||
              (Array.isArray(res.author) && res.author.includes(r.name)) ||
              slugifyAuthor(typeof res.author === "string" ? res.author : "") === r.slug,
          );

          const categories = Array.from(new Set(authorResources.map((res) => res.category)));

          return {
            id: r.id,
            categories,
            count: Number(r.resourceCount) || authorResources.length || 0,
            links: {
              blog: r.blog || undefined,
              github: r.github || undefined,
              linkedin: r.linkedin || undefined,
              twitter: r.twitter || undefined,
              website: r.website || undefined,
              youtube: r.youtube || undefined,
            },
            name: r.name,
            resources: authorResources,
            slug: r.slug,
          };
        });
      } catch (error) {
        console.error("Database query failed in getAllAuthors():", error);
        return [];
      }
    },
    ["all-authors"],
    { revalidate: 3600, tags: ["authors"] },
  ),
);

/**
 * Finds a specific author by their slug, along with their curated resources and social links.
 * Checks the cached list first; falls back to direct database query for newly created authors.
 */
export async function getAuthorBySlug(
  slug: string,
  customResources?: Resource[],
): Promise<AuthorWithResources | null> {
  const normalizedSlug = slug.toLowerCase().trim();
  const allAuthors = await getAllAuthors(customResources);
  const cached = allAuthors.find(
    (a) => a.slug === normalizedSlug || slugifyAuthor(a.name) === normalizedSlug,
  );
  if (cached) return cached;

  // Direct database query fallback for freshly created authors
  try {
    const [dbAuthor] = await db
      .select({
        id: author.id,
        blog: author.blog,
        github: author.github,
        linkedin: author.linkedin,
        name: author.name,
        slug: author.slug,
        twitter: author.twitter,
        website: author.website,
        youtube: author.youtube,
      })
      .from(author)
      .where(eq(author.slug, normalizedSlug));

    if (!dbAuthor) return null;

    const allResources = await getAllResources();
    const authorResources = allResources.filter(
      (res) =>
        res.author === dbAuthor.name ||
        (Array.isArray(res.author) && res.author.includes(dbAuthor.name)) ||
        slugifyAuthor(typeof res.author === "string" ? res.author : "") === dbAuthor.slug,
    );
    const categories = Array.from(new Set(authorResources.map((res) => res.category)));

    return {
      id: dbAuthor.id,
      categories,
      count: authorResources.length,
      links: {
        blog: dbAuthor.blog || undefined,
        github: dbAuthor.github || undefined,
        linkedin: dbAuthor.linkedin || undefined,
        twitter: dbAuthor.twitter || undefined,
        website: dbAuthor.website || undefined,
        youtube: dbAuthor.youtube || undefined,
      },
      name: dbAuthor.name,
      resources: authorResources,
      slug: dbAuthor.slug,
    };
  } catch (error) {
    console.error("Direct fallback failed in getAuthorBySlug():", error);
    return null;
  }
}

/**
 * Helper to revalidate the cached authors tag.
 */
export function invalidateAuthorCache() {
  try {
    revalidateTag("authors", { expire: 0 });
  } catch {
    // Ignore outside request context
  }
}
