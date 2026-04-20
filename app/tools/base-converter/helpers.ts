interface BitwiseOp {
  id: string;
  label: string;
  symbol: string;
  fn: (a: number, b: number) => number;
  unary?: boolean;
}

export const BITS = 16;
export const MAX = (1 << BITS) - 1; // 65535  (unsigned 16-bit)
export const SIGNED_MIN = -(1 << (BITS - 1)); // -32768
export const SIGNED_MAX = (1 << (BITS - 1)) - 1; // 32767

export const BITWISE_OPS: BitwiseOp[] = [
  { id: "and", label: "AND", symbol: "&", fn: (a, b) => a & b },
  { id: "or", label: "OR", symbol: "|", fn: (a, b) => a | b },
  { id: "xor", label: "XOR", symbol: "^", fn: (a, b) => a ^ b },
  { id: "not", label: "NOT", symbol: "~", fn: (a) => ~a & MAX, unary: true },
  { id: "shl", label: "Shift Left", symbol: "<<", fn: (a, b) => (a << b) & MAX },
  { id: "shr", label: "Shift Right", symbol: ">>", fn: (a, b) => a >> b },
];

export function clamp(n: number): number {
  if (!isFinite(n) || isNaN(n)) return 0;
  return Math.max(0, Math.min(MAX, Math.floor(n)));
}

export function toBin(n: number): string {
  return n.toString(2).padStart(BITS, "0");
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
