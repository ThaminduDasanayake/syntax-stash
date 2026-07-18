"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import YAML from "yaml";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";
import { downloadStringAsFile } from "@/lib/utils";

type Direction = "yaml-to-json" | "json-to-yaml";
type Indent = "2" | "4";

//language=text
const YAML_EXAMPLE = `server:
  host: localhost
  port: 8080
  debug: true

database:
  url: postgres://user:pass@localhost/db
  pool_size: 10

features:
  - name: auth
    enabled: true
  - name: cache
    enabled: false
`;

//language=text
const JSON_EXAMPLE = `{
  "server": {
    "host": "localhost",
    "port": 8080,
    "debug": true
  },
  "database": {
    "url": "postgres://user:pass@localhost/db",
    "pool_size": 10
  },
  "features": [
    { "name": "auth", "enabled": true },
    { "name": "cache", "enabled": false }
  ]
}`;

export default function YAMLJSONConverterPage() {
  const [direction, setDirection] = useState<Direction>("yaml-to-json");
  const [input, setInput] = useState(YAML_EXAMPLE);
  const [indent, setIndent] = useState<Indent>("2");

  const isYamlToJson = direction === "yaml-to-json";

  const { error, output } = useMemo<{ output: string; error: string }>(() => {
    if (!input.trim()) return { error: "", output: "" };
    try {
      if (isYamlToJson) {
        const parsed = YAML.parse(input);
        return { error: "", output: JSON.stringify(parsed, null, parseInt(indent)) };
      } else {
        const parsed = JSON.parse(input);
        return { error: "", output: YAML.stringify(parsed, null, { indent: parseInt(indent) }) };
      }
    } catch (e) {
      return { error: (e as Error).message, output: "" };
    }
  }, [indent, input, isYamlToJson]);

  const handleDirectionChange = (d: string) => {
    const newDir = d as Direction;
    setDirection(newDir);
    setInput(newDir === "yaml-to-json" ? YAML_EXAMPLE : JSON_EXAMPLE);
  };

  const ext = isYamlToJson ? "json" : "yaml";
  const handleDownload = () => {
    downloadStringAsFile(output, `converted.${ext}`);
  };

  const indentOptions = [
    { label: "2 spaces", value: "2" },
    { label: "4 spaces", value: "4" },
  ];

  const tool = internalTools.find((t) => t.slug === "yaml-json-converter");

  return (
    <ToolLayout tool={tool}>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-8">
        <ButtonGroup className="grid grid-cols-2">
          <Button
            variant={direction === "yaml-to-json" ? "default" : "outline"}
            onClick={() => handleDirectionChange("yaml-to-json")}
            className="font-semibold"
          >
            YAML <ArrowRightIcon weight="bold" /> JSON
          </Button>
          <Button
            variant={direction === "json-to-yaml" ? "default" : "outline"}
            onClick={() => handleDirectionChange("json-to-yaml")}
            className="font-semibold"
          >
            JSON <ArrowRightIcon weight="bold" /> YAML
          </Button>
        </ButtonGroup>

        <SelectField
          label="Indentation"
          value={indent}
          onValueChange={(v) => setIndent(v as Indent)}
          options={indentOptions}
          triggerClassName="w-36"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input */}
        <TextareaGroup
          label={isYamlToJson ? "YAML Input" : "JSON Input"}
          value={input}
          containerClassName="flex-1 min-h-[250px]"
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste your ${isYamlToJson ? "YAML" : "JSON"} here...`}
          action={<ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />}
        />

        {/* Output */}
        <div className="space-y-2">
          {error ? (
            <div className="space-y-2">
              <Label>{isYamlToJson ? "JSON Output" : "YAML Output"}</Label>
              <ErrorAlert message={error} />
            </div>
          ) : (
            <TextareaGroup
              label={isYamlToJson ? "JSON Output" : "YAML Output"}
              value={output}
              readOnly
              containerClassName="flex-1 min-h-[400px]"
              placeholder="Output will appear here..."
              action={
                <div className="flex gap-2">
                  <DownloadButton iconOnly onClick={handleDownload} disabled={!output} />
                  <CopyButton iconOnly textToCopy={output} disabled={!output} />
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* Stats */}
      {output && (
        <div className="mt-8 border-t pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Input size</p>
              <p className="text-lg font-semibold">{input.length} chars</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Output size</p>
              <p className="text-lg font-semibold">{output.length} chars</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Direction</p>
              <p className="text-lg font-semibold">
                {isYamlToJson ? "YAML → JSON" : "JSON → YAML"}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
