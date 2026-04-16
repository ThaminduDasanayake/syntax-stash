import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const SetupCopyButton = ({ text }: { text: string }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
      onClick={() => copy(text)}
    >
      {copied ? <Check className="text-emerald-400" /> : <Copy />}
    </Button>
  );
};
export default SetupCopyButton;
