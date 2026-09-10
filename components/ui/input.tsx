import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-full w-full min-w-0 rounded-xl border border-white/[0.10] bg-[#18181b]/90 px-3.5 py-2 text-sm transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:bg-[#18181b] focus:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-white/[0.04] disabled:opacity-50 aria-invalid:ring-3",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
