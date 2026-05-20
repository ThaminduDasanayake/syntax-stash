"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { Collapsible } from "@radix-ui/react-collapsible";
import { JSONPath } from "jsonpath-plus";
import { useMemo } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { TextareaGroup } from "@/components/ui/textarea-group";

const EXAMPLES = [
  { label: "All book titles", query: "$.store.book[*].title" },
  { label: "All authors", query: "$.store.book[*].author" },
  { label: "Books in stock", query: "$.store.book[?(@.inStock==true)]" },
  { label: "Books cheaper than $10", query: "$.store.book[?(@.price < 10)]" },
  { label: "Books with an ISBN", query: "$.store.book[?(@.isbn)]" },
  { label: "All prices (recursive)", query: "$..price" },
  { label: "First book", query: "$.store.book[0]" },
  { label: "Last book", query: "$.store.book[-1:]" },
  { label: "All leaf values", query: "$..*" },
  { label: "Root", query: "$" },
];

const CHEATSHEET: [string, string][] = [
  ["$", "Root element"],
  [".", "Child operator"],
  ["..", "Recursive descent"],
  ["*", "Wildcard — all elements"],
  ["[n]", "Array index (0-based)"],
  ["[-1:]", "Last element"],
  ["[0:3]", "Slice (items 0, 1, 2)"],
  ["[*]", "All array items"],
  ["[?(@.key)]", "Filter — key exists"],
  ["[?(@.n > 10)]", "Filter — numeric comparison"],
  ["[?(@.s == 'x')]", "Filter — string match"],
  ["[?(!@.key)]", "Filter — key absent"],
];

type QueryResult =
  | { status: "idle" }
  | { status: "json_error"; message: string }
  | { status: "query_error"; message: string }
  | { status: "ok"; output: string; count: number };

type Props = {
  input: string;
  query: string;
  onQueryChangeAction: (q: string) => void;
};

export function QueryTab({ input, query, onQueryChangeAction }: Props) {
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
      return {
        status: "query_error",
        message: e instanceof Error ? e.message : "Invalid JSONPath query",
      };
    }
  }, [input, query]);

  const outputValue = result.status === "ok" ? result.output : "";

  const resultLabel =
    result.status === "ok" ? (
      <span className="flex items-center gap-2">
        Result
        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-mono text-[11px]">
          {result.count} {result.count === 1 ? "match" : "matches"}
        </span>
      </span>
    ) : (
      "Result"
    );

  return (
    <div className="space-y-4">
      <InputField
        label="JSONPath Query"
        value={query}
        onChange={(e) => onQueryChangeAction(e.target.value)}
        placeholder="$.store.book[*].author"
        showCopy
        spellCheck={false}
      />

      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium">Quick examples</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map(({ label, query: q }) => (
            <Button
              key={q}
              variant={q === query ? "default" : "outline"}
              size="sm"
              onClick={() => onQueryChangeAction(q)}
              title={q}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {result.status === "json_error" && (
        <ErrorAlert message={`Invalid JSON — ${result.message}`} />
      )}
      {result.status === "query_error" && (
        <ErrorAlert message={`Invalid JSONPath — ${result.message}`} />
      )}

      <TextareaGroup
        label={resultLabel}
        value={outputValue}
        readOnly
        placeholder="Query results will appear here..."
        action={<CopyButton iconOnly textToCopy={outputValue} disabled={!outputValue} />}
      />

      <Card className="mx-auto w-full">
        <CardContent>
          <Collapsible className="data-[state=open]:bg-muted rounded-md">
            <CollapsibleTrigger>
              <Button variant="ghost" className="group w-full">
                JSONPath Syntax Reference
                <CaretDownIcon
                  weight="bold"
                  className="ml-auto group-data-[state=open]:rotate-180"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 grid gap-3 text-xs md:grid-cols-2 lg:grid-cols-3">
                {CHEATSHEET.map(([syntax, desc]) => (
                  <div key={syntax} className="bg-muted/50 rounded-lg p-3">
                    <code className="text-primary font-mono font-semibold">{syntax}</code>
                    <p className="text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
