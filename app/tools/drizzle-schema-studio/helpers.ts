import { PG_TYPE_MAP, SQLITE_TYPE_MAP } from "@/app/tools/drizzle-schema-studio/constants";
import {
  PrismaDialect,
  PrismaField,
  PrismaModel,
  SQLColumn,
  SQLDialect,
  SQLTable,
} from "@/app/tools/drizzle-schema-studio/types";

export function parseSQLTables(sql: string): SQLTable[] {
  const tables: SQLTable[] = [];
  const createTableRegex =
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)["`]?\s*\(([\s\S]*?)\);/gi;

  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const columns = parseSQLColumns(match[2]);
    tables.push({ name: match[1], columns });
  }
  return tables;
}

export function parseSQLColumns(columnsStr: string): SQLColumn[] {
  const columns: SQLColumn[] = [];
  for (const line of columnsStr.split(",")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("PRIMARY KEY") || trimmed.startsWith("FOREIGN KEY"))
      continue;

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;

    const name = parts[0].replace(/["`]/g, "");
    let type = parts[1].toUpperCase();
    const sizeMatch = trimmed.match(/VARCHAR\((\d+)\)/i);
    if (sizeMatch) type = `VARCHAR(${sizeMatch[1]})`;

    const column: SQLColumn = {
      name,
      type,
      notNull: /NOT\s+NULL/i.test(trimmed),
      primaryKey: /PRIMARY\s+KEY/i.test(trimmed),
      unique: /UNIQUE/i.test(trimmed),
    };

    const defaultMatch = trimmed.match(/DEFAULT\s+([^\s,]+)/i);
    if (defaultMatch) column.defaultValue = defaultMatch[1];

    const refMatch = trimmed.match(/REFERENCES\s+(\w+)\((\w+)\)/i);
    if (refMatch) column.references = `${refMatch[1]}.${refMatch[2]}`;

    columns.push(column);
  }
  return columns;
}

export function mapSQLType(sqlType: string, dialect: SQLDialect): string {
  const type = sqlType.toUpperCase();
  if (type.startsWith("VARCHAR")) {
    const m = sqlType.match(/VARCHAR\((\d+)\)/i);
    return m ? `varchar({ length: ${m[1]} })` : `varchar()`;
  }
  const map: Record<string, Record<SQLDialect, string>> = {
    SERIAL: { postgres: "serial", mysql: "int" },
    BIGSERIAL: { postgres: "bigserial", mysql: "bigint" },
    INT: { postgres: "integer", mysql: "int" },
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
  return map[type]?.[dialect] ?? "varchar()";
}

export function formatSQLDefault(value: string): string {
  const up = value.toUpperCase();
  if (up === "CURRENT_TIMESTAMP") return "sql`CURRENT_TIMESTAMP`";
  if (up === "TRUE") return "true";
  if (up === "FALSE") return "false";
  if (/^\d+$/.test(value)) return value;
  return `'${value}'`;
}

export function generateSQLDrizzle(tables: SQLTable[], dialect: SQLDialect): string {
  if (tables.length === 0) return "";
  const tableFn = dialect === "postgres" ? "pgTable" : "mysqlTable";
  const pkg = dialect === "postgres" ? "drizzle-orm/pg-core" : "drizzle-orm/mysql-core";

  const usedTypes = new Set<string>();
  tables.forEach((t) =>
    t.columns.forEach((c) =>
      usedTypes.add(
        mapSQLType(c.type, dialect)
          .replace(/\(.*\)/, "")
          .replace(/\{.*}/, ""),
      ),
    ),
  );

  const lines: string[] = [];
  lines.push(`import { ${tableFn}, ${[...usedTypes].sort().join(", ")} } from '${pkg}';`);
  if (
    tables.some((t) => t.columns.some((c) => c.defaultValue?.toUpperCase() === "CURRENT_TIMESTAMP"))
  ) {
    lines[0] = lines[0].replace(`} from`, `, sql } from`);
  }
  lines.push("");

  tables.forEach((table, idx) => {
    lines.push(`export const ${table.name} = ${tableFn}('${table.name}', {`);
    table.columns.forEach((col, ci) => {
      const drizzleType = mapSQLType(col.type, dialect);
      let def = `  ${col.name}: ${drizzleType}('${col.name}')`;
      if (col.primaryKey) def += ".primaryKey()";
      if (col.notNull && !col.primaryKey) def += ".notNull()";
      if (col.unique) def += ".unique()";
      if (col.defaultValue) def += `.default(${formatSQLDefault(col.defaultValue)})`;
      lines.push(def + (ci < table.columns.length - 1 ? "," : ""));
    });
    lines.push(`});`);
    if (idx < tables.length - 1) lines.push("");
  });

  return lines.join("\n");
}

export function parsePrismaField(line: string): PrismaField | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) return null;
  const match = trimmed.match(/^(\w+)\s+(\w+)(\?)?(\[])?\s*(.*)?$/);
  if (!match) return null;
  const [, name, prismaType, optionalMark, listMark, rest = ""] = match;
  const isRelation = /^[A-Z]/.test(prismaType) && !Object.keys(PG_TYPE_MAP).includes(prismaType);
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

export function parsePrismaModels(schema: string): PrismaModel[] {
  const models: PrismaModel[] = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]*)}/g;
  let match;
  while ((match = modelRegex.exec(schema)) !== null) {
    const fields = match[2]
      .split("\n")
      .map(parsePrismaField)
      .filter((f): f is PrismaField => f !== null);
    models.push({ name: match[1], fields });
  }
  return models;
}

export function toCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function toSnakeCase(s: string): string {
  return s
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

export function mapPrismaDefault(
  raw: string,
  _drizzleType: string,
  dialect: PrismaDialect,
): string {
  const v = raw.trim();
  if (v === "autoincrement()") return "";
  if (v === "now()") return `.default(sql\`now()\`)`;
  if (v === "cuid()" || v === "uuid()")
    return dialect === "postgres" ? ".default(sql`gen_random_uuid()`)" : "";
  if (v === "true") return ".default(true)";
  if (v === "false") return ".default(false)";
  if (/^\d+$/.test(v)) return `.default(${v})`;
  return `.default("${v}")`;
}

export function prismaFieldToColumn(field: PrismaField, dialect: PrismaDialect): string | null {
  if (field.isList)
    return `  // ${field.name}: ${field.prismaType}[] — relation, define FK separately`;
  if (field.isRelation)
    return `  // ${field.name}: ${field.prismaType} — relation, define FK separately`;

  const typeMap = dialect === "postgres" ? PG_TYPE_MAP : SQLITE_TYPE_MAP;
  const rawType = typeMap[field.prismaType];
  if (!rawType) return `  // ${field.name}: unknown Prisma type "${field.prismaType}"`;

  const usesSerial =
    field.isId &&
    (field.prismaType === "Int" || field.prismaType === "BigInt") &&
    dialect === "postgres";

  const effectiveType = usesSerial
    ? field.prismaType === "BigInt"
      ? "bigserial"
      : "serial"
    : rawType;

  let def = `  ${field.name}: ${effectiveType}("${field.name}")`;
  if (field.isId) def += ".primaryKey()";
  if (field.isUnique && !field.isId) def += ".unique()";
  if (field.isOptional) {
    def += ".$type<string | null>()";
  } else if (!field.isId && !usesSerial) {
    def += ".notNull()";
  }
  if (field.defaultValue && field.defaultValue !== "autoincrement()") {
    def += mapPrismaDefault(field.defaultValue, rawType, dialect);
  }
  if (field.isUpdatedAt) def += `.$onUpdateFn(() => new Date())`;
  return def;
}

export function generatePrismaDrizzle(models: PrismaModel[], dialect: PrismaDialect): string {
  if (models.length === 0) return "";
  const tableFn = dialect === "postgres" ? "pgTable" : "sqliteTable";
  const pkg = dialect === "postgres" ? "drizzle-orm/pg-core" : "drizzle-orm/sqlite-core";

  const usedTypes = new Set<string>();
  for (const model of models) {
    for (const field of model.fields) {
      if (field.isList || field.isRelation) continue;
      const typeMap = dialect === "postgres" ? PG_TYPE_MAP : SQLITE_TYPE_MAP;
      if (field.isId && dialect === "postgres") {
        usedTypes.add(field.prismaType === "BigInt" ? "bigserial" : "serial");
        continue;
      }
      const t = typeMap[field.prismaType];
      if (t) usedTypes.add(t);
    }
  }

  const lines: string[] = [];
  lines.push(`import { ${tableFn}, ${[...usedTypes].sort().join(", ")}, sql } from "${pkg}";`);
  lines.push("");

  for (const model of models) {
    const tableName = toSnakeCase(model.name) + "s";
    const constName = toCamelCase(model.name) + "Table";
    const columnDefs = model.fields
      .map((f) => prismaFieldToColumn(f, dialect))
      .filter((l): l is string => l !== null);

    lines.push(`export const ${constName} = ${tableFn}("${tableName}", {`);
    lines.push(...columnDefs.map((d) => `${d},`));
    lines.push("});");
    lines.push(`export type ${model.name} = typeof ${constName}.$inferSelect;`);
    lines.push(`export type New${model.name} = typeof ${constName}.$inferInsert;`);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
