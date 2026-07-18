type Confidence = "high" | "medium";

type DetectionResult = {
  format: string;
  confidence: Confidence;
  timestamp?: Date;
  metadata: Record<string, string>;
};

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function tryJwt(input: string): DetectionResult | null {
  const parts = input.split(".");
  if (parts.length !== 3) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]+$/.test(parts[1])) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const meta: Record<string, string> = {};
    if (header.alg) meta["Algorithm"] = String(header.alg);
    if (header.typ) meta["Type"] = String(header.typ);
    if (payload.sub) meta["Subject"] = String(payload.sub);
    if (payload.iss) meta["Issuer"] = String(payload.iss);
    if (payload.aud) meta["Audience"] = String(payload.aud);
    const iat = payload.iat ? new Date(payload.iat * 1000) : undefined;
    const exp = payload.exp ? new Date(payload.exp * 1000) : undefined;
    if (iat) meta["Issued At"] = iat.toUTCString();
    if (exp) {
      meta["Expires At"] = exp.toUTCString();
      meta["Status"] = exp < new Date() ? "Expired" : "Valid";
    }
    if (payload.jti) meta["JWT ID"] = String(payload.jti);
    return {
      confidence: "high",
      format: "JSON Web Token (JWT)",
      metadata: meta,
      timestamp: iat,
    };
  } catch {
    return null;
  }
}

function tryMongoObjectId(input: string): DetectionResult | null {
  if (!/^[0-9a-fA-F]{24}$/.test(input)) return null;
  const tsHex = input.slice(0, 8);
  const machine = input.slice(8, 14);
  const pid = input.slice(14, 18);
  const counter = input.slice(18, 24);
  const timestamp = new Date(parseInt(tsHex, 16) * 1000);
  return {
    confidence: "high",
    format: "MongoDB ObjectId",
    metadata: {
      Counter: `${parseInt(counter, 16).toLocaleString()} (0x${counter.toUpperCase()})`,
      "Hex Structure": `${tsHex} ${machine} ${pid} ${counter}`,
      "Machine ID": machine.toUpperCase(),
      "Process ID": `${parseInt(pid, 16)} (0x${pid.toUpperCase()})`,
    },
    timestamp,
  };
}

function tryUuid(input: string): DetectionResult | null {
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = input.match(uuidRe);
  if (!match) return null;
  const version = parseInt(match[1], 16);
  const meta: Record<string, string> = { Version: `v${version}` };
  let timestamp: Date | undefined;

  if (version === 1) {
    // v1: time_low (8 hex) - time_mid (4 hex) - time_high_version (4 hex, strip leading '1')
    const hex = input.replace(/-/g, "");
    const timeLow = hex.slice(0, 8);
    const timeMid = hex.slice(8, 12);
    const timeHigh = hex.slice(13, 16); // skip version nibble at position 12
    const timeHex = timeHigh + timeMid + timeLow;
    const intervalsSince1582 = BigInt("0x" + timeHex);
    // 100-nanosecond intervals from Oct 15 1582 to Unix epoch
    const unixNs = intervalsSince1582 - BigInt("122192928000000000");
    const unixMs = Number(unixNs / BigInt(10000));
    timestamp = new Date(unixMs);
    meta["Timestamp Source"] = "Gregorian epoch (v1 time-based)";
  } else if (version === 7) {
    // v7: first 48 bits = Unix ms timestamp
    const hex = input.replace(/-/g, "");
    const msHex = hex.slice(0, 12);
    timestamp = new Date(parseInt(msHex, 16));
    meta["Timestamp Source"] = "Unix epoch ms (v7)";
  } else {
    meta["Note"] = `v${version} UUIDs do not embed a timestamp`;
  }

  return {
    confidence: "high",
    format: `UUID v${version}`,
    metadata: meta,
    timestamp,
  };
}

function tryIso8601(input: string): DetectionResult | null {
  const iso = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
  if (!iso.test(input)) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return {
    confidence: "high",
    format: "ISO 8601 Date String",
    metadata: {},
    timestamp: d,
  };
}

function tryUnixMs(input: string): DetectionResult | null {
  if (!/^\d{13}$/.test(input)) return null;
  const ms = parseInt(input, 10);
  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;
  return {
    confidence: "high",
    format: "Unix Timestamp (milliseconds)",
    metadata: { "Raw Value": `${ms.toLocaleString()} ms` },
    timestamp: d,
  };
}

function tryUnixSec(input: string): DetectionResult | null {
  if (!/^\d{10}$/.test(input)) return null;
  const sec = parseInt(input, 10);
  const d = new Date(sec * 1000);
  if (isNaN(d.getTime())) return null;
  return {
    confidence: "high",
    format: "Unix Timestamp (seconds)",
    metadata: { "Raw Value": `${sec.toLocaleString()} sec` },
    timestamp: d,
  };
}

function trySnowflake(input: string): DetectionResult | null {
  if (!/^\d{17,20}$/.test(input)) return null;
  try {
    const id = BigInt(input);
    // Discord/Twitter epoch: Jan 1 2015 = 1420070400000 ms
    const DISCORD_EPOCH = BigInt(1420070400000);
    const ms = Number((id >> BigInt(22)) + DISCORD_EPOCH);
    const d = new Date(ms);
    if (isNaN(d.getTime()) || ms < 0 || ms > Date.now() + 1e12) return null;
    const workerId = Number((id >> BigInt(17)) & BigInt(0x1f));
    const processId = Number((id >> BigInt(12)) & BigInt(0x1f));
    const increment = Number(id & BigInt(0xfff));
    return {
      confidence: "medium",
      format: "Snowflake ID (Discord/Twitter)",
      metadata: {
        Increment: String(increment),
        Note: "Epoch assumes Discord (Jan 1 2015)",
        "Process ID": String(processId),
        "Worker ID": String(workerId),
      },
      timestamp: d,
    };
  } catch {
    return null;
  }
}

export function detect(raw: string): DetectionResult | null {
  const input = raw.trim();
  if (!input) return null;

  return (
    tryJwt(input) ??
    tryMongoObjectId(input) ??
    tryUuid(input) ??
    tryIso8601(input) ??
    tryUnixMs(input) ??
    tryUnixSec(input) ??
    trySnowflake(input) ??
    null
  );
}

export const localFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "long",
});
export const utcFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "long",
  timeZone: "UTC",
});

export function relativeTime(d: Date): string {
  const diffMs = d.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const past = diffMs < 0;
  const sec = Math.round(abs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const yr = Math.round(day / 365);
  let label: string;
  if (sec < 60) label = `${sec}s`;
  else if (min < 60) label = `${min}m`;
  else if (hr < 24) label = `${hr}h`;
  else if (day < 365) label = `${day}d`;
  else label = `${yr}yr`;
  return past ? `${label} ago` : `in ${label}`;
}
