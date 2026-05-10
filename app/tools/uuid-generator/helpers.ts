export function generateV4(): string {
  return crypto.randomUUID();
}

export function generateV7(): string {
  const ms = Date.now();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 48-bit big-endian timestamp in bytes 0-5
  bytes[0] = (ms / 0x10000000000) & 0xff;
  bytes[1] = (ms / 0x100000000) & 0xff;
  bytes[2] = (ms / 0x1000000) & 0xff;
  bytes[3] = (ms / 0x10000) & 0xff;
  bytes[4] = (ms / 0x100) & 0xff;
  bytes[5] = ms & 0xff;

  // Version 7
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Variant 10xx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export function formatUUID(uuid: string, uppercase: boolean, noHyphens: boolean): string {
  let result = uppercase ? uuid.toUpperCase() : uuid;
  if (noHyphens) result = result.replace(/-/g, "");
  return result;
}
