export type StageType = "$match" | "$group" | "$sort" | "$project" | "$limit" | "$lookup";

export interface Stage {
  id: string;
  type: StageType;
  value: string;
}

export const STAGE_DEFAULTS: Record<StageType, string> = {
  $match: `{
  "status": "active"
}`,
  $group: `{
  "_id": "$userId",
  "total": { "$sum": 1 },
  "avgScore": { "$avg": "$score" }
}`,
  $sort: `{
  "createdAt": -1
}`,
  $project: `{
  "_id": 0,
  "name": 1,
  "email": 1
}`,
  $limit: `10`,
  $lookup: `{
  "from": "orders",
  "localField": "_id",
  "foreignField": "userId",
  "as": "orders"
}`,
};

export const STAGE_DESCRIPTIONS: Record<StageType, string> = {
  $match: "Filter documents",
  $group: "Group & accumulate",
  $sort: "Sort documents",
  $project: "Shape the output",
  $limit: "Limit document count",
  $lookup: "Join a collection",
};

export const ALL_STAGES: StageType[] = [
  "$match",
  "$group",
  "$sort",
  "$project",
  "$limit",
  "$lookup",
];

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function tryParseJSON(raw: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false };
  }
}
