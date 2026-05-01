function toZodSchema(value: unknown, indent = 0, nameHint = "root"): string {
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
