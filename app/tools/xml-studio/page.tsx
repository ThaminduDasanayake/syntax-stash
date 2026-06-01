"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";
import { downloadStringAsFile } from "@/lib/utils";

type Mode = "format" | "xml-to-json" | "json-to-xml";
type Indent = "2" | "4";

const XML_EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>12.99</price>
  </book>
  <book category="non-fiction">
    <title lang="en">Sapiens</title>
    <author>Yuval Noah Harari</author>
    <year>2011</year>
    <price>15.99</price>
  </book>
</bookstore>`;

const JSON_EXAMPLE = `{
  "bookstore": {
    "book": [
      {
        "@category": "fiction",
        "title": { "@lang": "en", "#text": "The Great Gatsby" },
        "author": "F. Scott Fitzgerald",
        "year": "1925",
        "price": "12.99"
      },
      {
        "@category": "non-fiction",
        "title": { "@lang": "en", "#text": "Sapiens" },
        "author": "Yuval Noah Harari",
        "year": "2011",
        "price": "15.99"
      }
    ]
  }
}`;

function formatXML(xml: string, indentSize: number): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error(parseError.textContent ?? "Invalid XML");
  return serializeXML(doc.documentElement, 0, indentSize);
}

function serializeXML(node: Element, depth: number, indentSize: number): string {
  const indent = " ".repeat(depth * indentSize);
  const childIndent = " ".repeat((depth + 1) * indentSize);

  const attrs = Array.from(node.attributes)
    .map((a) => ` ${a.name}="${escapeXmlAttr(a.value)}"`)
    .join("");

  const children = Array.from(node.childNodes);
  const elementChildren = children.filter((c) => c.nodeType === Node.ELEMENT_NODE) as Element[];
  const textContent = children
    .filter((c) => c.nodeType === Node.TEXT_NODE)
    .map((c) => c.textContent?.trim() ?? "")
    .join("")
    .trim();

  if (elementChildren.length === 0) {
    if (!textContent) return `${indent}<${node.tagName}${attrs}/>`;
    return `${indent}<${node.tagName}${attrs}>${escapeXml(textContent)}</${node.tagName}>`;
  }

  const childLines = elementChildren.map((c) => serializeXML(c, depth + 1, indentSize));
  if (textContent) childLines.unshift(`${childIndent}${escapeXml(textContent)}`);

  return `${indent}<${node.tagName}${attrs}>\n${childLines.join("\n")}\n${indent}</${node.tagName}>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeXmlAttr(s: string): string {
  return escapeXml(s).replace(/"/g, "&quot;");
}

// XML → JSON: attributes become @attr, text becomes #text
function xmlNodeToJson(node: Element): unknown {
  const result: Record<string, unknown> = {};

  Array.from(node.attributes).forEach((a) => {
    result[`@${a.name}`] = a.value;
  });

  const children = Array.from(node.childNodes);
  const elementChildren = children.filter((c) => c.nodeType === Node.ELEMENT_NODE) as Element[];
  const textContent = children
    .filter((c) => c.nodeType === Node.TEXT_NODE)
    .map((c) => c.textContent?.trim() ?? "")
    .join("")
    .trim();

  if (elementChildren.length === 0) {
    if (Object.keys(result).length === 0) return textContent;
    if (textContent) result["#text"] = textContent;
    return result;
  }

  if (textContent) result["#text"] = textContent;

  const groups: Record<string, Element[]> = {};
  elementChildren.forEach((c) => {
    groups[c.tagName] = groups[c.tagName] ?? [];
    groups[c.tagName].push(c);
  });

  Object.entries(groups).forEach(([tag, nodes]) => {
    const converted = nodes.map(xmlNodeToJson);
    result[tag] = converted.length === 1 ? converted[0] : converted;
  });

  return result;
}

function xmlToJson(xml: string, indent: number): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error(parseError.textContent ?? "Invalid XML");
  const root = doc.documentElement;
  const obj = { [root.tagName]: xmlNodeToJson(root) };
  return JSON.stringify(obj, null, indent);
}

// JSON → XML
function jsonToXmlNode(tag: string, value: unknown, depth: number, indentSize: number): string {
  const indent = " ".repeat(depth * indentSize);
  const childIndent = " ".repeat((depth + 1) * indentSize);

  if (Array.isArray(value)) {
    return value.map((v) => jsonToXmlNode(tag, v, depth, indentSize)).join("\n");
  }

  if (value === null || typeof value !== "object") {
    const text = String(value ?? "");
    return `${indent}<${tag}>${escapeXml(text)}</${tag}>`;
  }

  const obj = value as Record<string, unknown>;
  const attrs = Object.entries(obj)
    .filter(([k]) => k.startsWith("@"))
    .map(([k, v]) => ` ${k.slice(1)}="${escapeXmlAttr(String(v))}"`)
    .join("");

  const textContent = obj["#text"] != null ? escapeXml(String(obj["#text"])) : "";

  const childEntries = Object.entries(obj).filter(([k]) => !k.startsWith("@") && k !== "#text");

  if (childEntries.length === 0) {
    if (!textContent) return `${indent}<${tag}${attrs}/>`;
    return `${indent}<${tag}${attrs}>${textContent}</${tag}>`;
  }

  const childLines = childEntries.flatMap(([k, v]) =>
    jsonToXmlNode(k, v, depth + 1, indentSize)
      .split("\n")
      .map((l) => l),
  );
  if (textContent) childLines.unshift(`${childIndent}${textContent}`);

  return `${indent}<${tag}${attrs}>\n${childLines.join("\n")}\n${indent}</${tag}>`;
}

function jsonToXml(json: string, indent: number): string {
  const obj = JSON.parse(json);
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("JSON root must be an object with a single root key representing the XML element.");
  }
  const entries = Object.entries(obj);
  if (entries.length !== 1) {
    throw new Error("JSON must have exactly one root key (the XML root element name).");
  }
  const [rootTag, rootValue] = entries[0];
  const body = jsonToXmlNode(rootTag, rootValue, 0, indent);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
}

const INDENT_OPTIONS = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
];

export default function XmlStudioPage() {
  const [mode, setMode] = useState<Mode>("format");
  const [input, setInput] = useState(XML_EXAMPLE);
  const [indent, setIndent] = useState<Indent>("2");

  const { output, error } = useMemo<{ output: string; error: string }>(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const indentNum = parseInt(indent);
      if (mode === "format") return { output: formatXML(input, indentNum), error: "" };
      if (mode === "xml-to-json") return { output: xmlToJson(input, indentNum), error: "" };
      return { output: jsonToXml(input, indentNum), error: "" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, indent, mode]);

  const handleModeChange = (m: Mode) => {
    setMode(m);
    if (m === "json-to-xml") setInput(JSON_EXAMPLE);
    else setInput(XML_EXAMPLE);
  };

  const ext = mode === "xml-to-json" ? "json" : "xml";
  const tool = internalTools.find((t) => t.slug === "xml-studio");

  return (
    <ToolLayout tool={tool}>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-8">
        <ButtonGroup className="grid grid-cols-3">
          <Button
            variant={mode === "format" ? "default" : "outline"}
            onClick={() => handleModeChange("format")}
          >
            Format XML
          </Button>
          <Button
            variant={mode === "xml-to-json" ? "default" : "outline"}
            onClick={() => handleModeChange("xml-to-json")}
            className="gap-1"
          >
            XML <ArrowRightIcon weight="bold" /> JSON
          </Button>
          <Button
            variant={mode === "json-to-xml" ? "default" : "outline"}
            onClick={() => handleModeChange("json-to-xml")}
            className="gap-1"
          >
            JSON <ArrowRightIcon weight="bold" /> XML
          </Button>
        </ButtonGroup>

        <SelectField
          label="Indentation"
          value={indent}
          onValueChange={(v) => setIndent(v as Indent)}
          options={INDENT_OPTIONS}
          triggerClassName="w-36"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TextareaGroup
          label={mode === "json-to-xml" ? "JSON Input" : "XML Input"}
          value={input}
          containerClassName="flex-1 min-h-[300px]"
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "json-to-xml" ? "Paste JSON here…" : "Paste XML here…"}
          action={<ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />}
        />

        <div className="space-y-2">
          {error ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Output</p>
              <ErrorAlert message={error} />
            </div>
          ) : (
            <TextareaGroup
              label={mode === "xml-to-json" ? "JSON Output" : "XML Output"}
              value={output}
              readOnly
              containerClassName="flex-1 min-h-[300px]"
              placeholder="Output will appear here…"
              action={
                <div className="flex gap-2">
                  <DownloadButton
                    iconOnly
                    onClick={() => downloadStringAsFile(output, `output.${ext}`)}
                    disabled={!output}
                  />
                  <CopyButton iconOnly textToCopy={output} disabled={!output} />
                </div>
              }
            />
          )}
        </div>
      </div>

      {output && (
        <div className="mt-8 border-t pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Input size</p>
              <p className="text-lg font-semibold">{input.length.toLocaleString()} chars</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Output size</p>
              <p className="text-lg font-semibold">{output.length.toLocaleString()} chars</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Mode</p>
              <p className="text-lg font-semibold">
                {mode === "format" ? "Format" : mode === "xml-to-json" ? "XML → JSON" : "JSON → XML"}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
