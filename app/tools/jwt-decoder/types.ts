export interface JwtDecoded {
  header: string;
  payload: string;
  signature: string;
  error: string | null;
}
