import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const CodeCopyButton = ({ code }: { code: string }) => {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
      onClick={() => copy(code)}
    >
      {copied ? (
        <>
          <Check className="mr-1.5 text-emerald-400" />
          <span className="text-xs text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="mr-1.5" />
          <span className="text-xs">Copy</span>
        </>
      )}
    </Button>
  );
};
export default CodeCopyButton;
