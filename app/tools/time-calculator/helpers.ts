export function toLocal(d: Date): string {
  const y = d.getFullYear();
  const mo = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return `${y}-${mo}-${day} ${h}:${mi}:${s}`;
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function isValidDate(d: Date): boolean {
  return !isNaN(d.getTime());
}

export function getGmtOffset(date: Date, tz?: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(date);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value;
    return offset || "";
  } catch {
    return "";
  }
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;

  const minutes = Math.floor(absDiff / (60 * 1000));
  const hours = Math.floor(absDiff / (60 * 60 * 1000));
  const days = Math.floor(absDiff / (24 * 60 * 60 * 1000));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let value: string;
  if (years > 0) value = `${years} year${years > 1 ? "s" : ""}`;
  else if (months > 0) value = `${months} month${months > 1 ? "s" : ""}`;
  else if (weeks > 0) value = `${weeks} week${weeks > 1 ? "s" : ""}`;
  else if (days > 0) value = `${days} day${days > 1 ? "s" : ""}`;
  else if (hours > 0) value = `${hours} hour${hours > 1 ? "s" : ""}`;
  else if (minutes > 0) value = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  else value = "just now";

  if (value === "just now") return value;
  return isPast ? `${value} ago` : `in ${value}`;
}
