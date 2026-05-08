import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const ExportBlock = ({ title, code }: { title: string; code: string }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2">
        <h4 className="text-foreground font-mono text-sm font-semibold">{title}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copy(code)}
          className="text-muted-foreground hover:text-foreground h-8"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-2 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} className="mr-2" />
              <span>Copy</span>
            </>
          )}
        </Button>
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
