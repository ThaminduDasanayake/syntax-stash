import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p className="font-mono">{message}</p>
    </div>
  );
}
