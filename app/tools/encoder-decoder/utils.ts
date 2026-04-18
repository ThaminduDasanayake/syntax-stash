export function encodeBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function decodeBase64(s: string): string {
  const binary = atob(s.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function stringToHex(s: string): string {
  const bytes = new TextEncoder().encode(s);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToString(s: string): string {
  const clean = s.replace(/\s+/g, "").replace(/^0x/i, "");
  if (clean.length === 0) return "";
  if (clean.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }
  if (!/^[0-9a-fA-F]+$/.test(clean)) {
    throw new Error("Hex string contains non-hex characters");
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}
