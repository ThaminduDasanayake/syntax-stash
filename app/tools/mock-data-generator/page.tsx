"use client";

import { Check, Copy, Database, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CITIES,
  DOMAINS,
  FIRST_NAMES,
  LAST_NAMES,
  POST_TITLES,
  POST_TOPICS,
  PRODUCT_ADJECTIVES,
  PRODUCT_CATEGORIES,
  PRODUCT_NOUNS,
  TAGS,
} from "@/app/tools/mock-data-generator/data";
import { SchemaId } from "@/app/tools/mock-data-generator/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

// Helpers
const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, decimals = 2) =>
  Number((Math.random() * (max - min) + min).toFixed(decimals));
const randomPastDate = (maxDaysAgo: number) => {
  const ms = Date.now() - randInt(1, maxDaysAgo) * 86400000;
  return new Date(ms).toISOString();
};
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Schema generators
function makeUser(id: number) {
  const firstName = rand(FIRST_NAMES);
  const lastName = rand(LAST_NAMES);
  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${rand(DOMAINS)}`,
    age: randInt(18, 72),
    city: rand(CITIES),
    joinedAt: randomPastDate(730),
  };
}

function makeProduct(id: number) {
  const name = `${rand(PRODUCT_ADJECTIVES)} ${rand(PRODUCT_NOUNS)}`;
  return {
    id,
    name,
    category: rand(PRODUCT_CATEGORIES),
    price: randFloat(4.99, 499.99),
    inStock: Math.random() > 0.2,
    rating: randFloat(1, 5, 1),
    sku: `SKU-${randInt(10000, 99999)}`,
  };
}

function makePost(id: number) {
  const topic = rand(POST_TOPICS);
  const title = rand(POST_TITLES).replace("{topic}", topic);
  const firstName = rand(FIRST_NAMES);
  const lastName = rand(LAST_NAMES);
  const tagCount = randInt(1, 3);
  const tags: string[] = [];
  while (tags.length < tagCount) {
    const t = rand(TAGS);
    if (!tags.includes(t)) tags.push(t);
  }
  return {
    id,
    title,
    slug: slugify(title),
    author: `${firstName} ${lastName}`,
    excerpt: `A short look at ${topic} and what it means for builders.`,
    likes: randInt(0, 5000),
    tags,
    publishedAt: randomPastDate(365),
  };
}

function generate(schema: SchemaId, count: number): unknown[] {
  const maker = schema === "users" ? makeUser : schema === "products" ? makeProduct : makePost;
  return Array.from({ length: count }, (_, i) => maker(i + 1));
}

// Page
export default function MockDataPage() {
  const [schema, setSchema] = useState<SchemaId>("users");
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState(0);

  const json = useMemo(() => {
    const safeCount = Math.max(1, Math.min(50, Math.floor(count) || 1));
    return JSON.stringify(generate(schema, safeCount), null, 2);
    // `seed` is a dependency so a manual regenerate produces fresh data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, count, seed]);

  function handleSchemaChange(v: string | null) {
    if (!v) return;
    setSchema(v as SchemaId);
  }

  const { copied, copy } = useCopyToClipboard();

  return (
    <ToolLayout
      icon={Database}
      title="Mock Data"
      highlight="Generator"
      description="Generate structured dummy JSON for users, products, or blog posts."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Left — controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground">Schema</Label>
            <Select value={schema} onValueChange={handleSchemaChange}>
              <SelectTrigger className="bg-background border-border text-foreground h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem
                  value="users"
                  className="text-muted-foreground focus:bg-accent focus:text-foreground"
                >
                  Users
                </SelectItem>
                <SelectItem
                  value="products"
                  className="text-muted-foreground focus:bg-accent focus:text-foreground"
                >
                  Products
                </SelectItem>
                <SelectItem
                  value="posts"
                  className="text-muted-foreground focus:bg-accent focus:text-foreground"
                >
                  Posts
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Count (1–50)</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 h-10 font-mono focus-visible:ring-1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setSeed((s) => s + 1)}
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 h-10 rounded-full px-4 text-xs font-semibold transition-colors"
            >
              <RefreshCw size={14} className="mr-2" />
              Regenerate
            </Button>
            <Button
              onClick={() => copy(json)}
              className="bg-foreground text-background hover:bg-foreground/90 h-10 rounded-full px-4 text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} className="mr-2" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right — output */}
        <div className="space-y-2">
          <Label className="text-foreground">Output</Label>
          <Textarea
            readOnly
            value={json}
            rows={24}
            className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
