import { promptTemplates } from "@/app/tools/ai-prompt-studio/prompt-templates";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface QuickStartersProps {
  onSelect: (starter: string) => void;
}

export function QuickStarters({ onSelect }: QuickStartersProps) {
  return (
    <div className="mb-8 space-y-3">
      <Label>Quick Starters</Label>
      <div className="flex flex-wrap gap-2">
        {promptTemplates.map((t) => (
          <Button
            key={t.id}
            variant="secondary"
            onClick={() => onSelect(t.starter)}
            className="px-4 font-semibold"
          >
            {t.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
