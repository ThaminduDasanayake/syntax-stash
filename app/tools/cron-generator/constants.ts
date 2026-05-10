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
  specific: [],
  rangeFrom: min,
  rangeTo: max,
  stepEvery: 1,
  stepFrom: min,
});

export const MINUTES = Array.from({ length: 60 }, (_, i) => i);
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const DOM = Array.from({ length: 31 }, (_, i) => i + 1);
export const MONTHS = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];
export const DOW = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
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
  "every-minute": {
    label: "Every minute",
    expression: "* * * * *",
    description: "Runs every minute",
  },
  "every-5-minutes": {
    label: "Every 5 minutes",
    expression: "*/5 * * * *",
    description: "Runs every 5 minutes",
  },
  "every-15-minutes": {
    label: "Every 15 minutes",
    expression: "*/15 * * * *",
    description: "Runs every 15 minutes",
  },
  hourly: {
    label: "Hourly",
    expression: "0 * * * *",
    description: "Runs at the start of every hour",
  },
  "daily-midnight": {
    label: "Daily at midnight",
    expression: "0 0 * * *",
    description: "Runs once a day at 00:00",
  },
  "daily-noon": {
    label: "Daily at noon",
    expression: "0 12 * * *",
    description: "Runs once a day at 12:00",
  },
  "weekly-monday": {
    label: "Every Monday",
    expression: "0 9 * * 1",
    description: "Runs at 09:00 every Monday",
  },
  "monthly-first": {
    label: "Monthly (1st)",
    expression: "0 0 1 * *",
    description: "Runs at midnight on the 1st of each month",
  },
  weekdays: {
    label: "Weekdays only",
    expression: "0 9 * * 1-5",
    description: "Runs at 09:00 Monday–Friday",
  },
  custom: { label: "Custom", expression: "", description: "" },
};
