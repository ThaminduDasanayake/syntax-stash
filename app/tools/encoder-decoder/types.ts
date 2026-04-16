export type EncoderAction = {
  id: string;
  label: string;
  run: (input: string) => string;
};
