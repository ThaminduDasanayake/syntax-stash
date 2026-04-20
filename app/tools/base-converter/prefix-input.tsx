import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PrefixInputProps {
  label: string;
  prefix: string;
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
}
const PrefixInput = ({ label, prefix, value, onChange, placeholder }: PrefixInputProps) => {
  return (
    <Card className="focus-within:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <span className="text-muted-foreground font-mono text-[11px]">{prefix}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex flex-1 items-center">
            {prefix && (
              <span className="text-muted-foreground pointer-events-none absolute left-3 font-mono text-sm select-none">
                {prefix}
              </span>
            )}
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`font-mono text-sm ${prefix ? "pl-8" : ""}`}
            />
          </div>
          <CopyButton label={false} value={prefix + value} disabled={!value} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrefixInput;
