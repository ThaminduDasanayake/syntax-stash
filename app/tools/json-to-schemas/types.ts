export type ParseResult =
  | {
      ok: true;
      ts: string;
      zod: string;
      pydantic: string;
    }
  | {
      ok: false;
      error: string;
    };

export type PydanticField = { name: string; type: string };

export type PydanticClass = { name: string; fields: PydanticField[] };

export type TabType = "ts" | "zod" | "pydantic";
