import { ClassEntry } from "@/app/tools/tailwind-extractor/helpers";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";

const ClassMapRow = ({
  entry,
  onRename,
}: {
  entry: ClassEntry;
  onRename: (id: string, name: string) => void;
}) => {
  return (
    <div className="bg-card border-border flex items-center gap-3 rounded-lg border px-3 py-2">
      <code
        className="text-secondary scrollbar-hide min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap"
        title={entry.originalClasses}
      >
        {entry.originalClasses}
      </code>

      <InputField
        value={entry.semanticName}
        onChange={(e) => onRename(entry.id, e.target.value)}
        className="font-mono text-xs"
        spellCheck={false}
        aria-label={`Semantic name for: ${entry.originalClasses}`}
        action={
          <CopyButton
            label={false}
            variant="ghost"
            size="sm"
            className="w-7"
            value={entry.semanticName}
            disabled={!entry.semanticName}
          />
        }
      />
    </div>
  );
};
export default ClassMapRow;
