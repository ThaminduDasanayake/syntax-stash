type Row = Record<string, unknown>;

function flattenObject(obj: unknown, prefix = ""): Record<string, string> {
  if (obj === null || obj === undefined) return { [prefix]: "" };
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return { [prefix]: String(obj) };
  }
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val, newKey));
    } else {
      result[newKey] = val === null || val === undefined ? "" : String(val);
    }
  }
  return result;
}

function quoteCell(cell: string, delimiter: string): string {
  if (cell.includes('"') || cell.includes(delimiter) || cell.includes("\n")) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

export function jsonToCSV(
  input: string,
  delimiter: string,
  includeHeader: boolean,
  flatten: boolean,
): string {
  const parsed: unknown = JSON.parse(input);
  const rows: Row[] = Array.isArray(parsed) ? (parsed as Row[]) : [parsed as Row];

  const processedRows = flatten ? rows.map((r) => flattenObject(r)) : rows;

  // Collect union of all keys
  const keySet = new Set<string>();
  for (const row of processedRows) {
    for (const k of Object.keys(row as Record<string, unknown>)) keySet.add(k);
  }
  const keys = Array.from(keySet);

  const lines: string[] = [];
  if (includeHeader) {
    lines.push(keys.map((k) => quoteCell(k, delimiter)).join(delimiter));
  }

  for (const row of processedRows) {
    const r = row as Record<string, unknown>;
    lines.push(
      keys
        .map((k) => quoteCell(r[k] === null || r[k] === undefined ? "" : String(r[k]), delimiter))
        .join(delimiter),
    );
  }

  return lines.join("\n");
}

export function csvToJSON(input: string, delimiter: string): string {
  const rows = parseCSV(input, delimiter);
  if (rows.length === 0) return "[]";

  const [headers, ...dataRows] = rows;
  const result = dataRows.map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i] ?? "";
    });
    return obj;
  });

  return JSON.stringify(result, null, 2);
}

function parseCSV(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        cell += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (input.slice(i, i + delimiter.length) === delimiter) {
        row.push(cell);
        cell = "";
        i += delimiter.length;
      } else if (ch === "\n") {
        row.push(cell);
        cell = "";
        rows.push(row);
        row = [];
        i++;
        // Handle \r\n
        if (input[i] === "\r") i++;
      } else if (ch === "\r") {
        row.push(cell);
        cell = "";
        rows.push(row);
        row = [];
        i++;
        if (input[i] === "\n") i++;
      } else {
        cell += ch;
        i++;
      }
    }
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  // Remove trailing empty row
  if (rows.length > 0 && rows[rows.length - 1].every((c) => c === "")) {
    rows.pop();
  }

  return rows;
}
