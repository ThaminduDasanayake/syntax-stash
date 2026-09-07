import { Submission } from "@/lib/db/schema";
import { slugifyAuthor } from "@/lib/utils";
import { Resource } from "@/types";

import { AdminResourceItem } from "./types";

export function generateTsCode(sub: Submission): string {
  // Parse tags
  const parsedTags = sub.tags
    ? sub.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const formattedTags = parsedTags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`);

  const resolvedWebsite = sub.authorWebsite;

  // Alphabetical property order
  let code = "  {\n";
  code += `    title: "${sub.title.replace(/"/g, '\\"')}",\n`;
  if (sub.author) code += `    author: "${sub.author.replace(/"/g, '\\"')}",\n`;
  code += `    category: "${sub.category.replace(/"/g, '\\"')}",\n`;
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
    code += `\n\n  // Author Entry\n`;
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

export function adminItemToResource(item: AdminResourceItem): Resource {
  return {
    title: item.title,
    author: item.authorName || undefined,
    category: item.category,
    description: item.description,
    favicon: item.favicon || undefined,
    github: item.github || undefined,
    ogImage: item.ogImage || undefined,
    subtitle: item.subtitle || undefined,
    tags: item.tags
      ? item.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined,
    url: item.url,
  };
}
