"use client";

import { Type } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

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
  const [input, setInput] = useState(
    "hello World, this is a TEST!",
  );

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

    const pascalCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    const snakeCase = words.join("_");

    const kebabCase = words.join("-");

    const constantCase = words.join("_").toUpperCase();

    const trainCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");

    const titleCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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

  return (
    <ToolLayout
      icon={Type}
      title="String Case"
      highlight="Converter"
      description="Convert text between different naming conventions and typographical styles."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Input */}
        <TextAreaField
          label="Text Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text to convert (e.g., hello World, this is a TEST!)"
          rows={22}
          action={
            <ClearButton
              onClick={() => setInput("")}
              disabled={!input}
            />
          }
        />

        {/* Right: Outputs */}
        <div className="space-y-3">
          {cases.map(({ key, label, description }) => (
            <div key={key}>
              <TextAreaField
                label={
                  <div className="flex items-center justify-between gap-2">
                    <span>{label}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {description}
                    </span>
                  </div>
                }
                value={outputs[key]}
                readOnly
                rows={2}
                action={
                  <CopyButton
                    value={outputs[key]}
                    disabled={!outputs[key]}
                  />
                }
              />
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
