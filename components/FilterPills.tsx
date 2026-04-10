"use client";

type Props = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export default function FilterPills({ categories, active, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`
            px-5 py-2
            rounded-full
            text-sm font-medium
            border
            transition-all duration-200
            ${
              active === cat
                ? "bg-white text-zinc-950 font-semibold border-transparent shadow-lg"
                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:shadow-[0_0_16px_rgba(249,115,22,0.1)]"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
