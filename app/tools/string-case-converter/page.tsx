"use client";

import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

interface CaseOutputs {
  camelCase: string;
  pascalCase: string;
  snakeCase: string;
  kebabCase: string;
  constantCase: string;
  trainCase: string;
  titleCase: string;
  lowercase: string;
  uppercase: string;
}

export default function StringCaseConverterPage() {
  const [input, setInput] = useState("hello World, this is a TEST!");

  const outputs = useMemo<CaseOutputs>(() => {
    if (!input.trim()) {
      return {
        camelCase: "",
        pascalCase: "",
        snakeCase: "",
        kebabCase: "",
        constantCase: "",
        trainCase: "",
        titleCase: "",
        lowercase: "",
        uppercase: "",
      };
    }

    // Parse: remove punctuation and split into words
    // Handles: spaces, underscores, hyphens, and camelCase/PascalCase
    const words = input
      .replace(/[^\w\s-]/g, "") // Remove punctuation but keep word chars, spaces, hyphens
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space between camelCase/PascalCase
      .replace(/[-_\s]+/g, " ") // Normalize separators to spaces
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => word.toLowerCase());

    const camelCase = words
      .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join("");

    const pascalCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");

    const snakeCase = words.join("_");

    const kebabCase = words.join("-");

    const constantCase = words.join("_").toUpperCase();

    const trainCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("-");

    const titleCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    const lowercase = input.toLowerCase();

    const uppercase = input.toUpperCase();

    return {
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
      constantCase,
      trainCase,
      titleCase,
      lowercase,
      uppercase,
    };
  }, [input]);

  const cases: Array<{
    key: keyof CaseOutputs;
    label: string;
    description: string;
  }> = [
    { key: "camelCase", label: "camelCase", description: "First word lowercase, rest capitalized" },
    { key: "pascalCase", label: "PascalCase", description: "All words capitalized" },
    { key: "snakeCase", label: "snake_case", description: "Lowercase with underscores" },
    { key: "kebabCase", label: "kebab-case", description: "Lowercase with hyphens" },
    { key: "constantCase", label: "CONSTANT_CASE", description: "Uppercase with underscores" },
    { key: "trainCase", label: "Train-Case", description: "Capitalized with hyphens" },
    { key: "titleCase", label: "Title Case", description: "Capitalized words with spaces" },
    { key: "lowercase", label: "lowercase", description: "All lowercase" },
    { key: "uppercase", label: "UPPERCASE", description: "All uppercase" },
  ];

  const tool = internalTools.find((t) => t.slug === "string-case-converter");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
        {/* Input */}
        <div className="shrink-0">
          <TextareaGroup
            label="Text Input"
            value={input}
            containerClassName="min-h-[150px]"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text to convert (e.g., hello World)"
            action={<ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />}
          />
        </div>
        {/* Outputs */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
          {cases.map(({ key, label, description }) => (
            <div key={key} className="shrink-0">
              <TextareaGroup
                label={
                  <div className="flex items-baseline gap-2">
                    <span>{label}</span>
                    <span className="text-xs">{description}</span>
                  </div>
                }
                value={outputs[key]}
                containerClassName="min-h-[150px]"
                readOnly
                action={<CopyButton iconOnly textToCopy={outputs[key]} disabled={!outputs[key]} />}
              />
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
