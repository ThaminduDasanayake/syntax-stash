import { CronField } from "./constants";

export function fieldToToken(field: CronField): string {
  switch (field.mode) {
    case "every":
      return "*";
    case "specific":
      return field.specific.length > 0 ? field.specific.sort((a, b) => a - b).join(",") : "*";
    case "range":
      return `${field.rangeFrom}-${field.rangeTo}`;
    case "step":
      return field.stepFrom === 0 ? `*/${field.stepEvery}` : `${field.stepFrom}/${field.stepEvery}`;
  }
}

export function buildExpression(
  minute: CronField,
  hour: CronField,
  dom: CronField,
  month: CronField,
  dow: CronField,
): string {
  return [
    fieldToToken(minute),
    fieldToToken(hour),
    fieldToToken(dom),
    fieldToToken(month),
    fieldToToken(dow),
  ].join(" ");
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function describeField(field: CronField, unit: string, labels?: string[]): string {
  switch (field.mode) {
    case "every":
      return `every ${unit}`;
    case "specific": {
      if (field.specific.length === 0) return `every ${unit}`;

      if (labels) {
        return field.specific.map((v) => labels[v] ?? String(v)).join(", ");
      }

      return field.specific.map(ordinal).join(", ");

      // const names = labels
      //   ? field.specific.map((v) => labels[v] ?? String(v))
      //   : field.specific.map(String);
      // return names.join(", ");
    }
    case "range": {
      const from = labels ? (labels[field.rangeFrom] ?? field.rangeFrom) : field.rangeFrom;
      const to = labels ? (labels[field.rangeTo] ?? field.rangeTo) : field.rangeTo;
      return `${from}–${to}`;
    }
    case "step":
      return `every ${field.stepEvery} ${unit}s${field.stepFrom > 0 ? ` from ${unit} ${field.stepFrom}` : ""}`;
  }
}

export function buildDescription(
  minute: CronField,
  hour: CronField,
  dom: CronField,
  month: CronField,
  dow: CronField,
): string {
  const minuteDesc = describeField(minute, "minute");
  const hourDesc = describeField(hour, "hour");
  const domDesc = describeField(dom, "day-of-month");
  const monthDesc = describeField(month, "month", MONTH_NAMES);
  const dowDesc = describeField(dow, "day", DOW_NAMES);

  const parts: string[] = [];

  if (minute.mode === "every" && hour.mode === "every") {
    parts.push("Every minute");
  } else if (minute.mode === "step" && hour.mode === "every") {
    parts.push(`Every ${minute.stepEvery} minute${minute.stepEvery !== 1 ? "s" : ""}`);
  } else if (minute.mode === "specific" || minute.mode === "every") {
    const m = minute.mode === "every" ? "0" : minute.specific.join(",");
    parts.push(`At minute ${m} of ${hourDesc}`);
  } else {
    parts.push(`At ${minuteDesc} past ${hourDesc}`);
  }

  if (dom.mode !== "every") parts.push(`on ${domDesc}`);
  if (dow.mode !== "every") parts.push(`on ${dowDesc}`);
  if (month.mode !== "every") parts.push(`in ${monthDesc}`);

  return parts.join(", ");
}
