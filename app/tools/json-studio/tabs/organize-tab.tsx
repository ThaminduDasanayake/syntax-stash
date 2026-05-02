"use client";

import { useMemo, useState } from "react";

import {
  compareValues,
  FilterOperator,
  matchesFilter,
  parseSmartBlocks,
} from "@/app/tools/json-studio/organize-helpers";
import { ErrorAlert } from "@/components/error-alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

export function OrganizeTab({ input }: { input: string }) {
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterKey, setFilterKey] = useState("");
  const [filterOperator, setFilterOperator] = useState<FilterOperator>("contains");
  const [filterValue, setFilterValue] = useState("");

  const parsed = useMemo(() => parseSmartBlocks(input), [input]);
  const hasValidData = parsed !== null;
  const keys = useMemo(() => parsed?.keys ?? [], [parsed]);

  const activeSortKey = keys.includes(sortKey) ? sortKey : (keys[0] ?? "");
  const activeFilterKey = keys.includes(filterKey) ? filterKey : (keys[0] ?? "");

  const result = useMemo(() => {
    if (!hasValidData) return null;

    let items = [...parsed!.items];

    if (filterValue && activeFilterKey) {
      items = items.filter((item) =>
        matchesFilter(item.data, activeFilterKey, filterOperator, filterValue),
      );
    }

    if (activeSortKey) {
      items.sort((a, b) => {
        if (!a.data) return 1;
        if (!b.data) return -1;
        const cmp = compareValues(a.data[activeSortKey], b.data[activeSortKey]);
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    return items;
  }, [parsed, activeSortKey, sortOrder, activeFilterKey, filterOperator, filterValue, hasValidData]);

  const resultJSON = useMemo(() => {
    if (!result) return "";
    return `[\n  ${result.map((item) => item.originalText).join(",\n  ")}\n]`;
  }, [result]);

  const resultCount = result?.length ?? 0;
  const totalCount = parsed?.items?.length ?? 0;

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        {input && !hasValidData && (
          <ErrorAlert message="Not a valid array of objects. This tab accepts lenient JS-literal syntax (e.g. unquoted identifiers like icon: Scale)." />
        )}

        {hasValidData && (
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

        {hasValidData && (
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

      <TextAreaField
        label={
          hasValidData ? (
            <div className="flex items-center gap-2">
              Result
              <Badge variant="secondary">
                {resultCount.toLocaleString()}
                {totalCount !== resultCount && ` of ${totalCount.toLocaleString()}`}
              </Badge>
            </div>
          ) : "Result"
        }
        value={resultJSON}
        readOnly
        rows={28}
        className="font-mono text-sm"
        action={<CopyButton value={resultJSON} disabled={!resultJSON} />}
      />
    </div>
  );
}
