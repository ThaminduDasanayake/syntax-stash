import { PydanticClass, PydanticField } from "@/app/tools/json-to-schemas/types";

export function generateInterfaceFromObject(
  obj: Record<string, unknown>,
  name: string,
  indent: number = 0,
): string {
  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);

  const lines: string[] = [];
  lines.push(`${pad}export interface ${name} {`);

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `"${key}"`;

    if (value === null) {
      lines.push(`${innerPad}${safeKey}: null;`);
    } else if (typeof value === "string") {
      lines.push(`${innerPad}${safeKey}: string;`);
    } else if (typeof value === "number") {
      lines.push(`${innerPad}${safeKey}: number;`);
    } else if (typeof value === "boolean") {
      lines.push(`${innerPad}${safeKey}: boolean;`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${innerPad}${safeKey}: any[];`);
      } else {
        const firstElement = value[0];
        if (
          typeof firstElement === "object" &&
          firstElement !== null &&
          !Array.isArray(firstElement)
        ) {
          const itemName = key.charAt(0).toUpperCase() + key.slice(1);
          const nestedInterface = generateInterfaceFromObject(
            firstElement as Record<string, unknown>,
            itemName,
            indent + 1,
          );
          const nestedLines = nestedInterface.split("\n");
          lines.push(...nestedLines);
          lines.push(`${innerPad}${safeKey}: ${itemName}[];`);
        } else {
          const elementType = Array.isArray(firstElement)
            ? "any[]"
            : typeof firstElement === "object"
              ? "any"
              : typeof firstElement;
          lines.push(`${innerPad}${safeKey}: ${elementType}[];`);
        }
      }
    } else if (typeof value === "object") {
      const objectName = key.charAt(0).toUpperCase() + key.slice(1);
      const nestedInterface = generateInterfaceFromObject(
        value as Record<string, unknown>,
        objectName,
        indent + 1,
      );
      const nestedLines = nestedInterface.split("\n");
      lines.push(...nestedLines);
      lines.push(`${innerPad}${safeKey}: ${objectName};`);
    } else {
      lines.push(`${innerPad}${safeKey}: any;`);
    }
  }

  lines.push(`${pad}}`);
  return lines.join("\n");
}

// Zod Generator

export function toZodSchema(value: unknown, indent = 0, nameHint = "root"): string {
  const pad = "  ".repeat(indent);

  if (value === null) return "z.null()";
  if (typeof value === "boolean") return "z.boolean()";
  if (typeof value === "number") return Number.isInteger(value) ? "z.number().int()" : "z.number()";
  if (typeof value === "string") return "z.string()";

  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";
    const itemSchema = toZodSchema(value[0], indent, nameHint);
    return `z.array(${itemSchema})`;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return "z.object({})";

    const fields = keys
      .map((k) => {
        const fieldSchema = toZodSchema(obj[k], indent + 1, k);
        const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : `"${k}"`;
        return `${"  ".repeat(indent + 1)}${safeKey}: ${fieldSchema},`;
      })
      .join("\n");

    return `z.object({\n${fields}\n${pad}})`;
  }

  return "z.unknown()";
}

export function buildZodOutput(parsed: unknown): string {
  const schema = toZodSchema(parsed, 0);
  return `import { z } from "zod";\n\nexport const RootSchema = ${schema};\n\nexport type Root = z.infer<typeof RootSchema>;`;
}

// Pydantic Generator

export function toPascalCase(s: string): string {
  return s
    .replace(/[_-](\w)/g, (_, c: string) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function inferPydanticType(
  value: unknown,
  fieldName: string,
  classes: PydanticClass[],
): string {
  if (value === null) return "Optional[Any]";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "float";
  if (typeof value === "string") return "str";

  if (Array.isArray(value)) {
    if (value.length === 0) return "List[Any]";
    const itemType = inferPydanticType(value[0], fieldName, classes);
    return `List[${itemType}]`;
  }

  if (typeof value === "object") {
    const className = toPascalCase(fieldName);
    const obj = value as Record<string, unknown>;
    const fields: PydanticField[] = Object.keys(obj).map((k) => ({
      name: k,
      type: inferPydanticType(obj[k], k, classes),
    }));
    // Avoid duplicate class names
    if (!classes.find((c) => c.name === className)) {
      classes.push({ name: className, fields });
    }
    return className;
  }

  return "Any";
}

export function buildPydanticOutput(parsed: unknown): string {
  const classes: PydanticClass[] = [];
  inferPydanticType(parsed, "Root", classes);

  const header = `from __future__ import annotations\nfrom typing import Any, List, Optional\nfrom pydantic import BaseModel\n\n`;

  const classBlocks = classes
    .map((cls) => {
      const fields =
        cls.fields.length === 0
          ? "    pass"
          : cls.fields.map((f) => `    ${f.name}: ${f.type}`).join("\n");
      return `class ${cls.name}(BaseModel):\n${fields}`;
    })
    .join("\n\n");

  return header + classBlocks;
}
