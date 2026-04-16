import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:text-muted-foreground flex min-h-16 w-full resize-none rounded-lg border px-3 py-2 font-mono text-base leading-relaxed transition-colors outline-none focus-visible:ring-1 disabled:cursor-not-allowed md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
