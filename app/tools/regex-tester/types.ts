export type RegexMatch = {
  value: string;
  index: number;
  groups: string[];
};

export type RegexResult = { ok: true; matches: RegexMatch[] } | { ok: false; error: string };
