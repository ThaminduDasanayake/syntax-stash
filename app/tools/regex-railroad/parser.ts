import { parse, type RootNode } from "regjsparser";

export type ParseResult =
  | { ok: true; ast: RootNode; flags: string }
  | { ok: false; error: string };

export function parseRegex(pattern: string, flags: string): ParseResult {
  if (!pattern) return { ok: false, error: "Enter a pattern" };
  try {
    // Validate the flags are usable by the native RegExp first
    new RegExp(pattern, flags);
    // Cast to base RootNode — extended features are handled in the renderer's default case
    const ast = parse(pattern, flags) as RootNode;
    return { ok: true, ast, flags };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid pattern" };
  }
}
