import type { DiffLine } from "@/app/tools/diff-viewer/helpers";

export function DiffLineRow({
  line,
  showOld,
  showNew,
}: {
  line: DiffLine;
  showOld: boolean;
  showNew: boolean;
}) {
  const bgClass =
    line.type === "added" ? "bg-green-500/10" : line.type === "removed" ? "bg-red-500/10" : "";
  const textClass =
    line.type === "added"
      ? "text-green-400"
      : line.type === "removed"
        ? "text-red-400"
        : "text-muted-foreground";
  const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";

  return (
    <div className={`flex min-w-0 font-mono text-xs leading-5 ${bgClass}`}>
      {showOld && (
        <span className="border-border text-muted-foreground w-10 shrink-0 border-r px-2 text-right select-none">
          {line.oldLineNum ?? ""}
        </span>
      )}
      {showNew && (
        <span className="border-border text-muted-foreground w-10 shrink-0 border-r px-2 text-right select-none">
          {line.newLineNum ?? ""}
        </span>
      )}
      <span className={`w-4 shrink-0 px-1 select-none ${textClass}`}>{prefix}</span>
      <span className={`min-w-0 flex-1 px-2 break-all whitespace-pre-wrap ${textClass}`}>
        {line.content}
      </span>
    </div>
  );
}
