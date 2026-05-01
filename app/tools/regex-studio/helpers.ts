import { parse, type RootNode } from "regjsparser";

import { ParseResult } from "@/app/tools/regex-studio/types.ts";

export function parseRegex(pattern: string, flags: string): ParseResult {
  if (!pattern) return { ok: false, error: "Enter a pattern" };
  try {
    new RegExp(pattern, flags);

    const ast = parse(pattern, flags) as RootNode;
    return { ok: true, ast, flags };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid pattern" };
  }
}
