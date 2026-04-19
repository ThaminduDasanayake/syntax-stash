"use client";

import { TableProperties } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

type DelimiterType = "auto" | "comma" | "tab" | "pipe";

export default function CSVToMarkdownPage() {
  const [input, setInput] = useState(`Name,Email,Role
Alice Johnson,alice@example.com,Engineer
Bob Smith,bob@example.com,Designer
Charlie Brown,charlie@example.com,Manager`);
  const [delimiter, setDelimiter] = useState<DelimiterType>("auto");

  const markdownTable = useMemo<string>(() => {
    const trimmed = input.trim();
    if (!trimmed) return "";

    // Detect delimiter if auto-detect is selected
    let actualDelimiter = ",";
    if (delimiter === "auto") {
      const commaCount = (trimmed.match(/,/g) || []).length;
      const tabCount = (trimmed.match(/\t/g) || []).length;
      const pipeCount = (trimmed.match(/\|/g) || []).length;

      const counts = [
        { delim: ",", count: commaCount },
        { delim: "\t", count: tabCount },
        { delim: "|", count: pipeCount },
      ];

      const maxCount = Math.max(...counts.map((c) => c.count));
      if (maxCount > 0) {
        actualDelimiter = counts.find((c) => c.count === maxCount)?.delim || ",";
      }
    } else if (delimiter === "comma") {
      actualDelimiter = ",";
    } else if (delimiter === "tab") {
      actualDelimiter = "\t";
    } else if (delimiter === "pipe") {
      actualDelimiter = "|";
    }

    // Split into rows
    const rows = trimmed
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) =>
        line.split(actualDelimiter).map((cell) => cell.trim())
      );

    if (rows.length === 0) return "";

    // Get the maximum column count
    const maxCols = Math.max(...rows.map((row) => row.length));

    // Pad rows to have the same number of columns
    const paddedRows = rows.map((row) => {
      const newRow = [...row];
      while (newRow.length < maxCols) {
        newRow.push("");
      }
      return newRow;
    });

    // Calculate column widths
    const columnWidths = Array(maxCols)
      .fill(0)
      .map((_, colIdx) => {
        return Math.max(
          ...paddedRows.map((row) => (row[colIdx] || "").length),
          3, // Minimum width
        );
      });

    // Format rows
    const formatRow = (row: string[], widths: number[]) => {
      return (
        "| " +
        row
          .map((cell, idx) => (cell || "").padEnd(widths[idx]))
          .join(" | ") +
        " |"
      );
    };

    // Build table
    const lines: string[] = [];

    // Header row
    if (paddedRows.length > 0) {
      lines.push(formatRow(paddedRows[0], columnWidths));

      // Separator
      lines.push(
        "| " +
          columnWidths
            .map((width) => "-".repeat(width))
            .join(" | ") +
          " |",
      );

      // Data rows
      for (let i = 1; i < paddedRows.length; i++) {
        lines.push(formatRow(paddedRows[i], columnWidths));
      }
    }

    return lines.join("\n");
  }, [input, delimiter]);

  const delimiterOptions: Array<{ value: DelimiterType; label: string }> = [
    { value: "auto", label: "Auto-detect" },
    { value: "comma", label: "Comma (,)" },
    { value: "tab", label: "Tab (\\t)" },
    { value: "pipe", label: "Pipe (|)" },
  ];

  return (
    <ToolLayout
      icon={TableProperties}
      title="CSV/Spreadsheet"
      highlight="to Markdown Table"
      description="Convert CSV and spreadsheet data into beautifully formatted Markdown tables."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-4">
          <SelectField
            label="Delimiter"
            value={delimiter}
            onValueChange={(value) => setDelimiter(value as DelimiterType)}
            options={delimiterOptions}
          />

          <TextAreaField
            label="CSV / Spreadsheet Data"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSV or spreadsheet data here..."
            rows={20}
            action={
              <ClearButton
                onClick={() => setInput("")}
                disabled={!input}
              />
            }
          />
        </div>

        {/* Right: Output */}
        <TextAreaField
          label="Markdown Table"
          value={markdownTable}
          readOnly
          rows={22}
          placeholder="Your Markdown table will appear here..."
          action={
            <CopyButton
              value={markdownTable}
              disabled={!markdownTable}
            />
          }
        />
      </div>

      {/* Info Section */}
      {markdownTable && (
        <div className="mt-8 border-t pt-8">
          <h3 className="mb-4 text-sm font-semibold">Table Info</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Rows (excluding header)</p>
              <p className="text-lg font-semibold">
                {Math.max(0, input.trim().split("\n").length - 1)}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Columns</p>
              <p className="text-lg font-semibold">
                {input
                  .trim()
                  .split("\n")[0]
                  ?.split(delimiter === "auto" ? /[,\t|]/ :
                    delimiter === "comma" ? "," :
                    delimiter === "tab" ? "\t" : "|")
                  .length || 0}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Character Count</p>
              <p className="text-lg font-semibold">{markdownTable.length}</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
