"use client";

import { Table } from "lucide-react";
import { useEffect, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

type SqlDialect = "sql" | "mysql" | "postgresql" | "sqlite" | "bigquery" | "transactsql";

const DIALECTS: { id: SqlDialect; label: string }[] = [
  { id: "sql", label: "Standard SQL" },
  { id: "mysql", label: "MySQL" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "sqlite", label: "SQLite" },
  { id: "bigquery", label: "BigQuery" },
  { id: "transactsql", label: "T-SQL (MSSQL)" },
];

const PLACEHOLDER =
  "SELECT u.id, u.name, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' GROUP BY u.id, u.name HAVING COUNT(o.id) > 5 ORDER BY total_spent DESC LIMIT 20;";

export default function SqlFormatterPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [dialect, setDialect] = useState<SqlDialect>("sql");

  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    let isMounted = true;

    import("sql-formatter")
      .then(({ format }) => {
        if (!isMounted) return;
        try {
          const result = format(input, { language: dialect, keywordCase: "upper", tabWidth: 2 });
          setOutput(result);
          setError(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to format SQL");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load SQL formatter module.");
      });

    return () => {
      isMounted = false;
    };
  }, [input, dialect]);

  return (
    <ToolLayout
      icon={Table}
      title="SQL Query"
      highlight="Formatter"
      description="Prettify and format raw SQL queries with proper indentation and capitalized keywords."
    >
      <div className="mb-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SelectField
          label="SQL Dialect"
          value={dialect}
          onValueChange={(v) => setDialect(v as SqlDialect)}
          options={DIALECTS.map((d) => ({ value: d.id, label: d.label }))}
        />
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Input */}
        <TextAreaField
          label="Raw SQL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your unformatted SQL here..."
          rows={20}
          action={
            <ClearButton
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

          <TextAreaField
            label="Formatted SQL"
            readOnly
            value={output}
            rows={20}
            placeholder={!input ? "Paste unformatted SQL on the left to format SQL" : ""}
            action={<CopyButton value={output} disabled={!!error || !output} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
