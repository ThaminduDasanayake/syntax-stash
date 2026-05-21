import { Card, CardContent } from "@/components/ui/card";
import { ClearButton } from "@/components/ui/clear-button";
import { InputField } from "@/components/ui/input-field";
import { TextareaGroup } from "@/components/ui/textarea-group";

const LONG_FORM_HINTS = [
  "description",
  "code",
  "context",
  "content",
  "text",
  "body",
  "message",
  "error",
  "details",
  "instructions",
  "task",
  "example",
];

interface VariableCardProps {
  variables: string[];
  varValues: Record<string, string>;
  onVarChange: (name: string, value: string) => void;
}

export function VariableCard({ variables, varValues, onVarChange }: VariableCardProps) {
  if (variables.length === 0) return null;

  return (
    <Card className="shrink-0" size="sm">
      <CardContent className="space-y-3">
        <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-wider uppercase">
          Variable Injection · {variables.length} detected
        </p>
        <div className="flex flex-col gap-5">
          {variables.map((name) => {
            const isLongForm = LONG_FORM_HINTS.some((h) => name.toLowerCase().includes(h));
            return isLongForm ? (
              <div key={name} className="space-y-1.5 sm:col-span-2">
                <TextareaGroup
                  autoGrow
                  label={`{{${name}}}`}
                  value={varValues[name] ?? ""}
                  onChange={(e) => onVarChange(name, e.target.value)}
                  placeholder={name.replace(/_/g, " ")}
                  action={<ClearButton size="xs" onClick={() => onVarChange(name, "")} />}
                />
              </div>
            ) : (
              <div key={name} className="space-y-1.5">
                <InputField
                  label={`{{${name}}}`}
                  value={varValues[name] ?? ""}
                  onChange={(e) => onVarChange(name, e.target.value)}
                  placeholder={name.replace(/_/g, " ")}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
