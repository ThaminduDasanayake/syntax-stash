type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type GenerateOptions = {
  rootName: string;
  useType: boolean;
  exportTypes: boolean;
  readonly: boolean;
  optionalNulls: boolean;
};

const RESERVED = new Set([
  "string",
  "number",
  "boolean",
  "null",
  "undefined",
  "any",
  "unknown",
  "never",
  "void",
  "object",
  "true",
  "false",
]);

function pascalCase(input: string): string {
  const cleaned = input.replace(/[^a-zA-Z0-9_]+/g, " ").trim();
  if (!cleaned) return "Root";
  const parts = cleaned.split(/\s+/).map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  let result = parts.join("");
  if (/^[0-9]/.test(result)) result = "_" + result;
  return result;
}

function singularize(name: string): string {
  if (/ies$/i.test(name)) return name.slice(0, -3) + "y";
  if (/sses$/i.test(name)) return name.slice(0, -2);
  if (/s$/i.test(name) && !/ss$/i.test(name)) return name.slice(0, -1);
  return name;
}

function isValidIdentifier(key: string): boolean {
  return /^[A-Za-z_$][\w$]*$/.test(key) && !RESERVED.has(key);
}

type InterfaceDef = {
  name: string;
  fields: Array<{ key: string; type: string; optional: boolean }>;
};

function mergeObjectShapes(items: Array<Record<string, JsonValue>>): {
  fields: Map<string, { values: JsonValue[]; presentIn: number }>;
  total: number;
} {
  const fields = new Map<string, { values: JsonValue[]; presentIn: number }>();
  for (const item of items) {
    for (const [key, value] of Object.entries(item)) {
      if (!fields.has(key)) fields.set(key, { values: [], presentIn: 0 });
      const entry = fields.get(key)!;
      entry.values.push(value);
      entry.presentIn++;
    }
  }
  return { fields, total: items.length };
}

function uniqueTypes(types: string[]): string[] {
  return Array.from(new Set(types));
}

export function generateTypeScript(json: unknown, options: GenerateOptions): string {
  const interfaces: InterfaceDef[] = [];
  const usedNames = new Set<string>();

  function reserveName(base: string): string {
    const name = pascalCase(base) || "Root";
    let candidate = name;
    let i = 2;
    while (usedNames.has(candidate)) {
      candidate = `${name}${i++}`;
    }
    usedNames.add(candidate);
    return candidate;
  }

  function inferType(value: JsonValue, hint: string): string {
    if (value === null) return "null";
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";

    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]";
      const elementHint = singularize(hint);

      const objects = value.filter(
        (v): v is Record<string, JsonValue> =>
          v !== null && typeof v === "object" && !Array.isArray(v),
      );
      const nonObjects = value.filter(
        (v) => v === null || typeof v !== "object" || Array.isArray(v),
      );

      const elementTypes: string[] = [];

      if (objects.length > 0) {
        const merged = mergeObjectShapes(objects);
        const fields = buildFields(merged.fields, merged.total);
        const name = reserveName(elementHint);
        interfaces.push({ name, fields });
        elementTypes.push(name);
      }

      for (const item of nonObjects) {
        elementTypes.push(inferType(item, elementHint));
      }

      const unique = uniqueTypes(elementTypes);
      const inner = unique.length === 1 ? unique[0] : `(${unique.join(" | ")})`;
      return `${inner}[]`;
    }

    if (typeof value === "object") {
      const name = reserveName(hint);
      const merged = mergeObjectShapes([value as Record<string, JsonValue>]);
      const fields = buildFields(merged.fields, merged.total);
      interfaces.push({ name, fields });
      return name;
    }

    return "unknown";
  }

  function buildFields(
    fieldMap: Map<string, { values: JsonValue[]; presentIn: number }>,
    total: number,
  ): InterfaceDef["fields"] {
    const result: InterfaceDef["fields"] = [];
    for (const [key, { values, presentIn }] of fieldMap.entries()) {
      const types = uniqueTypes(values.map((v) => inferType(v, key)));
      let combined = types.join(" | ");
      let optional = presentIn < total;
      if (options.optionalNulls && types.includes("null")) {
        const without = types.filter((t) => t !== "null");
        if (without.length > 0) {
          combined = without.join(" | ");
          optional = true;
        }
      }
      result.push({ key, type: combined, optional });
    }
    return result;
  }

  const rootName = pascalCase(options.rootName) || "Root";
  usedNames.add(rootName);
  const typedJson = json as JsonValue;

  if (Array.isArray(typedJson)) {
    const objectItems = typedJson.filter(
      (v): v is Record<string, JsonValue> =>
        v !== null && typeof v === "object" && !Array.isArray(v),
    );
    if (objectItems.length > 0 && objectItems.length === typedJson.length) {
      const merged = mergeObjectShapes(objectItems);
      const fields = buildFields(merged.fields, merged.total);
      interfaces.push({ name: rootName, fields });
    } else {
      const elementHint = singularize(rootName);
      const types = uniqueTypes(typedJson.map((v) => inferType(v, elementHint)));
      const aliasType = typedJson.length === 0 ? "unknown[]" : `(${types.join(" | ")})[]`;
      return renderOutput(interfaces, options, [
        { kind: "alias", name: rootName, value: aliasType },
      ]);
    }
  } else if (typedJson !== null && typeof typedJson === "object") {
    const merged = mergeObjectShapes([typedJson as Record<string, JsonValue>]);
    const fields = buildFields(merged.fields, merged.total);
    interfaces.push({ name: rootName, fields });
  } else {
    const aliasType = inferType(typedJson, rootName);
    return renderOutput([], options, [{ kind: "alias", name: rootName, value: aliasType }]);
  }

  const rootIdx = interfaces.findIndex((i) => i.name === rootName);
  if (rootIdx > -1 && rootIdx !== interfaces.length - 1) {
    const [root] = interfaces.splice(rootIdx, 1);
    interfaces.push(root);
  }

  return renderOutput(interfaces, options, []);
}

type TypeAlias = { kind: "alias"; name: string; value: string };

function renderOutput(
  interfaces: InterfaceDef[],
  options: GenerateOptions,
  aliases: TypeAlias[],
): string {
  const blocks: string[] = [];
  const exportPrefix = options.exportTypes ? "export " : "";
  const readonlyPrefix = options.readonly ? "readonly " : "";

  for (const def of interfaces) {
    const lines: string[] = [];
    lines.push(
      `${exportPrefix}${options.useType ? "type" : "interface"} ${def.name} ${options.useType ? "=" : ""} {`,
    );
    for (const field of def.fields) {
      const key = isValidIdentifier(field.key) ? field.key : JSON.stringify(field.key);
      const opt = field.optional ? "?" : "";
      lines.push(`  ${readonlyPrefix}${key}${opt}: ${field.type};`);
    }
    lines.push(options.useType ? "};" : "}");
    blocks.push(lines.join("\n"));
  }

  for (const alias of aliases) {
    blocks.push(`${exportPrefix}type ${alias.name} = ${alias.value};`);
  }

  return blocks.join("\n\n");
}
