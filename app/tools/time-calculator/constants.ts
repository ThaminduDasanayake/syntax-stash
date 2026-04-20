import { MathUnit } from "@/app/tools/time-calculator/types";

export const TIMEZONES = [
  { label: "UTC", tz: "UTC" },
  { label: "New York", tz: "America/New_York" },
  { label: "Los Angeles", tz: "America/Los_Angeles" },
  { label: "São Paulo", tz: "America/Sao_Paulo" },
  { label: "London", tz: "Europe/London" },
  { label: "Paris / Berlin", tz: "Europe/Paris" },
  { label: "Moscow", tz: "Europe/Moscow" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Mumbai", tz: "Asia/Kolkata" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Sydney", tz: "Australia/Sydney" },
];

export const UNIT_MS: Record<MathUnit, number> = {
  seconds: 1_000,
  minutes: 60_000,
  hours: 3_600_000,
  days: 86_400_000,
};

export const MATH_UNIT_OPTIONS: MathUnit[] = ["seconds", "minutes", "hours", "days"];
