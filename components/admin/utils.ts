import { slugifyAuthor } from "@/lib/authors";
import { Submission } from "@/lib/db/schema";

export function generateTsCode(sub: Submission): string {
  let code = "  // --- Resource Entry ---\n  {\n";
  code += `    title: "${sub.title.replace(/"/g, '\\"')}",\n`;
  if (sub.subtitle) code += `    subtitle: "${sub.subtitle.replace(/"/g, '\\"')}",\n`;
  code += `    category: CATEGORIES.${sub.category.toLowerCase().replace(/[^a-z0-9]/g, "") || "tools"},\n`;
  code += `    description: "${sub.description.replace(/"/g, '\\"')}",\n`;
  code += `    url: "${sub.url}",\n`;
  if (sub.favicon) code += `    favicon: "${sub.favicon}",\n`;
  if (sub.ogImage) code += `    ogImage: "${sub.ogImage}",\n`;
  if (sub.author) code += `    author: "${sub.author.replace(/"/g, '\\"')}",\n`;
  const resolvedWebsite = sub.authorWebsite || sub.authorLink;
  if (resolvedWebsite) code += `    authorLink: "${resolvedWebsite}",\n`;
  if (sub.gitHubLink) code += `    gitHubLink: "${sub.gitHubLink}",\n`;
  const parsedTags = sub.tags
    ? sub.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  if (parsedTags.length > 0) {
    code += `    tags: [${parsedTags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ")}],\n`;
  } else {
    code += "    tags: [],\n";
  }
  code += "  },";

  const hasSocial =
    sub.authorTwitter ||
    sub.authorGitHub ||
    sub.authorWebsite ||
    sub.authorYouTube ||
    sub.authorLinkedIn;
  if (sub.author && hasSocial) {
    const slug = slugifyAuthor(sub.author);
    code += `\n\n  // --- Authors Registry Entry (lib/resource-data/authors.ts) ---\n`;
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
