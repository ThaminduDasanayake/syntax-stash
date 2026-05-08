export type ClassEntry = {
  id: string;
  originalClasses: string;
  semanticName: string;
};

export const CLASSNAME_REGEX = /className\s*=\s*(?:"([^"]*)"|\{\s*['"]([^'"]*)['"]\s*\})/g;

// Normalisation
export function normalizeClasses(raw: string): string {
  return Array.from(new Set(raw.split(/\s+/).filter(Boolean))).join(" ");
}

// Extraction
export function extractClasses(source: string): string[] {
  if (!source.trim()) return [];

  const seen = new Set<string>();
  const out: string[] = [];

  for (const match of source.matchAll(CLASSNAME_REGEX)) {
    const raw = match[1] ?? match[2] ?? "";
    const norm = normalizeClasses(raw);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
  }

  return out;
}

// Entry reconciliation
export function reconcileEntries(previous: ClassEntry[], extracted: string[]): ClassEntry[] {
  const byClasses = new Map(previous.map((e) => [e.originalClasses, e]));
  const used = new Set(previous.map((e) => e.semanticName));
  const counter = 1;

  return extracted.map((cls) => {
    const prev = byClasses.get(cls);
    if (prev) return prev;

    const baseName = guessSemanticName(cls);

    let name = baseName;
    let counter = 2;

    while (used.has(name)) {
      name = `${baseName}-${counter}`;
      counter++;
    }

    used.add(name);
    return { id: cls, originalClasses: cls, semanticName: name };
  });
}

// CSS generation
export function generateCss(entries: ClassEntry[]): string {
  if (entries.length === 0) return "";

  const body = entries
    .map((e) => `  .${e.semanticName} {\n    @apply ${e.originalClasses};\n  }`)
    .join("\n\n");

  return `@layer components {\n${body}\n}`;
}

//  JSX refactoring
export function refactorSource(source: string, entries: ClassEntry[]): string {
  if (!source.trim() || entries.length === 0) return source;

  const nameByClasses = new Map(entries.map((e) => [e.originalClasses, e.semanticName]));

  return source.replace(CLASSNAME_REGEX, (_full, dq, jsx) => {
    const raw = dq ?? jsx ?? "";
    const norm = normalizeClasses(raw);
    const name = nameByClasses.get(norm);
    if (!name) return _full;
    return `className="${name}"`;
  });
}

export function guessSemanticName(classString: string): string {
  const c = classString;

  // Interactive elements
  if (c.includes("cursor-pointer") || c.includes("hover:") || c.includes("focus:"))
    return "action-btn";

  // Text elements
  if (c.includes("font-bold") || c.includes("text-xl") || c.includes("text-2xl")) return "heading";
  if (c.includes("text-sm") && c.includes("text-muted")) return "subtitle";

  // Layout and structural elements
  if (c.includes("fixed") && c.includes("inset-0")) return "overlay";
  if (c.includes("border") && c.includes("shadow")) return "card-panel";
  if (c.includes("grid")) return "grid-layout";
  if (c.includes("flex") && (c.includes("justify-between") || c.includes("items-center")))
    return "flex-row";
  if (c.includes("flex")) return "flex-container";

  // Base fallback
  return "ui-element";
}

export const SAMPLE_JSX = `

export function ProductCard({ product, onAddToCart }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lg">
          {product.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-2xl font-extrabold text-primary">
            \${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}`;
