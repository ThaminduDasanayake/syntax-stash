import { CopyButton } from "@/components/ui/copy-button";

export function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="group relative grid grid-cols-[110px_1fr] gap-4 py-2.5 pr-10 text-sm not-last:border-b">
      <span className="text-muted-foreground shrink-0 font-medium">{label}</span>
      <span className="text-foreground/90 min-w-0 pr-2 break-all">{value}</span>

      <div className="absolute top-1/2 right-1 -translate-y-1/2">
        <CopyButton iconOnly textToCopy={value} disabled={!value} />
      </div>
    </div>
  );
}
