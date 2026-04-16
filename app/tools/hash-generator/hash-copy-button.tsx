import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const HashCopyButton = ({ value }: { value: string }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      onClick={() => copy(value)}
      disabled={!value}
      variant="outline"
      className="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent h-10 shrink-0 px-3 transition-colors"
    >
      {copied ? <Check className="text-primary" /> : <Copy />}
    </Button>
  );
};
export default HashCopyButton;
