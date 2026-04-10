"use client";

import { Button } from "@/components/ui/button";

type Props = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export default function FilterPills({ categories, active, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant="ghost"
          onClick={() => onSelect(cat)}
          className={`
            rounded-full px-5 py-2 text-sm border transition-all duration-200
            ${
              active === cat
                ? "bg-white text-zinc-950 font-semibold border-transparent shadow-lg hover:bg-white hover:text-zinc-950"
                : "bg-zinc-950 border-zinc-800 text-zinc-400 font-medium hover:text-white hover:bg-zinc-950 hover:shadow-[0_0_16px_rgba(249,115,22,0.1)]"
            }
          `}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
