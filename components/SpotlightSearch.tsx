"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SpotlightSearch({ value, onChange }: Props) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 text-zinc-500 pointer-events-none"
          size={18}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tools and resources..."
          className="
            w-full
            bg-zinc-900/60
            border border-zinc-800/80
            rounded-2xl
            pl-12 pr-4 py-4
            text-white text-base
            placeholder:text-zinc-600
            outline-none
            backdrop-blur-sm
            transition-all duration-300
            focus:border-white/10
            focus:shadow-[0_0_30px_rgba(249,115,22,0.12)]
            focus:bg-zinc-900/80
          "
        />
      </div>
    </div>
  );
}
