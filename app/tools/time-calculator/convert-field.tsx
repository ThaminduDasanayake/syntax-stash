import { ConvertFieldProps } from "@/app/tools/time-calculator/types";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";

const ConvertField = ({ label, value, placeholder, onChange }: ConvertFieldProps) => {
  return (
    <Card className="focus-within:border-primary/50 transition-colors">
      <CardContent className="w-full justify-between p-4">
        <InputField
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full font-mono text-sm"
          action={<CopyButton label={false} value={value} disabled={!value} />}
        />
      </CardContent>
    </Card>
  );
};

export default ConvertField;
