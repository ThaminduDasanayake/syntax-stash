"use client";

import { ArrowSquareOutIcon, CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, isValidHttpUrl } from "@/lib/utils";

export interface CandidateOption {
  label: string;
  type?: string;
  url: string;
}

export interface EditableCandidateInputProps {
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  options?: CandidateOption[];
  placeholder?: string;
  prefix?: React.ReactNode;
  renderPreview?: (option: CandidateOption) => React.ReactNode;
  type?: string;
  value: string;
}

export function EditableCandidateInput({
  className,
  containerClassName,
  disabled = false,
  onChange,
  options = [],
  placeholder,
  prefix,
  renderPreview,
  type = "url",
  value,
}: EditableCandidateInputProps) {
  const [open, setOpen] = useState(false);

  const hasOptions = options.length > 0;
  const cleanVal = value?.trim() || "";
  const isValidUrl = Boolean(cleanVal) && (cleanVal.startsWith("/") || isValidHttpUrl(cleanVal));

  return (
    <div className={cn("relative flex items-center", containerClassName)}>
      <InputGroup className="w-full">
        {prefix && (
          <InputGroupAddon align="inline-start" className="pr-1 pl-2">
            {prefix}
          </InputGroupAddon>
        )}
        <InputGroupInput
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          title={value || placeholder || ""}
          className={cn("font-mono text-xs", className)}
        />

        {/* Action buttons on active input value */}
        {cleanVal && isValidUrl && (
          <InputGroupAddon align="inline-end" className="gap-1 pr-1">
            <CopyButton
              textToCopy={cleanVal}
              iconOnly
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground size-6"
              title="Copy current URL"
            />
            {cleanVal.startsWith("http") && (
              <a
                href={cleanVal}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 inline-flex size-6 items-center justify-center rounded transition-colors"
                title="Open current asset in new tab"
              >
                <ArrowSquareOutIcon weight="bold" className="size-3" />
              </a>
            )}
          </InputGroupAddon>
        )}

        {hasOptions && (
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  className="text-muted-foreground hover:text-foreground h-7 gap-1 px-1.5 font-mono text-[10px] font-bold uppercase"
                  title="Choose or inspect detected options"
                >
                  <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5">
                    {options.length} {options.length === 1 ? "option" : "options"}
                  </span>
                  <CaretDownIcon className="size-3" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="bg-popover border-border w-[calc(100vw-2rem)] max-w-lg p-2 font-mono text-xs shadow-xl sm:w-[480px]"
              >
                <div className="border-border text-muted-foreground flex items-center justify-between border-b-[1.5px] px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <span>Detected Options ({options.length})</span>
                  <span className="text-[9px] font-normal lowercase opacity-70">
                    click to select or inspect
                  </span>
                </div>

                <div className="no-scrollbar mt-1 max-h-72 space-y-1.5 overflow-y-auto p-0.5">
                  {options.map((option, idx) => {
                    const isSelected = value?.trim() === option.url.trim();
                    const isOptHttp = option.url.startsWith("http");

                    return (
                      <div
                        key={`${option.url}-${idx}`}
                        className={cn(
                          "group/option flex w-full items-start gap-2.5 rounded border-[1.5px] p-2 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-line bg-surface/40 hover:border-primary/50 hover:bg-surface/80",
                        )}
                      >
                        {/* Custom Preview thumbnail if provided */}
                        {renderPreview && (
                          <div
                            onClick={() => {
                              onChange(option.url);
                              setOpen(false);
                            }}
                            className="mt-0.5 shrink-0 cursor-pointer"
                          >
                            {renderPreview(option)}
                          </div>
                        )}

                        {/* Main clickable area to select this option */}
                        <div
                          onClick={() => {
                            onChange(option.url);
                            setOpen(false);
                          }}
                          className="min-w-0 flex-1 cursor-pointer space-y-1 select-none"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-foreground truncate text-[11px] font-bold">
                              {option.label}
                            </span>
                            {option.type && (
                              <span
                                className={cn(
                                  "shrink-0 rounded px-1 text-[9px] font-semibold uppercase",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {option.type}
                              </span>
                            )}
                          </div>

                          {/* Full URL with break-all and hover tooltip */}
                          <span
                            title={option.url}
                            className="text-muted-foreground hover:text-foreground block text-[10px] leading-relaxed break-all"
                          >
                            {option.url}
                          </span>
                        </div>

                        {/* Action buttons (Copy, Open in Tab, Selected Check) */}
                        <div className="flex shrink-0 items-center gap-1 pt-0.5">
                          <CopyButton
                            textToCopy={option.url}
                            iconOnly
                            size="icon-xs"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted/60 size-6 rounded"
                            title="Copy candidate URL"
                          />

                          {isOptHttp && (
                            <a
                              href={option.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-foreground hover:bg-muted/60 inline-flex size-6 items-center justify-center rounded transition-colors"
                              title="Open image in new tab"
                            >
                              <ArrowSquareOutIcon weight="bold" className="size-3" />
                            </a>
                          )}

                          {isSelected && (
                            <div className="bg-primary text-primary-foreground ml-0.5 flex size-5 items-center justify-center rounded-full">
                              <CheckIcon className="size-3" weight="bold" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
