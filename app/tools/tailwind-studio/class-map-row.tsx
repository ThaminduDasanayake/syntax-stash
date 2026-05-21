import { ClassEntry } from "@/app/tools/tailwind-studio/extractor-helpers";
import { InputField } from "@/components/ui/input-field";

const ClassMapRow = ({
  entry,
  onRename,
}: {
  entry: ClassEntry;
  onRename: (id: string, name: string) => void;
}) => {
  return (
    <div className="bg-card border-border hover:border-border/80 flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-colors">
      <InputField
        value={entry.semanticName}
        onChange={(e) => onRename(entry.id, e.target.value)}
        spellCheck={false}
        containerClassName="w-64"
        aria-label={`Semantic name for: ${entry.originalClasses}`}
        showCopy
      />
      <code
        className="text-muted-foreground max-w-full overflow-x-auto font-mono text-xs leading-relaxed"
        title={entry.originalClasses}
      >
        {entry.originalClasses}
      </code>
    </div>
  );
};
export default ClassMapRow;
