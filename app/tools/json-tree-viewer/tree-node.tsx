"use client";

import { Check, ChevronDown, ChevronRight, Clipboard, Link2 } from "lucide-react";
import { useState } from "react";

import {
  countChildren,
  getValueType,
  type JsonValue,
  matchesSearch,
  subtreeMatches,
} from "./helpers";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type Props = {
  name: string;
  value: JsonValue;
  path: string;
  depth: number;
  searchQuery: string;
  forceExpand: boolean | null; // null = user-controlled
};

const TYPE_COLORS: Record<string, string> = {
  string: "text-emerald-400",
  number: "text-sky-400",
  boolean: "text-violet-400",
  null: "text-muted-foreground",
};

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-300/30 text-yellow-300 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function CopyBtn({ text, icon: Icon }: { text: string; icon: typeof Clipboard }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button
      onClick={(e) => { e.stopPropagation(); copy(text); }}
      className="text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
      title={`Copy ${text}`}
    >
      {copied ? <Check size={10} className="text-emerald-400" /> : <Icon size={10} />}
    </button>
  );
}

export function TreeNode({ name, value, path, depth, searchQuery, forceExpand }: Props) {
  const type = getValueType(value);
  const isContainer = type === "object" || type === "array";
  const childCount = countChildren(value);
  const selfMatches = matchesSearch(name, value, searchQuery);
  const childrenMatch = isContainer && searchQuery ? subtreeMatches(value, searchQuery) : false;

  const autoExpand = searchQuery !== "" && childrenMatch;
  const [open, setOpen] = useState(depth < 2);
  const isOpen = forceExpand !== null ? forceExpand : (autoExpand || open);

  const indent = depth * 16;

  const displayValue = (): string => {
    if (type === "string") return `"${value as string}"`;
    if (type === "null") return "null";
    return String(value);
  };

  if (!isContainer) {
    return (
      <div
        className="group flex items-center gap-1.5 py-0.5 pr-2 hover:bg-white/5 rounded text-sm"
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        {name && (
          <>
            <span className="text-muted-foreground font-mono text-xs">{name}</span>
            <span className="text-muted-foreground text-xs">:</span>
          </>
        )}
        <span className={`font-mono text-xs ${TYPE_COLORS[type] ?? ""}`}>
          {selfMatches && searchQuery ? (
            <Highlight text={displayValue()} query={searchQuery} />
          ) : (
            displayValue()
          )}
        </span>
        <span className="text-muted-foreground ml-auto flex items-center gap-1">
          <CopyBtn text={path} icon={Link2} />
          <CopyBtn text={displayValue()} icon={Clipboard} />
        </span>
      </div>
    );
  }

  const bracket = type === "array" ? ["[", "]"] : ["{", "}"];
  const entries: [string, JsonValue][] = Array.isArray(value)
    ? value.map((v, i) => [String(i), v])
    : Object.entries(value as Record<string, JsonValue>);

  return (
    <Collapsible open={isOpen} onOpenChange={(v) => { if (forceExpand === null) setOpen(v); }}>
      <div
        className="group flex items-center gap-1.5 py-0.5 pr-2 hover:bg-white/5 rounded cursor-pointer"
        style={{ paddingLeft: `${indent + 2}px` }}
      >
        <CollapsibleTrigger
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
          onClick={() => { if (forceExpand === null) setOpen((o) => !o); }}
        >
          {isOpen
            ? <ChevronDown size={12} className="text-muted-foreground shrink-0" />
            : <ChevronRight size={12} className="text-muted-foreground shrink-0" />
          }
          {name && (
            <>
              <span className="text-muted-foreground font-mono text-xs">
                {selfMatches && searchQuery ? <Highlight text={name} query={searchQuery} /> : name}
              </span>
              <span className="text-muted-foreground text-xs">:</span>
            </>
          )}
          <span className="text-muted-foreground font-mono text-xs">{bracket[0]}</span>
          {!isOpen && (
            <span className="text-muted-foreground font-mono text-xs">
              {type === "array" ? childCount : `${childCount} key${childCount !== 1 ? "s" : ""}`}
            </span>
          )}
          {!isOpen && <span className="text-muted-foreground font-mono text-xs">{bracket[1]}</span>}
        </CollapsibleTrigger>
        <span className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <CopyBtn text={path} icon={Link2} />
        </span>
      </div>

      <CollapsibleContent>
        {entries.map(([k, v]) => (
          <TreeNode
            key={k}
            name={k}
            value={v}
            path={type === "array" ? `${path}[${k}]` : `${path}.${k}`}
            depth={depth + 1}
            searchQuery={searchQuery}
            forceExpand={forceExpand}
          />
        ))}
        <div
          className="py-0.5 font-mono text-xs text-muted-foreground"
          style={{ paddingLeft: `${indent + 8}px` }}
        >
          {bracket[1]}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
