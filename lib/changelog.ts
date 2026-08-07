import fs from "fs";
import path from "path";

export type ChangelogSection = {
  title: string;
  items: string[];
};

export type ChangelogEntry = {
  version: string;
  date: string;
  sections: ChangelogSection[];
};

/**
 * Parses Markdown inline formatting like **bold**, `code`, and [link](url)
 * into HTML strings for render inside dangerHTML or JSX.
 */
export function formatInlineMarkdown(text: string): string {
  return text
    .replace(
      /\[([^\]]+)]\(([^)]+)\)/g,
      (_, text, url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline hover:text-c-green transition-colors">${text}</a>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-card border border-border px-1.5 py-0.5 font-mono text-xs text-c-green">$1</code>',
    );
}

/**
 * Server-side parser that reads CHANGELOG.md from process.cwd()
 * and converts it into structured ChangelogEntry objects.
 */
export function getChangelog(): ChangelogEntry[] {
  const filePath = path.join(process.cwd(), "CHANGELOG.md");
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const versionBlocks = fileContent.split(/^##\s+\[/m).slice(1);

  return versionBlocks.map((block) => {
    const firstLineEnd = block.indexOf("\n");
    const headerLine = firstLineEnd !== -1 ? block.substring(0, firstLineEnd) : block;
    const body = firstLineEnd !== -1 ? block.substring(firstLineEnd + 1) : "";

    const headerMatch = headerLine.match(/^([^\]]+)](?:\s*-\s*(.+))?/);
    const version = headerMatch ? headerMatch[1].trim() : "v0.0.0";
    const date = headerMatch && headerMatch[2] ? headerMatch[2].trim() : "";

    const rawSections = body.split(/^###\s+/m).slice(1);
    const sections: ChangelogSection[] = [];

    rawSections.forEach((sec) => {
      const secLines = sec.trim().split("\n");
      const title = secLines[0].trim();
      const items: string[] = [];

      for (let i = 1; i < secLines.length; i++) {
        const line = secLines[i].trim();
        if (line.startsWith("- ") || line.startsWith("* ")) {
          items.push(line.replace(/^[-*]\s+/, "").trim());
        }
      }

      if (items.length > 0) {
        sections.push({ title, items });
      }
    });

    if (sections.length === 0) {
      const items: string[] = [];
      body.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          items.push(trimmed.replace(/^[-*]\s+/, ""));
        }
      });
      if (items.length > 0) {
        sections.push({ title: "Changes", items });
      }
    }

    return {
      date,
      sections,
      version: version.startsWith("v") ? version : `v${version}`,
    };
  });
}
