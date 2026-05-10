import { CopyButton } from "@/components/ui/copy-button";

const ExportBlock = ({ title, code }: { title: string; code: string }) => {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2">
        <h4 className="text-foreground font-mono text-sm font-semibold">{title}</h4>
        <CopyButton variant="ghost" textToCopy={code} />
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="text-muted-foreground font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
export default ExportBlock;
