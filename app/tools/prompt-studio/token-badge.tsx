import { Badge } from "@/components/ui/badge";

const TokenBadge = ({ text, label = "Est. tokens" }: { text: string; label?: string }) => {
  const count = Math.ceil(text.length / 4);
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <Badge variant="secondary" className="font-mono font-semibold">
        ~{count.toLocaleString()}
      </Badge>
    </div>
  );
};
export default TokenBadge;
