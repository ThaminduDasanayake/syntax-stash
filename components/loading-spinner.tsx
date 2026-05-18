import { CircleNotchIcon } from "@phosphor-icons/react/ssr";

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <CircleNotchIcon weight="bold" className="size-4 animate-spin" />
      {label && <span>{label}</span>}
    </div>
  );
}
