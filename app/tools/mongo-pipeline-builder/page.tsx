"use client";

import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import {
  ALL_STAGES,
  Stage,
  STAGE_DEFAULTS,
  STAGE_DESCRIPTIONS,
  StageType,
  tryParseJSON,
  uid,
} from "@/app/tools/mongo-pipeline-builder/helpers";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";

export default function MongoPipelineBuilderPage() {
  const [stages, setStages] = useState<Stage[]>([
    { id: uid(), type: "$match", value: STAGE_DEFAULTS["$match"] },
    { id: uid(), type: "$group", value: STAGE_DEFAULTS["$group"] },
    { id: uid(), type: "$sort", value: STAGE_DEFAULTS["$sort"] },
  ]);

  const addStage = (type: StageType) => {
    setStages((prev) => [...prev, { id: uid(), type, value: STAGE_DEFAULTS[type] }]);
  };

  const removeStage = (id: string) => {
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStage = (id: string, value: string) => {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  // Compile result
  const { pipelineJSON, hasErrors } = useMemo(() => {
    if (stages.length === 0) return { pipelineJSON: "[]", hasErrors: false };

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
    () => `const pipeline = ${pipelineJSON};\n\nconst results = await Model.aggregate(pipeline);`,
    [pipelineJSON],
  );

  const validStageIds = useMemo(
    () => new Set(stages.filter((s) => tryParseJSON(s.value).ok).map((s) => s.id)),
    [stages],
  );

  const tool = internalTools.find((t) => t.url === "/tools/mongo-pipeline-builder");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {/* Add-stage buttons */}
          <div className="space-y-2">
            <Label>Add a stage</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_STAGES.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs"
                  onClick={() => addStage(type)}
                >
                  <PlusIcon weight="bold" />
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Stage cards */}
          {stages.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground text-sm">No stages yet. Add one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const isValid = validStageIds.has(stage.id);
                return (
                  <Card
                    key={stage.id}
                    className={`transition-colors ${!isValid ? "border-destructive/50" : ""}`}
                  >
                    <CardContent className="space-y-2 p-3">
                      {/* Card header row */}

                      {/* Stage JSON editor */}
                      <TextAreaField
                        label={
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="font-mono font-semibold">{stage.type}</span>
                              <span className="text-muted-foreground text-xs">
                                — {STAGE_DESCRIPTIONS[stage.type]}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isValid && (
                                <span className="text-destructive text-xs">invalid JSON</span>
                              )}
                            </div>
                          </div>
                        }
                        value={stage.value}
                        onChange={(e) => updateStage(stage.id, e.target.value)}
                        rows={4}
                        textClassName="text-xs"
                        action={
                          <ClearButton
                            onClick={() => removeStage(stage.id)}
                            disabled={!stage.value}
                            label=""
                            variant="destructive"
                            className="w-5"
                            icon={<TrashIcon />}
                          />
                        }
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <TextAreaField
            label={
              hasErrors ? (
                <span>
                  Pipeline JSON{" "}
                  <span className="text-destructive text-xs font-normal">
                    (some stages have invalid JSON)
                  </span>
                </span>
              ) : (
                "Pipeline JSON"
              )
            }
            value={pipelineJSON}
            readOnly
            rows={12}
            action={<CopyButton value={pipelineJSON} disabled={!pipelineJSON} />}
          />

          <TextAreaField
            label="Node.js / Mongoose Snippet"
            value={nodeSnippet}
            readOnly
            rows={12}
            action={<CopyButton value={nodeSnippet} disabled={!nodeSnippet} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
