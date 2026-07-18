import { Range } from "@/app/tools/cron-studio/explore-types";

export const COMMON_TIMEZONES = [
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/New_York",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Europe/Berlin",
  "Europe/London",
  "Europe/Moscow",
  "Europe/Paris",
  "Pacific/Auckland",
  "UTC",
];

export const RANGE_OPTIONS: { value: Range; label: string; ms: number }[] = [
  { label: "Next 7 days", ms: 7 * 24 * 60 * 60 * 1000, value: "7d" },
  { label: "Next 24 hours", ms: 24 * 60 * 60 * 1000, value: "24h" },
  { label: "Next 30 days", ms: 30 * 24 * 60 * 60 * 1000, value: "30d" },
];
