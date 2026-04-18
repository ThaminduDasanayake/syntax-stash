import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 rounded-lg border p-4 text-xs">
      <AlertTriangle size={18} />
      <p className="font-mono">{message}</p>
    </div>
  );
}
