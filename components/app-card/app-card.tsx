"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps, ReactNode } from "react";

import type { AppPlan, AppStatus } from "@/components/status-badge/status-badge";
import { PlanBadge, StatusBadge } from "@/components/status-badge/status-badge";
import { cn } from "@/lib/utils";

export type AppCardProps = Omit<ComponentProps<"a">, "children"> & {
  /** App name, shown in mono. */
  name: string;
  /** Lifecycle state, rendered as a StatusBadge. */
  status: AppStatus;
  /** Billing plan, rendered as a PlanBadge. */
  plan?: AppPlan;
  /** One-line summary of what the app does. */
  description?: string;
  /** Last activity, already formatted, e.g. "2h ago". */
  updatedAt?: string;
  /**
   * Status-colored grain rising from the bottom edge. Pass a ReactNode
   * (e.g. a Paper Shaders GrainGradient) to replace the built-in CSS grain
   * inside the same positioned, status-tinted slot.
   */
  wash?: boolean | ReactNode;
};

/** Wash tint per status: color only ever comes from the vocabulary. */
const STATUS_WASH: Record<AppStatus, string> = {
  error: "text-destructive",
  provisioning: "text-primary",
  ready: "text-primary",
  stopped: "text-muted-foreground",
};

/* ─────────────────────────────────────────────────────────
 * The dashboard grid card, on MetricCard's shell: hairline
 * border warming on hover with a neon underline sweeping in
 * under the name (transform-only, no layout shift). The
 * corner arrow inks in alongside; the status vocabulary
 * anchors the foot with the timestamp opposite. The whole
 * card is one link.
 * ───────────────────────────────────────────────────────── */
export const AppCard = ({
  className,
  description,
  name,
  plan,
  status,
  updatedAt,
  wash = true,
  ...props
}: AppCardProps) => (
  <a
    className={cn(
      "group border-border/60 bg-card hover:border-border focus-visible:border-primary relative isolate flex min-h-[128px] cursor-pointer flex-col overflow-hidden rounded-lg border p-4 no-underline shadow-none ring-0 transition-colors select-none focus-visible:outline-none",
      className,
    )}
    data-slot="app-card"
    data-status={status}
    {...props}
  >
    {wash === true ? (
      <div
        aria-hidden="true"
        className={cn(
          "neon-card-wash pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.22]",
          STATUS_WASH[status],
        )}
      />
    ) : null}
    {wash && wash !== true ? (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 overflow-hidden",
          STATUS_WASH[status],
        )}
        data-slot="app-card-wash"
      >
        {wash}
      </div>
    ) : null}
    <div className="flex items-center gap-1.5">
      <p
        title={name}
        className="text-foreground after:bg-primary relative min-w-0 truncate font-mono text-sm font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none"
      >
        {name}
      </p>
      <HugeiconsIcon
        aria-hidden="true"
        icon={ArrowUpRight01Icon}
        strokeWidth={2}
        className="text-muted-foreground/40 group-hover:text-foreground size-3.5 shrink-0 transition-colors"
      />
    </div>
    {description ? (
      <p className="text-muted-foreground/80 mt-1.5 line-clamp-2 max-w-[48ch] text-xs leading-5 text-pretty">
        {description}
      </p>
    ) : null}
    <div className="mt-auto flex items-center gap-1.5 pt-4">
      <StatusBadge status={status} />
      {plan ? <PlanBadge plan={plan} /> : null}
      {updatedAt ? (
        <span className="text-muted-foreground/70 ml-auto font-mono text-[10px] whitespace-nowrap tabular-nums">
          {updatedAt}
        </span>
      ) : null}
    </div>
  </a>
);
