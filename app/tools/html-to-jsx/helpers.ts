import * as cheerio from "cheerio";

export type ConvertOptions = {
  componentName: string;
  asComponent: boolean;
  selfCloseEmpty: boolean;
};

const ATTR_RENAME: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  colspan: "colSpan",
  rowspan: "rowSpan",
  frameborder: "frameBorder",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  enctype: "encType",
  autofocus: "autoFocus",
  autocomplete: "autoComplete",
  autoplay: "autoPlay",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  marginheight: "marginHeight",
  marginwidth: "marginWidth",
  novalidate: "noValidate",
  playsinline: "playsInline",
  radiogroup: "radioGroup",
  spellcheck: "spellCheck",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  usemap: "useMap",
  accesskey: "accessKey",
};

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "keygen",
  "link", "meta", "param", "source", "track", "wbr",
]);

const BOOLEAN_ATTRS = new Set([
  "allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls",
  "default", "defer", "disabled", "formnovalidate", "hidden", "ismap", "loop",
  "multiple", "muted", "nomodule", "novalidate", "open", "playsinline",
  "readonly", "required", "reversed", "selected",
]);

function camelCase(input: string): string {
  return input.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}

function styleStringToObject(style: string): string {
  const props: string[] = [];
  for (const decl of style.split(";")) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon < 0) continue;
    const rawProp = trimmed.slice(0, colon).trim();
    const rawValue = trimmed.slice(colon + 1).trim();
    if (!rawProp || !rawValue) continue;
    const prop = rawProp.startsWith("--") ? `"${rawProp}"` : camelCase(rawProp);
    const numeric = /^-?\d+(\.\d+)?$/.test(rawValue);
    const value = numeric && !needsUnit(prop) ? rawValue : JSON.stringify(rawValue);
    props.push(`${prop}: ${value}`);
  }
  return `{{ ${props.join(", ")} }}`;
}

function needsUnit(prop: string): boolean {
  // Properties where unitless numbers are valid in React
  const unitless = new Set([
    "opacity", "zIndex", "fontWeight", "lineHeight", "flex", "flexGrow",
    "flexShrink", "order", "columnCount", "tabSize", "zoom",
  ]);
  return !unitless.has(prop);
}

function renameAttr(name: string): string {
  const lower = name.toLowerCase();
  if (ATTR_RENAME[lower]) return ATTR_RENAME[lower];
  if (lower.startsWith("on") && lower.length > 2) {
    // event handler: onclick → onClick
    return "on" + lower[2].toUpperCase() + lower.slice(3);
  }
  if (lower.startsWith("data-") || lower.startsWith("aria-")) {
    return lower;
  }
  return lower;
}

function escapeJsxText(text: string): string {
  return text
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

type CheerioLikeNode = {
  type?: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  children?: CheerioLikeNode[];
};

function renderNode(node: CheerioLikeNode, indent: number, options: ConvertOptions): string {
  const pad = "  ".repeat(indent);

  if (node.type === "text") {
    const text = node.data ?? "";
    if (!text.trim()) return "";
    return pad + escapeJsxText(text.replace(/\s+/g, " ").trim()) + "\n";
  }

  if (node.type === "comment") {
    const text = (node.data ?? "").trim();
    return `${pad}{/* ${text} */}\n`;
  }

  if (node.type !== "tag" && node.type !== "script" && node.type !== "style") {
    return "";
  }

  const tagName = node.name ?? "div";
  const attribs = node.attribs ?? {};
  const attrStrings: string[] = [];

  for (const [name, value] of Object.entries(attribs)) {
    if (name === "style") {
      attrStrings.push(`style=${styleStringToObject(value)}`);
      continue;
    }
    const newName = renameAttr(name);
    if (BOOLEAN_ATTRS.has(name.toLowerCase()) && (value === "" || value === name)) {
      attrStrings.push(newName);
      continue;
    }
    if (newName.startsWith("on") && newName !== "on") {
      // Wrap inline handlers in arrow if they are JS expressions
      attrStrings.push(`${newName}={() => { ${value} }}`);
      continue;
    }
    attrStrings.push(`${newName}=${JSON.stringify(value)}`);
  }

  const attrPart = attrStrings.length > 0 ? " " + attrStrings.join(" ") : "";
  const children = (node.children ?? []) as CheerioLikeNode[];
  const isVoid = VOID_ELEMENTS.has(tagName);

  if (isVoid || (options.selfCloseEmpty && children.length === 0)) {
    return `${pad}<${tagName}${attrPart} />\n`;
  }

  if (children.length === 0) {
    return `${pad}<${tagName}${attrPart}></${tagName}>\n`;
  }

  // Single text child — keep on one line
  const onlyText = children.length === 1 && children[0].type === "text";
  if (onlyText) {
    const text = (children[0].data ?? "").trim();
    if (!text) return `${pad}<${tagName}${attrPart} />\n`;
    return `${pad}<${tagName}${attrPart}>${escapeJsxText(text)}</${tagName}>\n`;
  }

  let childOutput = "";
  for (const child of children) {
    childOutput += renderNode(child, indent + 1, options);
  }

  return `${pad}<${tagName}${attrPart}>\n${childOutput}${pad}</${tagName}>\n`;
}

export function convertHtmlToJsx(html: string, options: ConvertOptions): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  const $ = cheerio.load(trimmed, { xml: false }, false);
  const roots = $.root().children().toArray() as unknown as CheerioLikeNode[];

  if (roots.length === 0) return "";

  let body = "";
  for (const node of roots) {
    body += renderNode(node, options.asComponent ? 2 : 0, options);
  }
  body = body.trimEnd();

  if (!options.asComponent) {
    return body;
  }

  const needsFragment = roots.length > 1;
  const componentName = options.componentName.trim() || "MyComponent";
  const wrapped = needsFragment
    ? `    <>\n${indentBlock(body, 1)}\n    </>`
    : body;

  return `export default function ${componentName}() {
  return (
${wrapped}
  );
}`;
}

function indentBlock(text: string, extraLevels: number): string {
  const pad = "  ".repeat(extraLevels);
  return text.split("\n").map((l) => (l.trim() ? pad + l : l)).join("\n");
}
