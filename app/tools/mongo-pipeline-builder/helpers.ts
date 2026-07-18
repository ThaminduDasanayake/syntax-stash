export type StageType = "$match" | "$group" | "$sort" | "$project" | "$limit" | "$lookup";

export interface Stage {
  id: string;
  type: StageType;
  value: string;
}

export const STAGE_DEFAULTS: Record<StageType, string> = {
  $group: `{
  "_id": "$userId",
  "total": { "$sum": 1 },
  "avgScore": { "$avg": "$score" }
}`,
  $limit: `10`,
  $lookup: `{
  "from": "orders",
  "localField": "_id",
  "foreignField": "userId",
  "as": "orders"
}`,
  $match: `{
  "status": "active"
}`,
  $project: `{
  "_id": 0,
  "name": 1,
  "email": 1
}`,
  $sort: `{
  "createdAt": -1
}`,
};

export const STAGE_DESCRIPTIONS: Record<StageType, string> = {
  $group: "Group & accumulate",
  $limit: "Limit document count",
  $lookup: "Join a collection",
  $match: "Filter documents",
  $project: "Shape the output",
  $sort: "Sort documents",
};

export const ALL_STAGES: StageType[] = [
  "$group",
  "$limit",
  "$lookup",
  "$match",
  "$project",
  "$sort",
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
