"use client";

import { ListFilter } from "lucide-react";
import { useMemo, useState } from "react";

import {
  compareValues,
  FilterOperator,
  matchesFilter,
  parseSmartBlocks,
} from "@/app/tools/json-array-sorter/helpers";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

const PLACEHOLDER = `[
  { "name": "Alice", "age": 28, "city": "New York", "salary": 75000 },
  { "name": "Bob", "age": 34, "city": "San Francisco", "salary": 95000 },
  { "name": "Charlie", "age": 23, "city": "Austin", "salary": 65000 },
  { "name": "Diana", "age": 31, "city": "New York", "salary": 85000 },
  { "name": "Eve", "age": 29, "city": "Seattle", "salary": 88000 }
]`;

export default function JSONArraySorterPage() {
  const [rawJSON, setRawJSON] = useState(PLACEHOLDER);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterKey, setFilterKey] = useState("");
  const [filterOperator, setFilterOperator] = useState<FilterOperator>("contains");
  const [filterValue, setFilterValue] = useState("");

  // Parse JSON and extract keys
  const parsed = useMemo(() => parseSmartBlocks(rawJSON), [rawJSON]);
  const hasValidJSON = parsed !== null;
  const keys = useMemo(() => parsed?.keys ?? [], [parsed]);

  const activeSortKey = keys.includes(sortKey) ? sortKey : (keys[0] ?? "");
  const activeFilterKey = keys.includes(filterKey) ? filterKey : (keys[0] ?? "");

  // Process array: filter then sort
  const result = useMemo(() => {
    if (!hasValidJSON) return null;

    let items = [...parsed!.items];

    // Apply filter
    if (filterValue && activeFilterKey) {
      items = items.filter((item) =>
        matchesFilter(item.data, activeFilterKey, filterOperator, filterValue),
      );
    }

    // Apply sort
    if (activeSortKey) {
      items.sort((a, b) => {
        // Push items that failed shadow parsing to the bottom
        if (!a.data) return 1;
        if (!b.data) return -1;

        const cmp = compareValues(a.data[activeSortKey], b.data[activeSortKey]);
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    return items;
  }, [
    parsed,
    activeSortKey,
    sortOrder,
    activeFilterKey,
    filterOperator,
    filterValue,
    hasValidJSON,
  ]);

  const resultJSON = useMemo(() => {
    if (!result) return "";
    return `[\n  ${result.map((item) => item.originalText).join(",\n  ")}\n]`;
  }, [result]);

  const resultCount = result?.length ?? 0;
  const totalCount = parsed?.items?.length ?? 0;

  function handleClear() {
    setRawJSON("");
    setFilterValue("");
  }

  // Options for selects
  const keyOptions = keys.map((k) => ({ value: k, label: k }));
  const orderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];
  const operatorOptions = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "greater", label: "Greater Than (>)" },
    { value: "less", label: "Less Than (<)" },
  ];

  return (
    <ToolLayout
      icon={ListFilter}
      title="JSON"
      highlight="Organizer"
      description="Sort and filter massive JSON arrays in real-time."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {/* Raw JSON Input */}
          <TextAreaField
            label="Raw JSON Array"
            value={rawJSON}
            onChange={(e) => setRawJSON(e.target.value)}
            rows={12}
            placeholder="Paste a JSON array of objects..."
            className="font-mono text-sm"
            action={<ClearButton onClick={handleClear} disabled={!rawJSON && !filterValue} />}
          />

          {/* Error state */}
          {rawJSON && !hasValidJSON && (
            <ErrorAlert message="Invalid JSON or not an array of objects. Please check the format." />
          )}

          {/* Sort Controls */}
          {hasValidJSON && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sort</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SelectField
                  label="Key"
                  value={activeSortKey}
                  onValueChange={setSortKey}
                  options={keyOptions}
                  placeholder="Select a key"
                />
                <SelectField
                  label="Order"
                  value={sortOrder}
                  onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
                  options={orderOptions}
                />
              </CardContent>
            </Card>
          )}

          {/* Filter Controls */}
          {hasValidJSON && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Filter (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SelectField
                  label="Key"
                  value={activeFilterKey}
                  onValueChange={setFilterKey}
                  options={keyOptions}
                  placeholder="Select a key"
                />
                <SelectField
                  label="Operator"
                  value={filterOperator}
                  onValueChange={(v) => setFilterOperator(v as FilterOperator)}
                  options={operatorOptions}
                />

                <InputField
                  label="Value"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Enter filter value..."
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output JSON */}
        <TextAreaField
          label={
            hasValidJSON && (
              <div className="flex items-center gap-2">
                Result
                <Badge variant="secondary">
                  {resultCount.toLocaleString()}
                  {totalCount !== resultCount && ` of ${totalCount.toLocaleString()}`}
                </Badge>
              </div>
            )
          }
          value={resultJSON}
          readOnly
          rows={38}
          className="font-mono text-sm"
          action={<CopyButton value={resultJSON} disabled={!resultJSON} />}
        />
      </div>
    </ToolLayout>
  );
}
