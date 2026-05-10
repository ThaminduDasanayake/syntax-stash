import { WarningIcon } from "@phosphor-icons/react/ssr";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 rounded-lg border p-4 text-xs">
      <WarningIcon weight="duotone" size={20} />
      <p className="font-mono">{message}</p>
    </div>
  );
}
