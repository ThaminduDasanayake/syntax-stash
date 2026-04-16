import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const ShadeButton = ({ shade, hex }: { shade: number; hex: string }) => {
  const { copied, copy } = useCopyToClipboard();
  const isBase = shade === 500;

  return (
    <Button
      variant="outline"
      onClick={() => copy(hex)}
      className="h-auto w-full flex-col items-stretch gap-0 overflow-hidden rounded-xl p-0 transition-all hover:scale-105 active:scale-95"
    >
      {/* The Color Swatch */}
      <div className="h-20 w-full shrink-0 border-b" style={{ backgroundColor: hex }} />

      {/* The Label */}
      <div className="bg-card flex w-full flex-col p-2 font-mono">
        <p className="text-foreground text-start text-xs font-semibold">
          {shade}
          {isBase && <span className="text-primary ml-2 text-xs">base</span>}
        </p>
        <div className="w flex items-center justify-between">
          <p className="text-muted-foreground truncate text-[10px]">{hex}</p>
          <span>
            {copied ? (
              <Check className="text-emerald-400" />
            ) : (
              <Copy className="text-muted-foreground" />
            )}
          </span>
        </div>
      </div>
    </Button>
  );
};
export default ShadeButton;
