export type ParsedParam = {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
};

export type ParsedFunction = {
  name: string;
  isAsync: boolean;
  isArrow: boolean;
  isGenerator: boolean;
  generics?: string;
  params: ParsedParam[];
  returnType: string;
  description?: string;
};

function splitTopLevel(input: string, separator: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "(" || ch === "[" || ch === "{" || ch === "<") depth++;
    else if (ch === ")" || ch === "]" || ch === "}" || ch === ">") depth--;
    if (ch === separator && depth === 0) {
      out.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

function parseParam(raw: string): ParsedParam | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Strip leading rest spread
  let working = trimmed.startsWith("...") ? trimmed.slice(3) : trimmed;

  // Split off default value at top-level =
  let defaultValue: string | undefined;
  const eqDepth = (() => {
    let depth = 0;
    for (let i = 0; i < working.length; i++) {
      const ch = working[i];
      if (ch === "(" || ch === "[" || ch === "{" || ch === "<") depth++;
      else if (ch === ")" || ch === "]" || ch === "}" || ch === ">") depth--;
      if (ch === "=" && depth === 0 && working[i + 1] !== ">" && working[i - 1] !== "=" && working[i - 1] !== "!" && working[i - 1] !== "<" && working[i - 1] !== ">") {
        return i;
      }
    }
    return -1;
  })();

  if (eqDepth >= 0) {
    defaultValue = working.slice(eqDepth + 1).trim();
    working = working.slice(0, eqDepth).trim();
  }

  // Split on first top-level colon
  let name = working;
  let type = "any";
  let optional = false;
  let colonIdx = -1;
  let depth = 0;
  for (let i = 0; i < working.length; i++) {
    const ch = working[i];
    if (ch === "(" || ch === "[" || ch === "{" || ch === "<") depth++;
    else if (ch === ")" || ch === "]" || ch === "}" || ch === ">") depth--;
    if (ch === ":" && depth === 0) {
      colonIdx = i;
      break;
    }
  }
  if (colonIdx >= 0) {
    name = working.slice(0, colonIdx).trim();
    type = working.slice(colonIdx + 1).trim();
  }

  if (name.endsWith("?")) {
    optional = true;
    name = name.slice(0, -1);
  }

  if (defaultValue) optional = true;

  return { name, type: type || "any", optional, defaultValue };
}

export function parseFunctionSignature(source: string): ParsedFunction | null {
  const cleaned = source.trim().replace(/;$/, "");
  if (!cleaned) return null;

  // Detect async
  let working = cleaned;
  let isAsync = false;
  if (/^async\s+/.test(working)) {
    isAsync = true;
    working = working.replace(/^async\s+/, "");
  }
  // Strip leading export / public / private / protected modifiers
  working = working.replace(/^(export\s+(default\s+)?|public\s+|private\s+|protected\s+|static\s+)+/, "");
  // Handle "async" again after modifier strip
  if (/^async\s+/.test(working)) {
    isAsync = true;
    working = working.replace(/^async\s+/, "");
  }

  let isGenerator = false;
  let isArrow = false;
  let name = "anonymous";
  let generics = "";
  let paramsRaw = "";
  let returnType = "void";

  // Pattern 1: function declaration  - "function* name<G>(args): Ret"
  const funcDeclMatch = working.match(/^function(\*?)\s+([A-Za-z_$][\w$]*)\s*(<[^>]+>)?\s*\(([\s\S]*)$/);
  // Pattern 2: const/let/var arrow  - "const name = <G>(args): Ret =>"
  const arrowVarMatch = working.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*[:=]/);
  // Pattern 3: method shorthand    - "name<G>(args): Ret"
  const methodMatch = working.match(/^([A-Za-z_$][\w$]*)\s*(<[^>]+>)?\s*\(([\s\S]*)$/);

  if (funcDeclMatch) {
    isGenerator = funcDeclMatch[1] === "*";
    name = funcDeclMatch[2];
    generics = funcDeclMatch[3] ?? "";
    const rest = "(" + funcDeclMatch[4];
    const parsed = extractParensAndReturn(rest);
    if (!parsed) return null;
    paramsRaw = parsed.params;
    returnType = parsed.returnType;
  } else if (arrowVarMatch) {
    name = arrowVarMatch[1];
    isArrow = true;
    const afterEq = working.slice(working.indexOf("=") + 1).trim();
    let body = afterEq;
    if (/^async\s+/.test(body)) {
      isAsync = true;
      body = body.replace(/^async\s+/, "");
    }
    const genMatch = body.match(/^(<[^>]+>)\s*\(/);
    if (genMatch) {
      generics = genMatch[1];
      body = body.slice(genMatch[1].length).trim();
    }
    if (!body.startsWith("(")) {
      // single-arg arrow without parens: "x => …"
      const singleMatch = body.match(/^([A-Za-z_$][\w$]*)\s*=>/);
      if (!singleMatch) return null;
      paramsRaw = singleMatch[1];
      returnType = "any";
    } else {
      const parsed = extractParensAndReturn(body, true);
      if (!parsed) return null;
      paramsRaw = parsed.params;
      returnType = parsed.returnType;
    }
  } else if (methodMatch) {
    name = methodMatch[1];
    generics = methodMatch[2] ?? "";
    const rest = "(" + methodMatch[3];
    const parsed = extractParensAndReturn(rest);
    if (!parsed) return null;
    paramsRaw = parsed.params;
    returnType = parsed.returnType;
  } else {
    return null;
  }

  const params = splitTopLevel(paramsRaw, ",")
    .map(parseParam)
    .filter((p): p is ParsedParam => p !== null);

  return {
    name,
    isAsync,
    isArrow,
    isGenerator,
    generics: generics || undefined,
    params,
    returnType: returnType || "void",
  };
}

function extractParensAndReturn(input: string, isArrow = false): { params: string; returnType: string } | null {
  if (!input.startsWith("(")) return null;
  let depth = 0;
  let end = -1;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) return null;
  const params = input.slice(1, end);
  let after = input.slice(end + 1).trim();

  let returnType = isArrow ? "any" : "void";
  if (after.startsWith(":")) {
    after = after.slice(1).trim();
    // Read return type until "{" or "=>" or ";" or end
    let depth2 = 0;
    let cut = after.length;
    for (let i = 0; i < after.length; i++) {
      const ch = after[i];
      if (ch === "(" || ch === "[" || ch === "{" || ch === "<") {
        if (depth2 === 0 && ch === "{") {
          cut = i;
          break;
        }
        depth2++;
      } else if (ch === ")" || ch === "]" || ch === "}" || ch === ">") {
        depth2--;
      } else if (depth2 === 0 && ch === "=" && after[i + 1] === ">") {
        cut = i;
        break;
      } else if (depth2 === 0 && ch === ";") {
        cut = i;
        break;
      }
    }
    returnType = after.slice(0, cut).trim() || (isArrow ? "any" : "void");
  }

  return { params, returnType };
}

export type DocStyle = "jsdoc" | "tsdoc";

export function generateDoc(parsed: ParsedFunction, style: DocStyle, includeThrows: boolean): string {
  const lines: string[] = ["/**"];
  lines.push(` * ${parsed.description ?? `Description of ${parsed.name}.`}`);

  if (parsed.params.length > 0) {
    lines.push(" *");
    for (const p of parsed.params) {
      const typeStr = style === "jsdoc" ? `{${p.type}} ` : "";
      const nameStr = p.optional && style === "jsdoc"
        ? p.defaultValue ? `[${p.name}=${p.defaultValue}]` : `[${p.name}]`
        : p.name;
      const desc = `Description of ${p.name}.`;
      lines.push(` * @param ${typeStr}${nameStr} - ${desc}`);
    }
  }

  if (parsed.returnType && parsed.returnType !== "void") {
    lines.push(" *");
    const typeStr = style === "jsdoc" ? `{${parsed.returnType}} ` : "";
    lines.push(` * @returns ${typeStr}Description of return value.`);
  }

  if (includeThrows) {
    lines.push(" *");
    lines.push(` * @throws {Error} Description of error condition.`);
  }

  if (parsed.isAsync) {
    lines.push(" *");
    lines.push(" * @async");
  }

  lines.push(" */");
  return lines.join("\n");
}
