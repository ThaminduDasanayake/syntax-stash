/**
 * Generates TypeScript interface declarations from a parsed JSON value.
 *
 * Used by the "JSON to TS" tool. Changes here apply to all consumers.
 */

export function generateInterfaceFromObject(
  obj: Record<string, unknown>,
  name: string,
  indent: number = 0,
): string {
  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);

  const lines: string[] = [];
  lines.push(`${pad}interface ${name} {`);

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

/**
 * Entry point: takes any parsed JSON value and produces a TypeScript
 * interface string. Handles the top-level being an object, array, or primitive.
 */
export function generateTypeScriptFromJson(parsed: unknown, rootName: string = "RootObject"): string {
  if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
    return generateInterfaceFromObject(parsed as Record<string, unknown>, rootName);
  }

  // Non-object root (array or primitive)
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return `type ${rootName} = any[];`;
    const first = parsed[0];
    if (typeof first === "object" && first !== null && !Array.isArray(first)) {
      const itemInterface = generateInterfaceFromObject(
        first as Record<string, unknown>,
        `${rootName}Item`,
      );
      return `${itemInterface}\n\ntype ${rootName} = ${rootName}Item[];`;
    }
    const elementType =
      first === null ? "null" : typeof first === "object" ? "any" : typeof first;
    return `type ${rootName} = ${elementType}[];`;
  }

  const primitiveType = parsed === null ? "null" : typeof parsed;
  return `type ${rootName} = ${primitiveType};`;
}
