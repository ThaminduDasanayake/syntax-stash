"use client";

import { Database } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

type Dialect = "postgres" | "mysql";

interface Column {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue?: string;
  references?: string;
}

interface Table {
  name: string;
  columns: Column[];
}

export default function SQLToDrizzlePage() {
  const [input, setInput] = useState(`CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);

  const [dialect, setDialect] = useState<Dialect>("postgres");

  const drizzleCode = useMemo<string>(() => {
    if (!input.trim()) return "";

    const tables = parseSQLTables(input);
    if (tables.length === 0) return "";

    const lines: string[] = [];
    const tableFunction = dialect === "postgres" ? "pgTable" : "mysqlTable";

    lines.push(`import { ${tableFunction}, serial, varchar, text, timestamp, boolean, int, bigint } from 'drizzle-orm/${dialect === "postgres" ? "pg-core" : "mysql-core"}';\n`);

    tables.forEach((table, idx) => {
      lines.push(`export const ${table.name} = ${tableFunction}('${table.name}', {`);

      table.columns.forEach((col, colIdx) => {
        const drizzleType = mapSQLTypeToDrizzle(col.type, dialect);
        let fieldDef = `  ${col.name}: ${drizzleType}('${col.name}')`;

        // Add constraints
        if (col.primaryKey) fieldDef += ".primaryKey()";
        if (col.notNull && !col.primaryKey) fieldDef += ".notNull()";
        if (col.unique) fieldDef += ".unique()";
        if (col.defaultValue) {
          fieldDef += `.default(${formatDefaultValue(col.defaultValue)})`;
        }

        fieldDef += colIdx === table.columns.length - 1 ? "" : ",";
        lines.push(fieldDef);
      });

      lines.push(`});`);
      if (idx < tables.length - 1) lines.push("");
    });

    return lines.join("\n");
  }, [input, dialect]);

  function parseSQLTables(sql: string): Table[] {
    const tables: Table[] = [];
    const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)["`]?\s*\(([\s\S]*?)\);/gi;

    let match;
    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      const columnsStr = match[2];

      const columns = parseColumns(columnsStr);
      tables.push({ name: tableName, columns });
    }

    return tables;
  }

  function parseColumns(columnsStr: string): Column[] {
    const columns: Column[] = [];
    const lines = columnsStr.split(",");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("PRIMARY KEY") || trimmed.startsWith("FOREIGN KEY")) {
        continue;
      }

      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) continue;

      const name = parts[0].replace(/["`]/g, "");
      let type = parts[1].toUpperCase();

      // Extract size for VARCHAR
      const sizeMatch = trimmed.match(/VARCHAR\((\d+)\)/i);
      if (sizeMatch) {
        type = `VARCHAR(${sizeMatch[1]})`;
      }

      const column: Column = {
        name,
        type,
        notNull: /NOT\s+NULL/i.test(trimmed),
        primaryKey: /PRIMARY\s+KEY/i.test(trimmed),
        unique: /UNIQUE/i.test(trimmed),
      };

      // Extract DEFAULT value
      const defaultMatch = trimmed.match(/DEFAULT\s+([^\s,]+)/i);
      if (defaultMatch) {
        column.defaultValue = defaultMatch[1];
      }

      // Extract REFERENCES
      const refMatch = trimmed.match(/REFERENCES\s+(\w+)\((\w+)\)/i);
      if (refMatch) {
        column.references = `${refMatch[1]}.${refMatch[2]}`;
      }

      columns.push(column);
    }

    return columns;
  }

  function mapSQLTypeToDrizzle(sqlType: string, dialect: Dialect): string {
    const type = sqlType.toUpperCase();

    // Handle VARCHAR with size
    if (type.startsWith("VARCHAR")) {
      const sizeMatch = sqlType.match(/VARCHAR\((\d+)\)/i);
      if (sizeMatch) return `varchar('${sizeMatch[1]}')`;
      return `varchar()`;
    }

    const typeMap: Record<string, Record<Dialect, string>> = {
      SERIAL: { postgres: "serial", mysql: "int" },
      BIGSERIAL: { postgres: "bigserial", mysql: "bigint" },
      INT: { postgres: "int", mysql: "int" },
      INTEGER: { postgres: "integer", mysql: "int" },
      BIGINT: { postgres: "bigint", mysql: "bigint" },
      SMALLINT: { postgres: "smallint", mysql: "smallint" },
      TEXT: { postgres: "text", mysql: "text" },
      BOOLEAN: { postgres: "boolean", mysql: "boolean" },
      TIMESTAMP: { postgres: "timestamp", mysql: "timestamp" },
      TIMESTAMPTZ: { postgres: "timestamp", mysql: "timestamp" },
      DATE: { postgres: "date", mysql: "date" },
      TIME: { postgres: "time", mysql: "time" },
      DECIMAL: { postgres: "decimal", mysql: "decimal" },
      NUMERIC: { postgres: "numeric", mysql: "decimal" },
      FLOAT: { postgres: "real", mysql: "float" },
      DOUBLE: { postgres: "doublePrecision", mysql: "double" },
      UUID: { postgres: "uuid", mysql: "varchar" },
      JSON: { postgres: "json", mysql: "json" },
      JSONB: { postgres: "jsonb", mysql: "json" },
    };

    return typeMap[type]?.[dialect] || "varchar()";
  }

  function formatDefaultValue(value: string): string {
    const upperValue = value.toUpperCase();
    if (upperValue === "CURRENT_TIMESTAMP") return "sql`CURRENT_TIMESTAMP`";
    if (upperValue === "TRUE") return "true";
    if (upperValue === "FALSE") return "false";
    if (/^\d+$/.test(value)) return value;
    return `'${value}'`;
  }

  const dialectOptions = [
    { value: "postgres", label: "PostgreSQL (pgTable)" },
    { value: "mysql", label: "MySQL (mysqlTable)" },
  ];

  return (
    <ToolLayout
      icon={Database}
      title="SQL to Drizzle"
      highlight="Converter"
      description="Instantly convert PostgreSQL and MySQL CREATE TABLE statements into Drizzle ORM schemas."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-4">
          <SelectField
            label="Database Dialect"
            value={dialect}
            onValueChange={(value) => setDialect(value as Dialect)}
            options={dialectOptions}
          />

          <TextAreaField
            label="SQL CREATE TABLE Statements"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL CREATE TABLE statements here..."
            rows={20}
            action={
              <ClearButton
                onClick={() => setInput("")}
                disabled={!input}
              />
            }
          />
        </div>

        {/* Right: Output */}
        <TextAreaField
          label="Drizzle ORM Schema"
          value={drizzleCode}
          readOnly
          rows={24}
          placeholder="Your Drizzle code will appear here..."
          action={
            <CopyButton
              value={drizzleCode}
              disabled={!drizzleCode}
            />
          }
        />
      </div>

      {/* Features & Reference */}
      <div className="mt-8 border-t pt-8">
        <h3 className="mb-4 text-sm font-semibold">Supported Features</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Data Types</p>
            <p className="text-xs text-muted-foreground">
              SERIAL, INT, VARCHAR, TEXT, TIMESTAMP, BOOLEAN, UUID, JSON, and more
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Constraints</p>
            <p className="text-xs text-muted-foreground">
              PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Dialects</p>
            <p className="text-xs text-muted-foreground">
              PostgreSQL (pgTable) and MySQL (mysqlTable)
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Multiple Tables</p>
            <p className="text-xs text-muted-foreground">
              Convert multiple CREATE TABLE statements at once
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Type Mapping</p>
            <p className="text-xs text-muted-foreground">
              Automatic conversion of SQL types to Drizzle equivalents
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Comments & Format</p>
            <p className="text-xs text-muted-foreground">
              Clean, production-ready TypeScript code
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
