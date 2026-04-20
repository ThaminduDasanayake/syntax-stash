export interface ConvertFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (raw: string) => void;
}

export type MathUnit = "seconds" | "minutes" | "hours" | "days";
