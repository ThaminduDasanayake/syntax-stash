export function parseVariables(text: string): string[] {
  const seen = new Set<string>();
  return [...text.matchAll(/\{\{(\w+)\}\}/g)]
    .map((m) => m[1])
    .filter((name) => (seen.has(name) ? false : (seen.add(name), true)));
}

export function injectVariables(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, name) => vars[name] || match);
}

export function minifyPrompt(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/\*([\s\S]+?)\*/g, "$1")
    .replace(/__([\s\S]+?)__/g, "$1")
    .replace(/_([\s\S]+?)_/g, "$1")
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, "").trim())
    .replace(/`(.+?)`/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\s*>\s*/gm, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
