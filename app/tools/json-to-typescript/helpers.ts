type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type GenerateOptions = {
  rootName: string;
  useType: boolean;
  exportTypes: boolean;
  readonly: boolean;
  optionalNulls: boolean;
};

const RESERVED = new Set([
  "string", "number", "boolean", "null", "undefined", "any", "unknown", "never",
  "void", "object", "true", "false",
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

function getValueType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
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
  const seen = new Set<string>();
  const result: string[] = [];
  for (const t of types) {
    if (!seen.has(t)) {
      seen.add(t);
      result.push(t);
    }
  }
  return result;
}

export function generateTypeScript(json: JsonValue, options: GenerateOptions): string {
  const interfaces: InterfaceDef[] = [];
  const usedNames = new Set<string>();

  function reserveName(base: string): string {
    let name = pascalCase(base) || "Root";
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
      const elementTypes = uniqueTypes(value.map((v) => inferType(v, elementHint)));
      const inner = elementTypes.length === 1 ? elementTypes[0] : `(${elementTypes.join(" | ")})`;
      return `${inner}[]`;
    }
    if (typeof value === "object") {
      // Build interface for this object
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

  // Root handling
  const rootName = pascalCase(options.rootName) || "Root";
  usedNames.add(rootName);

  if (Array.isArray(json)) {
    const objectItems = json.filter((v): v is Record<string, JsonValue> => v !== null && typeof v === "object" && !Array.isArray(v));
    if (objectItems.length > 0 && objectItems.length === json.length) {
      const merged = mergeObjectShapes(objectItems);
      const fields = buildFields(merged.fields, merged.total);
      interfaces.push({ name: rootName, fields });
    } else {
      // Not all objects — use union
      const elementHint = singularize(rootName);
      const types = uniqueTypes(json.map((v) => inferType(v, elementHint)));
      interfaces.push({
        name: rootName,
        fields: [],
      });
      // Special: emit type alias instead
      const aliasType = json.length === 0 ? "unknown[]" : `(${types.join(" | ")})[]`;
      return renderOutput(interfaces.filter((i) => i.name !== rootName), options, [{
        kind: "alias",
        name: rootName,
        value: aliasType,
      }]);
    }
  } else if (json !== null && typeof json === "object") {
    const merged = mergeObjectShapes([json as Record<string, JsonValue>]);
    const fields = buildFields(merged.fields, merged.total);
    interfaces.push({ name: rootName, fields });
  } else {
    // Scalar root — emit alias
    const aliasType = inferType(json, rootName);
    return renderOutput([], options, [{ kind: "alias", name: rootName, value: aliasType }]);
  }

  // Move root interface to the end so dependencies come first
  const rootIdx = interfaces.findIndex((i) => i.name === rootName);
  if (rootIdx > -1 && rootIdx !== interfaces.length - 1) {
    const [root] = interfaces.splice(rootIdx, 1);
    interfaces.push(root);
  }

  return renderOutput(interfaces, options, []);
}

type TypeAlias = { kind: "alias"; name: string; value: string };

function renderOutput(interfaces: InterfaceDef[], options: GenerateOptions, aliases: TypeAlias[]): string {
  const blocks: string[] = [];
  const exportPrefix = options.exportTypes ? "export " : "";
  const readonlyPrefix = options.readonly ? "readonly " : "";

  for (const def of interfaces) {
    const lines: string[] = [];
    if (options.useType) {
      lines.push(`${exportPrefix}type ${def.name} = {`);
    } else {
      lines.push(`${exportPrefix}interface ${def.name} {`);
    }
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
