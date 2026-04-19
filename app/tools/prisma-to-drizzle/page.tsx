"use client";

import { ArrowRightLeft } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

type Dialect = "postgres" | "sqlite";

interface ParsedField {
  name: string;
  prismaType: string;
  isOptional: boolean;
  isList: boolean;
  isId: boolean;
  isUnique: boolean;
  isUpdatedAt: boolean;
  defaultValue: string | null;
  isRelation: boolean;
}

interface ParsedModel {
  name: string;
  fields: ParsedField[];
}

// ---------------------------------------------------------------------------
// Type maps
// ---------------------------------------------------------------------------

const PG_TYPE_MAP: Record<string, string> = {
  String: "text",
  Int: "integer",
  BigInt: "bigint",
  Float: "doublePrecision",
  Decimal: "decimal",
  Boolean: "boolean",
  DateTime: "timestamp",
  Json: "jsonb",
  Bytes: "bytea",
};

const SQLITE_TYPE_MAP: Record<string, string> = {
  String: "text",
  Int: "integer",
  BigInt: "integer",
  Float: "real",
  Decimal: "real",
  Boolean: "integer",
  DateTime: "text",
  Json: "text",
  Bytes: "blob",
};

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

function parseField(line: string): ParsedField | null {
  const trimmed = line.trim();
  // Skip blank lines, comments, and model-level attributes
  if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) return null;

  // e.g.  id        Int      @id @default(autoincrement())
  //       email     String   @unique
  //       posts     Post[]
  //       profile   Profile?
  const match = trimmed.match(/^(\w+)\s+(\w+)(\?)?(\[\])?\s*(.*)?$/);
  if (!match) return null;

  const [, name, prismaType, optionalMark, listMark, rest = ""] = match;

  const isRelation =
    // If the type starts with uppercase and is NOT a known scalar, treat it as a relation
    /^[A-Z]/.test(prismaType) && !Object.keys(PG_TYPE_MAP).includes(prismaType);

  const defaultMatch = rest.match(/@default\(([^)]+)\)/);

  return {
    name,
    prismaType,
    isOptional: !!optionalMark,
    isList: !!listMark,
    isId: rest.includes("@id"),
    isUnique: rest.includes("@unique"),
    isUpdatedAt: rest.includes("@updatedAt"),
    defaultValue: defaultMatch ? defaultMatch[1] : null,
    isRelation,
  };
}

function parseModels(schema: string): ParsedModel[] {
  const models: ParsedModel[] = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]*)\}/g;
  let match;
  while ((match = modelRegex.exec(schema)) !== null) {
    const name = match[1];
    const body = match[2];
    const fields = body
      .split("\n")
      .map(parseField)
      .filter((f): f is ParsedField => f !== null);
    models.push({ name, fields });
  }
  return models;
}

// ---------------------------------------------------------------------------
// Code generator
// ---------------------------------------------------------------------------

function toCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function toSnakeCase(s: string): string {
  return s.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
}

function mapDefaultValue(raw: string, drizzleType: string, dialect: Dialect): string {
  const v = raw.trim();
  if (v === "autoincrement()") return dialect === "postgres" ? "" : "";
  if (v === "now()") return `.default(sql\`now()\`)`;
  if (v === "cuid()" || v === "uuid()") return dialect === "postgres" ? ".default(sql`gen_random_uuid()`)" : "";
  if (v === "true") return ".default(true)";
  if (v === "false") return ".default(false)";
  if (/^\d+$/.test(v)) return `.default(${v})`;
  return `.default("${v}")`;
}

function fieldToColumn(field: ParsedField, dialect: Dialect): string | null {
  // Relation fields become a comment — they need a separate FK column
  if (field.isList) {
    return `  // ${field.name}: ${field.prismaType}[] — relation, define FK separately`;
  }
  if (field.isRelation) {
    return `  // ${field.name}: ${field.prismaType} — relation, define FK separately`;
  }

  const typeMap = dialect === "postgres" ? PG_TYPE_MAP : SQLITE_TYPE_MAP;
  const rawDrizzleType = typeMap[field.prismaType];
  if (!rawDrizzleType) {
    return `  // ${field.name}: unknown Prisma type "${field.prismaType}"`;
  }

  // Use serial/autoincrement shorthand for @id Int on PG
  const usesAutoIncrement =
    field.isId &&
    (field.prismaType === "Int" || field.prismaType === "BigInt") &&
    dialect === "postgres";

  const effectiveType = usesAutoIncrement
    ? field.prismaType === "BigInt"
      ? "bigserial"
      : "serial"
    : rawDrizzleType;

  const col = field.name;
  let def = `  ${col}: ${effectiveType}("${col}")`;

  if (field.isId) def += ".primaryKey()";
  if (field.isUnique && !field.isId) def += ".unique()";

  if (field.isOptional) {
    // Drizzle columns are NOT NULL by default; optional means nullable
    def += ".$type<string | null>()";
  } else if (!field.isId && !usesAutoIncrement) {
    def += ".notNull()";
  }

  // Default values (skip autoincrement — handled by serial type)
  if (field.defaultValue && field.defaultValue !== "autoincrement()") {
    def += mapDefaultValue(field.defaultValue, rawDrizzleType, dialect);
  }

  if (field.isUpdatedAt) {
    def += `.$onUpdateFn(() => new Date())`;
  }

  return def;
}

function generateDrizzle(models: ParsedModel[], dialect: Dialect): string {
  if (models.length === 0) return "";

  const tableFn = dialect === "postgres" ? "pgTable" : "sqliteTable";
  const corePackage =
    dialect === "postgres" ? "drizzle-orm/pg-core" : "drizzle-orm/sqlite-core";

  // Collect only the column types actually used
  const usedTypes = new Set<string>();
  for (const model of models) {
    for (const field of model.fields) {
      if (field.isList || field.isRelation) continue;
      const typeMap = dialect === "postgres" ? PG_TYPE_MAP : SQLITE_TYPE_MAP;
      if (field.isId && dialect === "postgres") {
        usedTypes.add(
          field.prismaType === "BigInt" ? "bigserial" : "serial",
        );
        continue;
      }
      const t = typeMap[field.prismaType];
      if (t) usedTypes.add(t);
    }
  }

  const lines: string[] = [];
  lines.push(
    `import { ${tableFn}, ${[...usedTypes].sort().join(", ")}, sql } from "${corePackage}";`,
  );
  lines.push("");

  for (const model of models) {
    const tableName = toSnakeCase(model.name) + "s"; // naive pluralisation
    const constName = toCamelCase(model.name) + "Table";

    const columnDefs = model.fields
      .map((f) => fieldToColumn(f, dialect))
      .filter((line): line is string => line !== null);

    lines.push(`export const ${constName} = ${tableFn}("${tableName}", {`);
    lines.push(...columnDefs.map((d) => `${d},`));
    lines.push("});");
    lines.push(
      `export type ${model.name} = typeof ${constName}.$inferSelect;`,
    );
    lines.push(
      `export type New${model.name} = typeof ${constName}.$inferInsert;`,
    );
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SAMPLE = `model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}`;

export default function PrismaToDrizzlePage() {
  const [input, setInput] = useState(SAMPLE);
  const [dialect, setDialect] = useState<Dialect>("postgres");

  const drizzleCode = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    const models = parseModels(trimmed);
    return generateDrizzle(models, dialect);
  }, [input, dialect]);

  const dialectOptions = [
    { value: "postgres", label: "PostgreSQL (pgTable)" },
    { value: "sqlite", label: "SQLite (sqliteTable)" },
  ];

  return (
    <ToolLayout
      icon={ArrowRightLeft}
      title="Prisma to"
      highlight="Drizzle"
      description="Migrate your schema.prisma models directly into Drizzle ORM syntax."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: input */}
        <div className="space-y-4">
          <SelectField
            label="Target Dialect"
            value={dialect}
            onValueChange={(v) => setDialect(v as Dialect)}
            options={dialectOptions}
          />
          <TextAreaField
            label="Prisma Schema Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your schema.prisma models here..."
            rows={20}
            action={<ClearButton onClick={() => setInput("")} disabled={!input} />}
          />
        </div>

        {/* Right: output */}
        <TextAreaField
          label="Drizzle ORM Schema"
          value={drizzleCode}
          readOnly
          rows={24}
          placeholder="Generated Drizzle schema will appear here..."
          action={<CopyButton value={drizzleCode} disabled={!drizzleCode} />}
        />
      </div>

      {/* Reference */}
      <div className="mt-8 border-t pt-8">
        <h3 className="mb-4 text-sm font-semibold">Type Mapping Reference</h3>
        <div className="grid gap-3 text-xs md:grid-cols-2 lg:grid-cols-3">
          {[
            ["String", "text", "text"],
            ["Int", "serial / integer", "integer"],
            ["BigInt", "bigserial / bigint", "integer"],
            ["Float", "doublePrecision", "real"],
            ["Decimal", "decimal", "real"],
            ["Boolean", "boolean", "integer (0/1)"],
            ["DateTime", "timestamp", "text (ISO 8601)"],
            ["Json", "jsonb", "text"],
            ["Bytes", "bytea", "blob"],
          ].map(([prisma, pg, sqlite]) => (
            <div key={prisma} className="rounded-lg bg-muted/50 p-3 font-mono">
              <span className="text-primary">{prisma}</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>{dialect === "postgres" ? pg : sqlite}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
