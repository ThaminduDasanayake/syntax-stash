"use client";

import { ListFilter } from "lucide-react";
import { useMemo, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

// ---------------------------------------------------------------------------
// Default placeholder
// ---------------------------------------------------------------------------

const PLACEHOLDER = `[
  { "name": "Alice", "age": 28, "city": "New York", "salary": 75000 },
  { "name": "Bob", "age": 34, "city": "San Francisco", "salary": 95000 },
  { "name": "Charlie", "age": 23, "city": "Austin", "salary": 65000 },
  { "name": "Diana", "age": 31, "city": "New York", "salary": 85000 },
  { "name": "Eve", "age": 29, "city": "Seattle", "salary": 88000 }
]`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterOperator = "contains" | "equals" | "greater" | "less";

interface ParsedData {
  items: Record<string, unknown>[];
  keys: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseJSON(text: string): ParsedData | null {
  try {
    const parsed = JSON.parse(text.trim());
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }
    if (typeof parsed[0] !== "object" || parsed[0] === null) {
      return null;
    }
    const keys = Object.keys(parsed[0]);
    return { items: parsed, keys };
  } catch {
    return null;
  }
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  // String comparison
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }

  // Numeric comparison
  const aNum = Number(a);
  const bNum = Number(b);
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }

  // Fallback
  return String(a).localeCompare(String(b));
}

function matchesFilter(
  item: Record<string, unknown>,
  key: string,
  operator: FilterOperator,
  value: string,
): boolean {
  const itemValue = item[key];
  const strValue = String(itemValue).toLowerCase();
  const filterValue = value.toLowerCase();

  switch (operator) {
    case "contains":
      return strValue.includes(filterValue);
    case "equals":
      return String(itemValue).toLowerCase() === filterValue;
    case "greater": {
      const num = Number(itemValue);
      const filterNum = Number(value);
      return !isNaN(num) && !isNaN(filterNum) && num > filterNum;
    }
    case "less": {
      const num = Number(itemValue);
      const filterNum = Number(value);
      return !isNaN(num) && !isNaN(filterNum) && num < filterNum;
    }
    default:
      return true;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function JSONArraySorterPage() {
  const [rawJSON, setRawJSON] = useState(PLACEHOLDER);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterKey, setFilterKey] = useState("");
  const [filterOperator, setFilterOperator] = useState<FilterOperator>("contains");
  const [filterValue, setFilterValue] = useState("");

  // Parse JSON and extract keys
  const parsed = useMemo(() => parseJSON(rawJSON), [rawJSON]);
  const keys = parsed?.keys ?? [];
  const hasValidJSON = parsed !== null;

  // Initialize sort/filter keys if not set
  useMemo(() => {
    if (keys.length > 0 && !sortKey) {
      setSortKey(keys[0]);
    }
    if (keys.length > 0 && !filterKey) {
      setFilterKey(keys[0]);
    }
  }, [keys, sortKey, filterKey]);

  // Process array: filter then sort
  const result = useMemo(() => {
    if (!hasValidJSON) return null;

    let items = parsed!.items;

    // Apply filter
    if (filterValue && filterKey) {
      items = items.filter((item) => matchesFilter(item, filterKey, filterOperator, filterValue));
    }

    // Apply sort
    if (sortKey) {
      items = [...items].sort((a, b) => {
        const cmp = compareValues(a[sortKey], b[sortKey]);
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    return items;
  }, [parsed, sortKey, sortOrder, filterKey, filterOperator, filterValue, hasValidJSON]);

  const resultJSON = useMemo(
    () => (result ? JSON.stringify(result, null, 2) : ""),
    [result],
  );

  const resultCount = result?.length ?? 0;
  const totalCount = parsed?.items.length ?? 0;

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
        {/* ---------------------------------------------------------------- */}
        {/* Left — inputs & controls                                         */}
        {/* ---------------------------------------------------------------- */}
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
                  value={sortKey}
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
                  value={filterKey}
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Enter filter value..."
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right — output                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-3">
          {/* Result Count Badge */}
          {hasValidJSON && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Result</span>
              <Badge variant="secondary" className="font-mono text-[11px]">
                {resultCount.toLocaleString()}
                {totalCount !== resultCount && ` of ${totalCount.toLocaleString()}`}
              </Badge>
            </div>
          )}

          {/* Output JSON */}
          <TextAreaField
            value={resultJSON}
            readOnly
            rows={28}
            className="font-mono text-sm"
            action={<CopyButton value={resultJSON} disabled={!resultJSON} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
