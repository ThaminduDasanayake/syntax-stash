"use client";

import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react";
import { Select as SelectPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  children,
  className,
  size = "default",
  variant,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
  variant?: "accent" | "default" | "destructive" | "primary" | "rose" | "secondary";
}) {
  const triggerVariantStyles = variant
    ? {
        accent:
          "hover:border-accent/50 focus-visible:border-accent focus-visible:ring-accent/30 dark:hover:bg-accent/10",
        default: "",
        destructive:
          "hover:border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/30 dark:hover:bg-destructive/10",
        primary:
          "hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/30 dark:hover:bg-primary/10",
        rose: "hover:border-rose-500/50 focus-visible:border-rose-500 focus-visible:ring-rose-500/30 dark:hover:bg-rose-500/10",
        secondary:
          "hover:border-secondary/50 focus-visible:border-secondary focus-visible:ring-secondary/30 dark:hover:bg-secondary/10",
      }[variant]
    : "";

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-border focus-visible:border-ring focus-visible:ring-ring/70 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex w-fit items-center justify-between gap-1.5 rounded-md border bg-transparent py-1.5 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        triggerVariantStyles,
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretDownIcon weight="bold" className="text-muted-foreground pointer-events-none size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  align = "center",
  children,
  className,
  position = "popper",
  viewportClassName,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  viewportClassName?: string;
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground border-border data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 relative z-70 max-h-96 min-w-36 overflow-hidden rounded-md border p-1 shadow-md duration-100",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            viewportClassName,
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs font-semibold", className)}
      {...props}
    />
  );
}

function SelectItem({
  children,
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  variant?: "accent" | "default" | "destructive" | "primary" | "rose" | "secondary";
}) {
  const variantStyles = {
    accent:
      "data-[state=checked]:bg-accent/15 data-[state=checked]:font-medium data-[state=checked]:text-accent not-data-[state=checked]:focus:bg-accent/15 not-data-[state=checked]:focus:text-white not-data-[variant=destructive]:not-data-[state=checked]:focus:**:text-white",
    default:
      "data-[state=checked]:bg-accent/15 data-[state=checked]:font-medium data-[state=checked]:text-accent not-data-[state=checked]:focus:bg-accent/15 not-data-[state=checked]:focus:text-white not-data-[variant=destructive]:not-data-[state=checked]:focus:**:text-white",
    destructive:
      "data-[state=checked]:bg-destructive/15 data-[state=checked]:font-medium data-[state=checked]:text-destructive not-data-[state=checked]:focus:bg-destructive/15 not-data-[state=checked]:focus:text-rose-200 not-data-[variant=destructive]:not-data-[state=checked]:focus:**:text-rose-200",
    primary:
      "data-[state=checked]:bg-primary/15 data-[state=checked]:font-medium data-[state=checked]:text-primary not-data-[state=checked]:focus:bg-primary/15 not-data-[state=checked]:focus:text-white not-data-[variant=destructive]:not-data-[state=checked]:focus:**:text-white",
    rose: "data-[state=checked]:bg-rose-500/15 data-[state=checked]:font-medium data-[state=checked]:text-rose-400 not-data-[state=checked]:focus:bg-rose-500/15 not-data-[state=checked]:focus:text-white not-data-[variant=destructive]:not-data-[state=checked]:focus:**:text-white",
    secondary:
      "data-[state=checked]:bg-secondary/15 data-[state=checked]:font-medium data-[state=checked]:text-secondary not-data-[state=checked]:focus:bg-secondary/15 not-data-[state=checked]:focus:text-white not-data-[variant=destructive]:not-data-[state=checked]:focus:**:text-white",
  }[variant];

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-variant={variant}
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        variantStyles,
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon weight="bold" className="pointer-events-none size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border/60 pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "text-muted-foreground hover:text-foreground z-10 flex cursor-default items-center justify-center rounded-sm bg-transparent py-1 transition-colors [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <CaretUpIcon weight="bold" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "text-muted-foreground hover:text-foreground z-10 flex cursor-default items-center justify-center rounded-sm bg-transparent py-1 transition-colors [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <CaretDownIcon weight="bold" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
