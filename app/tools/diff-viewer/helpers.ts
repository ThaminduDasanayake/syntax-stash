export type DiffLineType = "added" | "removed" | "unchanged";

export type DiffLine = {
  type: DiffLineType;
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
};

function buildLcsTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const table: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      table[i][j] =
        a[i - 1] === b[j - 1]
          ? table[i - 1][j - 1] + 1
          : Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }
  return table;
}

export function computeDiff(
  original: string,
  modified: string,
  ignoreWhitespace: boolean,
): DiffLine[] {
  const aLines = original.split("\n");
  const bLines = modified.split("\n");

  const aKeys = ignoreWhitespace ? aLines.map((l) => l.trim()) : aLines;
  const bKeys = ignoreWhitespace ? bLines.map((l) => l.trim()) : bLines;

  const table = buildLcsTable(aKeys, bKeys);

  const result: DiffLine[] = [];
  let i = aLines.length;
  let j = bLines.length;
  let oldNum = aLines.length;
  let newNum = bLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aKeys[i - 1] === bKeys[j - 1]) {
      result.push({
        type: "unchanged",
        content: aLines[i - 1],
        oldLineNum: oldNum--,
        newLineNum: newNum--,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || table[i][j - 1] >= table[i - 1][j])) {
      result.push({ type: "added", content: bLines[j - 1], newLineNum: newNum-- });
      j--;
    } else {
      result.push({ type: "removed", content: aLines[i - 1], oldLineNum: oldNum-- });
      i--;
    }
  }

  return result.reverse();
}

export function formatUnifiedDiff(lines: DiffLine[]): string {
  return lines
    .map((line) => {
      const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      const oldN = line.oldLineNum != null ? String(line.oldLineNum).padStart(4) : "    ";
      const newN = line.newLineNum != null ? String(line.newLineNum).padStart(4) : "    ";
      return `${oldN} ${newN} ${prefix} ${line.content}`;
    })
    .join("\n");
}

type SideLine = { line: DiffLine | null; key: string };

export function buildSideColumns(lines: DiffLine[]): { left: SideLine[]; right: SideLine[] } {
  const left: SideLine[] = [];
  const right: SideLine[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.type === "unchanged") {
      left.push({ line, key: `u-${i}` });
      right.push({ line, key: `u-${i}` });
      i++;
    } else if (line.type === "removed") {
      // check if next line is added (a modification pair)
      const next = lines[i + 1];
      if (next?.type === "added") {
        left.push({ line, key: `r-${i}` });
        right.push({ line: next, key: `a-${i + 1}` });
        i += 2;
      } else {
        left.push({ line, key: `r-${i}` });
        right.push({ line: null, key: `empty-r-${i}` });
        i++;
      }
    } else {
      // added without a preceding removed
      left.push({ line: null, key: `empty-a-${i}` });
      right.push({ line, key: `a-${i}` });
      i++;
    }
  }

  return { left, right };
}
