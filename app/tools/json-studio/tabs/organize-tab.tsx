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
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";

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
  }, [
    activeFilterKey,
    activeSortKey,
    filterOperator,
    filterValue,
    hasValidData,
    parsed,
    sortOrder,
  ]);

  const resultJSON = useMemo(() => {
    if (!result) return "";
    return `[\n  ${result.map((item) => item.originalText).join(",\n  ")}\n]`;
  }, [result]);

  const resultCount = result?.length ?? 0;
  const totalCount = parsed?.items?.length ?? 0;

  const keyOptions = keys.map((k) => ({ label: k, value: k }));
  const orderOptions = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
  const operatorOptions = [
    { label: "Contains", value: "contains" },
    { label: "Equals", value: "equals" },
    { label: "Greater Than (>)", value: "greater" },
    { label: "Less Than (<)", value: "less" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        {input && !hasValidData && (
          <ErrorAlert message="Not a valid array of objects. This tab accepts lenient JS-literal syntax (e.g. unquoted identifiers like icon: Scale)." />
        )}

        {hasValidData && (
          <Card size="sm">
            <CardHeader className="border-b">
              <CardTitle>Sort</CardTitle>
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
          <Card size="sm">
            <CardHeader className="border-b">
              <CardTitle>Filter (Optional)</CardTitle>
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

      <TextareaGroup
        label={
          hasValidData ? (
            <div className="flex items-center gap-2">
              Result
              <Badge variant="secondary">
                {resultCount.toLocaleString()}
                {totalCount !== resultCount && ` of ${totalCount.toLocaleString()}`}
              </Badge>
            </div>
          ) : (
            "Result"
          )
        }
        value={resultJSON}
        readOnly
        action={<CopyButton iconOnly textToCopy={resultJSON} disabled={!resultJSON} />}
      />
    </div>
  );
}
