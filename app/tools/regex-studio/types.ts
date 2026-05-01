import { ReactNode } from "react";
import { type RootNode } from "regjsparser";

export type ParseResult = { ok: true; ast: RootNode; flags: string } | { ok: false; error: string };

export type RegexMatch = {
  value: string;
  index: number;
  groups: string[];
};

export type RegexResult = { ok: true; matches: RegexMatch[] } | { ok: false; error: string };

export type Rendered = {
  width: number;
  height: number;
  railY: number; // Y coordinate of the connecting rail, relative to this node's top
  el: (key: string) => ReactNode;
};

export type RegexCategory = "Validation" | "Formats" | "Code" | "Numbers";

export type RegexPattern = {
  name: string;
  pattern: string;
  flags: string;
  description: string;
  category: RegexCategory;
  examples: {
    match: string[];
    noMatch: string[];
  };
};
