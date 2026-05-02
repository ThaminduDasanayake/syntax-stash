// Re-export shared JSON utilities used across tabs
export type JsonValue =
  | string | number | boolean | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonType = "object" | "array" | "string" | "number" | "boolean" | "null";

export function parseJson(input: string): { ok: true; value: JsonValue } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

export function getValueType(v: JsonValue): JsonType {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v as JsonType;
}

export function countChildren(v: JsonValue): number {
  if (v === null || typeof v !== "object") return 0;
  return Array.isArray(v) ? v.length : Object.keys(v).length;
}

export function matchesSearch(key: string, value: JsonValue, query: string): boolean {
  if (!query) return false;
  const q = query.toLowerCase();
  if (key.toLowerCase().includes(q)) return true;
  if (value !== null && typeof value !== "object") {
    return String(value).toLowerCase().includes(q);
  }
  return false;
}

export function subtreeMatches(value: JsonValue, query: string): boolean {
  if (!query) return false;
  if (value === null || typeof value !== "object") {
    return String(value).toLowerCase().includes(query.toLowerCase());
  }
  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as [string, JsonValue])
    : Object.entries(value) as [string, JsonValue][];
  return entries.some(([k, v]) =>
    matchesSearch(k, v, query) || subtreeMatches(v, query),
  );
}
