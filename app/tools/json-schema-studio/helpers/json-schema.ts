function inferJsonSchema(value: unknown): Record<string, any> {
  if (value === null) return { type: "null" };
  if (typeof value === "string") return { type: "string" };
  if (typeof value === "number") return { type: "number" };
  if (typeof value === "boolean") return { type: "boolean" };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: "array", items: {} };
    return { type: "array", items: inferJsonSchema(value[0]) };
  }
  if (typeof value === "object") {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(value)) {
      properties[k] = inferJsonSchema(v);
      required.push(k);
    }
    return {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
    };
  }
  return {};
}

export function buildJsonSchemaOutput(parsed: unknown, rootName: string = "Root"): string {
  const schemaObj = inferJsonSchema(parsed);
  schemaObj.title = rootName || "Root";
  return JSON.stringify(schemaObj, null, 2);
}