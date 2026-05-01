export type PydanticClass = {
  name: string;
  fields: PydanticField[];
};

export type PydanticField = {
  name: string;
  type: string;
};

export function toPascalCase(s: string): string {
  return s
    .replace(/[_-](\w)/g, (_, c: string) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function inferPydanticType(value: unknown, fieldName: string, classes: PydanticClass[]): string {
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
