"use client";

import { useMemo, useState } from "react";

import { SQL_SAMPLE } from "@/app/tools/drizzle-schema-studio/constants";
import { generateSQLDrizzle, parseSQLTables } from "@/app/tools/drizzle-schema-studio/helpers";
import { SQLDialect } from "@/app/tools/drizzle-schema-studio/types";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";

const dialectOptions = [
  { value: "postgres", label: "PostgreSQL (pgTable)" },
  { value: "mysql", label: "MySQL (mysqlTable)" },
];

export function SqlToDrizzle() {
  const [sqlInput, setSqlInput] = useState(SQL_SAMPLE);
  const [sqlDialect, setSqlDialect] = useState<SQLDialect>("postgres");

  const sqlOutput = useMemo(() => {
    if (!sqlInput.trim()) return "";
    const tables = parseSQLTables(sqlInput);
    return generateSQLDrizzle(tables, sqlDialect);
  }, [sqlInput, sqlDialect]);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
      <div className="space-y-4">
        <SelectField
          label="Database Dialect"
          value={sqlDialect}
          containerClassName="max-w-xs"
          onValueChange={(v) => setSqlDialect(v as SQLDialect)}
          options={dialectOptions}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <TextareaGroup
            label="SQL CREATE TABLE Statements"
            value={sqlInput}
            containerClassName="flex-1 min-h-[450px]"
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder="Paste your SQL CREATE TABLE statements here..."
            action={<ClearButton size="sm" onClick={() => setSqlInput("")} disabled={!sqlInput} />}
          />
          <TextareaGroup
            label="Drizzle ORM Schema"
            value={sqlOutput}
            readOnly
            containerClassName="flex-1 min-h-[450px]"
            placeholder="Your Drizzle schema will appear here..."
            action={<CopyButton iconOnly textToCopy={sqlOutput} disabled={!sqlOutput} />}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="mb-4 text-sm font-semibold">Supported Features</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Data Types", "SERIAL, INT, VARCHAR, TEXT, TIMESTAMP, BOOLEAN, UUID, JSON, and more"],
            ["Constraints", "PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT"],
            ["Dialects", "PostgreSQL (pgTable) and MySQL (mysqlTable)"],
            ["Multiple Tables", "Convert multiple CREATE TABLE statements at once"],
            ["REFERENCES", "Foreign key references are noted in comments"],
            ["Clean Output", "Production-ready TypeScript with correct imports"],
          ].map(([title, desc]) => (
            <div key={title} className="bg-card rounded-lg border p-3">
              <p className="text-xs font-medium">{title}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
