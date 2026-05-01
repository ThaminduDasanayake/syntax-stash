import { marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

export function buildFrontmatter(filename: string, dateIso: string): string {
  return `---\nsource: ${filename}\nconverted: ${dateIso}\n---\n\n`;
}

export function downloadMarkdown(content: string, filename: string): void {
  const basename = filename.replace(/\.[^.]+$/, "");
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${basename}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function markdownToHtml(md: string): string {
  if (!md) return "";
  const html = marked.parse(md, { async: false, gfm: true, breaks: true }) as string;

  return html.replace(/\n<\/code><\/pre>/g, "</code></pre>");
}

const _td = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
_td.use(gfm);

export function htmlToMarkdown(html: string): string {
  return _td.turndown(html ?? "");
}

export function composeOutput(
  md: string,
  withFrontmatter: boolean,
  fileName: string | null,
): string {
  if (!withFrontmatter || !fileName) return md;
  return buildFrontmatter(fileName, new Date().toISOString().slice(0, 10)) + md;
}
