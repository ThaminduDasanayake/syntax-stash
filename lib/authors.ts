import { resourceLinks } from "@/lib/resource-data";
import { AUTHORS_REGISTRY } from "@/lib/resource-data/authors";
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
  links?: AuthorLinks;
  name: string;
  slug?: string;
}

export interface AuthorWithResources {
  categories: string[];
  count: number;
  links?: AuthorLinks;
  name: string;
  resources: Resource[];
  slug: string;
}

/**
 * Normalizes and converts an author name into a clean, URL-friendly slug.
 * Handles diacritics / accents (e.g. "falk schröter" -> "falk-schroter").
 */
export function slugifyAuthor(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Retrieves all unique authors with their resources across the stash.
 * Merges with explicit author profiles from AUTHORS_REGISTRY when available.
 * Sorted by resource count descending.
 */
export function getAllAuthors(): AuthorWithResources[] {
  const authorMap = new Map<string, { name: string; resources: Resource[] }>();

  for (const resource of resourceLinks) {
    if (!resource.author) continue;

    const rawAuthors = Array.isArray(resource.author) ? resource.author : [resource.author];

    for (const authorItem of rawAuthors) {
      if (!authorItem) continue;
      const trimmedAuthor = authorItem.trim();
      const slug = slugifyAuthor(trimmedAuthor);

      if (!authorMap.has(slug)) {
        authorMap.set(slug, {
          name: trimmedAuthor,
          resources: [],
        });
      }

      authorMap.get(slug)?.resources.push(resource);
    }
  }

  const result: AuthorWithResources[] = [];

  for (const [slug, { name, resources }] of authorMap.entries()) {
    const registryEntry = AUTHORS_REGISTRY[slug];
    const displayName = registryEntry?.name || name;

    // Discover website link from resource.authorLink if not in registry
    let fallbackLinks: AuthorLinks | undefined = registryEntry?.links;
    if (!fallbackLinks?.website) {
      const resourceWithAuthorLink = resources.find((r) => r.authorLink);
      if (resourceWithAuthorLink?.authorLink) {
        const rawLink = Array.isArray(resourceWithAuthorLink.authorLink)
          ? resourceWithAuthorLink.authorLink[0]
          : resourceWithAuthorLink.authorLink;
        if (rawLink) {
          fallbackLinks = {
            ...fallbackLinks,
            website: rawLink,
          };
        }
      }
    }

    const categories = Array.from(new Set(resources.map((r) => r.category)));

    result.push({
      categories,
      count: resources.length,
      links: fallbackLinks,
      name: displayName,
      resources,
      slug,
    });
  }

  return result.sort((a, b) => b.count - a.count);
}

/**
 * Finds a specific author by their slug, along with their curated resources.
 */
export function getAuthorBySlug(slug: string): AuthorWithResources | null {
  const normalizedSlug = slug.toLowerCase().trim();
  const allAuthors = getAllAuthors();
  return allAuthors.find((a) => a.slug === normalizedSlug) || null;
}
