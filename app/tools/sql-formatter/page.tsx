"use client";

import { Check, Copy, Table } from "lucide-react";
import { format } from "sql-formatter";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type SqlDialect =
  | "sql"
  | "mysql"
  | "postgresql"
  | "sqlite"
  | "bigquery"
  | "transactsql";

const DIALECTS: { id: SqlDialect; label: string }[] = [
  { id: "sql", label: "Standard SQL" },
  { id: "mysql", label: "MySQL" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "sqlite", label: "SQLite" },
  { id: "bigquery", label: "BigQuery" },
  { id: "transactsql", label: "T-SQL (MSSQL)" },
];

const PLACEHOLDER = `SELECT u.id, u.name, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' GROUP BY u.id, u.name HAVING COUNT(o.id) > 5 ORDER BY total_spent DESC LIMIT 20;`;

export default function SqlFormatterPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const { copied, copy } = useCopyToClipboard();

  const result = useMemo<{ ok: true; output: string } | { ok: false; error: string }>(() => {
    if (!input.trim()) return { ok: true, output: "" };
    try {
      const output = format(input, { language: dialect, keywordCase: "upper", tabWidth: 2 });
      return { ok: true, output };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Failed to format SQL" };
    }
  }, [input, dialect]);

  return (
    <ToolLayout
      icon={Table}
      title="SQL Query"
      highlight="Formatter"
      description="Prettify and format raw SQL queries with proper indentation and capitalized keywords."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>SQL Dialect</Label>
            <Select
              value={dialect}
              onValueChange={(v) => setDialect(v as SqlDialect)}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIALECTS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Raw SQL</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your unformatted SQL here..."
              rows={20}
            />
          </div>
        </div>

        {/* Right — Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Formatted SQL</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => result.ok && copy(result.output)}
              disabled={!result.ok || !result.output}
              className="rounded-full font-semibold"
            >
              {copied ? (
                <>
                  <Check size={12} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </Button>
          </div>

          {!result.ok ? (
            <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
              <p className="font-mono">{result.error}</p>
            </div>
          ) : (
            <Textarea readOnly value={result.output} rows={20} />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
