"use client";

import {
  CaretDownIcon,
  CaretRightIcon,
  CheckIcon,
  ClipboardIcon,
  LinkSimpleHorizontalIcon,
  PlayCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import {
  countChildren,
  getValueType,
  type JsonValue,
  matchesSearch,
  subtreeMatches,
} from "./helpers";

type Props = {
  name: string;
  value: JsonValue;
  path: string;
  depth: number;
  searchQuery: string;
  forceExpand: boolean | null;
  onTestInQueryAction?: (path: string) => void;
};

const TYPE_COLORS: Record<string, string> = {
  boolean: "text-violet-400",
  null: "text-muted-foreground",
  number: "text-sky-400",
  string: "text-emerald-400",
};

function Highlight({ query, text }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-yellow-300/30 px-0.5 text-yellow-300">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function CopyBtn({ icon: Icon, text }: { text: string; icon: typeof ClipboardIcon }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        copy(text);
      }}
      size="xs"
      variant="ghost"
      className="text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
      title={`Copy ${text}`}
    >
      {copied ? (
        <CheckIcon weight="bold" className="text-emerald-400" />
      ) : (
        <Icon className="size-4" />
      )}
    </Button>
  );
}

function TestInQueryBtn({
  onTestInQueryAction,
  path,
}: {
  path: string;
  onTestInQueryAction: (p: string) => void;
}) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onTestInQueryAction(path);
      }}
      size="xs"
      variant="ghost"
      className="text-muted-foreground hover:text-primary rounded p-0.5! opacity-0 transition-opacity group-hover:opacity-100"
      title="Test path in Query tab"
    >
      <PlayCircleIcon weight="duotone" className="size-4" />
    </Button>
  );
}

export function TreeNode({
  depth,
  forceExpand,
  name,
  onTestInQueryAction,
  path,
  searchQuery,
  value,
}: Props) {
  const type = getValueType(value);
  const isContainer = type === "object" || type === "array";
  const childCount = countChildren(value);
  const selfMatches = matchesSearch(name, value, searchQuery);
  const childrenMatch = isContainer && searchQuery ? subtreeMatches(value, searchQuery) : false;

  const autoExpand = searchQuery !== "" && childrenMatch;
  const [open, setOpen] = useState(depth < 2);
  const isOpen = forceExpand !== null ? forceExpand : autoExpand || open;

  const indent = depth * 16;

  const displayValue = (): string => {
    if (type === "string") return `"${value as string}"`;
    if (type === "null") return "null";
    return String(value);
  };

  if (!isContainer) {
    return (
      <div
        className="group flex items-center gap-1.5 rounded py-0.5 pr-2 text-sm hover:bg-white/5"
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
          {onTestInQueryAction && (
            <TestInQueryBtn path={path} onTestInQueryAction={onTestInQueryAction} />
          )}

          <CopyBtn text={path} icon={LinkSimpleHorizontalIcon} />
          <CopyBtn text={displayValue()} icon={ClipboardIcon} />
        </span>
      </div>
    );
  }

  const bracket = type === "array" ? ["[", "]"] : ["{", "}"];
  const entries: [string, JsonValue][] = Array.isArray(value)
    ? value.map((v, i) => [String(i), v])
    : Object.entries(value as Record<string, JsonValue>);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(v) => {
        if (forceExpand === null) setOpen(v);
      }}
    >
      <div
        className="group flex cursor-pointer items-center gap-1.5 rounded py-0.5 pr-2 hover:bg-white/5"
        style={{ paddingLeft: `${indent + 2}px` }}
      >
        <CollapsibleTrigger
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
          onClick={() => {
            if (forceExpand === null) setOpen((o) => !o);
          }}
        >
          {isOpen ? (
            <CaretDownIcon size={12} className="text-muted-foreground shrink-0" />
          ) : (
            <CaretRightIcon size={12} className="text-muted-foreground shrink-0" />
          )}
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
          {onTestInQueryAction && (
            <TestInQueryBtn path={path} onTestInQueryAction={onTestInQueryAction} />
          )}
          <CopyBtn text={path} icon={LinkSimpleHorizontalIcon} />
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
            onTestInQueryAction={onTestInQueryAction}
          />
        ))}
        <div
          className="text-muted-foreground py-0.5 font-mono text-xs"
          style={{ paddingLeft: `${indent + 8}px` }}
        >
          {bracket[1]}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
