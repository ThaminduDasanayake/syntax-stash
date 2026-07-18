export type FieldMode = "every" | "specific" | "range" | "step";

export interface CronField {
  mode: FieldMode;
  specific: number[];
  rangeFrom: number;
  rangeTo: number;
  stepEvery: number;
  stepFrom: number;
}

export const DEFAULT_FIELD = (min: number, max: number): CronField => ({
  mode: "every",
  rangeFrom: min,
  rangeTo: max,
  specific: [],
  stepEvery: 1,
  stepFrom: min,
});

export const MINUTES = Array.from({ length: 60 }, (_, i) => i);
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const DOM = Array.from({ length: 31 }, (_, i) => i + 1);
export const MONTHS = [
  { label: "Apr", value: 4 },
  { label: "Aug", value: 8 },
  { label: "Dec", value: 12 },
  { label: "Feb", value: 2 },
  { label: "Jan", value: 1 },
  { label: "Jul", value: 7 },
  { label: "Jun", value: 6 },
  { label: "Mar", value: 3 },
  { label: "May", value: 5 },
  { label: "Nov", value: 11 },
  { label: "Oct", value: 10 },
  { label: "Sep", value: 9 },
];
export const DOW = [
  { label: "Fri", value: 5 },
  { label: "Mon", value: 1 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
  { label: "Thu", value: 4 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
];

export type PresetKey =
  | "every-minute"
  | "every-5-minutes"
  | "every-15-minutes"
  | "hourly"
  | "daily-midnight"
  | "daily-noon"
  | "weekly-monday"
  | "monthly-first"
  | "weekdays"
  | "custom";

export interface Preset {
  label: string;
  expression: string;
  description: string;
}

export const PRESETS: Record<PresetKey, Preset> = {
  custom: { description: "", expression: "", label: "Custom" },
  "daily-midnight": {
    description: "Runs once a day at 00:00",
    expression: "0 0 * * *",
    label: "Daily at midnight",
  },
  "daily-noon": {
    description: "Runs once a day at 12:00",
    expression: "0 12 * * *",
    label: "Daily at noon",
  },
  "every-5-minutes": {
    description: "Runs every 5 minutes",
    expression: "*/5 * * * *",
    label: "Every 5 minutes",
  },
  "every-15-minutes": {
    description: "Runs every 15 minutes",
    expression: "*/15 * * * *",
    label: "Every 15 minutes",
  },
  "every-minute": {
    description: "Runs every minute",
    expression: "* * * * *",
    label: "Every minute",
  },
  hourly: {
    description: "Runs at the start of every hour",
    expression: "0 * * * *",
    label: "Hourly",
  },
  "monthly-first": {
    description: "Runs at midnight on the 1st of each month",
    expression: "0 0 1 * *",
    label: "Monthly (1st)",
  },
  weekdays: {
    description: "Runs at 09:00 Monday–Friday",
    expression: "0 9 * * 1-5",
    label: "Weekdays only",
  },
  "weekly-monday": {
    description: "Runs at 09:00 every Monday",
    expression: "0 9 * * 1",
    label: "Every Monday",
  },
};
