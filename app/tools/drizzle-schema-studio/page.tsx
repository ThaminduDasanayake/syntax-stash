"use client";

import { Database } from "lucide-react";
import { useMemo, useState } from "react";

import { PRISMA_SAMPLE, SQL_SAMPLE } from "@/app/tools/drizzle-schema-studio/constants";
import {
  generatePrismaDrizzle,
  generateSQLDrizzle,
  parsePrismaModels,
  parseSQLTables,
} from "@/app/tools/drizzle-schema-studio/helpers";
import { Mode, PrismaDialect, SQLDialect } from "@/app/tools/drizzle-schema-studio/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

export default function DrizzleSchemaStudioPage() {
  const [mode, setMode] = useState<Mode>("sql");

  const [sqlInput, setSqlInput] = useState(SQL_SAMPLE);
  const [sqlDialect, setSqlDialect] = useState<SQLDialect>("postgres");

  const [prismaInput, setPrismaInput] = useState(PRISMA_SAMPLE);
  const [prismaDialect, setPrismaDialect] = useState<PrismaDialect>("postgres");

  const sqlOutput = useMemo(() => {
    if (!sqlInput.trim()) return "";
    const tables = parseSQLTables(sqlInput);
    return generateSQLDrizzle(tables, sqlDialect);
  }, [sqlInput, sqlDialect]);

  const prismaOutput = useMemo(() => {
    if (!prismaInput.trim()) return "";
    const models = parsePrismaModels(prismaInput);
    return generatePrismaDrizzle(models, prismaDialect);
  }, [prismaInput, prismaDialect]);

  const sqlDialectOptions = [
    { value: "postgres", label: "PostgreSQL (pgTable)" },
    { value: "mysql", label: "MySQL (mysqlTable)" },
  ];

  const prismaDialectOptions = [
    { value: "postgres", label: "PostgreSQL (pgTable)" },
    { value: "sqlite", label: "SQLite (sqliteTable)" },
  ];

  return (
    <ToolLayout
      icon={Database}
      title="Drizzle Schema"
      highlight="Studio"
      description="Convert SQL CREATE TABLE statements or Prisma schema models into Drizzle ORM schemas."
    >
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="flex w-full flex-col">
        <TabsList className="mb-6 grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="sql" className="tab-trigger">
            SQL → Drizzle
          </TabsTrigger>
          <TabsTrigger value="prisma" className="tab-trigger">
            Prisma → Drizzle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sql">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <SelectField
                label="Database Dialect"
                value={sqlDialect}
                onValueChange={(v) => setSqlDialect(v as SQLDialect)}
                options={sqlDialectOptions}
              />
              <TextAreaField
                label="SQL CREATE TABLE Statements"
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                placeholder="Paste your SQL CREATE TABLE statements here..."
                rows={20}
                action={<ClearButton onClick={() => setSqlInput("")} disabled={!sqlInput} />}
              />
            </div>
            <TextAreaField
              label="Drizzle ORM Schema"
              value={sqlOutput}
              readOnly
              rows={24}
              placeholder="Your Drizzle schema will appear here..."
              action={<CopyButton value={sqlOutput} disabled={!sqlOutput} />}
            />
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="mb-4 text-sm font-semibold">Supported Features</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                [
                  "Data Types",
                  "SERIAL, INT, VARCHAR, TEXT, TIMESTAMP, BOOLEAN, UUID, JSON, and more",
                ],
                ["Constraints", "PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT"],
                ["Dialects", "PostgreSQL (pgTable) and MySQL (mysqlTable)"],
                ["Multiple Tables", "Convert multiple CREATE TABLE statements at once"],
                ["REFERENCES", "Foreign key references are noted in comments"],
                ["Clean Output", "Production-ready TypeScript with correct imports"],
              ].map(([title, desc]) => (
                <div key={title} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium">{title}</p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── Prisma Tab ── */}
        <TabsContent value="prisma">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <SelectField
                label="Target Dialect"
                value={prismaDialect}
                onValueChange={(v) => setPrismaDialect(v as PrismaDialect)}
                options={prismaDialectOptions}
              />
              <TextAreaField
                label="Prisma Schema Input"
                value={prismaInput}
                onChange={(e) => setPrismaInput(e.target.value)}
                placeholder="Paste your schema.prisma models here..."
                rows={20}
                action={<ClearButton onClick={() => setPrismaInput("")} disabled={!prismaInput} />}
              />
            </div>
            <TextAreaField
              label="Drizzle ORM Schema"
              value={prismaOutput}
              readOnly
              rows={24}
              placeholder="Generated Drizzle schema will appear here..."
              action={<CopyButton value={prismaOutput} disabled={!prismaOutput} />}
            />
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="mb-4 text-sm font-semibold">Type Mapping Reference</h3>
            <div className="grid gap-3 text-xs md:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["String", "text", "text"],
                  ["Int", "serial / integer", "integer"],
                  ["BigInt", "bigserial / bigint", "integer"],
                  ["Float", "doublePrecision", "real"],
                  ["Decimal", "decimal", "real"],
                  ["Boolean", "boolean", "integer (0/1)"],
                  ["DateTime", "timestamp", "text (ISO 8601)"],
                  ["Json", "jsonb", "text"],
                  ["Bytes", "bytea", "blob"],
                ] as [string, string, string][]
              ).map(([prisma, pg, sqlite]) => (
                <div key={prisma} className="bg-muted/50 rounded-lg p-3 font-mono">
                  <span className="text-primary">{prisma}</span>
                  <span className="text-muted-foreground mx-2">→</span>
                  <span>{prismaDialect === "postgres" ? pg : sqlite}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
