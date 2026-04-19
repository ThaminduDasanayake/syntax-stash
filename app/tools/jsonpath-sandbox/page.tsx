"use client";

import { JSONPath } from "jsonpath-plus";
import { SearchCode } from "lucide-react";
import { useMemo, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";

// ---------------------------------------------------------------------------
// Sample payload
// ---------------------------------------------------------------------------

const SAMPLE_JSON = JSON.stringify(
  {
    store: {
      book: [
        {
          category: "reference",
          author: "Nigel Rees",
          title: "Sayings of the Century",
          price: 8.95,
          inStock: true,
        },
        {
          category: "fiction",
          author: "Evelyn Waugh",
          title: "Sword of Honour",
          price: 12.99,
          inStock: false,
        },
        {
          category: "fiction",
          author: "Herman Melville",
          title: "Moby Dick",
          isbn: "0-553-21311-3",
          price: 8.99,
          inStock: true,
        },
        {
          category: "fiction",
          author: "J. R. R. Tolkien",
          title: "The Lord of the Rings",
          isbn: "0-395-19395-8",
          price: 22.99,
          inStock: true,
        },
      ],
      bicycle: {
        color: "red",
        price: 399.95,
        inStock: true,
      },
    },
    meta: {
      generated: "2026-04-19T21:39:21Z",
      total: 4,
    },
  },
  null,
  2,
);

// ---------------------------------------------------------------------------
// Quick-reference cheatsheet entries
// ---------------------------------------------------------------------------

const EXAMPLES = [
  { label: "All book titles",         query: "$.store.book[*].title" },
  { label: "All authors",             query: "$.store.book[*].author" },
  { label: "Books in stock",          query: "$.store.book[?(@.inStock==true)]" },
  { label: "Books cheaper than $10",  query: "$.store.book[?(@.price < 10)]" },
  { label: "Books with an ISBN",      query: "$.store.book[?(@.isbn)]" },
  { label: "All prices (recursive)",  query: "$..price" },
  { label: "First book",              query: "$.store.book[0]" },
  { label: "Last book",               query: "$.store.book[-1:]" },
  { label: "All leaf values",         query: "$..*" },
  { label: "Root",                    query: "$" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type QueryResult =
  | { status: "idle" }
  | { status: "json_error"; message: string }
  | { status: "query_error"; message: string }
  | { status: "ok"; output: string; count: number };

export default function JSONPathSandboxPage() {
  const [payload, setPayload]   = useState(SAMPLE_JSON);
  const [query,   setQuery]     = useState("$.store.book[*].author");

  const result = useMemo<QueryResult>(() => {
    const trimmedPayload = payload.trim();
    const trimmedQuery   = query.trim();

    if (!trimmedPayload) return { status: "idle" };

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmedPayload);
    } catch (e) {
      return {
        status: "json_error",
        message: e instanceof Error ? e.message : "Invalid JSON",
      };
    }

    if (!trimmedQuery) return { status: "idle" };

    // Execute JSONPath
    try {
      const matches = JSONPath({ path: trimmedQuery, json: parsed as object });
      return {
        status: "ok",
        output: JSON.stringify(matches, null, 2),
        count: Array.isArray(matches) ? matches.length : 1,
      };
    } catch (e) {
      return {
        status: "query_error",
        message: e instanceof Error ? e.message : "Invalid JSONPath query",
      };
    }
  }, [payload, query]);

  const outputValue = result.status === "ok" ? result.output : "";

  const resultLabel = useMemo(() => {
    if (result.status === "ok") {
      return (
        <span className="flex items-center gap-2">
          Result
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
            {result.count} {result.count === 1 ? "match" : "matches"}
          </span>
        </span>
      );
    }
    return "Result";
  }, [result]);

  return (
    <ToolLayout
      icon={SearchCode}
      title="JSONPath"
      highlight="Sandbox"
      description="Test and evaluate JSONPath queries against massive API payloads in real-time."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Left — query input + payload                                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Query input */}
          <div className="space-y-2">
            <Label>JSONPath Query</Label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="$.store.book[*].author"
              className="font-mono text-sm"
              spellCheck={false}
            />
          </div>

          {/* Quick-pick examples */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Quick examples
            </p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map(({ label, query: q }) => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  title={q}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-xs transition-colors hover:border-primary/60 hover:bg-primary/5"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Payload textarea */}
          <TextAreaField
            label="JSON Payload"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder='Paste your JSON payload here…'
            rows={16}
            action={
              <ClearButton onClick={() => setPayload("")} disabled={!payload} />
            }
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right — result                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Errors float at the top */}
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
            rows={24}
            placeholder="Query results will appear here…"
            action={
              <CopyButton value={outputValue} disabled={!outputValue} />
            }
          />
        </div>
      </div>

      {/* Syntax reference */}
      <div className="mt-8 border-t pt-8">
        <h3 className="mb-4 text-sm font-semibold">JSONPath Syntax Reference</h3>
        <div className="grid gap-3 text-xs md:grid-cols-2 lg:grid-cols-3">
          {[
            ["$",             "Root element"],
            [".",             "Child operator"],
            ["..",            "Recursive descent"],
            ["*",             "Wildcard — all elements"],
            ["[n]",           "Array index (0-based)"],
            ["[-1:]",         "Last element"],
            ["[0:3]",         "Slice (items 0, 1, 2)"],
            ["[*]",           "All array items"],
            ["[?(@.key)]",    "Filter — key exists"],
            ["[?(@.n > 10)]", "Filter — numeric comparison"],
            ["[?(@.s == 'x')]","Filter — string match"],
            ["[?(!@.key)]",   "Filter — key absent"],
          ].map(([syntax, desc]) => (
            <div key={syntax} className="rounded-lg bg-muted/50 p-3">
              <code className="font-mono font-semibold text-primary">{syntax}</code>
              <p className="mt-0.5 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
