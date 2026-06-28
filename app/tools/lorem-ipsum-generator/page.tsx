"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useCallback, useMemo, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CopyButton } from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { StepperField } from "@/components/ui/stepper-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

const CLASSIC_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "perspiciatis",
  "unde",
  "omnis",
  "iste",
  "natus",
  "error",
  "voluptatem",
  "accusantium",
  "doloremque",
  "laudantium",
  "totam",
  "rem",
  "aperiam",
  "eaque",
  "ipsa",
  "quae",
  "ab",
  "illo",
  "inventore",
  "veritatis",
  "quasi",
  "architecto",
  "beatae",
  "vitae",
  "dicta",
  "explicabo",
  "nemo",
  "ipsam",
  "aspernatur",
  "aut",
  "odit",
  "fugit",
  "consequuntur",
  "magni",
  "dolores",
  "eos",
  "ratione",
  "sequi",
  "nesciunt",
  "neque",
  "porro",
  "quisquam",
  "quia",
  "numquam",
  "eius",
  "modi",
  "tempora",
  "incidunt",
  "aliquam",
  "quaerat",
  "minima",
  "nostrum",
  "exercitationem",
  "ullam",
  "corporis",
  "suscipit",
  "laboriosam",
  "nisi",
  "aliquid",
  "commodi",
  "consequatur",
  "quis",
  "maxime",
  "placeat",
  "facere",
  "possimus",
  "omnis",
  "voluptas",
  "assumenda",
  "repellendus",
  "temporibus",
  "autem",
  "quibusdam",
  "officiis",
  "debitis",
  "rerum",
  "necessitatibus",
  "saepe",
  "eveniet",
  "voluptates",
  "repudiandae",
  "recusandae",
  "itaque",
  "earum",
  "rerum",
  "hic",
  "tenetur",
  "sapiente",
  "delectus",
  "reiciendis",
  "voluptatibus",
  "maiores",
  "alias",
  "consequatur",
  "aut",
  "perferendis",
  "doloribus",
  "asperiores",
  "repellat",
];

const HIPSTER_WORDS = [
  "artisan",
  "pour-over",
  "fixie",
  "vinyl",
  "gastropub",
  "synth",
  "aesthetic",
  "letterpress",
  "chicharrones",
  "selvage",
  "normcore",
  "typewriter",
  "vegan",
  "keffiyeh",
  "williamsburg",
  "brookly",
  "craft",
  "beer",
  "organic",
  "tofu",
  "locavore",
  "tumblr",
  "mustache",
  "seitan",
  "cardigan",
  "twee",
  "scenester",
  "pork",
  "belly",
  "tote",
  "bag",
  "irony",
  "raw",
  "denim",
  "trust",
  "fund",
  "mixtape",
  "ethical",
  "plaid",
  "messenger",
  "bicycle",
  "rights",
  "bushwick",
  "polaroid",
  "forage",
  "small",
  "batch",
  "authentic",
  "listicle",
  "occupy",
  "narwhal",
  "pinterest",
  "chia",
  "quinoa",
  "flannel",
  "pabst",
  "bitters",
  "pickled",
  "distillery",
  "readymade",
  "chambray",
  "dreamcatcher",
  "skateboard",
  "drinking",
  "vinegar",
  "butcher",
  "mlkshk",
  "humblebrag",
  "retro",
  "cred",
  "taxidermy",
  "hoodie",
  "thundercats",
  "shoreditch",
  "meditation",
  "salvia",
  "fanny",
  "pack",
  "deep",
  "tattooed",
  "slow",
  "cold-pressed",
  "activated",
  "charcoal",
  "adaptogen",
  "collagen",
];

const CORPORATE_WORDS = [
  "synergy",
  "leverage",
  "paradigm",
  "disruptive",
  "scalable",
  "agile",
  "bandwidth",
  "boil",
  "ocean",
  "circle",
  "back",
  "deep",
  "dive",
  "drill",
  "down",
  "ecosystem",
  "empower",
  "end-to-end",
  "evangelize",
  "future-proof",
  "game-changer",
  "granular",
  "holistic",
  "ideate",
  "impactful",
  "incentivize",
  "innovate",
  "iteration",
  "key",
  "takeaways",
  "learnings",
  "low-hanging",
  "fruit",
  "move",
  "needle",
  "next",
  "level",
  "on",
  "same",
  "page",
  "optics",
  "outside",
  "box",
  "pivot",
  "proactive",
  "robust",
  "ROI",
  "scalability",
  "seamless",
  "socialized",
  "stakeholder",
  "streamline",
  "strategic",
  "synergize",
  "takeaway",
  "thought",
  "leader",
  "traction",
  "value-add",
  "vertical",
  "visibility",
  "win-win",
  "alignment",
  "bandwidth",
  "benchmark",
  "best-in-class",
  "bespoke",
  "blue-sky",
  "cadence",
  "cross-functional",
  "customer-centric",
  "deliverable",
  "dynamic",
  "engagement",
  "execution",
  "framework",
  "growth",
  "hacking",
  "impact",
  "initiative",
  "launch",
  "mindshare",
  "mission-critical",
  "onboarding",
  "optimization",
  "outreach",
  "pipeline",
  "platform",
  "priority",
  "proactive",
  "roadmap",
  "solution",
  "sprint",
  "strategy",
  "touch-base",
  "transformation",
  "transparency",
  "velocity",
];

type Variant = "classic" | "hipster" | "corporate";
type Unit = "paragraphs" | "sentences" | "words";

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeSentence(words: string[], count: number): string {
  const w = Array.from({ length: count }, () => pick(words));
  return w[0].charAt(0).toUpperCase() + w[0].slice(1) + " " + w.slice(1).join(" ") + ".";
}

function makeParagraph(words: string[]): string {
  const sentCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentCount }, () =>
    makeSentence(words, 8 + Math.floor(Math.random() * 8)),
  ).join(" ");
}

function generate(variant: Variant, unit: Unit, count: number, startWithLorem: boolean): string {
  const words =
    variant === "classic" ? CLASSIC_WORDS : variant === "hipster" ? HIPSTER_WORDS : CORPORATE_WORDS;

  if (unit === "words") {
    const w = Array.from({ length: count }, () => pick(words));
    const result = w.join(" ");
    if (startWithLorem && variant === "classic") {
      return "Lorem ipsum dolor sit amet " + w.slice(5).join(" ");
    }
    return result;
  }

  if (unit === "sentences") {
    const sentences = Array.from({ length: count }, (_, i) => {
      if (i === 0 && startWithLorem && variant === "classic") {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      }
      return makeSentence(words, 8 + Math.floor(Math.random() * 8));
    });
    return sentences.join(" ");
  }

  // paragraphs
  return Array.from({ length: count }, (_, i) => {
    if (i === 0 && startWithLorem && variant === "classic") {
      return (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
        makeParagraph(words).split(". ").slice(1).join(". ")
      );
    }
    return makeParagraph(words);
  }).join("\n\n");
}

const UNIT_OPTIONS = [
  { value: "paragraphs", label: "Paragraphs" },
  { value: "sentences", label: "Sentences" },
  { value: "words", label: "Words" },
];

export default function LoremIpsumGeneratorPage() {
  const [variant, setVariant] = useState<Variant>("classic");
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [seed, setSeed] = useState(0);

  const output = useMemo(
    () => generate(variant, unit, count, startWithLorem),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant, unit, count, startWithLorem, seed],
  );

  const regenerate = useCallback(() => setSeed((s) => s + 1), []);

  const wordCount = output.split(/\s+/).filter(Boolean).length;
  const charCount = output.length;

  const tool = internalTools.find((t) => t.slug === "lorem-ipsum-generator");

  return (
    <ToolLayout tool={tool}>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-6">
        <ButtonGroup className="grid grid-cols-3">
          {(["classic", "hipster", "corporate"] as Variant[]).map((v) => (
            <Button
              key={v}
              variant={variant === v ? "default" : "outline"}
              onClick={() => setVariant(v)}
              className="capitalize"
            >
              {v}
            </Button>
          ))}
        </ButtonGroup>

        <SelectField
          label="Unit"
          value={unit}
          onValueChange={(v) => setUnit(v as Unit)}
          options={UNIT_OPTIONS}
          triggerClassName="w-36"
        />

        <StepperField
          label="Count"
          value={count}
          min={1}
          max={unit === "paragraphs" ? 20 : unit === "sentences" ? 50 : 200}
          onValueChange={setCount}
        />

        {variant === "classic" && unit !== "words" && (
          <Button
            variant={startWithLorem ? "default" : "outline"}
            onClick={() => setStartWithLorem((s) => !s)}
            size="sm"
          >
            Start with "Lorem ipsum"
          </Button>
        )}

        <Button variant="outline" onClick={regenerate} className="gap-2">
          <ArrowsClockwiseIcon weight="bold" />
          Regenerate
        </Button>
      </div>

      <TextareaGroup
        label="Generated Text"
        value={output}
        readOnly
        containerClassName="min-h-[400px]"
        action={<CopyButton iconOnly textToCopy={output} disabled={!output} />}
      />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-muted-foreground text-xs">Words</p>
          <p className="text-lg font-semibold">{wordCount.toLocaleString()}</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-muted-foreground text-xs">Characters</p>
          <p className="text-lg font-semibold">{charCount.toLocaleString()}</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-muted-foreground text-xs">Variant</p>
          <p className="text-lg font-semibold capitalize">{variant}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
