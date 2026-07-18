import { Card, CardContent } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";

interface InputCardProps {
  label: string;
  prefix: string;
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
}
const BaseInput = ({ label, onChange, placeholder, prefix, value }: InputCardProps) => {
  return (
    <Card className="focus-within:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <InputField
          label={label}
          prefix={prefix}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          showCopy={true}
        />
      </CardContent>
    </Card>
  );
};

export default BaseInput;
