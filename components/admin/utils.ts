import { slugifyAuthor } from "@/lib/authors";
import { Submission } from "@/lib/db/schema";
import { CATEGORIES } from "@/lib/resource-data/categories";
import { TAGS } from "@/lib/resource-data/tags";

export function generateTsCode(sub: Submission): string {
  // Find category key in CATEGORIES
  const categoryKey =
    Object.entries(CATEGORIES).find(([, val]) => val === sub.category)?.[0] ||
    sub.category.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "dev";

  // Parse and resolve tags against TAGS object
  const parsedTags = sub.tags
    ? sub.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const formattedTags = parsedTags.map((tag) => {
    const matchedTagKey = Object.entries(TAGS).find(
      ([key, val]) =>
        key.toLowerCase() === tag.toLowerCase() || val.toLowerCase() === tag.toLowerCase(),
    )?.[0];

    return matchedTagKey ? `TAGS.${matchedTagKey}` : `"${tag.replace(/"/g, '\\"')}"`;
  });

  const resolvedWebsite = sub.authorWebsite;

  // Alphabetical property order
  let code = "  {\n";
  code += `    title: "${sub.title.replace(/"/g, '\\"')}",\n`;
  if (sub.author) code += `    author: "${sub.author.replace(/"/g, '\\"')}",\n`;
  code += `    category: CATEGORIES.${categoryKey},\n`;
  code += `    description:\n      "${sub.description.replace(/"/g, '\\"')}",\n`;
  if (sub.favicon) code += `    favicon: "${sub.favicon}",\n`;
  if (sub.github) code += `    github: "${sub.github}",\n`;
  if (sub.ogImage) code += `    ogImage:\n      "${sub.ogImage}",\n`;
  if (sub.subtitle) code += `    subtitle: "${sub.subtitle.replace(/"/g, '\\"')}",\n`;
  if (formattedTags.length > 0) {
    code += `    tags: [${formattedTags.join(", ")}],\n`;
  } else {
    code += "    tags: [],\n";
  }
  code += `    url: "${sub.url}",\n`;
  code += "  },";

  const hasSocial =
    sub.authorTwitter ||
    sub.authorGitHub ||
    sub.authorWebsite ||
    sub.authorYouTube ||
    sub.authorLinkedIn;

  if (sub.author && hasSocial) {
    const slug = slugifyAuthor(sub.author);
    code += `\n\n  // Authors Registry Entry (lib/resource-data/authors.ts)\n`;
    code += `  "${slug}": {\n`;
    code += `    name: "${sub.author.replace(/"/g, '\\"')}",\n`;
    code += `    links: {\n`;
    if (sub.authorGitHub) code += `      github: "${sub.authorGitHub}",\n`;
    if (sub.authorLinkedIn) code += `      linkedin: "${sub.authorLinkedIn}",\n`;
    if (sub.authorTwitter) code += `      twitter: "${sub.authorTwitter}",\n`;
    if (resolvedWebsite) code += `      website: "${resolvedWebsite}",\n`;
    if (sub.authorYouTube) code += `      youtube: "${sub.authorYouTube}",\n`;
    code += `    },\n`;
    code += `  },`;
  }

  return code;
}
