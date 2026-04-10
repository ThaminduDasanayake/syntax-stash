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
          className="absolute left-4 text-zinc-500 pointer-events-none z-10"
          size={18}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tools and resources..."
          className="
            w-full h-auto
            bg-zinc-900/60
            border-zinc-800/80
            rounded-2xl
            pl-12 pr-4 py-4
            text-white text-base
            placeholder:text-zinc-600
            backdrop-blur-sm
            transition-all duration-300
            focus-visible:border-white/10
            focus-visible:ring-0
            focus-visible:shadow-[0_0_30px_rgba(249,115,22,0.12)]
          "
        />
      </div>
    </div>
  );
}
