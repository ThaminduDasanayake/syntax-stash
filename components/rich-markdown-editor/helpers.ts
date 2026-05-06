import { marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

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
