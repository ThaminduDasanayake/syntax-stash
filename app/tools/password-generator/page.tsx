"use client";

import { ArrowsClockwiseIcon, CopyIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { CopyButton } from "@/components/ui/copy-button";
import { SliderField } from "@/components/ui/slider-field";
import { StepperField } from "@/components/ui/stepper-field";
import { internalTools } from "@/lib/tools-data";

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
};

// EFF Long Word List (subset of ~200 words for diceware-style passphrases)
const WORD_LIST = [
  "abacus",
  "abandon",
  "ability",
  "absence",
  "abstract",
  "academy",
  "accent",
  "access",
  "account",
  "achieve",
  "acquire",
  "across",
  "action",
  "active",
  "actual",
  "address",
  "advance",
  "advice",
  "affect",
  "afford",
  "against",
  "agency",
  "agenda",
  "agree",
  "almost",
  "already",
  "always",
  "amount",
  "animal",
  "answer",
  "appeal",
  "appear",
  "around",
  "aspect",
  "assume",
  "attach",
  "attack",
  "attempt",
  "attend",
  "attract",
  "auction",
  "author",
  "balance",
  "ballot",
  "basket",
  "battle",
  "beauty",
  "before",
  "behave",
  "belong",
  "better",
  "beyond",
  "bishop",
  "blanket",
  "border",
  "bottle",
  "bounce",
  "branch",
  "bridge",
  "bright",
  "brother",
  "budget",
  "button",
  "camera",
  "candle",
  "canvas",
  "capital",
  "castle",
  "caught",
  "center",
  "change",
  "charge",
  "choose",
  "circle",
  "classic",
  "client",
  "closed",
  "coffee",
  "column",
  "common",
  "connect",
  "copper",
  "corner",
  "cotton",
  "course",
  "create",
  "crisis",
  "cross",
  "custom",
  "danger",
  "debate",
  "define",
  "degree",
  "detail",
  "device",
  "direct",
  "dollar",
  "double",
  "dragon",
  "driven",
  "during",
  "either",
  "elegant",
  "enable",
  "energy",
  "engine",
  "enough",
  "entire",
  "escape",
  "estate",
  "evolve",
  "except",
  "expect",
  "expert",
  "factor",
  "fallen",
  "family",
  "famous",
  "flight",
  "flower",
  "follow",
  "forest",
  "forget",
  "format",
  "foster",
  "friend",
  "frozen",
  "galaxy",
  "garden",
  "gather",
  "gentle",
  "giving",
  "global",
  "golden",
  "govern",
  "ground",
  "growth",
  "guitar",
  "handle",
  "harbor",
  "hidden",
  "history",
  "honest",
  "hosted",
  "hunter",
  "impact",
  "import",
  "income",
  "inside",
  "island",
  "issue",
  "jacket",
  "jungle",
  "junior",
  "kernel",
  "kitten",
  "ladder",
  "latest",
  "launch",
  "leader",
  "lemon",
  "letter",
  "lights",
  "limit",
  "liquid",
  "listen",
  "locked",
  "logical",
  "manage",
  "market",
  "master",
  "medium",
  "melody",
  "method",
  "mirror",
  "moment",
  "morning",
  "motion",
  "muscle",
  "museum",
  "mutual",
  "narrow",
  "native",
  "nearby",
  "needle",
  "never",
  "normal",
  "notice",
  "number",
  "object",
  "obtain",
  "office",
  "online",
  "orange",
  "origin",
  "outside",
  "output",
  "owner",
  "packet",
  "palace",
  "parent",
  "particle",
  "patent",
  "patrol",
  "pencil",
  "perfect",
  "permit",
  "phrase",
  "planet",
  "player",
  "pocket",
  "policy",
  "portal",
  "potato",
  "power",
  "prefer",
  "pretty",
  "prince",
  "prison",
  "produce",
  "profit",
  "prompt",
  "proper",
  "protect",
  "public",
  "purple",
  "puzzle",
  "python",
  "rabbit",
  "random",
  "recent",
  "record",
  "reduce",
  "reform",
  "region",
  "render",
  "repair",
  "repeat",
  "report",
  "result",
  "reveal",
  "river",
  "rocket",
  "rotate",
  "router",
  "safety",
  "sample",
  "school",
  "second",
  "secure",
  "select",
  "sensor",
  "server",
  "silver",
  "simple",
  "single",
  "sister",
  "sketch",
  "source",
  "spring",
  "stable",
  "street",
  "string",
  "strong",
  "studio",
  "subject",
  "supply",
  "switch",
  "system",
  "target",
  "temple",
  "ticket",
  "timber",
  "toggle",
  "travel",
  "triple",
  "tunnel",
  "update",
  "upload",
  "value",
  "vector",
  "verify",
  "vision",
  "visual",
  "volume",
  "wallet",
  "window",
  "winter",
  "wooden",
  "worker",
  "yellow",
  "zebra",
];

function randomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

interface PasswordOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
}

function generatePassword(opts: PasswordOptions): string {
  const charset =
    (opts.upper ? CHARS.upper : "") +
    (opts.lower ? CHARS.lower : "") +
    (opts.digits ? CHARS.digits : "") +
    (opts.symbols ? CHARS.symbols : "");

  if (!charset) return "";

  const required: string[] = [];
  if (opts.upper) required.push(CHARS.upper[randomInt(CHARS.upper.length)]);
  if (opts.lower) required.push(CHARS.lower[randomInt(CHARS.lower.length)]);
  if (opts.digits) required.push(CHARS.digits[randomInt(CHARS.digits.length)]);
  if (opts.symbols) required.push(CHARS.symbols[randomInt(CHARS.symbols.length)]);

  const remaining = opts.length - required.length;
  const rest = Array.from(
    { length: Math.max(0, remaining) },
    () => charset[randomInt(charset.length)],
  );

  const all = [...required, ...rest];
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.join("");
}

function generatePassphrase(wordCount: number, separator: string): string {
  return Array.from({ length: wordCount }, () => WORD_LIST[randomInt(WORD_LIST.length)]).join(
    separator,
  );
}

function entropy(charset: number, length: number): number {
  if (charset === 0) return 0;
  return Math.log2(Math.pow(charset, length));
}

function strengthLabel(bits: number): { label: string; color: string } {
  if (bits < 40) return { label: "Very Weak", color: "text-red-500" };
  if (bits < 60) return { label: "Weak", color: "text-orange-500" };
  if (bits < 80) return { label: "Fair", color: "text-yellow-500" };
  if (bits < 100) return { label: "Strong", color: "text-emerald-500" };
  return { label: "Very Strong", color: "text-green-500" };
}

export default function PasswordGeneratorPage() {
  const [mode, setMode] = useState<"password" | "passphrase">("password");
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(0);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const charsetSize = useMemo(
    () =>
      (upper ? CHARS.upper.length : 0) +
      (lower ? CHARS.lower.length : 0) +
      (digits ? CHARS.digits.length : 0) +
      (symbols ? CHARS.symbols.length : 0),
    [upper, lower, digits, symbols],
  );

  const generate = useCallback(() => {
    if (mode === "password") {
      setPasswords(
        Array.from({ length: count }, () =>
          generatePassword({ length, upper, lower, digits, symbols }),
        ),
      );
    } else {
      setPasswords(Array.from({ length: count }, () => generatePassphrase(wordCount, separator)));
    }
    setCopied(null);
  }, [mode, length, upper, lower, digits, symbols, wordCount, separator, count]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, mode, length, upper, lower, digits, symbols, wordCount, separator, count]);

  const entropyBits =
    mode === "password" ? entropy(charsetSize, length) : entropy(WORD_LIST.length, wordCount);
  const strength = strengthLabel(entropyBits);

  const handleCopy = (idx: number) => {
    navigator.clipboard.writeText(passwords[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  const tool = internalTools.find((t) => t.slug === "password-generator");

  return (
    <ToolLayout tool={tool}>
      {/* Mode toggle */}
      <div className="mb-6 flex flex-wrap items-end gap-6">
        <div className="flex gap-2">
          {(["password", "passphrase"] as const).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              onClick={() => setMode(m)}
              className="capitalize"
            >
              {m}
            </Button>
          ))}
        </div>

        <StepperField label="Quantity" value={count} min={1} max={20} onValueChange={setCount} />

        <Button variant="outline" className="gap-2" onClick={() => setSeed((s) => s + 1)}>
          <ArrowsClockwiseIcon weight="bold" />
          Regenerate
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Options */}
        <div className="space-y-6 lg:col-span-1">
          {mode === "password" ? (
            <>
              <SliderField
                label={`Length: ${length}`}
                value={[length]}
                min={8}
                max={128}
                step={1}
                onValueChange={([v]) => setLength(v)}
              />
              <div className="space-y-3">
                <CheckboxField
                  label="Uppercase (A–Z)"
                  checked={upper}
                  onCheckedChange={(v) => setUpper(!!v)}
                />
                <CheckboxField
                  label="Lowercase (a–z)"
                  checked={lower}
                  onCheckedChange={(v) => setLower(!!v)}
                />
                <CheckboxField
                  label="Digits (0–9)"
                  checked={digits}
                  onCheckedChange={(v) => setDigits(!!v)}
                />
                <CheckboxField
                  label="Symbols (!@#…)"
                  checked={symbols}
                  onCheckedChange={(v) => setSymbols(!!v)}
                />
              </div>
            </>
          ) : (
            <>
              <StepperField
                label="Words per passphrase"
                value={wordCount}
                min={3}
                max={10}
                onValueChange={setWordCount}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">Separator</p>
                <div className="flex gap-2">
                  {["-", ".", "_", " "].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={separator === s ? "default" : "outline"}
                      onClick={() => setSeparator(s)}
                      className="w-10 font-mono"
                    >
                      {s === " " ? "·" : s}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Entropy */}
          <div className="bg-muted space-y-1 rounded-lg p-4">
            <p className="text-muted-foreground text-xs">Entropy</p>
            <p className="text-2xl font-semibold">{entropyBits.toFixed(1)} bits</p>
            <p className={`text-sm font-medium ${strength.color}`}>{strength.label}</p>
          </div>
        </div>

        {/* Password list */}
        <div className="space-y-2 lg:col-span-2">
          {passwords.map((pw, i) => (
            <div
              key={i}
              className="bg-muted flex items-center justify-between gap-3 rounded-lg px-4 py-3"
            >
              <span className="flex-1 truncate font-mono text-sm">{pw}</span>
              <button
                onClick={() => handleCopy(i)}
                className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                title="Copy"
              >
                <CopyIcon weight={copied === i ? "fill" : "regular"} size={16} />
              </button>
            </div>
          ))}
          {passwords.length > 1 && (
            <div className="flex justify-end pt-1">
              <CopyButton textToCopy={passwords.join("\n")} size="sm" variant="outline">
                Copy all
              </CopyButton>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
