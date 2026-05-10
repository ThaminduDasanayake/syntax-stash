"use client";

import { useMemo, useState } from "react";

import { buildMarkdownTable } from "@/app/tools/ascii-studio/helpers";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";

const DEFAULT_COLS = 3;
const DEFAULT_ROWS = 3;

function makeHeaders(n: number) {
  return Array.from({ length: n }, (_, i) => `Col ${i + 1}`);
}
function makeData(rows: number, cols: number) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));
}

export function MarkdownTableTab() {
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [headers, setHeaders] = useState<string[]>(makeHeaders(DEFAULT_COLS));
  const [data, setData] = useState<string[][]>(makeData(DEFAULT_ROWS, DEFAULT_COLS));

  const handleColsChange = (newCols: number) => {
    setCols(newCols);
    setHeaders((prev) => {
      const next = makeHeaders(newCols);
      return next.map((fallback, i) => prev[i] ?? fallback);
    });
    setData((prev) => {
      return Array.from({ length: rows }, (_, ri) =>
        Array.from({ length: newCols }, (__, ci) => prev[ri]?.[ci] ?? ""),
      );
    });
  };

  const handleRowsChange = (newRows: number) => {
    setRows(newRows);
    setData((prev) => {
      return Array.from({ length: newRows }, (_, ri) =>
        Array.from({ length: cols }, (__, ci) => prev[ri]?.[ci] ?? ""),
      );
    });
  };

  const output = useMemo(() => buildMarkdownTable(headers, data), [headers, data]);

  function updateHeader(ci: number, val: string) {
    setHeaders((prev) => prev.map((h, i) => (i === ci ? val : h)));
  }
  function updateCell(ri: number, ci: number, val: string) {
    setData((prev) =>
      prev.map((row, r) => row.map((cell, c) => (r === ri && c === ci ? val : cell))),
    );
  }

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div className="flex flex-wrap gap-4">
        <InputField
          label="Columns"
          type="number"
          value={cols}
          onChange={(e) => handleColsChange(clamp(Number(e.target.value), 1, 10))}
          min={1}
          max={10}
          containerClassName="w-28"
        />
        <InputField
          label="Rows"
          type="number"
          value={rows}
          onChange={(e) => handleRowsChange(clamp(Number(e.target.value), 1, 20))}
          min={1}
          max={20}
          containerClassName="w-28"
        />
      </div>

      {/* Grid editor */}
      <div className="space-y-2">
        <Label>Table Data</Label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {headers.map((h, ci) => (
                  <th key={ci} className="border-border border p-1">
                    <Input
                      value={h}
                      onChange={(e) => updateHeader(ci, e.target.value)}
                      placeholder={`Col ${ci + 1}`}
                      className="bg-muted/40 h-8 text-center font-semibold"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-border border p-1">
                      <Input
                        value={cell}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        placeholder="—"
                        className="h-8 text-center font-mono text-xs"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TextAreaField
        label="Markdown Output"
        readOnly
        value={output}
        rows={Math.max(rows + 3, 6)}
        textClassName="font-mono text-sm"
        action={<CopyButton textToCopy={output} disabled={!output} />}
      />
    </div>
  );
}
