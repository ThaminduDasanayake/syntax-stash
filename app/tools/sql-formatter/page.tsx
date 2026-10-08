"use client";

import { useMemo, useState } from "react";
import { format } from "sql-formatter";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

type SqlDialect = "sql" | "mysql" | "postgresql" | "sqlite" | "bigquery" | "transactsql";

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { label: "BigQuery", value: "bigquery" },
  { label: "MySQL", value: "mysql" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "SQLite", value: "sqlite" },
  { label: "Standard SQL", value: "sql" },
  { label: "T-SQL (MSSQL)", value: "transactsql" },
];

const PLACEHOLDER =
  "SELECT u.id, u.name, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' GROUP BY u.id, u.name HAVING COUNT(o.id) > 5 ORDER BY total_spent DESC LIMIT 20;";

export default function SqlFormatterPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [dialect, setDialect] = useState<SqlDialect>("sql");

  const { error, output } = useMemo(() => {
    if (!input.trim()) {
      return { error: null, output: "" };
    }
    try {
      const result = format(input, { keywordCase: "upper", language: dialect, tabWidth: 2 });
      return { error: null, output: result };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Failed to format SQL",
        output: "",
      };
    }
  }, [dialect, input]);

  const tool = internalTools.find((t) => t.slug === "sql-formatter");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-4">
        <div className="grid shrink-0 grid-cols-1 gap-8 lg:grid-cols-2">
          <SelectField
            label="SQL Dialect"
            value={dialect}
            onValueChange={(v) => setDialect(v as SqlDialect)}
            options={DIALECTS}
          />
        </div>

        {/* Editor Grid */}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <TextareaGroup
            label="Raw SQL"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your unformatted SQL here..."
            action={
              <ClearButton
                size="sm"
                onClick={() => {
                  setInput("");
                }}
                disabled={!input}
              />
            }
          />

          {/* Right — Output */}
          <div className="space-y-4">
            {error && <ErrorAlert message={error} />}

            <TextareaGroup
              label="Formatted SQL"
              readOnly
              value={output}
              placeholder={!input ? "Paste unformatted SQL on the left to format SQL" : ""}
              action={<CopyButton iconOnly textToCopy={output} disabled={!!error || !output} />}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
