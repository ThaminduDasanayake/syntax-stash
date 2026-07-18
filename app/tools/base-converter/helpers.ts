interface BitwiseOp {
  id: string;
  label: string;
  symbol: string;
  fn: (a: number, b: number) => number;
  unary?: boolean;
}

export const BITS = 16;
export const MAX = (1 << BITS) - 1; // 65535

export const BASE_LIST = [
  { label: "BIN", value: "2" },
  { label: "DEC", value: "10" },
  { label: "HEX", value: "16" },
  { label: "OCT", value: "8" },
];

export const BITWISE_OPS: BitwiseOp[] = [
  { id: "and", fn: (a, b) => a & b, label: "AND", symbol: "&" },
  { id: "not", fn: (a) => ~a & MAX, label: "NOT", symbol: "~", unary: true },
  { id: "or", fn: (a, b) => a | b, label: "OR", symbol: "|" },
  { id: "shl", fn: (a, b) => (a << b) & MAX, label: "Shift Left", symbol: "<<" },
  { id: "shr", fn: (a, b) => a >> b, label: "Shift Right", symbol: ">>" },
  { id: "xor", fn: (a, b) => a ^ b, label: "XOR", symbol: "^" },
];

export function clamp(n: number): number {
  if (!isFinite(n) || isNaN(n)) return 0;

  return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(n)));
}

export function toBin(n: number): string {
  return n.toString(2);
}
export function toHex(n: number): string {
  return n.toString(16).toUpperCase();
}
export function toOct(n: number): string {
  return n.toString(8);
}
export function toDec(n: number): string {
  return n.toString(10);
}

// Two's-complement signed value for 16-bit
export function toSigned(n: number): number {
  return n >= 1 << (BITS - 1) ? n - (1 << BITS) : n;
}
