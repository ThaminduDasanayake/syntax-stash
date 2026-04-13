"use client";

import { Button } from "@/components/ui/button";

type Props = {
  categories: string[];
  active: string;
  onSelectAction: (category: string) => void;
};

export default function FilterPills({ categories, active, onSelectAction }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant="ghost"
          onClick={() => onSelectAction(cat)}
          className={`rounded-full border px-5 py-2 text-sm transition-all duration-200 ${
            active === cat
              ? "border-transparent bg-white font-semibold text-zinc-950 shadow-lg hover:bg-white hover:text-zinc-950"
              : "border-zinc-800 bg-zinc-950 font-medium text-zinc-400 hover:bg-zinc-950 hover:text-white hover:shadow-[0_0_16px_rgba(249,115,22,0.1)]"
          } `}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
