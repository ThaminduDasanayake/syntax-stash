"use client";

import { JSONPath } from "jsonpath-plus";
import { useMemo } from "react";

import { ErrorAlert } from "@/components/error-alert";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const EXAMPLES = [
  { label: "All book titles",        query: "$.store.book[*].title" },
  { label: "All authors",            query: "$.store.book[*].author" },
  { label: "Books in stock",         query: "$.store.book[?(@.inStock==true)]" },
  { label: "Books cheaper than $10", query: "$.store.book[?(@.price < 10)]" },
  { label: "Books with an ISBN",     query: "$.store.book[?(@.isbn)]" },
  { label: "All prices (recursive)", query: "$..price" },
  { label: "First book",             query: "$.store.book[0]" },
  { label: "Last book",              query: "$.store.book[-1:]" },
  { label: "All leaf values",        query: "$..*" },
  { label: "Root",                   query: "$" },
];

const CHEATSHEET: [string, string][] = [
  ["$",              "Root element"],
  [".",              "Child operator"],
  ["..",             "Recursive descent"],
  ["*",              "Wildcard — all elements"],
  ["[n]",            "Array index (0-based)"],
  ["[-1:]",          "Last element"],
  ["[0:3]",          "Slice (items 0, 1, 2)"],
  ["[*]",            "All array items"],
  ["[?(@.key)]",     "Filter — key exists"],
  ["[?(@.n > 10)]",  "Filter — numeric comparison"],
  ["[?(@.s == 'x')]","Filter — string match"],
  ["[?(!@.key)]",    "Filter — key absent"],
];

type QueryResult =
  | { status: "idle" }
  | { status: "json_error"; message: string }
  | { status: "query_error"; message: string }
  | { status: "ok"; output: string; count: number };

type Props = {
  input: string;
  query: string;
  onQueryChange: (q: string) => void;
};

export function QueryTab({ input, query, onQueryChange }: Props) {
  const result = useMemo<QueryResult>(() => {
    const trimmedPayload = input.trim();
    const trimmedQuery = query.trim();

    if (!trimmedPayload) return { status: "idle" };

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmedPayload);
    } catch (e) {
      return { status: "json_error", message: e instanceof Error ? e.message : "Invalid JSON" };
    }

    if (!trimmedQuery) return { status: "idle" };

    try {
      const matches = JSONPath({ path: trimmedQuery, json: parsed as object });
      return {
        status: "ok",
        output: JSON.stringify(matches, null, 2),
        count: Array.isArray(matches) ? matches.length : 1,
      };
    } catch (e) {
      return { status: "query_error", message: e instanceof Error ? e.message : "Invalid JSONPath query" };
    }
  }, [input, query]);

  const outputValue = result.status === "ok" ? result.output : "";

  const resultLabel = result.status === "ok" ? (
    <span className="flex items-center gap-2">
      Result
      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
        {result.count} {result.count === 1 ? "match" : "matches"}
      </span>
    </span>
  ) : "Result";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>JSONPath Query</Label>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="$.store.book[*].author"
          className="font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Quick examples</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map(({ label, query: q }) => (
            <button
              key={q}
              onClick={() => onQueryChange(q)}
              title={q}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-xs transition-colors hover:border-primary/60 hover:bg-primary/5"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {result.status === "json_error" && (
        <ErrorAlert message={`Invalid JSON — ${result.message}`} />
      )}
      {result.status === "query_error" && (
        <ErrorAlert message={`Invalid JSONPath — ${result.message}`} />
      )}

      <TextAreaField
        label={resultLabel}
        value={outputValue}
        readOnly
        rows={16}
        placeholder="Query results will appear here…"
        action={<CopyButton value={outputValue} disabled={!outputValue} />}
      />

      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown size={14} className="transition-transform [[data-state=open]_&]:rotate-180" />
          JSONPath Syntax Reference
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 grid gap-3 text-xs md:grid-cols-2 lg:grid-cols-3">
            {CHEATSHEET.map(([syntax, desc]) => (
              <div key={syntax} className="rounded-lg bg-muted/50 p-3">
                <code className="font-mono font-semibold text-primary">{syntax}</code>
                <p className="mt-0.5 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
