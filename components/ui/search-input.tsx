"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { forwardRef, InputHTMLAttributes } from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, placeholder = "Search...", ...props }, ref) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        <InputGroup>
          <InputGroupInput
            id="inline-start-input"
            type="search"
            ref={ref}
            className={className}
            placeholder={placeholder}
            {...props}
          />
          <InputGroupAddon align="inline-start">
            <MagnifyingGlassIcon weight="bold" className="pointer-events-none" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
