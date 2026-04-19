"use client";

import { Layers, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import CopyButton from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextAreaField } from "@/components/ui/textarea-field";

type StageType = "$match" | "$group" | "$sort" | "$project" | "$limit" | "$lookup";

interface Stage {
  id: string;
  type: StageType;
  value: string;
}

const STAGE_DEFAULTS: Record<StageType, string> = {
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

const STAGE_DESCRIPTIONS: Record<StageType, string> = {
  $match: "Filter documents",
  $group: "Group & accumulate",
  $sort: "Sort documents",
  $project: "Shape the output",
  $limit: "Limit document count",
  $lookup: "Join a collection",
};

const ALL_STAGES: StageType[] = [
  "$match",
  "$group",
  "$sort",
  "$project",
  "$limit",
  "$lookup",
];

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function tryParseJSON(raw: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false };
  }
}

export default function MongoPipelineBuilderPage() {
  const [stages, setStages] = useState<Stage[]>([
    { id: uid(), type: "$match", value: STAGE_DEFAULTS["$match"] },
    { id: uid(), type: "$group", value: STAGE_DEFAULTS["$group"] },
    { id: uid(), type: "$sort", value: STAGE_DEFAULTS["$sort"] },
  ]);

  const addStage = (type: StageType) => {
    setStages((prev) => [
      ...prev,
      { id: uid(), type, value: STAGE_DEFAULTS[type] },
    ]);
  };

  const removeStage = (id: string) => {
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStage = (id: string, value: string) => {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  // Compile result
  const { pipelineJSON, hasErrors } = useMemo(() => {
    if (stages.length === 0)
      return { pipelineJSON: "[]", hasErrors: false };

    const compiled: unknown[] = [];
    let hasErrors = false;

    for (const stage of stages) {
      const parsed = tryParseJSON(stage.value);
      if (parsed.ok) {
        compiled.push({ [stage.type]: parsed.value });
      } else {
        hasErrors = true;
        compiled.push({ [stage.type]: `/* invalid JSON */` });
      }
    }

    return {
      pipelineJSON: JSON.stringify(compiled, null, 2),
      hasErrors,
    };
  }, [stages]);

  const nodeSnippet = useMemo(
    () =>
      `const pipeline = ${pipelineJSON};\n\nconst results = await Model.aggregate(pipeline);`,
    [pipelineJSON],
  );

  const validStageIds = useMemo(
    () =>
      new Set(
        stages
          .filter((s) => tryParseJSON(s.value).ok)
          .map((s) => s.id),
      ),
    [stages],
  );

  return (
    <ToolLayout
      icon={Layers}
      title="Mongo Aggregation"
      highlight="Builder"
      description="Visually scaffold complex MongoDB aggregation pipelines."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Left — visual builder                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Add-stage buttons */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Add a stage
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_STAGES.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-3 font-mono text-xs"
                  onClick={() => addStage(type)}
                >
                  <Plus size={11} />
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Stage cards */}
          {stages.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No stages yet. Add one above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const isValid = validStageIds.has(stage.id);
                return (
                  <Card
                    key={stage.id}
                    className={`transition-colors ${
                      !isValid ? "border-destructive/50" : ""
                    }`}
                  >
                    <CardContent className="space-y-2 p-3">
                      {/* Card header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-sm font-semibold">
                            {stage.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            — {STAGE_DESCRIPTIONS[stage.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isValid && (
                            <span className="text-xs text-destructive">
                              invalid JSON
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeStage(stage.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>

                      {/* Stage JSON editor */}
                      <TextAreaField
                        value={stage.value}
                        onChange={(e) => updateStage(stage.id, e.target.value)}
                        rows={4}
                        className="font-mono text-xs"
                        textClassName="font-mono text-xs"
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right — compiled output                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          <TextAreaField
            label={
              hasErrors ? (
                <span>
                  Pipeline JSON{" "}
                  <span className="text-xs font-normal text-destructive">
                    (some stages have invalid JSON)
                  </span>
                </span>
              ) : (
                "Pipeline JSON"
              )
            }
            value={pipelineJSON}
            readOnly
            rows={16}
            action={
              <CopyButton value={pipelineJSON} disabled={!pipelineJSON} />
            }
          />

          <TextAreaField
            label="Node.js / Mongoose Snippet"
            value={nodeSnippet}
            readOnly
            rows={8}
            action={
              <CopyButton value={nodeSnippet} disabled={!nodeSnippet} />
            }
          />
        </div>
      </div>
    </ToolLayout>
  );
}
