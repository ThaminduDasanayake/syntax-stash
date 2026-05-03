export function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 py-2.5 text-sm not-last:border-b">
      <span className="text-muted-foreground shrink-0 font-medium">{label}</span>
      <span className="text-foreground/90 wrap-break-word">{value}</span>
    </div>
  );
}
