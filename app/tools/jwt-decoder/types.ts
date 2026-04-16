export type JwtDecoded =
  | { ok: true; header: string; payload: string; signature: string }
  | { ok: false; error: string };
