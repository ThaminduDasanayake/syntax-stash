"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { PRISMA_SAMPLE } from "@/app/tools/drizzle-schema-studio/constants";
import {
  generatePrismaDrizzle,
  parsePrismaModels,
} from "@/app/tools/drizzle-schema-studio/helpers";
import { PrismaDialect } from "@/app/tools/drizzle-schema-studio/types";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";

const dialectOptions = [
  { value: "postgres", label: "PostgreSQL (pgTable)" },
  { value: "sqlite", label: "SQLite (sqliteTable)" },
];

export function PrismaToDrizzle() {
  const [prismaInput, setPrismaInput] = useState(PRISMA_SAMPLE);
  const [prismaDialect, setPrismaDialect] = useState<PrismaDialect>("postgres");

  const prismaOutput = useMemo(() => {
    if (!prismaInput.trim()) return "";
    const models = parsePrismaModels(prismaInput);
    return generatePrismaDrizzle(models, prismaDialect);
  }, [prismaInput, prismaDialect]);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
      <div className="space-y-4">
        <SelectField
          label="Target Dialect"
          value={prismaDialect}
          containerClassName="max-w-xs"
          onValueChange={(v) => setPrismaDialect(v as PrismaDialect)}
          options={dialectOptions}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <TextareaGroup
            label="Prisma Schema Input"
            value={prismaInput}
            onChange={(e) => setPrismaInput(e.target.value)}
            placeholder="Paste your schema.prisma models here..."
            containerClassName="flex-1 min-h-[450px]"
            className="h-full"
            action={
              <ClearButton size="sm" onClick={() => setPrismaInput("")} disabled={!prismaInput} />
            }
          />
          <TextareaGroup
            label="Drizzle ORM Schema"
            value={prismaOutput}
            readOnly
            containerClassName="flex-1 min-h-[450px]"
            placeholder="Generated Drizzle schema will appear here..."
            action={<CopyButton iconOnly textToCopy={prismaOutput} disabled={!prismaOutput} />}
          />
        </div>
      </div>

      <div className="flex flex-col">
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
            <div key={prisma} className="bg-card flex items-center gap-2 border p-3 font-mono">
              <span className="text-primary">{prisma}</span>
              <span>
                <ArrowRightIcon />
              </span>
              <span>{prismaDialect === "postgres" ? pg : sqlite}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
