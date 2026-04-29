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
