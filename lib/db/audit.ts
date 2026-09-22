import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";

export interface FieldDiff {
  field: string;
  label: string;
  newValue: unknown;
  oldValue: unknown;
}

export interface LogActivityParams {
  action: "approved" | "created" | "deleted" | "rejected" | "updated";
  actorEmail?: null | string;
  diff?: FieldDiff[] | null;
  entityId?: null | string;
  entityTitle: string;
  entityType: "author" | "category" | "resource" | "submission" | "tag";
  metadata?: null | Record<string, unknown>;
}

/**
 * Computes meaningful field-level differences between an old and new record.
 */
export function computeDiffs(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  labels?: Record<string, string>,
): FieldDiff[] {
  const diffs: FieldDiff[] = [];
  const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of keys) {
    if (
      key === "id" ||
      key === "createdAt" ||
      key === "updatedAt" ||
      key === "reviewedAt" ||
      key === "userId"
    ) {
      continue;
    }

    const valA = oldObj[key];
    const valB = newObj[key];

    // If newObj doesn't specify this key at all (e.g. partial update where key was omitted), skip
    if (valB === undefined && !(key in newObj)) {
      continue;
    }

    const normA =
      valA === null || valA === undefined ? "" : typeof valA === "string" ? valA.trim() : valA;
    const normB =
      valB === null || valB === undefined ? "" : typeof valB === "string" ? valB.trim() : valB;

    if (normA !== normB) {
      diffs.push({
        field: key,
        label: labels?.[key] || key,
        newValue: valB,
        oldValue: valA,
      });
    }
  }

  return diffs;
}

/**
 * Non-blocking helper to log an administrative action to the activity_log table.
 */
export async function logActivity({
  action,
  actorEmail,
  diff,
  entityId,
  entityTitle,
  entityType,
  metadata,
}: LogActivityParams): Promise<void> {
  try {
    const id = `act_${crypto.randomUUID()}`;
    await db.insert(activityLog).values({
      id,
      action,
      actorEmail: actorEmail || null,
      createdAt: new Date(),
      diff: diff && diff.length > 0 ? JSON.stringify(diff) : null,
      entityId: entityId || null,
      entityTitle,
      entityType,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  } catch (error) {
    console.error(
      `[ActivityLog] Failed to record activity for ${entityType} "${entityTitle}":`,
      error,
    );
  }
}
