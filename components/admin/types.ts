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
    activeClasses:
      "bg-ink text-paper hover:bg-ink/90 hover:text-paper dark:bg-paper dark:text-ink dark:hover:bg-paper/90 dark:hover:text-ink border-ink/40 dark:border-paper/40",
    badgeActive: "bg-paper/20 text-paper dark:bg-ink/20 dark:text-ink",
    badgeInactive: "bg-muted text-muted-foreground",
    dotColor: "bg-muted-foreground",
    inactiveClasses:
      "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border",
    label: "All",
  },
  approved: {
    activeClasses:
      "bg-emerald-600 text-white hover:bg-emerald-600/90 hover:text-white dark:bg-emerald-500 dark:text-ink dark:hover:bg-emerald-500/90 dark:hover:text-ink border-emerald-700/40",
    badgeActive: "bg-white/25 text-white dark:bg-ink/20 dark:text-ink",
    badgeInactive: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
    inactiveClasses:
      "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 border-emerald-500/30",
    label: "Approved",
  },
  pending: {
    activeClasses:
      "bg-amber-500 text-ink hover:bg-amber-500/90 hover:text-ink dark:bg-amber-500 dark:text-ink dark:hover:bg-amber-500/90 dark:hover:text-ink border-amber-600/40 font-black",
    badgeActive: "bg-ink/20 text-ink",
    badgeInactive: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
    dotColor: "bg-amber-500",
    inactiveClasses:
      "bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200 border-amber-500/30",
    label: "Pending",
  },
  rejected: {
    activeClasses:
      "bg-rose-600 text-white hover:bg-rose-600/90 hover:text-white dark:bg-rose-500 dark:text-ink dark:hover:bg-rose-500/90 dark:hover:text-ink border-rose-700/40",
    badgeActive: "bg-white/25 text-white dark:bg-ink/20 dark:text-ink",
    badgeInactive: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
    dotColor: "bg-rose-500",
    inactiveClasses:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 hover:text-rose-800 dark:text-rose-300 dark:hover:text-rose-200 border-rose-500/30",
    label: "Rejected",
  },
};

// eslint-disable-next-line perfectionist/sort-arrays
export const TABS: TabStatus[] = ["pending", "approved", "rejected", "all"];
