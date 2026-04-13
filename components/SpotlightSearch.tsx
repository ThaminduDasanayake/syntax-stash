"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SpotlightSearchProps } from "@/types";

export default function SpotlightSearch({ value, onChangeAction }: SpotlightSearchProps) {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search
          className="text-muted-foreground pointer-events-none absolute left-4 z-10"
          size={18}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChangeAction(e.target.value)}
          placeholder="Search tools and resources..."
          className="bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/50 focus-visible:shadow-primary/10 h-auto w-full rounded-2xl py-4 pr-4 pl-12 text-base backdrop-blur-sm transition-all duration-300 focus-visible:shadow-[0_0_30px_var(--color-primary)] focus-visible:ring-1"
        />
      </div>
    </div>
  );
}
