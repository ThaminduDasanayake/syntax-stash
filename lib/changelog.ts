import fs from "fs";
import path from "path";

export type ChangelogSection = {
  title: string;
  items: string[];
};

export type ChangelogEntry = {
  id: string;
  title: string;
  date: string;
  sections: ChangelogSection[];
  version: string;
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
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline hover:text-foreground transition-colors">${text}</a>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-card border-[1.5px] border-border px-1.5 py-0.5 font-mono text-xs text-foreground">$1</code>',
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
    const primary = headerMatch ? headerMatch[1].trim() : "Update";
    const secondary = headerMatch && headerMatch[2] ? headerMatch[2].trim() : "";

    // If primary is in YYYY-MM-DD format (or contains date/version), use it as anchor ID
    const id = primary.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
    const date = secondary || primary;
    const title = secondary || primary;

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
      id,
      title,
      date,
      sections,
      version: primary,
    };
  });
}
