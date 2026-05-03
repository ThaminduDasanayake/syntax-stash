"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { forwardRef, InputHTMLAttributes } from "react";

import { InputField } from "@/components/ui/input-field.tsx";
import { cn } from "@/lib/utils";

// Extend standard Input props so value, onChange, etc. just work automatically
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, placeholder = "Search...", ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <MagnifyingGlassIcon
          weight="duotone"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        />
        <InputField
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn("pl-9", className)}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
