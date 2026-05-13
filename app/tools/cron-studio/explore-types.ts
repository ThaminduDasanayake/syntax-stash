export type Range = "24h" | "7d" | "30d";

export type CronParsed = { ok: true; human: string; dates: Date[] } | { ok: false; error: string };
