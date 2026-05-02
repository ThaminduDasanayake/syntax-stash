import json5 from "json5";

export interface BlockItem {
  originalText: string;
  data: Record<string, unknown> | null;
}

export interface ParsedData {
  items: BlockItem[];
  keys: string[];
}

export type FilterOperator = "contains" | "equals" | "greater" | "less";

export function extractElements(text: string): string[] | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;

  const inner = trimmed.slice(1, -1);
  const elements: string[] = [];
  let current = "";
  let depth = 0;
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];

    if (inString) {
      current += char;
      if (char === stringChar && inner[i - 1] !== "\\") inString = false;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      stringChar = char;
      current += char;
      continue;
    }

    if (char === "{" || char === "[") {
      depth++;
      current += char;
      continue;
    }

    if (char === "}" || char === "]") {
      depth--;
      current += char;
      continue;
    }

    if (char === "," && depth === 0) {
      if (current.trim()) elements.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) elements.push(current.trim());
  return elements;
}

export function parseSmartBlocks(text: string): ParsedData | null {
  if (!text.trim()) return null;

  const elements = extractElements(text);
  if (!elements || elements.length === 0) return null;

  const items: BlockItem[] = [];
  const keySet = new Set<string>();

  for (const el of elements) {
    let data = null;
    try {
      // Shadow-quote bare JS identifiers so json5 can parse them
      // e.g. `icon: Scale,` -> `icon: "Scale",`
      const shadow = el.replace(/:\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*([,}])/g, ':"$1"$2');
      data = json5.parse(shadow);

      if (typeof data === "object" && data !== null) {
        Object.keys(data).forEach((k) => keySet.add(k));
      }
    } catch {
      // keep original text even if parsing fails
    }
    items.push({ originalText: el, data });
  }

  return { items, keys: Array.from(keySet) };
}

export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);

  const aNum = Number(a);
  const bNum = Number(b);
  if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;

  return String(a).localeCompare(String(b));
}

export function matchesFilter(
  itemData: Record<string, unknown> | null,
  key: string,
  operator: FilterOperator,
  value: string,
): boolean {
  if (!itemData) return false;

  const itemValue = itemData[key];
  if (itemValue == null) return false;

  const strValue = String(itemValue).toLowerCase();
  const filterValue = value.toLowerCase();

  switch (operator) {
    case "contains":
      return strValue.includes(filterValue);
    case "equals":
      return strValue === filterValue;
    case "greater": {
      const num = Number(itemValue);
      const filterNum = Number(value);
      return !isNaN(num) && !isNaN(filterNum) && num > filterNum;
    }
    case "less": {
      const num = Number(itemValue);
      const filterNum = Number(value);
      return !isNaN(num) && !isNaN(filterNum) && num < filterNum;
    }
    default:
      return true;
  }
}
