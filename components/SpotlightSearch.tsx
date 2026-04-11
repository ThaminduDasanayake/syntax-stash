"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SpotlightSearch({ value, onChange }: Props) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 text-muted-foreground pointer-events-none z-10"
          size={18}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tools and resources..."
          className="
            w-full h-auto
            bg-background/80
            border-border
            rounded-2xl
            pl-12 pr-4 py-4
            text-foreground text-base
            placeholder:text-muted-foreground
            backdrop-blur-sm
            transition-all duration-300
            focus-visible:border-primary/50
            focus-visible:ring-1 focus-visible:ring-primary/50
            focus-visible:shadow-[0_0_30px_var(--color-primary)] focus-visible:shadow-primary/10
          "
        />
      </div>
    </div>
  );
}
