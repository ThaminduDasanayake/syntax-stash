import { Range } from "@/app/tools/cron-explorer/types";

export const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export const RANGE_OPTIONS: { value: Range; label: string; ms: number }[] = [
  { value: "24h", label: "Next 24 hours", ms: 24 * 60 * 60 * 1000 },
  { value: "7d", label: "Next 7 days", ms: 7 * 24 * 60 * 60 * 1000 },
  { value: "30d", label: "Next 30 days", ms: 30 * 24 * 60 * 60 * 1000 },
];
