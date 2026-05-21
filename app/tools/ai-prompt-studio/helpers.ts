export function parseVariables(text: string): string[] {
  const seen = new Set<string>();
  return [...text.matchAll(/\{\{(\w+)}}/g)]
    .map((m) => m[1])
    .filter((name) => (seen.has(name) ? false : (seen.add(name), true)));
}

export function injectVariables(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)}}/g, (match, name) => vars[name] || match);
}
