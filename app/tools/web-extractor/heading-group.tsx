export function HeadingGroup({ level, items }: { level: "h1" | "h2" | "h3"; items: string[] }) {
  if (items.length === 0) return null;
  const styles = {
    h1: "text-foreground font-semibold text-base",
    h2: "text-foreground/80 font-medium text-sm",
    h3: "text-muted-foreground text-sm",
  } as const;

  return (
    <div className="space-y-2 pb-4 not-last:border-b">
      <div className="flex items-center gap-2">
        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase">
          {level}
        </span>
        <span className="text-muted-foreground text-xs font-medium">{items.length} tags</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((text, i) => (
          <li key={i} className={`${styles[level]} leading-snug wrap-break-word`}>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
