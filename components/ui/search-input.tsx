"use client";

import { CircleNotchIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> {
  containerClassName?: string;
  inputGroupClassName?: string;
  isLoading?: boolean;
  onClear?: () => void;
  prefixIcon?: ReactNode;
  shortcut?: ReactNode | string;
  showClear?: boolean;
  size?: "default" | "lg" | "sm";
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      defaultValue,
      disabled,
      inputGroupClassName,
      isLoading = false,
      onChange,
      onClear,
      onKeyDown,
      placeholder = "Search...",
      prefixIcon,
      shortcut,
      showClear = true,
      size = "default",
      type = "text",
      value,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(
      (defaultValue as string) || "",
    );

    const currentValue = isControlled ? ((value as string) ?? "") : uncontrolledValue;
    const hasValue = Boolean(currentValue && String(currentValue).length > 0);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setUncontrolledValue("");
      }

      if (inputRef.current) {
        inputRef.current.value = "";
        const syntheticEvent = {
          bubbles: true,
          cancelable: true,
          currentTarget: inputRef.current,
          target: inputRef.current,
        } as unknown as ChangeEvent<HTMLInputElement>;
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        onChange?.(syntheticEvent);
        inputRef.current.focus();
      }

      onClear?.();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && hasValue) {
        e.preventDefault();
        e.stopPropagation();
        handleClear();
      }
      onKeyDown?.(e);
    };

    const sizeClasses = {
      default: "h-9 text-sm",
      lg: "h-10 text-base",
      sm: "h-8 text-xs",
    }[size];

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <InputGroup className={cn(sizeClasses, inputGroupClassName)}>
          {/* Prefix (Magnifying Glass or Custom Icon / Spinner) */}
          <InputGroupAddon align="inline-start">
            {isLoading ? (
              <CircleNotchIcon
                weight="bold"
                className="text-muted-foreground pointer-events-none size-4 animate-spin"
              />
            ) : prefixIcon ? (
              prefixIcon
            ) : (
              <MagnifyingGlassIcon
                weight="bold"
                className="text-muted-foreground pointer-events-none size-4"
              />
            )}
          </InputGroupAddon>

          {/* Core Input */}
          <InputGroupInput
            ref={inputRef}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={cn("h-full", className)}
            {...props}
          />

          {/* Suffix (Clear Button or Shortcut badge) */}
          {hasValue && showClear && !disabled ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <XIcon weight="bold" className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          ) : shortcut ? (
            <InputGroupAddon align="inline-end">
              {typeof shortcut === "string" ? <Kbd>{shortcut}</Kbd> : shortcut}
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
