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
  variant?: "default" | "pill";
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
      variant = "default",
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

    if (variant === "pill") {
      const pillHeight = size === "sm" ? "h-[38px]" : size === "lg" ? "h-11" : "h-10";
      const iconSize = size === "sm" ? "size-3.5" : "size-4";
      const fontSize = size === "sm" ? "text-xs" : "text-sm";

      return (
        <div className={cn("relative w-full", containerClassName)}>
          <div
            className={cn(
              "group/pill-search relative flex w-full items-center rounded-full border border-white/10 bg-[#252525] px-3.5 text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all duration-200 focus-within:border-white/25 focus-within:ring-2 focus-within:ring-white/10",
              pillHeight,
              disabled && "cursor-not-allowed opacity-50",
              inputGroupClassName,
            )}
          >
            {/* Prefix Icon */}
            <span className="mr-2.5 flex shrink-0 items-center justify-center text-zinc-400 transition-colors duration-200 group-hover/pill-search:text-zinc-200 group-focus-within/pill-search:text-white">
              {isLoading ? (
                <CircleNotchIcon weight="bold" className={cn("animate-spin", iconSize)} />
              ) : prefixIcon ? (
                prefixIcon
              ) : (
                <MagnifyingGlassIcon weight="bold" className={iconSize} />
              )}
            </span>

            {/* Input */}
            <input
              ref={inputRef}
              type={type}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
              disabled={disabled}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "h-full w-full border-0 bg-transparent font-medium tracking-tight text-white placeholder:text-zinc-500 outline-none",
                fontSize,
                className,
              )}
              {...props}
            />

            {/* Suffix (Clear Button or Shortcut badge) */}
            {hasValue && showClear && !disabled ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="ml-2 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-zinc-400 transition-colors hover:bg-white/20 hover:text-white"
              >
                <XIcon weight="bold" className="size-3" />
              </button>
            ) : shortcut ? (
              <span className="ml-2 flex shrink-0 items-center">
                {typeof shortcut === "string" ? (
                  <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-semibold text-zinc-400 select-none">
                    {shortcut}
                  </kbd>
                ) : (
                  shortcut
                )}
              </span>
            ) : null}
          </div>
        </div>
      );
    }

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
