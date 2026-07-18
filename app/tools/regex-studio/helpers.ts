import { parse, type RootNode } from "regjsparser";

import { ParseResult } from "@/app/tools/regex-studio/types";

export function parseRegex(pattern: string, flags: string): ParseResult {
  if (!pattern) return { error: "Enter a pattern", ok: false };
  try {
    new RegExp(pattern, flags);

    const ast = parse(pattern, flags) as RootNode;
    return { ast, flags, ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid pattern", ok: false };
  }
}
