import { resourceCategories } from "@/lib/resource-data";

export type TabStatus = "all" | "approved" | "pending" | "rejected";

export interface SubmissionCounts {
  all: number;
  approved: number;
  pending: number;
  rejected: number;
}

export const CATEGORY_OPTIONS = resourceCategories.map((cat) => ({
  label: cat,
  value: cat,
}));

export const STATUS_OPTIONS = [
  { label: "Approved", value: "approved" },
  { label: "Pending Review", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

export type SubmissionStatus = "approved" | "pending" | "rejected";

export const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    badge: string;
    button: string;
    dotColor: string;
    label: string;
  }
> = {
  approved: {
    badge: "bg-emerald-500/15 text-emerald-700 border border-emerald-600/60",
    button: "border-emerald-600/60 text-emerald-700 hover:bg-emerald-500/20",
    dotColor: "bg-emerald-500",
    label: "Approved",
  },
  pending: {
    badge: "bg-amber-500/15 text-amber-800 border border-amber-600/60",
    button: "border-amber-600/60 text-amber-800 hover:bg-amber-500/20",
    dotColor: "bg-amber-500",
    label: "Pending",
  },
  rejected: {
    badge: "bg-rose-500/15 text-rose-700 border border-rose-600/60",
    button: "border-rose-600/60 text-rose-700 hover:bg-rose-500/20",
    dotColor: "bg-rose-500",
    label: "Rejected",
  },
};

export const TAB_CONFIG: Record<
  TabStatus,
  {
    activeClasses: string;
    badgeActive: string;
    badgeInactive: string;
    dotColor: string;
    inactiveClasses: string;
    label: string;
  }
> = {
  all: {
    activeClasses: "bg-ink text-paper hover:bg-ink/90 hover:text-paper border-ink",
    badgeActive: "bg-paper/20 text-paper",
    badgeInactive: "bg-muted text-muted-foreground",
    dotColor: "bg-muted-foreground",
    inactiveClasses:
      "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border",
    label: "All",
  },
  approved: {
    activeClasses:
      "bg-emerald-600 text-paper hover:bg-emerald-600/90 hover:text-paper border-emerald-700/60",
    badgeActive: "bg-paper/25 text-paper",
    badgeInactive: "bg-emerald-500/20 text-emerald-700",
    dotColor: "bg-emerald-500",
    inactiveClasses:
      "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 hover:text-emerald-800 border-emerald-600/60",
    label: "Approved",
  },
  pending: {
    activeClasses:
      "bg-amber-500 text-ink hover:bg-amber-500/90 hover:text-ink border-amber-600/60 font-black",
    badgeActive: "bg-ink/20 text-ink",
    badgeInactive: "bg-amber-500/20 text-amber-800",
    dotColor: "bg-amber-500",
    inactiveClasses:
      "bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 hover:text-amber-900 border-amber-600/60",
    label: "Pending",
  },
  rejected: {
    activeClasses:
      "bg-rose-600 text-paper hover:bg-rose-600/90 hover:text-paper border-rose-700/60",
    badgeActive: "bg-paper/25 text-paper",
    badgeInactive: "bg-rose-500/20 text-rose-700",
    dotColor: "bg-rose-500",
    inactiveClasses:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 hover:text-rose-800 border-rose-600/60",
    label: "Rejected",
  },
};

// eslint-disable-next-line perfectionist/sort-arrays
export const TABS: TabStatus[] = ["pending", "approved", "rejected", "all"];
