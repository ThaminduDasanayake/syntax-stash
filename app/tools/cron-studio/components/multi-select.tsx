import { Button } from "@/components/ui/button";

export function MultiSelect({
  values,
  selected,
  onChange,
  max = 10,
}: {
  values: { value: number; label: string }[];
  selected: number[];
  onChange: (vals: number[]) => void;
  max?: number;
}) {
  const toggle = (v: number) => {
    if (selected.includes(v)) {
      onChange(selected.filter((x) => x !== v));
    } else {
      if (selected.length >= max) return;
      onChange([...selected, v]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map(({ value, label }) => (
        <Button
          key={value}
          variant={selected.includes(value) ? "default" : "outline"}
          className="w-9 font-mono"
          onClick={() => toggle(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
