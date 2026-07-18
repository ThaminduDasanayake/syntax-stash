import { MathUnit } from "@/app/tools/time-calculator/types";

export const TIMEZONES = [
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "London", tz: "Europe/London" },
  { label: "Los Angeles", tz: "America/Los_Angeles" },
  { label: "Moscow", tz: "Europe/Moscow" },
  { label: "Mumbai", tz: "Asia/Kolkata" },
  { label: "New York", tz: "America/New_York" },
  { label: "Paris / Berlin", tz: "Europe/Paris" },
  { label: "São Paulo", tz: "America/Sao_Paulo" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Sydney", tz: "Australia/Sydney" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "UTC", tz: "UTC" },
];

export const UNIT_MS: Record<MathUnit, number> = {
  days: 86_400_000,
  hours: 3_600_000,
  minutes: 60_000,
  seconds: 1_000,
};

export const MATH_UNIT_OPTIONS: MathUnit[] = ["days", "hours", "minutes", "seconds"];
