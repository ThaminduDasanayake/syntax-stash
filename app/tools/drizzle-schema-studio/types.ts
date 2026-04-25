export type SQLDialect = "postgres" | "mysql";
export type PrismaDialect = "postgres" | "sqlite";

export interface SQLColumn {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue?: string;
  references?: string;
}

export interface SQLTable {
  name: string;
  columns: SQLColumn[];
}

export interface PrismaField {
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

export interface PrismaModel {
  name: string;
  fields: PrismaField[];
}

export type Mode = "sql" | "prisma";
