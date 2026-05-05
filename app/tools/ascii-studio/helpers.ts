import { ASCII_RAMP } from "./constants";
import { TreeNode } from "./types";

// Folder Tree
function getDepth(line: string): number {
  const match = line.match(/^(\s*)/);
  const leading = match ? match[1] : "";
  if (leading.includes("\t")) return leading.split("\t").length - 1;
  return Math.floor(leading.length / 2);
}

export function parseIndentedList(input: string): TreeNode[] {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  const root: TreeNode[] = [];
  const stack: { node: TreeNode; depth: number }[] = [];

  for (const line of lines) {
    const depth = getDepth(line);
    const name = line.trim().replace(/\/$/, "");
    const endsWithSlash = line.trim().endsWith("/");

    const node: TreeNode = { name, children: [], isFolder: endsWithSlash };

    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      const parent = stack[stack.length - 1].node;
      parent.children.push(node);
      parent.isFolder = true;
    }

    stack.push({ node, depth });
  }

  return root;
}

function renderNodes(nodes: TreeNode[], prefix: string): string {
  return nodes
    .map((node, i) => {
      const isLast = i === nodes.length - 1;
      const connector = isLast ? "┗━━ " : "┣━━ ";
      const childPrefix = prefix + (isLast ? "    " : "┃   ");
      const emoji = node.isFolder || node.children.length > 0 ? "📂" : "📜";
      const line = `${prefix}${connector}${emoji} ${node.name}`;
      if (node.children.length > 0) {
        return line + "\n" + renderNodes(node.children, childPrefix);
      }
      return line;
    })
    .join("\n");
}

export function renderFolderTree(nodes: TreeNode[]): string {
  if (nodes.length === 0) return "";
  const root = nodes[0];
  const rootEmoji = root.isFolder || root.children.length > 0 ? "📂" : "📜";
  const header = `${rootEmoji} ${root.name}`;
  if (root.children.length === 0) return header;
  return header + "\n" + renderNodes(root.children, "");
}

// Markdown Table
export function buildMarkdownTable(headers: string[], rows: string[][]): string {
  const allRows = [headers, ...rows];
  const colWidths = headers.map((_, ci) =>
    Math.max(...allRows.map((row) => (row[ci] ?? "").length), 3),
  );

  const pad = (cell: string, width: number) => cell.padEnd(width, " ");

  const headerRow = "| " + headers.map((h, i) => pad(h, colWidths[i])).join(" | ") + " |";
  const separator = "| " + colWidths.map((w) => "-".repeat(w)).join(" | ") + " |";
  const dataRows = rows.map(
    (row) => "| " + headers.map((_, i) => pad(row[i] ?? "", colWidths[i])).join(" | ") + " |",
  );

  return [headerRow, separator, ...dataRows].join("\n");
}

// Zalgo
const COMBINING_MARKS = Array.from({ length: 0x036f - 0x0300 + 1 }, (_, i) =>
  String.fromCharCode(0x0300 + i),
);

export function applyZalgo(text: string, chaos: number): string {
  if (!text) return "";

  const maxMarks = Math.floor(chaos / 5);

  return text
    .split("")
    .map((char) => {
      if (char === " " || char === "\n") return char;
      let result = char;

      const actualMarks = Math.floor(Math.random() * maxMarks) + 1;

      for (let i = 0; i < actualMarks; i++) {
        result += COMBINING_MARKS[Math.floor(Math.random() * COMBINING_MARKS.length)];
      }
      return result;
    })
    .join("");
}

// Image to ASCII
export function imageToAscii(imageData: ImageData, ramp: string = ASCII_RAMP): string {
  const { data, width, height } = imageData;
  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const index = Math.floor((brightness / 255) * (ramp.length - 1));
      row += ramp[index];
    }
    lines.push(row);
  }

  return lines.join("\n");
}
