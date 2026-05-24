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
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { SwitchField } from "@/components/ui/switch-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
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
      <div className="mb-6 grid grid-cols-2 items-end justify-between gap-6">
        <div className="flex flex-wrap items-end justify-between">
          <ButtonGroup className="grid grid-cols-2">
            <Button
              variant={direction === "json-to-csv" ? "default" : "outline"}
              onClick={() => handleDirectionChange("json-to-csv")}
              className="font-semibold"
            >
              JSON <ArrowRightIcon weight="bold" /> CSV
            </Button>
            <Button
              variant={direction === "csv-to-json" ? "default" : "outline"}
              onClick={() => handleDirectionChange("csv-to-json")}
              className="font-semibold"
            >
              CSV <ArrowRightIcon weight="bold" /> JSON
            </Button>
          </ButtonGroup>

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input */}
        <TextareaGroup
          label={isJsonToCsv ? "JSON Input" : "CSV Input"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste your ${isJsonToCsv ? "JSON array" : "CSV"} here...`}
          action={<ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />}
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
            <TextareaGroup
              label={isJsonToCsv ? "CSV Output" : "JSON Output"}
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
