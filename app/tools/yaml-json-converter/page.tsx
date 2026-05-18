"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import YAML from "yaml";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";
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

  const { output, error } = useMemo<{ output: string; error: string }>(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (isYamlToJson) {
        const parsed = YAML.parse(input);
        return { output: JSON.stringify(parsed, null, parseInt(indent)), error: "" };
      } else {
        const parsed = JSON.parse(input);
        return { output: YAML.stringify(parsed, null, { indent: parseInt(indent) }), error: "" };
      }
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, indent, isYamlToJson]);

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
    { value: "2", label: "2 spaces" },
    { value: "4", label: "4 spaces" },
  ];

  const tool = internalTools.find((t) => t.slug === "yaml-json-converter");

  return (
    <ToolLayout tool={tool}>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-8">
        <Tabs value={direction} onValueChange={handleDirectionChange}>
          <TabsList className="grid w-full min-w-xs grid-cols-2">
            <TabsTrigger value="yaml-to-json" className="tab-trigger">
              YAML <ArrowRightIcon weight="bold" /> JSON
            </TabsTrigger>
            <TabsTrigger value="json-to-yaml" className="tab-trigger">
              JSON <ArrowRightIcon weight="bold" /> YAML
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
        <TextAreaField
          label={isYamlToJson ? "YAML Input" : "JSON Input"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste your ${isYamlToJson ? "YAML" : "JSON"} here...`}
          rows={22}
          action={<ClearButton onClick={() => setInput("")} disabled={!input} />}
          className="font-mono text-xs"
        />

        {/* Output */}
        <div className="space-y-2">
          {error ? (
            <div className="space-y-2">
              <Label>{isYamlToJson ? "JSON Output" : "YAML Output"}</Label>
              <ErrorAlert message={error} />
            </div>
          ) : (
            <TextAreaField
              label={isYamlToJson ? "JSON Output" : "YAML Output"}
              value={output}
              readOnly
              rows={22}
              placeholder="Output will appear here..."
              action={
                <div className="flex gap-2">
                  <CopyButton textToCopy={output} disabled={!output} />
                  <DownloadButton
                    onClick={handleDownload}
                    disabled={!output}
                    label={`Download ${ext.toUpperCase()}`}
                  />
                </div>
              }
              className="font-mono text-xs"
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
