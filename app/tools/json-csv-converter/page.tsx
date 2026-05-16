"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { SwitchField } from "@/components/ui/switch-field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";
import { downloadStringAsFile } from "@/lib/utils";

import { csvToJSON, jsonToCSV } from "./helpers";

type Direction = "json-to-csv" | "csv-to-json";
type Delimiter = "comma" | "tab" | "semicolon";

const DELIMITER_MAP: Record<Delimiter, string> = {
  comma: ",",
  tab: "\t",
  semicolon: ";",
};

const JSON_EXAMPLE = `[
  { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "Engineer", "active": true },
  { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "Designer", "active": false },
  { "id": 3, "name": "Charlie Brown", "email": "charlie@example.com", "role": "Manager", "active": true }
]`;

const CSV_EXAMPLE = `id,name,email,role,active
1,Alice Johnson,alice@example.com,Engineer,true
2,Bob Smith,bob@example.com,Designer,false
3,Charlie Brown,charlie@example.com,Manager,true`;

export default function JSONCSVConverterPage() {
  const [direction, setDirection] = useState<Direction>("json-to-csv");
  const [input, setInput] = useState(JSON_EXAMPLE);
  const [delimiter, setDelimiter] = useState<Delimiter>("comma");
  const [includeHeader, setIncludeHeader] = useState(true);
  const [flatten, setFlatten] = useState(false);

  const isJsonToCsv = direction === "json-to-csv";

  const { output, error } = useMemo<{ output: string; error: string }>(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const delim = DELIMITER_MAP[delimiter];
      if (isJsonToCsv) {
        return { output: jsonToCSV(input, delim, includeHeader, flatten), error: "" };
      } else {
        return { output: csvToJSON(input, delim), error: "" };
      }
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, delimiter, includeHeader, flatten, isJsonToCsv]);

  const handleDirectionChange = (d: string) => {
    const newDir = d as Direction;
    setDirection(newDir);
    setInput(newDir === "json-to-csv" ? JSON_EXAMPLE : CSV_EXAMPLE);
  };

  const ext = isJsonToCsv ? "csv" : "json";

  const handleDownload = () => {
    downloadStringAsFile(output, `converted.${ext}`);
  };

  const delimiterOptions = [
    { value: "comma", label: "Comma (,)" },
    { value: "tab", label: "Tab (\\t)" },
    { value: "semicolon", label: "Semicolon (;)" },
  ];

  const tool = internalTools.find((t) => t.slug === "json-csv-converter");

  return (
    <ToolLayout tool={tool}>
      {/* Controls */}
      <div className="mb-6 grid grid-cols-2 items-end justify-between gap-8">
        <div className="flex items-end justify-between">
          <Tabs value={direction} onValueChange={handleDirectionChange}>
            <TabsList className="grid w-full min-w-xs grid-cols-2">
              <TabsTrigger value="json-to-csv" className="tab-trigger">
                JSON <ArrowRightIcon weight="bold" /> CSV
              </TabsTrigger>
              <TabsTrigger value="csv-to-json" className="tab-trigger">
                CSV <ArrowRightIcon weight="bold" /> JSON
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <SelectField
            label="Delimiter"
            value={delimiter}
            onValueChange={(v) => setDelimiter(v as Delimiter)}
            options={delimiterOptions}
            triggerClassName="w-40"
          />
        </div>

        {isJsonToCsv && (
          <div className="flex items-end justify-start gap-5">
            <SwitchField
              label="Include header row"
              checked={includeHeader}
              onCheckedChange={setIncludeHeader}
            />
            <SwitchField
              label="Flatten nested keys"
              checked={flatten}
              onCheckedChange={setFlatten}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input */}
        <TextAreaField
          label={isJsonToCsv ? "JSON Input" : "CSV Input"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste your ${isJsonToCsv ? "JSON array" : "CSV"} here...`}
          rows={22}
          action={<ClearButton onClick={() => setInput("")} disabled={!input} />}
          className="font-mono text-xs"
        />

        {/* Output */}
        <div className="space-y-2">
          {error ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isJsonToCsv ? "CSV Output" : "JSON Output"}
              </Label>
              <ErrorAlert message={error} />
            </div>
          ) : (
            <TextAreaField
              label={isJsonToCsv ? "CSV Output" : "JSON Output"}
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
                    label={`Download .${ext}`}
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
              <p className="text-muted-foreground text-xs">Rows</p>
              <p className="text-lg font-semibold">
                {isJsonToCsv
                  ? Math.max(0, output.split("\n").length - (includeHeader ? 1 : 0))
                  : output.split("\n").length}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
