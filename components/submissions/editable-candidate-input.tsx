"use client";

import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  renderPreview,
  type = "url",
  value,
}: EditableCandidateInputProps) {
  const [open, setOpen] = useState(false);

  const hasOptions = options.length > 1;

  return (
    <div className={cn("relative flex items-center", containerClassName)}>
      <InputGroup className="w-full">
        <InputGroupInput
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("font-mono text-xs", className)}
        />

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
                  title="Choose from detected options"
                >
                  <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5">
                    {options.length} options
                  </span>
                  <CaretDownIcon className="size-3" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="bg-popover border-border w-84 p-1.5 font-mono text-xs shadow-xl"
              >
                <div className="text-muted-foreground border-b px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase">
                  Detected Options ({options.length})
                </div>

                <div className="no-scrollbar mt-1 max-h-60 space-y-1 overflow-y-auto">
                  {options.map((option, idx) => {
                    const isSelected = value?.trim() === option.url.trim();

                    return (
                      <button
                        key={`${option.url}-${idx}`}
                        type="button"
                        onClick={() => {
                          onChange(option.url);
                          setOpen(false);
                        }}
                        className={cn(
                          "hover:bg-accent flex w-full items-center gap-2.5 rounded p-2 text-left transition-colors",
                          isSelected && "bg-accent/70 ring-primary/40 ring-1",
                        )}
                      >
                        {/* Optional Custom Preview */}
                        {renderPreview && <div className="shrink-0">{renderPreview(option)}</div>}

                        {/* Text and URL details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-foreground truncate text-[11px] font-bold">
                              {option.label}
                            </span>
                            {option.type && (
                              <span className="bg-ink/10 dark:bg-paper/10 text-muted-foreground shrink-0 rounded px-1 text-[9px] font-semibold uppercase">
                                {option.type}
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground block truncate text-[10px]">
                            {option.url}
                          </span>
                        </div>

                        {isSelected && (
                          <CheckIcon className="text-primary size-3.5 shrink-0" weight="bold" />
                        )}
                      </button>
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
